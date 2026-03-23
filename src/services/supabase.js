/**
 * Supabase client for Nuvio Addon Manager
 * Communicates with Nuvio's Supabase backend for auth and addon management.
 */

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || 'https://dpyhjjcoabcglfmgecug.supabase.co').replace(/\/$/, '')
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRweWhqamNvYWJjZ2xmbWdlY3VnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3ODYyNDcsImV4cCI6MjA4NjM2MjI0N30.U-3QSNDdpsnvRk_7ZL419AFTOtggHJJcmkodxeXjbkg'
const SESSION_KEY = 'nuvio-addon-manager:session'

export function isConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)
}

// --- Session management ---

function getStoredSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    localStorage.removeItem(SESSION_KEY)
    return null
  }
}

function storeSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

function isSessionExpired(session) {
  if (!session?.expires_at) return false
  const now = Math.floor(Date.now() / 1000)
  return now >= (session.expires_at - 30)
}

// --- HTTP helpers ---

async function request(path, { method = 'GET', body, authToken } = {}) {
  const headers = {
    apikey: SUPABASE_ANON_KEY,
  }

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`
  }

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(`${SUPABASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  const raw = await response.text()
  let parsed
  try {
    parsed = raw ? JSON.parse(raw) : null
  } catch {
    parsed = raw
  }

  if (!response.ok) {
    const message = parsed?.message || parsed?.msg || parsed?.error_description || parsed?.error || `Request failed (${response.status})`
    const error = new Error(typeof message === 'string' ? message : JSON.stringify(message))
    error.status = response.status
    error.code = parsed?.error_code || parsed?.code
    throw error
  }

  return parsed
}

async function requestAuth(path, { method, body }) {
  return request(path, { method, body, authToken: null })
}

// --- Auth ---

export async function signUp(email, password) {
  const data = await requestAuth('/auth/v1/signup', {
    method: 'POST',
    body: { email, password },
  })

  if (data.session) {
    storeSession(data.session)
    return { user: data.user, session: data.session }
  }

  // Email confirmation required
  return { user: data.user, needsConfirmation: true }
}

export async function signIn(email, password) {
  const session = await requestAuth('/auth/v1/token?grant_type=password', {
    method: 'POST',
    body: { email, password },
  })

  storeSession(session)
  return { user: session.user, session }
}

export async function signOut() {
  const token = await getValidToken()
  if (token) {
    try {
      await request('/auth/v1/logout', { method: 'POST', authToken: token })
    } catch {
      // Ignore logout errors
    }
  }
  clearSession()
}

async function refreshToken(refreshToken) {
  const session = await requestAuth('/auth/v1/token?grant_type=refresh_token', {
    method: 'POST',
    body: { refresh_token: refreshToken },
  })
  storeSession(session)
  return session
}

export async function getValidToken() {
  let session = getStoredSession()
  if (!session?.access_token) return null

  if (isSessionExpired(session)) {
    if (!session.refresh_token) {
      clearSession()
      return null
    }
    try {
      session = await refreshToken(session.refresh_token)
    } catch {
      clearSession()
      return null
    }
  }

  return session.access_token
}

export function getCurrentUser() {
  const session = getStoredSession()
  return session?.user || null
}

export function isLoggedIn() {
  return Boolean(getStoredSession()?.access_token)
}

// --- RPC ---

async function callRpc(functionName, payload = {}) {
  const token = await getValidToken()
  if (!token) throw new Error('Not authenticated')

  return request(`/rest/v1/rpc/${functionName}`, {
    method: 'POST',
    body: payload,
    authToken: token,
  })
}

// --- Addon management ---

async function getEffectiveOwnerId() {
  const response = await callRpc('get_sync_owner', {})
  if (typeof response === 'string') return response
  if (Array.isArray(response)) {
    const first = response[0]
    if (typeof first === 'string') return first
    if (first && typeof first === 'object') {
      return first.get_sync_owner || first.id || null
    }
  }
  if (response && typeof response === 'object') {
    return response.get_sync_owner || response.id || null
  }
  return null
}

export async function fetchAddons() {
  const token = await getValidToken()
  if (!token) throw new Error('Not authenticated')

  const ownerId = await getEffectiveOwnerId()
  if (!ownerId) throw new Error('Could not resolve user ID')

  const rows = await request(
    `/rest/v1/addons?select=id,url,sort_order&user_id=eq.${encodeURIComponent(ownerId)}&profile_id=eq.1&order=sort_order.asc`,
    { method: 'GET', authToken: token }
  )

  // For each addon URL, try to fetch the manifest to get name/logo
  const addons = []
  for (const row of rows || []) {
    if (!row.url) continue

    const addon = {
      id: row.id,
      url: row.url,
      sort_order: row.sort_order,
      manifest: null,
    }

    try {
      const manifestUrl = row.url.includes('manifest.json')
        ? row.url
        : `${row.url.replace(/\/$/, '')}/manifest.json`
      const resp = await fetch(manifestUrl)
      if (resp.ok) {
        addon.manifest = await resp.json()
      }
    } catch {
      // Manifest fetch failed, that's OK
    }

    addons.push(addon)
  }

  return addons
}

export async function syncAddons(addons) {
  const payload = addons.map((addon, index) => ({
    url: addon.url.includes('manifest.json')
      ? addon.url
      : `${addon.url.replace(/\/$/, '')}/manifest.json`,
    sort_order: index,
  }))

  await callRpc('sync_push_addons', { p_addons: payload })
}

export async function getRemoteStats() {
  const token = await getValidToken()
  if (!token) return null

  const ownerId = await getEffectiveOwnerId()
  if (!ownerId) return null

  const ownerFilter = encodeURIComponent(ownerId)
  const [addons, plugins] = await Promise.all([
    request(`/rest/v1/addons?select=id&user_id=eq.${ownerFilter}&profile_id=eq.1`, { method: 'GET', authToken: token }),
    request(`/rest/v1/plugins?select=id&user_id=eq.${ownerFilter}&profile_id=eq.1`, { method: 'GET', authToken: token }),
  ])

  return {
    addons: addons?.length || 0,
    plugins: plugins?.length || 0,
  }
}
