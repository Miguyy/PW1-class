import placeholderImage from '@/assets/pokemon-placeholder.gif'

/**
 * Formata o order do Pokémon com padding dinâmico baseado no total.
 * Retorna placeholder '???' para orders inválidos (alguns Pokémon têm order=-1 na API).
 *
 * @param {number} order - O order do Pokémon
 * @param {number} totalCount - O total de Pokémon na Pokédex
 * @returns {string} - Ex: '#0025' ou '#????'
 */
export function formatPokemonOrder(order, totalCount) {
  const totalDigits = Math.floor(Math.log10(totalCount)) + 1
  const placeholder = '?'.repeat(totalDigits)

  if (!order || order < 0) {
    return '#' + placeholder
  }

  return '#' + String(order).padStart(totalDigits, '0')
}

/**
 * Obtém o sprite do Pokémon com fallback para placeholder.
 *
 * @param {Object} sprites - Objeto sprites do Pokémon
 * @param {string} type - Tipo de sprite ('front_default', 'back_default', etc.)
 * @returns {string} - URL do sprite ou placeholder
 */
export function getPokemonSprite(sprites, type = 'front_default') {
  return sprites?.[type] || placeholderImage
}

/**
 * Converte altura de decímetros (formato API) para metros.
 *
 * @param {number} height - Altura em decímetros
 * @returns {string} - Ex: '1.7 m'
 */
export function formatHeight(height) {
  const heightInMeters = height / 10
  return `${heightInMeters.toFixed(1)} m`
}

/**
 * Converte peso de hectogramas (formato API) para quilogramas.
 *
 * @param {number} weight - Peso em hectogramas
 * @returns {string} - Ex: '90.5 kg'
 */
export function formatWeight(weight) {
  const weightInKg = weight / 10
  return `${weightInKg.toFixed(1)} kg`
}

/**
 * Formata nome de habilidade: 'lightning-rod' -> 'Lightning Rod'
 *
 * @param {string} abilityName - Nome da habilidade da API
 * @returns {string} - Nome formatado
 */
export function formatAbilityName(abilityName) {
  return abilityName
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Traduz nomes das stats da API para português.
 *
 * @param {string} statName - Nome da stat da API
 * @returns {string} - Nome traduzido
 */
export function formatStatName(statName) {
  const statNames = {
    hp: 'HP',
    attack: 'Ataque',
    defense: 'Defesa',
    'special-attack': 'Atq. Esp.',
    'special-defense': 'Def. Esp.',
    speed: 'Velocidade',
  }
  return statNames[statName] || statName
}

/**
 * Calcula percentagem para barra de progresso de stats.
 * O valor máximo de uma stat é ~255.
 *
 * @param {number} value - Valor da stat
 * @returns {number} - Percentagem (0-100)
 */
export function calculateStatPercentage(value) {
  const MAX_STAT = 255
  return Math.min((value / MAX_STAT) * 100, 100)
}
