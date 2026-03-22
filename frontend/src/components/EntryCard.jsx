import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Star, Trash2, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import { useStore } from '../store/useStore'
import * as api from '../lib/api'

const REACTIONS = ['❤️', '🥺', '🌸', '✨', '😂', '🤗', '💙', '🙌']
const AV = [
    'linear-gradient(135deg,#e8637a,#e8b86d)',
    'linear-gradient(135deg,#7db8a4,#c4b8d8)',
]

export default function EntryCard({ entry, avatarIndex = 0 }) {
    const { authorName, updateEntry, removeEntry } = useStore()
    const [picker, setPicker] = useState(false)
    const [imgOpen, setImgOpen] = useState(false)
    const isMine = entry.author_name === authorName
    const summary = entry.reaction_summary || {}

    const handleFav = async () => {
        const { is_favourite } = await api.toggleFavourite(entry.id)
        updateEntry(entry.id, { is_favourite })
        toast.success(is_favourite ? 'Added to favourites' : 'Removed')
    }

    const handleDelete = async () => {
        if (!confirm('Delete this entry?')) return
        await api.deleteEntry(entry.id, authorName)
        removeEntry(entry.id)
        toast.success('Deleted')
    }

    const handleReact = async (emoji) => {
        setPicker(false)
        if (isMine) { toast.error("Can't react to your own entry"); return }
        const { action } = await api.react(entry.id, authorName, emoji)
        const cur = summary[emoji] || 0
        const next = action === 'added' ? cur + 1 : Math.max(0, cur - 1)
        const ns = { ...summary, [emoji]: next }
        if (!next) delete ns[emoji]
        updateEntry(entry.id, { reaction_summary: ns })
    }

    return (
        <>
            <div style={{
                background: isMine ? 'rgba(232,99,122,0.04)' : 'rgba(255,255,255,0.03)',
                border: isMine ? '1px solid rgba(232,99,122,0.13)' : '1px solid rgba(196,184,216,0.1)',
                borderRadius: '1rem', padding: '1.25rem', position: 'relative',
                animation: 'cardIn 0.5s cubic-bezier(0.22,1,0.36,1) both',
            }}>

                {entry.is_favourite && <span style={{ position: 'absolute', top: '1rem', right: '1rem', color: '#e8b86d', fontSize: '0.85rem' }}>⭐</span>}

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: AV[avatarIndex % 2], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 700, color: '#0a0812', flexShrink: 0 }}>
                        {entry.author_name.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f5ede8' }}>{entry.author_name}</p>
                        <p style={{ fontSize: '0.62rem', color: 'rgba(245,237,232,0.3)' }}>{formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}</p>
                    </div>
                    {entry.mood_emoji && <span style={{ fontSize: '1.2rem' }}>{entry.mood_emoji}</span>}
                    <div style={{ display: 'flex', gap: '0.2rem' }}>
                        <button onClick={handleFav} style={{ padding: '0.3rem', borderRadius: '8px', border: 'none', background: 'transparent', cursor: 'pointer', color: entry.is_favourite ? '#e8b86d' : 'rgba(245,237,232,0.3)' }}>
                            <Star size={13} fill={entry.is_favourite ? '#e8b86d' : 'none'} />
                        </button>
                        {isMine && (
                            <button onClick={handleDelete} style={{ padding: '0.3rem', borderRadius: '8px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'rgba(245,237,232,0.2)' }}>
                                <Trash2 size={13} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Content */}
                {entry.content && (
                    <p style={{ fontSize: '0.875rem', color: 'rgba(245,237,232,0.75)', lineHeight: '1.75', fontWeight: 300, whiteSpace: 'pre-wrap', wordBreak: 'break-word', marginBottom: entry.photo ? '0.75rem' : 0 }}>
                        {entry.content}
                    </p>
                )}

                {/* Photo */}
                {entry.photo && (
                    <div style={{ marginTop: entry.content ? '0.75rem' : 0, marginBottom: '0.75rem' }}>
                        <img
                            src={entry.photo}
                            alt="attached"
                            onClick={() => setImgOpen(true)}
                            style={{ maxWidth: '100%', maxHeight: '220px', objectFit: 'cover', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', cursor: 'zoom-in', display: 'block' }}
                        />
                    </div>
                )}

                {/* Reactions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                    {Object.entries(summary).map(([emoji, count]) => (
                        <button key={emoji} onClick={() => handleReact(emoji)}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.2rem 0.55rem', borderRadius: '9999px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', fontSize: '0.7rem', cursor: 'pointer', color: 'rgba(245,237,232,0.55)', transition: 'all 0.15s' }}>
                            {emoji} {count}
                        </button>
                    ))}
                    {!isMine && (
                        <div style={{ position: 'relative' }}>
                            <button onClick={() => setPicker((v) => !v)}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', padding: '0.2rem 0.5rem', borderRadius: '9999px', background: 'transparent', border: '1px dashed rgba(255,255,255,0.1)', fontSize: '0.7rem', cursor: 'pointer', color: 'rgba(245,237,232,0.25)' }}>
                                <Plus size={10} /> React
                            </button>
                            {picker && (
                                <div style={{ position: 'absolute', bottom: '100%', left: 0, marginBottom: '0.4rem', background: 'rgba(14,11,24,0.97)', backdropFilter: 'blur(16px)', border: '1px solid rgba(196,184,216,0.1)', borderRadius: '16px', padding: '0.65rem', display: 'flex', gap: '0.3rem', flexWrap: 'wrap', width: '172px', zIndex: 20, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
                                    {REACTIONS.map((e) => (
                                        <button key={e} onClick={() => handleReact(e)}
                                            style={{ fontSize: '1.2rem', background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', borderRadius: '8px', transition: 'transform 0.15s' }}
                                            onMouseEnter={(ev) => ev.currentTarget.style.transform = 'scale(1.25)'}
                                            onMouseLeave={(ev) => ev.currentTarget.style.transform = 'scale(1)'}>
                                            {e}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Lightbox */}
            {imgOpen && entry.photo && (
                <div onClick={() => setImgOpen(false)}
                    style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', cursor: 'zoom-out' }}>
                    <img src={entry.photo} alt="full" style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: '14px', boxShadow: '0 24px 80px rgba(0,0,0,0.6)' }} />
                </div>
            )}
        </>
    )
}
