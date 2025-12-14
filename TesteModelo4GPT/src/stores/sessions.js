import { defineStore } from 'pinia'
import {
  sessionsLists as apiGetAll,
  sessionsDetails as apiGetById,
  createSession as apiCreate,
  updateSession as apiUpdate,
  deleteSession as apiDelete,
} from '@/api/api.js'

export const useSessionsStore = defineStore('sessions', {
  state: () => ({
    sessions: [],
    selectedSession: null,
    activeDisciplineFilter: null,
    loading: false,
    error: null,
  }),

  actions: {
    setError(err) {
      this.error = err ? String(err.message || err) : null
    },

    async loadSessions() {
      this.loading = true
      this.setError(null)
      try {
        const data = await apiGetAll()
        this.sessions = Array.isArray(data) ? data : []
      } catch (err) {
        this.setError(err)
        this.sessions = []
      } finally {
        this.loading = false
      }
    },

    async loadSessionById(id) {
      this.loading = true
      this.setError(null)
      try {
        const data = await apiGetById(id)
        this.selectedSession = data || null
        return this.selectedSession
      } catch (err) {
        this.setError(err)
        this.selectedSession = null
        return null
      } finally {
        this.loading = false
      }
    },

    async addSession(sessionData) {
      this.loading = true
      this.setError(null)
      try {
        const created = await apiCreate(sessionData)
        this.sessions.unshift(created)
        return created
      } catch (err) {
        this.setError(err)
        return null
      } finally {
        this.loading = false
      }
    },

    async updateSession(id, sessionData) {
      this.loading = true
      this.setError(null)
      try {
        const updated = await apiUpdate(id, sessionData)
        if (updated) {
          const idx = this.sessions.findIndex((s) => String(s.id) === String(id))
          if (idx !== -1) this.sessions.splice(idx, 1, updated)
          if (this.selectedSession && String(this.selectedSession.id) === String(id)) {
            this.selectedSession = updated
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

    async removeSession(id) {
      this.loading = true
      this.setError(null)
      try {
        const ok = await apiDelete(id)
        if (ok) {
          this.sessions = this.sessions.filter((s) => String(s.id) !== String(id))
          if (this.selectedSession && String(this.selectedSession.id) === String(id)) {
            this.selectedSession = null
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

    async toggleCompleted(id) {
      const s = this.sessions.find((x) => String(x.id) === String(id))
      if (!s) return null
      return this.updateSession(id, { completed: !s.completed })
    },

    async toggleFavorite(id) {
      const s = this.sessions.find((x) => String(x.id) === String(id))
      if (!s) return null
      return this.updateSession(id, { favorite: !s.favorite })
    },
  },

  getters: {
    completedCount: (state) => state.sessions.filter((s) => s.completed).length,
    favoriteCount: (state) => state.sessions.filter((s) => s.favorite).length,
    sessionsBySubject: (state) => (subject) => state.sessions.filter((s) => s.subject === subject),
    hasSessions: (state) => state.sessions.length > 0,
  },
})
