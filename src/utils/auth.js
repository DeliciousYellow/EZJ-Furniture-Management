import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}


const digestSecretKey = 'vue_admin_template_digestSecret'

export function setDigestSecret(digestSecret) {
  return Cookies.set(digestSecretKey, digestSecret)
}

export function getDigestSecret() {
  return Cookies.get(digestSecretKey)
}

export function removeDigestSecret() {
  return Cookies.remove(digestSecretKey)
}