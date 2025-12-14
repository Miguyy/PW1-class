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

  const response = await fetch(`${BASE_URL}/sessions`)

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

function sessionsLists() {
  return get('/sessions')
}

function sessionsDetails(id) {
  return get(`/sessions/${id}`)
}

function createSession(sessionData) {
  return post('/sessions', sessionData)
}

function updateSession(id, sessionData) {
  return put(`/sessions/${id}`, sessionData)
}

function deleteSession(id) {
  return del(`/sessions/${id}`)
}

export { sessionsLists, sessionsDetails, createSession, updateSession, deleteSession }
