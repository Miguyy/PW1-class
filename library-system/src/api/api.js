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

// GET - Obter recursos (suporta query params para filtros/pesquisa/paginação)
export async function get(endpoint) {
  const url = `${BASE_URL}${endpoint}`
  return request(url)
}

// POST - Criar novos recursos
export async function post(endpoint, data) {
  const url = `${BASE_URL}${endpoint}`
  return request(url, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// PUT - Atualizar recurso completo
export async function put(endpoint, data) {
  const url = `${BASE_URL}${endpoint}`
  return request(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

// DELETE - Remover recurso
// Nota: 'del' porque 'delete' é palavra reservada em JS
export async function del(endpoint) {
  const url = `${BASE_URL}${endpoint}`
  return request(url, {
    method: 'DELETE',
  })
}

// Constrói query string a partir de objeto de parâmetros
// Filtra valores vazios/null/undefined automaticamente
export function buildQueryString(params) {
  const query = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    // Só adiciona se o valor não for vazio/null/undefined
    if (value !== null && value !== undefined && value !== '') {
      query.append(key, value)
    }
  })

  const queryString = query.toString()
  return queryString ? `?${queryString}` : ''
}
