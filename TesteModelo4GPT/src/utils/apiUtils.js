const STORAGE_KEY = 'appUtils'
const SIMULATED_DELAY_MS = 150

let inMemoryStore = null

function delay(ms = SIMULATED_DELAY_MS) {
  return new Promise((res) => setTimeout(res, ms))
}

function hasLocalStorage() {
  try {
    return typeof window !== 'undefined' && 'localStorage' in window
  } catch {
    return false
  }
}

function readStore() {
  if (hasLocalStorage()) {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  }
  return inMemoryStore || []
}

function writeStore(sessions) {
  if (hasLocalStorage()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
  } else {
    inMemoryStore = sessions
  }
}

function generateId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

export async function getAllSessions() {
  await delay()
  return readStore().map(clone)
}

export async function getSessionById(id) {
  await delay()
  const sessions = readStore()
  const found = sessions.find((t) => String(t.id) === String(id))
  return found ? clone(found) : null
}

export async function createSession(sessionData = {}) {
  await delay()
  if (!sessionData || !String(sessionData.title || '').trim()) {
    throw new Error('Session must have a non-empty title')
  }

  const sessions = readStore()
  const now = new Date().toISOString()
  const newSession = {
    id: generateId(),
    title: String(sessionData.title).trim(),
    subject: String(sessionData.subject || '').trim(),
    duration: sessionData.duration ? Number(sessionData.duration) : 0,
    completed: Boolean(sessionData.completed || false),
    favorite: Boolean(sessionData.favorite || false),
    createdAt: now,
  }

  sessions.unshift(newSession)
  writeStore(sessions)
  return clone(newSession)
}

export async function updateSession(id, sessionData = {}) {
  await delay()
  const sessions = readStore()
  const idx = sessions.findIndex((t) => String(t.id) === String(id))
  if (idx === -1) return null

  const existing = sessions[idx]
  const updated = {
    ...existing,
    ...sessionData,
    id: existing.id,
    updatedAt: new Date().toISOString(),
  }

  sessions[idx] = updated
  writeStore(sessions)
  return clone(updated)
}

export async function deleteSession(id) {
  await delay()
  const sessions = readStore()
  const idx = sessions.findIndex((t) => String(t.id) === String(id))
  if (idx === -1) return false
  sessions.splice(idx, 1)
  writeStore(sessions)
  return true
}
