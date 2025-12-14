// URL de fallback para capas de livros sem imagem
export const FALLBACK_COVER_URL = 'https://via.placeholder.com/300x450/cccccc/666666?text=No+Cover'

// Mapeamento de códigos de género para labels legíveis
const GENRE_MAP = {
  fantasy: 'Fantasy',
  fiction: 'Fiction',
  classic: 'Classic',
  dystopian: 'Dystopian',
  thriller: 'Thriller',
  scifi: 'Sci-Fi',
  romance: 'Romance',
  biography: 'Biography',
  horror: 'Horror',
}

/**
 * Formata o código de género para apresentação.
 *
 * @param {string} genre - Código do género (ex: 'scifi')
 * @returns {string} - Label formatado (ex: 'Sci-Fi')
 */
export function formatGenre(genre) {
  return GENRE_MAP[genre] || genre
}

/**
 * Renderiza rating como estrelas visuais (★★★☆☆).
 *
 * @param {number} rating - Rating entre 0 e 5
 * @returns {string} - String de estrelas (ex: '★★★☆☆' para rating 3)
 */
export function renderStars(rating) {
  const fullStars = '★'.repeat(rating)
  const emptyStars = '☆'.repeat(5 - rating)
  return fullStars + emptyStars
}

/**
 * Handler para erro de carregamento de imagem.
 * Define a src para o URL de fallback.
 *
 * @param {Event} event - Evento de erro da imagem
 */
export function handleImageError(event) {
  event.target.src = FALLBACK_COVER_URL
}
