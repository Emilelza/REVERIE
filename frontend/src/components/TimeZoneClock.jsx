import { useClock } from '../hooks/useClock'
import { useStore } from '../store/useStore'

export default function TimeZoneClock() {
    const { presences, authorName } = useStore()
    const myTz = Intl.DateTimeFormat().resolvedOptions().timeZone
    const partner = presences.find((p) => p.member_name !== authorName)
    const { clock1, clock2 } = useClock(myTz, partner?.timezone_name || myTz)

    return (
        <div className="glass rounded-2xl p-4 mb-3">
            <p className="text-[0.62rem] font-semibold tracking-[0.1em] uppercase text-cream/25 mb-3">🌍 Your time · Their time</p>
            <div className="flex justify-between items-start gap-3">
                <div>
                    <p className="text-[0.62rem] uppercase tracking-widest text-cream/30 mb-1">{clock1.city}</p>
                    <p className="font-serif text-xl font-bold text-cream">{clock1.time}<span className="text-xs text-cream/30 ml-1">{clock1.ampm}</span></p>
                    <p className="text-[0.62rem] text-cream/25 mt-0.5">{clock1.date}</p>
                </div>
                <div className="w-px self-stretch bg-white/[0.06]" />
                <div className="text-right">
                    <p className="text-[0.62rem] uppercase tracking-widest text-cream/30 mb-1">{clock2.city}</p>
                    <p className="font-serif text-xl font-bold text-cream">{clock2.time}<span className="text-xs text-cream/30 ml-1">{clock2.ampm}</span></p>
                    <p className="text-[0.62rem] text-cream/25 mt-0.5">{clock2.date}</p>
                </div>
            </div>
        </div>
    )
}