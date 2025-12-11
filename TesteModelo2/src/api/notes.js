// API de comunicação com JSON Server
// Iniciar servidor: json-server --watch db.json --port 3000

// Base URL do JSON Server
const BASE_URL = 'http://localhost:3000'

// Request genérico com tratamento de erros
async function request(endpoint, options = {}) {
  const { method = 'GET', body = null } = options

  const config = { method }

  if (body) {
    config.headers = { 'Content-Type': 'application/json' }
    config.body = JSON.stringify(body)
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config)

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  // DELETE não retorna conteúdo
  return method === 'DELETE' ? response.ok : await response.json()
}

// Métodos HTTP simplificados
function get(endpoint) {
  return request(endpoint, { method: 'GET' })
}

function post(endpoint, data) {
  return request(endpoint, { method: 'POST', body: data })
}

function put(endpoint, data) {
  return request(endpoint, { method: 'PUT', body: data })
}

function del(endpoint) {
  return request(endpoint, { method: 'DELETE' })
}

// GET /notes - Todas as notas
function getAllNotes() {
  return get('/notes')
}

// GET /notes/:id - Nota por ID
function getNoteById(id) {
  return get(`/notes/${id}`)
}

// GET /notes?category=:category - Notas por categoria
function getNotesByCategory(category) {
  return get(`/notes?category=${encodeURIComponent(category)}`)
}

// GET /notes?q=:query - Pesquisa full-text (JSON Server)
function searchNotes(query) {
  if (!query || query.trim() === '') return getAllNotes()
  return get(`/notes?q=${encodeURIComponent(query)}`)
}

// POST /notes - Criar nota
function createNote(noteData) {
  return post('/notes', noteData)
}

// PUT /notes/:id - Atualizar nota completa
function updateNote(id, noteData) {
  return put(`/notes/${id}`, noteData)
}

// DELETE /notes/:id - Eliminar nota
function deleteNote(id) {
  return del(`/notes/${id}`)
}

export {
  getAllNotes,
  getNoteById,
  getNotesByCategory,
  searchNotes,
  createNote,
  updateNote,
  deleteNote,
}
