import EntryCard from './EntryCard'

export default function DiaryFeed({ entries }) {
    const memberOrder = {}
    let idx = 0
        ; (entries || []).forEach(e => { if (memberOrder[e.author_name] === undefined) memberOrder[e.author_name] = idx++ })

    if (!entries?.length) return (
        <div className="flex flex-col items-center justify-center flex-1 gap-3 text-center py-16">
            <span className="text-4xl">📖</span>
            <p className="font-serif text-xl text-cream/35">Your diary is empty</p>
            <p className="text-xs text-cream/25 max-w-[220px] leading-relaxed">Write the first entry below — your partner will see it instantly.</p>
        </div>
    )

    return (
        <div id="entries-feed" className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
            {entries.map(e => <EntryCard key={e.id} entry={e} avatarIndex={memberOrder[e.author_name] ?? 0} />)}
        </div>
    )
}