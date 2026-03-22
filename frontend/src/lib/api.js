const BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

async function req(method, path, body = null) {
    const opts = { method, headers: { 'Content-Type': 'application/json' } }
    if (body && method !== 'GET') opts.body = JSON.stringify(body)
    const res = await fetch(BASE + path, opts)
    if (res.status === 204) return null
    const data = await res.json()
    if (!res.ok) {
        const err = new Error(data?.error || data?.detail || 'Request failed')
        err.status = res.status
        throw err
    }
    return data
}

export const createRoom = (name, pass = '') => req('POST', '/rooms/', { author_name: name, passphrase: pass })
export const joinRoom = (code, name, pass = '') => req('POST', `/rooms/${code}/join/`, { author_name: name, passphrase: pass })
export const getRoom = (code) => req('GET', `/rooms/${code}/`)
export const getEntries = (code, params = {}) => { const qs = new URLSearchParams(params).toString(); return req('GET', `/entries/${code}/${qs ? '?' + qs : ''}`) }
export const createEntry = (code, body) => req('POST', `/entries/${code}/`, { author_name: body.authorName, content: body.content, mood_emoji: body.moodEmoji || '', is_favourite: false, photo: body.photo || null })
export const updateEntry = (id, name, fields) => req('PATCH', `/entry/${id}/`, { author_name: name, ...fields })
export const deleteEntry = (id, name) => req('DELETE', `/entry/${id}/`, { author_name: name })
export const toggleFavourite = (id) => req('POST', `/entry/${id}/favourite/`)
export const getMemories = (code) => req('GET', `/memories/${code}/`)
export const react = (id, name, emoji) => req('POST', `/reactions/${id}/`, { reactor_name: name, emoji })
export const getPresence = (code) => req('GET', `/presence/${code}/`)
export const updatePresence = (code, name, f = {}) => req('PATCH', `/presence/${code}/`, { member_name: name, vibe_emoji: f.vibeEmoji || '', vibe_text: f.vibeText || '', is_online: f.isOnline ?? true, timezone_name: f.timezoneName || Intl.DateTimeFormat().resolvedOptions().timeZone })
export const getMessages = (code, afterId = null) => { const qs = afterId ? `?after=${afterId}` : ''; return req('GET', `/chat/${code}/${qs}`) }
export const sendMessage = (code, sender, text) => req('POST', `/chat/${code}/`, { sender_name: sender, text })
export const getDateIdeas = (n = 6) => req('GET', `/dateideas/?random=${n}`)
export const getMoods = () => req('GET', '/moods/')
