// URL base da API - utiliza key "1" gratuita para desenvolvimento
const BASE_URL = 'https://www.thecocktaildb.com/api/json/v1/1'

// Função genérica para pedidos GET
// Centraliza lógica de fetch e tratamento de erros
async function get(endpoint) {
  const url = `${BASE_URL}/${endpoint}`

  const response = await fetch(url, {
    headers: {
      // Header Accept: indica ao servidor que preferimos JSON
      Accept: 'application/json',
    },
  })

  // Lança erro se resposta não for bem-sucedida (status 4xx ou 5xx)
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  // .json() lê o body e converte de texto para objeto JS
  const data = await response.json()
  return data
}

// Obtém um cocktail aleatório
// Endpoint: random.php
export async function getRandomCocktail() {
  const data = await get('random.php')
  // A API retorna { drinks: [cocktail] } - extraímos o primeiro elemento
  return data.drinks ? data.drinks[0] : null
}

// Obtém detalhes completos de um cocktail por ID
// Endpoint: lookup.php?i={id}
export async function getCocktailById(id) {
  const data = await get(`lookup.php?i=${id}`)
  return data.drinks ? data.drinks[0] : null
}

// Pesquisa cocktails por nome
// Endpoint: search.php?s={query}
export async function searchCocktails(query) {
  if (!query || query.trim() === '') {
    return []
  }

  // encodeURIComponent trata caracteres especiais (espaços, acentos, etc.)
  const data = await get(`search.php?s=${encodeURIComponent(query)}`)

  // A API retorna { drinks: null } quando não há resultados (não array vazio)
  return data.drinks || []
}

// Lista cocktails de uma categoria específica
// Endpoint: filter.php?c={category}
// NOTA: Retorna dados simplificados (apenas idDrink, strDrink, strDrinkThumb)
export async function getCocktailsByCategory(category) {
  if (!category) {
    return []
  }

  const data = await get(`filter.php?c=${encodeURIComponent(category)}`)
  return data.drinks || []
}

// Obtém lista de todas as categorias disponíveis
// Endpoint: list.php?c=list
export async function getCategories() {
  const data = await get('list.php?c=list')

  if (!data.drinks) {
    return []
  }

  // A API retorna [{ strCategory: "Cocktail" }, ...]
  // Transformamos para array simples de strings
  return data.drinks.map((item) => item.strCategory)
}
