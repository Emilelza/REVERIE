import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, X, LogOut, BookOpen, Star, Shuffle, History, MessageCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useStore } from '../store/useStore'
import * as api from '../lib/api'
import DiaryFeed from '../components/DiaryFeed'
import EntryForm from '../components/EntryForm'
import TogetherMode from '../components/TogetherMode'
import TimeZoneClock from '../components/TimeZoneClock'
import MemoryModal from '../components/MemoryModal'
import AnniversaryPopup from '../components/AnniversaryPopup'
import EntryCard from '../components/EntryCard'
import Chat from '../components/chat'
import ThemeToggle from '../components/ThemeToggle'

const VIEWS = [
    { id: 'diary', icon: BookOpen, label: 'Diary' },
    { id: 'memories', icon: History, label: 'On This Day' },
    { id: 'favourites', icon: Star, label: 'Favourites' },
    { id: 'dateideas', icon: Shuffle, label: 'Date Ideas' },
]

const TAG_STYLE = {
    Virtual: { background: 'rgba(125,184,164,0.1)', color: 'var(--sage)', border: '1px solid rgba(125,184,164,0.2)' },
    Future: { background: 'rgba(232,184,109,0.1)', color: 'var(--gold)', border: '1px solid rgba(232,184,109,0.2)' },
    Gift: { background: 'rgba(240,160,176,0.1)', color: 'var(--blush)', border: '1px solid rgba(232,99,122,0.2)' },
}

export default function Diary() {
    const navigate = useNavigate()
    const {
        roomCode, authorName,
        entries, setEntries,
        memories, setMemories,
        setPresences,
        activeView, setActiveView,
        sidebarOpen, setSidebarOpen,
        setShowMemoryModal,
        setShowAnniversaryPopup,
        clearSession,
    } = useStore()

    const [ideas, setIdeas] = useState([])
    const [loadingIdeas, setLoadingIdeas] = useState(false)
    const [memBadge, setMemBadge] = useState(0)
    const [showChat, setShowChat] = useState(false)

    useEffect(() => {
        if (!roomCode) return
        api.getEntries(roomCode).then(setEntries).catch(() => { })
        api.getMemories(roomCode).then((m) => {
            setMemories(m)
            if (m.length > 0) { setMemBadge(m.length); setTimeout(() => setShowAnniversaryPopup(true), 2000) }
        }).catch(() => { })
        const fp = () => api.getPresence(roomCode).then(setPresences).catch(() => { })
        fp()
        const t = setInterval(fp, 15000)
        api.updatePresence(roomCode, authorName, { isOnline: true, timezoneName: Intl.DateTimeFormat().resolvedOptions().timeZone }).catch(() => { })
        return () => { clearInterval(t); api.updatePresence(roomCode, authorName, { isOnline: false }).catch(() => { }) }
    }, [roomCode]) // eslint-disable-line

    useEffect(() => {
        if (activeView === 'dateideas' && ideas.length === 0) loadIdeas()
    }, [activeView]) // eslint-disable-line

    const loadIdeas = async () => {
        setLoadingIdeas(true)
        try { setIdeas(await api.getDateIdeas(6)) }
        catch (e) { void e; toast.error('Could not load ideas') }
        finally { setLoadingIdeas(false) }
    }

    const handleLeave = async () => {
        if (!confirm('Leave this room?')) return
        await api.updatePresence(roomCode, authorName, { isOnline: false }).catch(() => { })
        clearSession(); navigate('/login')
    }

    const favourites = entries.filter((e) => e.is_favourite)

    const NavButton = ({ view }) => {
        const ViewIcon = view.icon
        const active = activeView === view.id
        return (
            <button
                onClick={() => { setActiveView(view.id); setSidebarOpen(false) }}
                style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.65rem 0.75rem', borderRadius: '10px', width: '100%',
                    border: active ? '1px solid rgba(232,99,122,0.2)' : '1px solid transparent',
                    background: active ? 'rgba(232,99,122,0.1)' : 'transparent',
                    color: active ? 'var(--text)' : 'var(--text3)',
                    fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer',
                    fontFamily: 'Outfit, sans-serif', transition: 'all 0.2s',
                }}
            >
                <ViewIcon size={15} />
                {view.label}
                {view.id === 'memories' && memBadge > 0 && (
                    <span style={{ marginLeft: 'auto', fontSize: '0.6rem', fontWeight: 700, background: 'var(--rose)', color: '#fff', borderRadius: '9999px', padding: '0.1rem 0.4rem' }}>
                        {memBadge}
                    </span>
                )}
            </button>
        )
    }

    const SidebarContent = () => (
        <>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', fontWeight: 900, color: 'var(--text)' }}>
                        Re<em style={{ color: 'var(--rose)', fontStyle: 'italic' }}>v</em>erie
                    </span>
                    <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.2rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text3)' }}>Room</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--blush)', letterSpacing: '0.06em' }}>{roomCode}</span>
                    </div>
                </div>
                <button onClick={() => setSidebarOpen(false)}
                    style={{ padding: '0.35rem', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text3)', borderRadius: '8px' }}>
                    <X size={16} />
                </button>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px', padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>
                {VIEWS.map((v) => <NavButton key={v.id} view={v} />)}
            </nav>

            <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <TimeZoneClock />
                <TogetherMode />
            </div>

            <div style={{ padding: '0.75rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <ThemeToggle />
                <button onClick={handleLeave}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', borderRadius: '10px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text4)', fontSize: '0.75rem', fontFamily: 'Outfit, sans-serif' }}>
                    <LogOut size={12} /> Leave room
                </button>
            </div>
        </>
    )

    const sidebarBase = {
        width: '272px', flexShrink: 0,
        background: 'var(--bg2)',
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        transition: 'background 0.3s',
    }

    return (
        <div style={{ display: 'flex', height: '100vh', background: 'var(--bg)', overflow: 'hidden' }}>

            {/* Mobile sidebar */}
            <aside style={{ ...sidebarBase, position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 50, transition: 'transform 0.3s', transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)' }}>
                <SidebarContent />
            </aside>

            {/* Desktop sidebar */}
            <aside style={{ ...sidebarBase, display: 'none' }} className="lg:flex">
                <SidebarContent />
            </aside>

            {sidebarOpen && (
                <div onClick={() => setSidebarOpen(false)}
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40, backdropFilter: 'blur(2px)' }} />
            )}

            {/* MAIN */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

                {/* Topbar */}
                <header style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '0.875rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0, transition: 'background 0.3s' }}>
                    <button onClick={() => setSidebarOpen(true)}
                        style={{ padding: '0.35rem', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text3)', borderRadius: '8px' }}>
                        <Menu size={18} />
                    </button>
                    <div style={{ flex: 1 }}>
                        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1 }}>
                            {VIEWS.find((v) => v.id === activeView)?.label}
                        </h1>
                        <p style={{ fontSize: '0.65rem', color: 'var(--text3)', marginTop: '0.2rem' }}>{authorName}</p>
                    </div>

                    {activeView === 'memories' && memBadge > 0 && (
                        <button onClick={() => setShowMemoryModal(true)}
                            style={{ padding: '0.35rem 0.75rem', borderRadius: '9999px', border: '1px solid rgba(232,184,109,0.3)', background: 'rgba(232,184,109,0.1)', color: 'var(--gold)', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
                            View memories
                        </button>
                    )}

                    <button onClick={() => setShowChat((v) => !v)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.4rem',
                            padding: '0.45rem 0.9rem', borderRadius: '9999px',
                            border: showChat ? '1px solid rgba(232,99,122,0.3)' : '1px solid var(--border2)',
                            background: showChat ? 'rgba(232,99,122,0.15)' : 'transparent',
                            color: showChat ? 'var(--rose)' : 'var(--text3)',
                            fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
                            fontFamily: 'Outfit, sans-serif', transition: 'all 0.2s',
                        }}>
                        <MessageCircle size={14} />
                        Chat
                    </button>
                </header>

                {/* DIARY VIEW */}
                {activeView === 'diary' && (
                    <>
                        {memories.length > 0 && (
                            <div onClick={() => setShowMemoryModal(true)}
                                style={{ margin: '1rem 1.25rem 0', padding: '0.75rem 1rem', borderRadius: '12px', cursor: 'pointer', background: 'linear-gradient(to right,rgba(232,184,109,0.1),rgba(232,99,122,0.07))', border: '1px solid rgba(232,184,109,0.25)' }}>
                                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--gold)', marginBottom: '0.2rem' }}>On this day, a year ago</p>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text2)', fontStyle: 'italic', fontFamily: 'Playfair Display, serif', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                    {memories[0].content.slice(0, 80)}
                                </p>
                            </div>
                        )}
                        <DiaryFeed entries={entries} />
                        <EntryForm />
                    </>
                )}

                {/* MEMORIES VIEW */}
                {activeView === 'memories' && (
                    <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
                        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.25rem' }}>On This Day</h2>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text3)', marginBottom: '1.25rem' }}>Entries from this date in previous years</p>
                        {memories.length === 0
                            ? <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4rem 0', gap: '0.75rem', textAlign: 'center' }}>
                                <span style={{ fontSize: '2.5rem' }}>🌸</span>
                                <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', color: 'var(--text3)' }}>No memories yet</p>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text4)', maxWidth: '200px' }}>Come back on the anniversary of an entry.</p>
                            </div>
                            : <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {memories.map((e, i) => <EntryCard key={e.id} entry={e} avatarIndex={i % 2} />)}
                            </div>
                        }
                    </div>
                )}

                {/* FAVOURITES VIEW */}
                {activeView === 'favourites' && (
                    <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
                        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.25rem' }}>Favourite Moments</h2>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text3)', marginBottom: '1.25rem' }}>Starred entries surface on their anniversary.</p>
                        {favourites.length === 0
                            ? <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4rem 0', gap: '0.75rem', textAlign: 'center' }}>
                                <span style={{ fontSize: '2.5rem' }}>⭐</span>
                                <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', color: 'var(--text3)' }}>No favourites yet</p>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text4)' }}>Tap the star on any entry.</p>
                            </div>
                            : <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {favourites.map((e, i) => <EntryCard key={e.id} entry={e} avatarIndex={i % 2} />)}
                            </div>
                        }
                    </div>
                )}

                {/* DATE IDEAS VIEW */}
                {activeView === 'dateideas' && (
                    <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                            <div>
                                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)' }}>Date Ideas</h2>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text3)', marginTop: '0.25rem' }}>Stuck on what to do together?</p>
                            </div>
                            <button onClick={loadIdeas} disabled={loadingIdeas}
                                style={{ padding: '0.4rem 0.9rem', borderRadius: '9999px', border: '1px solid rgba(232,99,122,0.2)', background: 'rgba(232,99,122,0.08)', color: 'var(--rose)', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'Outfit, sans-serif', fontWeight: 600 }}>
                                {loadingIdeas ? '...' : 'Refresh'}
                            </button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '0.75rem' }}>
                            {ideas.map((idea, i) => (
                                <div key={i} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '1rem', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', transition: 'box-shadow 0.2s' }}>
                                    <span style={{ fontSize: '1.6rem' }}>{idea.emoji}</span>
                                    <p style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)' }}>{idea.title}</p>
                                    <p style={{ fontSize: '0.78rem', color: 'var(--text3)', lineHeight: 1.6, flex: 1 }}>{idea.desc}</p>
                                    <span style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '0.2rem 0.55rem', borderRadius: '9999px', width: 'fit-content', ...TAG_STYLE[idea.tag] }}>
                                        {idea.tag}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <MemoryModal />
            <AnniversaryPopup />
            {showChat && <Chat onClose={() => setShowChat(false)} />}
        </div>
    )
}
