const TOKEN_KEY = 'token'

function removeStoredToken() {
  localStorage.removeItem(TOKEN_KEY)
}

function sanitizeToken(value?: string | null) {
  if (!value) return null
  return value.trim().replace(/^Bearer\s+/i, '')
}

function extractToken(raw: string) {
  try {
    const parsed = JSON.parse(raw)
    if (typeof parsed === 'string') return sanitizeToken(parsed)
    if (parsed && typeof parsed === 'object') {
      if ('token' in parsed) return sanitizeToken(parsed.token as string)
      if ('access_token' in parsed) return sanitizeToken(parsed.access_token as string)
    }
    return null
  } catch {
    return sanitizeToken(raw)
  }
}

export function getTokenFromLocalStorage() {
  const raw = localStorage.getItem(TOKEN_KEY)
  if (!raw) return null

  const token = extractToken(raw)
  if (!token) {
    removeStoredToken()
    return null
  }

  const payload = parseJwt(token)
  if (!payload || payload.exp < Date.now() / 1000) {
    removeStoredToken()
    return null
  }

  return token
}

export function parseJwt(token: string) {
  try {
    const parts = token.split('.')
    if (parts.length < 2 || !parts[1]) throw new Error('Malformed JWT')

    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join(''),
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Invalid JWT detected', error)
    return null
  }
}
