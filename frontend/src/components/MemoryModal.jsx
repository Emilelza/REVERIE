import { format } from 'date-fns'
import { X } from 'lucide-react'
import { useStore } from '../store/useStore'

export default function MemoryModal() {
    const { memories, showMemoryModal, setShowMemoryModal } = useStore()
    if (!showMemoryModal) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md"
            onClick={e => e.target === e.currentTarget && setShowMemoryModal(false)}>
            <div className="glass rounded-3xl p-8 w-full max-w-lg animate-card-in border border-gold/20">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <p className="text-[0.7rem] font-semibold tracking-[0.14em] uppercase text-gold mb-1">⏳ On This Day</p>
                        <h2 className="font-serif text-2xl font-bold">Memories from <em className="text-rose">the past</em></h2>
                        <p className="text-xs text-cream/35 mt-1">{format(new Date(), 'MMMM d')} · previous years</p>
                    </div>
                    <button onClick={() => setShowMemoryModal(false)} className="p-2 rounded-xl hover:bg-white/[0.07] text-cream/30 hover:text-cream/70">
                        <X size={16} />
                    </button>
                </div>
                <div className="flex flex-col gap-3 max-h-[55vh] overflow-y-auto">
                    {memories.length === 0
                        ? <div className="text-center py-8 text-cream/30"><p className="text-3xl mb-2">🌸</p><p className="text-sm">No memories on this day yet.</p></div>
                        : memories.map(m => (
                            <div key={m.id} className="bg-white/[0.04] border border-gold/10 rounded-2xl p-4 hover:border-gold/20 transition-colors">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-[0.65rem] font-semibold uppercase tracking-widest text-gold/60">{format(new Date(m.created_at), 'MMMM d, yyyy')}</span>
                                    {m.mood_emoji && <span className="text-base">{m.mood_emoji}</span>}
                                </div>
                                <p className="font-serif italic text-sm text-cream/70 leading-relaxed">"{m.content.slice(0, 200)}{m.content.length > 200 ? '…' : ''}"</p>
                                <p className="text-[0.65rem] text-cream/30 mt-2">— {m.author_name}</p>
                            </div>
                        ))
                    }
                </div>
                <button onClick={() => setShowMemoryModal(false)} className="w-full mt-5 py-2.5 rounded-xl glass text-sm font-medium text-cream/50 hover:text-cream/80 transition-all">Close</button>
            </div>
        </div>
    )
}