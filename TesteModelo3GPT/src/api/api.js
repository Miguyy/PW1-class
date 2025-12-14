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

function getAllTasks() {
  return get('/tasks')
}

function getTaskById(id) {
  return get(`/tasks/${id}`)
}

function getTasksFilter(filter) {
  return get(`/tasks?stats=${encodeURIComponent(filter)}`)
}

function searchTasks(query) {
  if (!query || query.trim() === '') return getAllTasks()
  return get(`/tasks?q=${encodeURIComponent(query)}`)
}

function orderTasksByDueDate() {
  return get('/tasks?_sort=dueDate&_order=asc')
}

function multipleFilters() {
  return get('/tasks?stats=completed&priority=false')
}

function createTask(taskData) {
  return post('/tasks', taskData)
}

function updateTask(id, taskData) {
  return put(`/tasks/${id}`, taskData)
}

function deleteTask(id) {
  return del(`/tasks/${id}`)
}

export {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTasksFilter,
  searchTasks,
  orderTasksByDueDate,
  multipleFilters,
}
