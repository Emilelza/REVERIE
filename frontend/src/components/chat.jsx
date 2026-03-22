import { useState, useEffect, useRef } from 'react'
import { Send, X, Bell, BellOff } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'
import { useStore } from '../store/useStore'
import * as api from '../lib/api'

export default function Chat({ onClose }) {
    const { roomCode, authorName, presences } = useStore()

    const [messages, setMessages] = useState([])
    const [text, setText] = useState('')
    const [sending, setSending] = useState(false)
    const [notifOn, setNotifOn] = useState(false)
    const [unread, setUnread] = useState(0)
    const [focused, setFocused] = useState(true)

    const lastIdRef = useRef(null)
    const bottomRef = useRef(null)
    const inputRef = useRef(null)
    const pollRef = useRef(null)

    // ── partner info from presence ─────────────────────────────
    const partner = presences.find((p) => p.member_name !== authorName)
    const partnerOnline = partner?.is_online || false
    const partnerVibe = partner?.vibe_text || ''
    const partnerEmoji = partner?.vibe_emoji || ''

    // ── request browser notification permission ────────────────
    const requestNotif = async () => {
        if (!('Notification' in window)) {
            toast.error('Notifications not supported in this browser')
            return
        }
        const perm = await Notification.requestPermission()
        if (perm === 'granted') {
            setNotifOn(true)
            toast.success('Notifications enabled!')
        } else {
            toast.error('Permission denied. Allow notifications in browser settings.')
        }
    }

    const toggleNotif = () => {
        if (notifOn) {
            setNotifOn(false)
            toast('Notifications off')
        } else {
            requestNotif()
        }
    }

    // ── show browser notification ──────────────────────────────
    const showNotif = (msg) => {
        if (!notifOn) return
        if (document.visibilityState === 'visible' && focused) return
        try {
            const n = new Notification(`${msg.sender_name} in Reverie`, {
                body: msg.text.slice(0, 80),
                icon: '/favicon.ico',
                badge: '/favicon.ico',
                tag: 'reverie-chat',
            })
            n.onclick = () => { window.focus(); n.close() }
        } catch (e) { void e }
    }

    // ── track window focus ─────────────────────────────────────
    useEffect(() => {
        const onFocus = () => { setFocused(true); setUnread(0) }
        const onBlur = () => setFocused(false)
        window.addEventListener('focus', onFocus)
        window.addEventListener('blur', onBlur)
        return () => {
            window.removeEventListener('focus', onFocus)
            window.removeEventListener('blur', onBlur)
        }
    }, [])

    // ── initial load + polling ─────────────────────────────────
    useEffect(() => {
        loadAll()
        inputRef.current?.focus()
        pollRef.current = setInterval(poll, 2500)
        return () => clearInterval(pollRef.current)
    }, []) // eslint-disable-line

    // ── scroll to bottom on new messages ──────────────────────
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const loadAll = async () => {
        try {
            const data = await api.getMessages(roomCode)
            setMessages(data)
            if (data.length > 0) lastIdRef.current = data[data.length - 1].id
        } catch (e) { void e }
    }

    const poll = async () => {
        try {
            const data = await api.getMessages(roomCode, lastIdRef.current)
            if (data.length > 0) {
                // only add messages from the other person
                const newMsgs = data.filter((m) => m.sender_name !== authorName)
                setMessages((prev) => {
                    const ids = new Set(prev.map((m) => m.id))
                    const fresh = data.filter((m) => !ids.has(m.id))
                    return [...prev, ...fresh]
                })
                // notifications + unread count for partner messages
                newMsgs.forEach((m) => {
                    showNotif(m)
                    if (!focused) setUnread((u) => u + 1)
                })
                lastIdRef.current = data[data.length - 1].id
            }
        } catch (e) { void e }
    }

    // ── send message ───────────────────────────────────────────
    const send = async () => {
        const trimmed = text.trim()
        if (!trimmed) return
        setSending(true)
        try {
            const msg = await api.sendMessage(roomCode, authorName, trimmed)
            setMessages((prev) => [...prev, msg])
            lastIdRef.current = msg.id
            setText('')
            inputRef.current?.focus()
        } catch (err) {
            toast.error(err.message || 'Could not send')
        } finally {
            setSending(false)
        }
    }

    const onKey = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
    }

    // ── group messages by sender for a cleaner flow ────────────
    const grouped = messages.reduce((acc, msg, i) => {
        const prev = messages[i - 1]
        const sameAuthor = prev && prev.sender_name === msg.sender_name
        const timeDiff = prev ? (new Date(msg.created_at) - new Date(prev.created_at)) / 1000 : 999
        acc.push({ ...msg, grouped: sameAuthor && timeDiff < 120 })
        return acc
    }, [])

    return (
        <div style={{
            position: 'fixed', bottom: '1.5rem', right: '1.5rem',
            width: '320px', height: '500px', zIndex: 100,
            display: 'flex', flexDirection: 'column',
            borderRadius: '22px',
            background: 'var(--bg2)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(232,99,122,0.2)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
            animation: 'cardIn 0.4s cubic-bezier(0.22,1,0.36,1) both',
            overflow: 'hidden',
        }}>

            {/* ── HEADER ── */}
            <div style={{ padding: '0.875rem 1.1rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0, background: 'var(--bg2)' }}>

                {/* Partner avatar + online dot */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                    <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg,#7db8a4,#c4b8d8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#0a0812' }}>
                        {partner ? partner.member_name.charAt(0).toUpperCase() : '?'}
                    </div>
                    {/* Online dot */}
                    <span style={{
                        position: 'absolute', bottom: '0px', right: '0px',
                        width: '10px', height: '10px', borderRadius: '50%',
                        background: partnerOnline ? '#7db8a4' : 'rgba(200,200,200,0.4)',
                        border: '2px solid var(--bg2)',
                        boxShadow: partnerOnline ? '0 0 6px #7db8a4' : 'none',
                        transition: 'all 0.3s',
                    }} />
                </div>

                {/* Partner name + status */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text)', fontFamily: 'Playfair Display, serif', lineHeight: 1 }}>
                        {partner ? partner.member_name : 'Waiting for partner...'}
                    </p>
                    <p style={{ fontSize: '0.65rem', marginTop: '0.2rem', color: partnerOnline ? 'var(--sage)' : 'var(--text4)' }}>
                        {partnerOnline
                            ? partnerEmoji
                                ? `${partnerEmoji} ${partnerVibe}`
                                : 'Online now'
                            : partner
                                ? 'Offline'
                                : 'Not joined yet'
                        }
                    </p>
                </div>

                {/* Notification toggle */}
                <button onClick={toggleNotif} title={notifOn ? 'Turn off notifications' : 'Turn on notifications'}
                    style={{ padding: '0.3rem', border: 'none', background: 'transparent', cursor: 'pointer', color: notifOn ? 'var(--gold)' : 'var(--text4)', borderRadius: '8px', transition: 'color 0.2s' }}>
                    {notifOn ? <Bell size={15} /> : <BellOff size={15} />}
                </button>

                {/* Unread badge */}
                {unread > 0 && (
                    <span style={{ background: 'var(--rose)', color: '#fff', fontSize: '0.6rem', fontWeight: 700, borderRadius: '9999px', padding: '0.1rem 0.4rem', minWidth: '18px', textAlign: 'center' }}>
                        {unread}
                    </span>
                )}

                {/* Close */}
                <button onClick={onClose}
                    style={{ padding: '0.3rem', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text3)', borderRadius: '8px' }}>
                    <X size={15} />
                </button>
            </div>

            {/* ── MESSAGES ── */}
            <div
                onClick={() => setUnread(0)}
                style={{ flex: 1, overflowY: 'auto', padding: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>

                {messages.length === 0 ? (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', textAlign: 'center', color: 'var(--text4)', paddingTop: '3rem' }}>
                        <span style={{ fontSize: '2.5rem' }}>💬</span>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text3)', fontFamily: 'Playfair Display, serif' }}>
                            {partnerOnline ? `${partner.member_name} is here!` : 'No messages yet'}
                        </p>
                        <p style={{ fontSize: '0.72rem', color: 'var(--text4)' }}>
                            {partnerOnline ? 'Say something...' : 'Say something, they will see it when they join'}
                        </p>
                    </div>
                ) : (
                    grouped.map((msg, i) => {
                        const isMe = msg.sender_name === authorName
                        const showTime = !grouped[i + 1] || grouped[i + 1]?.sender_name !== msg.sender_name

                        return (
                            <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start', marginBottom: msg.grouped ? '0.1rem' : '0.5rem' }}>

                                {/* Sender name — only show on first of a group */}
                                {!msg.grouped && !isMe && (
                                    <p style={{ fontSize: '0.62rem', color: 'var(--text4)', paddingLeft: '0.5rem', marginBottom: '0.2rem' }}>
                                        {msg.sender_name}
                                    </p>
                                )}

                                {/* Bubble */}
                                <div style={{
                                    maxWidth: '80%',
                                    padding: '0.5rem 0.9rem',
                                    borderRadius: msg.grouped
                                        ? isMe ? '16px 6px 6px 16px' : '6px 16px 16px 6px'
                                        : isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                    background: isMe
                                        ? 'linear-gradient(135deg,rgba(232,99,122,0.3),rgba(200,64,90,0.25))'
                                        : 'var(--card2)',
                                    border: isMe
                                        ? '1px solid rgba(232,99,122,0.25)'
                                        : '1px solid var(--border)',
                                    fontSize: '0.875rem',
                                    color: 'var(--text)',
                                    lineHeight: 1.55,
                                    wordBreak: 'break-word',
                                    transition: 'background 0.3s',
                                }}>
                                    {msg.text}
                                </div>

                                {/* Timestamp — only show on last of a group */}
                                {showTime && (
                                    <p style={{ fontSize: '0.58rem', color: 'var(--text4)', marginTop: '0.2rem', paddingLeft: isMe ? 0 : '0.5rem', paddingRight: isMe ? '0.5rem' : 0 }}>
                                        {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                                    </p>
                                )}
                            </div>
                        )
                    })
                )}
                <div ref={bottomRef} />
            </div>

            {/* ── INPUT ── */}
            <div style={{ padding: '0.75rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.5rem', alignItems: 'flex-end', flexShrink: 0, background: 'var(--bg2)' }}>
                <textarea
                    ref={inputRef}
                    value={text}
                    onChange={(e) => setText(e.target.value.slice(0, 500))}
                    onKeyDown={onKey}
                    placeholder="Type a message..."
                    rows={1}
                    style={{
                        flex: 1, background: 'var(--input-bg)',
                        border: '1px solid var(--border2)',
                        borderRadius: '14px', padding: '0.6rem 0.9rem',
                        color: 'var(--text)', fontFamily: 'Outfit, sans-serif',
                        fontSize: '0.875rem', outline: 'none', resize: 'none',
                        lineHeight: 1.5, maxHeight: '80px', overflowY: 'auto',
                        transition: 'border-color 0.2s',
                    }}
                />
                <button onClick={send} disabled={!text.trim() || sending}
                    style={{
                        width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                        background: text.trim() && !sending
                            ? 'linear-gradient(135deg,#e8637a,#c8405a)'
                            : 'var(--card)',
                        border: '1px solid var(--border)',
                        cursor: text.trim() ? 'pointer' : 'not-allowed',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s',
                    }}>
                    <Send size={14} color={text.trim() && !sending ? '#fff' : 'var(--text4)'} />
                </button>
            </div>
        </div>
    )
}
