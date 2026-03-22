import { useState, useRef } from 'react'
import { Send, Image, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { useStore } from '../store/useStore'
import * as api from '../lib/api'

const MOODS = ['🥰', '😊', '😢', '😤', '😌', '🥺', '🌸', '✨', '😴', '💭']

export default function EntryForm() {
    const { roomCode, authorName, addEntry } = useStore()
    const [content, setContent] = useState('')
    const [mood, setMood] = useState('')
    const [photo, setPhoto] = useState(null)
    const [preview, setPreview] = useState(null)
    const [posting, setPosting] = useState(false)
    const fileRef = useRef(null)

    const handlePhoto = (e) => {
        const file = e.target.files[0]
        if (!file) return
        if (file.size > 2 * 1024 * 1024) { toast.error('Photo must be under 2MB'); return }
        const reader = new FileReader()
        reader.onload = (ev) => { setPhoto(ev.target.result); setPreview(ev.target.result) }
        reader.readAsDataURL(file)
    }

    const removePhoto = () => {
        setPhoto(null); setPreview(null)
        if (fileRef.current) fileRef.current.value = ''
    }

    const post = async () => {
        if (!content.trim() && !photo) return
        setPosting(true)
        try {
            const entry = await api.createEntry(roomCode, { authorName, content: content.trim(), moodEmoji: mood, photo })
            addEntry(entry)
            setContent(''); setMood(''); setPhoto(null); setPreview(null)
            if (fileRef.current) fileRef.current.value = ''
            toast.success('Entry posted')
            document.getElementById('entries-feed')?.scrollTo({ top: 0, behavior: 'smooth' })
        } catch (err) {
            toast.error(err.message || 'Could not post')
        } finally { setPosting(false) }
    }

    const canPost = (content.trim().length > 0 || photo !== null) && !posting

    return (
        <div style={{ background: '#120f1e', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '1rem 1.25rem', flexShrink: 0 }}>

            {/* Mood row */}
            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                {MOODS.map((m) => (
                    <button key={m} onClick={() => setMood((p) => p === m ? '' : m)}
                        style={{
                            padding: '0.2rem 0.5rem', borderRadius: '9999px', fontSize: '1rem', cursor: 'pointer',
                            border: mood === m ? '1px solid rgba(232,99,122,0.3)' : '1px solid rgba(255,255,255,0.07)',
                            background: mood === m ? 'rgba(232,99,122,0.12)' : 'rgba(255,255,255,0.03)',
                            transition: 'all 0.15s',
                        }}>
                        {m}
                    </button>
                ))}
            </div>

            {/* Photo preview */}
            {preview && (
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: '0.75rem' }}>
                    <img src={preview} alt="preview" style={{ height: '80px', width: 'auto', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', objectFit: 'cover' }} />
                    <button onClick={removePhoto}
                        style={{ position: 'absolute', top: '-6px', right: '-6px', width: '20px', height: '20px', borderRadius: '50%', background: '#e8637a', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <X size={11} color="#fff" />
                    </button>
                </div>
            )}

            {/* Textarea */}
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value.slice(0, 2000))}
                onKeyDown={(e) => (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) && post()}
                placeholder="Write something for them... (Ctrl+Enter to post)"
                rows={3}
                style={{
                    width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '14px', padding: '0.75rem 1rem', color: '#f5ede8',
                    fontFamily: 'Outfit, sans-serif', fontSize: '0.875rem', lineHeight: '1.65',
                    resize: 'none', outline: 'none', maxHeight: '140px',
                }}
            />

            {/* Footer */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.6rem' }}>
                <span style={{ fontSize: '0.68rem', color: 'rgba(245,237,232,0.2)' }}>{content.length} / 2000</span>

                {/* Photo button */}
                <button onClick={() => fileRef.current?.click()}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '0.3rem',
                        padding: '0.35rem 0.75rem', borderRadius: '9999px',
                        background: photo ? 'rgba(232,99,122,0.15)' : 'rgba(255,255,255,0.05)',
                        border: photo ? '1px solid rgba(232,99,122,0.3)' : '1px solid rgba(255,255,255,0.08)',
                        color: photo ? '#f0a0b0' : 'rgba(245,237,232,0.4)',
                        fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.2s',
                    }}>
                    <Image size={13} />
                    {photo ? 'Photo added' : 'Add photo'}
                </button>

                <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} style={{ display: 'none' }} />

                {/* Post button */}
                <button onClick={post} disabled={!canPost}
                    style={{
                        marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.4rem',
                        padding: '0.5rem 1.25rem', borderRadius: '9999px',
                        background: canPost ? 'linear-gradient(135deg,#e8637a,#c8405a)' : 'rgba(255,255,255,0.07)',
                        color: canPost ? '#fff' : 'rgba(245,237,232,0.3)',
                        border: 'none', fontFamily: 'Outfit, sans-serif', fontWeight: 600,
                        fontSize: '0.85rem', cursor: canPost ? 'pointer' : 'not-allowed', transition: 'all 0.2s',
                    }}>
                    {posting
                        ? <span style={{ width: '13px', height: '13px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                        : <Send size={13} />
                    }
                    {posting ? 'Posting...' : 'Post Entry'}
                </button>
            </div>
        </div>
    )
}
