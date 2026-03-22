import { format } from 'date-fns'
import { useStore } from '../store/useStore'

export default function AnniversaryPopup() {
    const { memories, showAnniversaryPopup, setShowAnniversaryPopup, setShowMemoryModal } = useStore()
    if (!showAnniversaryPopup || !memories?.length) return null
    const first = memories[0]

    return (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 w-full max-w-sm px-4 animate-fade-up">
            <div className="glass border border-gold/25 rounded-2xl px-5 py-4 shadow-[0_8px_40px_rgba(232,184,109,0.15)] flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-base flex-shrink-0">⏳</div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gold mb-0.5">On this day</p>
                    <p className="text-xs text-cream/55 leading-relaxed line-clamp-2">"{first.content.slice(0, 80)}{first.content.length > 80 ? '…' : ''}"</p>
                    <p className="text-[0.62rem] text-cream/25 mt-1">— {first.author_name}, {format(new Date(first.created_at), 'yyyy')}</p>
                </div>
                <div className="flex flex-col gap-1.5 flex-shrink-0">
                    <button onClick={() => { setShowAnniversaryPopup(false); setShowMemoryModal(true) }}
                        className="px-3 py-1 rounded-full bg-gold/15 border border-gold/25 text-[0.65rem] font-semibold text-gold hover:bg-gold/25 transition-colors">
                        View
                    </button>
                    <button onClick={() => setShowAnniversaryPopup(false)} className="px-3 py-1 rounded-full text-[0.65rem] text-cream/25 hover:text-cream/50">Dismiss</button>
                </div>
            </div>
        </div>
    )
}