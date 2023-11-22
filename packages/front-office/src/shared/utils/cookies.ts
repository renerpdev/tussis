import { AuthCookie } from '../types/auth.types'

export const AUTH_COOKIE_NAME = 'auth'

export const getAuthCookie = () => {
  const matches = document.cookie.match(
    new RegExp(
      '(?:^|; )' + AUTH_COOKIE_NAME.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)',
    ),
  )

  if (matches) {
    const decoded = decodeURIComponent(matches[1])
    const authCookie: AuthCookie = decoded.startsWith('j:')
      ? JSON.parse(decoded.substring(2, decoded.length))
      : JSON.parse(decoded)

    return authCookie
  }
  return undefined
}
