import { useState } from 'react'
import toast from 'react-hot-toast'
import { useStore } from '../store/useStore'
import * as api from '../lib/api'

const VIBES = [
    { emoji: '✨', text: 'Feeling loved' }, { emoji: '📚', text: 'Studying' },
    { emoji: '💭', text: 'Missing you' }, { emoji: '😴', text: 'Tired but here' },
    { emoji: '🌙', text: 'Good night' }, { emoji: '☕', text: 'Coffee time' },
    { emoji: '🎵', text: 'Listening to music' }, { emoji: '🌸', text: 'Feeling grateful' },
    { emoji: '😊', text: 'Happy today' }, { emoji: '💪', text: 'Busy but thinking of you' },
]

export default function TogetherMode() {
    const { presences, authorName, roomCode, myVibe, setMyVibe, showVibeModal, setShowVibeModal } = useStore()
    const [sel, setSel] = useState(myVibe)
    const [saving, setSaving] = useState(false)

    const saveVibe = async () => {
        setSaving(true)
        try {
            await api.updatePresence(roomCode, authorName, { vibeEmoji: sel.emoji, vibeText: sel.text, isOnline: true })
            setMyVibe(sel); setShowVibeModal(false)
            toast.success(`${sel.emoji} ${sel.text}`)
        } catch { toast.error('Could not update vibe') } finally { setSaving(false) }
    }

    return (
        <>
            <div className="mb-3">
                <p className="text-[0.62rem] font-semibold tracking-[0.1em] uppercase text-cream/25 mb-2">Together Mode</p>
                {presences.length === 0
                    ? <p className="text-xs text-cream/20">Just you for now…</p>
                    : presences.map(p => (
                        <div key={p.member_name} className="flex items-center gap-2 py-1">
                            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${p.is_online ? 'bg-sage shadow-[0_0_6px_#7db8a4] animate-pulse-dot' : 'bg-cream/20'}`} />
                            <span className="text-xs font-medium text-cream/70 flex-1 truncate">
                                {p.member_name}{p.member_name === authorName && <span className="ml-1 text-[0.6rem] text-rose">you</span>}
                            </span>
                            {p.vibe_emoji && <span className="text-xs">{p.vibe_emoji}</span>}
                        </div>
                    ))
                }
            </div>

            <button onClick={() => setShowVibeModal(true)}
                className="w-full glass rounded-xl px-3 py-2.5 text-xs font-medium text-cream/50 hover:border-rose/20 hover:text-cream/80 transition-all text-left flex items-center gap-2">
                <span>{myVibe.emoji || '✨'}</span>
                <span>{myVibe.text || 'Set your vibe'}</span>
            </button>

            {showVibeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
                    onClick={e => e.target === e.currentTarget && setShowVibeModal(false)}>
                    <div className="glass-rose rounded-3xl p-8 w-full max-w-sm animate-card-in">
                        <h3 className="font-serif text-xl font-bold mb-1">Set Your Vibe</h3>
                        <p className="text-xs text-cream/40 mb-5">Let your partner know how you're feeling.</p>
                        <div className="flex flex-wrap gap-2 mb-6">
                            {VIBES.map(v => (
                                <button key={v.text} onClick={() => setSel(v)}
                                    className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${sel.text === v.text ? 'bg-rose/15 border-rose/30 text-cream' : 'bg-white/[0.04] border-white/[0.08] text-cream/50 hover:bg-rose/10'}`}>
                                    {v.emoji} {v.text}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setShowVibeModal(false)} className="flex-1 py-2.5 rounded-xl glass text-sm font-medium text-cream/50 hover:text-cream/80">Cancel</button>
                            <button onClick={saveVibe} disabled={saving} className="flex-1 py-2.5 rounded-xl bg-rose text-ink text-sm font-bold hover:-translate-y-0.5 transition-all disabled:opacity-50">
                                {saving ? 'Saving…' : 'Save Vibe'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}