import { defineStore } from 'pinia'
import {
  getAllTasks as apiGetAll,
  getTaskById as apiGetById,
  getTasksFilter as apiGetByStats, // mapear nome conforme usa na store
  searchTasks as apiSearch,
  createTask as apiCreate,
  updateTask as apiUpdate,
  deleteTask as apiDelete,
} from '@/api/api.js'

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    tasks: [],
    selectedTask: null,
    activeStatsFilter: null, // 'Pendente' | 'in-progress' | 'Concluída' | null
    searchQuery: '',
    loading: false,
    error: null,
    showArchived: false,
  }),

  getters: {
    // favorites first, then by priority (high > medium > low), then by dueDate (earliest first)
    sortedTasks: (state) => {
      const priorityRank = { high: 0, medium: 1, low: 2, Normal: 3 }
      return [...state.tasks]
        .filter((t) => (state.showArchived ? true : !t.archived))
        .sort((a, b) => {
          // favorites first
          if ((b.favorite === true) - (a.favorite === true) !== 0) {
            return (b.favorite === true) - (a.favorite === true)
          }
          // priority
          const pa = priorityRank[(a.priority || 'Normal').toString().toLowerCase()] ?? 3
          const pb = priorityRank[(b.priority || 'Normal').toString().toLowerCase()] ?? 3
          if (pa !== pb) return pa - pb
          // due date (nulls last)
          const da = a.dueDate ? new Date(a.dueDate).getTime() : Infinity
          const db = b.dueDate ? new Date(b.dueDate).getTime() : Infinity
          return da - db
        })
    },

    // Grouped by Stats
    tasksByStats: (state) =>
      state.tasks.reduce((acc, t) => {
        const s = t.Stats || ''
        if (!acc[s]) acc[s] = []
        acc[s].push(t)
        return acc
      }, {}),

    favoriteCount: (state) => state.tasks.filter((t) => t.favorite).length,
    completedCount: (state) => state.tasks.filter((t) => t.Stats === 'Concluída').length,
    archivedCount: (state) => state.tasks.filter((t) => t.archived).length,
    hasTasks: (state) => state.tasks.length > 0,
  },

  actions: {
    // Internal helpers
    setError(err) {
      this.error = err ? String(err.message || err) : null
    },

    // Load all tasks (respects showArchived flag only in getters)
    async loadAllTasks() {
      this.loading = true
      this.setError(null)
      try {
        const data = await apiGetAll()
        this.tasks = data.map((t) => ({
          // Normalize common fields and defaults
          id: t.id,
          title: t.title || '',
          description: t.description || '',
          Stats: t.Stats || 'Pendente',
          favorite: !!t.favorite,
          archived: !!t.archived,
          priority: t.priority || 'Normal',
          dueDate: t.dueDate || null,
          createdAt: t.createdAt || null,
          updatedAt: t.updatedAt || null,
          ...t,
        }))
      } catch (err) {
        this.setError(err)
        this.tasks = []
      } finally {
        this.loading = false
      }
    },

    async loadTaskById(id) {
      this.loading = true
      this.setError(null)
      try {
        const t = await apiGetById(id)
        this.selectedTask = t || null
        return this.selectedTask
      } catch (err) {
        this.setError(err)
        this.selectedTask = null
        return null
      } finally {
        this.loading = false
      }
    },

    // Use API filter when available
    async filterByStats(Stats) {
      this.loading = true
      this.setError(null)
      this.activeStatsFilter = Stats
      try {
        if (Stats == null) {
          await this.loadAllTasks()
        } else {
          const data = await apiGetByStats(Stats)
          this.tasks = data
        }
      } catch (err) {
        this.setError(err)
        this.tasks = []
      } finally {
        this.loading = false
      }
    },

    async search(query) {
      this.loading = true
      this.setError(null)
      this.searchQuery = query || ''
      try {
        if (!this.searchQuery) {
          await this.loadAllTasks()
        } else {
          const data = await apiSearch(this.searchQuery)
          this.tasks = data
        }
      } catch (err) {
        this.setError(err)
        this.tasks = []
      } finally {
        this.loading = false
      }
    },

    async createTask(taskData) {
      this.loading = true
      this.setError(null)
      try {
        const created = await apiCreate(taskData)
        // keep local list up-to-date (add to front)
        this.tasks.unshift(created)
        return created
      } catch (err) {
        this.setError(err)
        return null
      } finally {
        this.loading = false
      }
    },

    async updateTask(id, taskData) {
      this.loading = true
      this.setError(null)
      try {
        const updated = await apiUpdate(id, taskData)
        if (updated) {
          const idx = this.tasks.findIndex((t) => String(t.id) === String(id))
          if (idx !== -1) this.tasks.splice(idx, 1, updated)
          if (this.selectedTask && String(this.selectedTask.id) === String(id)) {
            this.selectedTask = updated
          }
        }
        return updated
      } catch (err) {
        this.setError(err)
        return null
      } finally {
        this.loading = false
      }
    },

    async removeTask(id) {
      this.loading = true
      this.setError(null)
      try {
        const ok = await apiDelete(id)
        if (ok) {
          this.tasks = this.tasks.filter((t) => String(t.id) !== String(id))
          if (this.selectedTask && String(this.selectedTask.id) === String(id)) {
            this.selectedTask = null
          }
        }
        return ok
      } catch (err) {
        this.setError(err)
        return false
      } finally {
        this.loading = false
      }
    },

    // Toggle favorite
    async toggleFavorite(id) {
      const task = this.tasks.find((t) => String(t.id) === String(id))
      if (!task) return null
      const updated = await this.updateTask(id, { favorite: !task.favorite })
      return updated
    },

    // Toggle completion (Stats)
    async toggleCompletion(id) {
      const task = this.tasks.find((t) => String(t.id) === String(id))
      if (!task) return null
      const newStats = task.Stats === 'Concluída' ? 'Pendente' : 'Concluída'
      const updated = await this.updateTask(id, { Stats: newStats })
      return updated
    },

    // Archive / Unarchive
    async toggleArchive(id) {
      const task = this.tasks.find((t) => String(t.id) === String(id))
      if (!task) return null
      const updated = await this.updateTask(id, { archived: !task.archived })
      return updated
    },

    // Utility: refresh current view (applies activeStatsFilter or searchQuery)
    async refresh() {
      if (this.searchQuery) {
        await this.search(this.searchQuery)
      } else if (this.activeStatsFilter) {
        await this.filterByStats(this.activeStatsFilter)
      } else {
        await this.loadAllTasks()
      }
    },
  },
})
