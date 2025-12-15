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

function writeStore(dishes) {
  if (hasLocalStorage()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dishes))
  } else {
    inMemoryStore = dishes
  }
}

function generateId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

export async function apiGetAll() {
  await delay()
  return readStore().map(clone)
}

export async function apiGetByCategory(category) {
  await delay()
  const dishes = readStore()
  const found = dishes.find((t) => String(t.id) === String(category))
  return found ? clone(found) : null
}

export async function apiCreate(dishData = {}) {
  await delay()
  if (!dishData || !String(dishData.name || '').trim()) {
    throw new Error('The dish must have a non-empty name')
  }

  const dishes = readStore()
  const now = new Date().toISOString()
  const newDish = {
    id: generateId(),
    name: String(dishData.name).trim(),
    description: String(dishData.subject || '').trim(),
    price: dishData.price ? Number(dishData.price) : 0,
    category: String(dishData.category).trim(),
    available: Boolean(dishData.available || false),
    imageUrl: String(dishData.imageUrl).trim(),
    createdAt: now,
  }

  dishes.unshift(newDish)
  writeStore(dishes)
  return clone(newDish)
}

export async function updateDish(id, dishData = {}) {
  await delay()
  const dishes = readStore()
  const idx = dishes.findIndex((t) => String(t.id) === String(id))
  if (idx === -1) return null

  const existing = dishes[idx]
  const updated = {
    ...existing,
    ...dishData,
    id: existing.id,
    updatedAt: new Date().toISOString(),
  }

  dishes[idx] = updated
  writeStore(dishes)
  return clone(updated)
}

export async function deleteDish(id) {
  await delay()
  const dishes = readStore()
  const idx = dishes.findIndex((t) => String(t.id) === String(id))
  if (idx === -1) return false
  dishes.splice(idx, 1)
  writeStore(dishes)
  return true
}
