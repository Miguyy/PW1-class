// Store Pinia para gestão centralizada de notas

import { defineStore } from 'pinia'
import {
  getAllNotes,
  getNoteById,
  getNotesByCategory,
  searchNotes,
  createNote,
  updateNote,
  deleteNote,
} from '@/api/notes'

// Chave para localStorage da preferência showArchived
const SHOW_ARCHIVED_KEY = 'note-keeper-show-archived'

export const useNotesStore = defineStore('notes', {
  state: () => ({
    notes: [],
    currentNote: null,
    activeCategory: null,
    searchTerm: '',
    showArchived: false,

    // Estados de UI: initialLoading (fetch, pesquisa) e isUpdating (pin, archive, delete)
    initialLoading: false,
    isUpdating: false,
    error: null,
  }),

  getters: {
    // Ordenação: pinned (desc) → normais (desc) → arquivadas (desc)
    sortedNotes(state) {
      const notesCopy = [...state.notes]
      const sortByDate = (a, b) => new Date(b.createdAt) - new Date(a.createdAt)

      const pinned = notesCopy.filter((n) => n.pinned && !n.archived).sort(sortByDate)
      const normal = notesCopy.filter((n) => !n.pinned && !n.archived).sort(sortByDate)
      const archived = notesCopy.filter((n) => n.archived).sort(sortByDate)

      return [...pinned, ...normal, ...archived]
    },

    // Filtra por categoria e estado archived
    filteredNotes(state) {
      let result = this.sortedNotes

      if (!state.showArchived) {
        result = result.filter((note) => !note.archived)
      }

      if (state.activeCategory) {
        result = result.filter((note) => note.category === state.activeCategory)
      }

      return result
    },

    pinnedCount(state) {
      return state.notes.filter((note) => note.pinned && !note.archived).length
    },

    archivedCount(state) {
      return state.notes.filter((note) => note.archived).length
    },

    totalCount(state) {
      return state.notes.filter((note) => !note.archived).length
    },

    hasNotes(state) {
      return state.notes.length > 0
    },

    hasError(state) {
      return state.error !== null
    },

    categories() {
      return ['personal', 'work', 'ideas', 'other']
    },

    colors() {
      return ['yellow', 'green', 'blue', 'pink']
    },
  },

  actions: {
    // Carrega todas as notas
    async fetchAllNotes() {
      this.initialLoading = true
      this.error = null

      try {
        this.notes = await getAllNotes()
      } catch (err) {
        console.error('Erro ao carregar notas:', err)
        this.error = 'Não foi possível carregar as notas.'
        this.notes = []
      } finally {
        this.initialLoading = false
      }
    },

    // Carrega notas filtradas por categoria
    async fetchNotesByCategory(category) {
      this.initialLoading = true
      this.error = null
      this.activeCategory = category

      try {
        this.notes = category ? await getNotesByCategory(category) : await getAllNotes()
      } catch (err) {
        console.error('Erro ao carregar notas:', err)
        this.error = 'Não foi possível carregar as notas.'
      } finally {
        this.initialLoading = false
      }
    },

    // Carrega nota por ID para detalhes/edição
    async fetchNoteById(id) {
      this.initialLoading = true
      this.error = null

      try {
        this.currentNote = await getNoteById(id)
      } catch (err) {
        console.error('Erro ao carregar nota:', err)
        this.error = 'Não foi possível carregar a nota.'
        this.currentNote = null
      } finally {
        this.initialLoading = false
      }
    },

    // Pesquisa full-text via JSON Server (?q=)
    async searchNotes(query) {
      this.initialLoading = true
      this.error = null
      this.searchTerm = query

      try {
        this.notes = await searchNotes(query)
      } catch (err) {
        console.error('Erro ao pesquisar notas:', err)
        this.error = 'Não foi possível realizar a pesquisa.'
        this.notes = []
      } finally {
        this.initialLoading = false
      }
    },

    // Cria nova nota com timestamp
    async addNote(noteData) {
      this.initialLoading = true
      this.error = null

      try {
        const newNote = {
          ...noteData,
          createdAt: new Date().toISOString(),
          pinned: noteData.pinned || false,
          archived: noteData.archived || false,
        }

        const created = await createNote(newNote)
        this.notes.push(created)

        return created
      } catch (err) {
        console.error('Erro ao criar nota:', err)
        this.error = 'Não foi possível criar a nota.'
        return null
      } finally {
        this.initialLoading = false
      }
    },

    // Atualiza nota existente
    async editNote(id, noteData) {
      this.initialLoading = true
      this.error = null

      try {
        const updated = await updateNote(id, noteData)

        // Sincroniza lista local
        const index = this.notes.findIndex((n) => n.id === id || n.id === Number(id))
        if (index !== -1) {
          this.notes[index] = updated
        }

        // Sincroniza currentNote se for a mesma
        if (
          this.currentNote &&
          (this.currentNote.id === id || this.currentNote.id === Number(id))
        ) {
          this.currentNote = updated
        }

        return updated
      } catch (err) {
        console.error('Erro ao atualizar nota:', err)
        this.error = 'Não foi possível atualizar a nota.'
        throw err
      } finally {
        this.initialLoading = false
      }
    },

    // Remove nota com optimistic update
    async removeNote(id) {
      this.isUpdating = true
      this.error = null

      // Optimistic: remove imediatamente da UI
      const noteIndex = this.notes.findIndex((n) => n.id === id || n.id === Number(id))
      const removedNote = this.notes[noteIndex]

      if (noteIndex !== -1) {
        this.notes.splice(noteIndex, 1)
      }

      try {
        await deleteNote(id)
        return true
      } catch (err) {
        console.error('Erro ao remover nota:', err)
        // Reverte se API falhar
        if (removedNote) {
          this.notes.splice(noteIndex, 0, removedNote)
        }
        this.error = 'Não foi possível remover a nota.'
        return false
      } finally {
        this.isUpdating = false
      }
    },

    // Toggle pin com optimistic update
    async togglePin(id) {
      const note = this.notes.find((n) => n.id === id)
      if (!note) return false

      this.isUpdating = true

      const originalPinned = note.pinned
      note.pinned = !note.pinned

      // Sincroniza currentNote
      if (this.currentNote && (this.currentNote.id === id || this.currentNote.id === Number(id))) {
        this.currentNote.pinned = note.pinned
      }

      try {
        await updateNote(id, { ...note })
        return true
      } catch (err) {
        console.error('Erro ao atualizar pin:', err)
        note.pinned = originalPinned
        this.error = 'Não foi possível atualizar a nota.'
        return false
      } finally {
        this.isUpdating = false
      }
    },

    // Toggle archive com optimistic update (arquivar remove pin)
    async toggleArchive(id) {
      const note = this.notes.find((n) => n.id === id || n.id === Number(id))
      if (!note) return false

      this.isUpdating = true

      const originalArchived = note.archived
      const originalPinned = note.pinned

      note.archived = !note.archived
      if (!originalArchived) note.pinned = false

      // Sincroniza currentNote
      if (this.currentNote && (this.currentNote.id === id || this.currentNote.id === Number(id))) {
        this.currentNote.archived = note.archived
        this.currentNote.pinned = note.pinned
      }

      try {
        await updateNote(id, { ...note })
        return true
      } catch (err) {
        console.error('Erro ao atualizar archive:', err)
        note.archived = originalArchived
        note.pinned = originalPinned
        this.error = 'Não foi possível atualizar a nota.'
        return false
      } finally {
        this.isUpdating = false
      }
    },

    setActiveCategory(category) {
      this.activeCategory = category
    },

    clearSearch() {
      this.searchTerm = ''
    },

    clearCurrentNote() {
      this.currentNote = null
      this.error = null
    },

    toggleShowArchived() {
      this.showArchived = !this.showArchived
      this.saveShowArchivedPreference()
    },

    // Persistência da preferência em localStorage
    saveShowArchivedPreference() {
      try {
        localStorage.setItem(SHOW_ARCHIVED_KEY, JSON.stringify(this.showArchived))
      } catch (err) {
        console.error('Erro ao guardar preferência:', err)
      }
    },

    loadShowArchivedPreference() {
      try {
        const stored = localStorage.getItem(SHOW_ARCHIVED_KEY)
        if (stored !== null) {
          this.showArchived = JSON.parse(stored)
        }
      } catch (err) {
        console.error('Erro ao carregar preferência:', err)
        this.showArchived = false
      }
    },
  },
})
