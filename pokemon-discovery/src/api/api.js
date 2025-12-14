const BASE_URL = 'https://pokeapi.co/api/v2'

export async function get(endpoint) {
  const url = `${BASE_URL}/${endpoint}`

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data = await response.json()
  return data
}
