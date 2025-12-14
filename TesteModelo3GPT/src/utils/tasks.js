// src/utils/tasks.js
// Pequena API assíncrona de tarefas com persistência em localStorage (fallback em memória)

const STORAGE_KEY = 'app_tasks_v1'
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

function writeStore(tasks) {
  if (hasLocalStorage()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  } else {
    inMemoryStore = tasks
  }
}

function generateId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * getAllTasks(): Promise<task[]>
 */
export async function getAllTasks() {
  await delay()
  return readStore().map(clone)
}

/**
 * getTaskById(id): Promise<task|null>
 */
export async function getTaskById(id) {
  await delay()
  const tasks = readStore()
  const found = tasks.find((t) => String(t.id) === String(id))
  return found ? clone(found) : null
}

/**
 * getTasksBystats(stats): Promise<task[]>
 * stats: string (ex: 'todo', 'in-progress', 'done') - case-insensitive
 */
export async function getTasksByStats(stats) {
  await delay()
  if (stats == null || String(stats).trim() === '') return []
  const s = String(stats).toLowerCase()
  return readStore()
    .filter((t) => String(t.stats || '').toLowerCase() === s)
    .map(clone)
}

/**
 * searchTasks(query): Promise<task[]>
 * Pesquisa em title e description (case-insensitive)
 */
export async function searchTasks(query) {
  await delay()
  const q = (query || '').toString().trim().toLowerCase()
  if (!q) return []
  return readStore()
    .filter((t) => {
      const title = (t.title || '').toString().toLowerCase()
      const desc = (t.description || '').toString().toLowerCase()
      return title.includes(q) || desc.includes(q)
    })
    .map(clone)
}

/**
 * createTask(taskData): Promise<task>
 * taskData: { title, description?, stats?, dueDate?, priority?, ... }
 */
export async function createTask(taskData = {}) {
  await delay()
  if (!taskData || !String(taskData.title || '').trim()) {
    throw new Error('Task must have a non-empty title')
  }

  const tasks = readStore()
  const now = new Date().toISOString()
  const newTask = {
    id: generateId(),
    title: String(taskData.title).trim(),
    description: taskData.description ? String(taskData.description) : '',
    stats: taskData.stats ? String(taskData.stats) : 'all',
    createdAt: now,
    updatedAt: now,
    dueDate: taskData.dueDate || null,
    priority: taskData.priority || 'normal',
    ...taskData.extra,
  }

  tasks.unshift(newTask)
  writeStore(tasks)
  return clone(newTask)
}

/**
 * updateTask(id, taskData): Promise<task|null>
 * Atualização parcial (merge)
 */
export async function updateTask(id, taskData = {}) {
  await delay()
  const tasks = readStore()
  const idx = tasks.findIndex((t) => String(t.id) === String(id))
  if (idx === -1) return null

  const existing = tasks[idx]
  const updated = {
    ...existing,
    ...taskData,
    id: existing.id,
    updatedAt: new Date().toISOString(),
  }

  tasks[idx] = updated
  writeStore(tasks)
  return clone(updated)
}

/**
 * deleteTask(id): Promise<boolean>
 */
export async function deleteTask(id) {
  await delay()
  const tasks = readStore()
  const idx = tasks.findIndex((t) => String(t.id) === String(id))
  if (idx === -1) return false
  tasks.splice(idx, 1)
  writeStore(tasks)
  return true
}
