import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { User, Lock } from 'lucide-react'
import { useStore } from '../store/useStore'
import JoinRoom from '../components/JoinRoom'
import StarField from '../components/StarField'
import * as api from '../lib/api'

export default function Login() {
    const navigate = useNavigate()
    const { roomCode, setSession } = useStore()
    const [tab, setTab] = useState('join')
    const [cName, setCName] = useState('')
    const [cPass, setCPass] = useState('')
    const [loading, setLoading] = useState(false)
    const [created, setCreated] = useState(null)
    const [nameErr, setNameErr] = useState('')

    useEffect(() => { if (roomCode) navigate('/diary', { replace: true }) }, [])

    const handleCreate = async () => {
        if (!cName.trim()) { setNameErr('Please enter your name.'); return }
        setNameErr(''); setLoading(true)
        try {
            const data = await api.createRoom(cName.trim(), cPass.trim())
            setCreated({ roomCode: data.pair.room_code, authorName: data.author_name, pairId: data.pair.id })
        } catch (err) { toast.error(err.message || 'Could not create room') } finally { setLoading(false) }
    }

    return (
        <div className="min-h-screen bg-ink flex items-center justify-center p-4 relative overflow-hidden">
            <StarField />
            <div className="fixed w-[480px] h-[480px] rounded-full pointer-events-none bg-[radial-gradient(circle,rgba(232,99,122,0.1),transparent_70%)] -top-24 -left-24 animate-float-slow" />
            <div className="fixed w-[560px] h-[560px] rounded-full pointer-events-none bg-[radial-gradient(circle,rgba(110,90,160,0.08),transparent_70%)] -bottom-32 -right-32 animate-float" />

            <div className="relative z-10 w-full max-w-[440px]">
                <div className="glass-rose rounded-[28px] p-10 shadow-[0_50px_80px_rgba(0,0,0,0.5)] animate-card-in">
                    <div className="text-center mb-8">
                        <span className="font-serif text-[2.2rem] font-black text-cream block">Re<em className="text-rose not-italic">v</em>erie</span>
                        <span className="text-[0.72rem] text-cream/30 tracking-[0.1em] uppercase">Your private shared diary</span>
                    </div>

                    <div className="flex bg-white/[0.035] rounded-2xl p-1 gap-1 mb-7 border border-white/[0.05]">
                        {['join', 'create'].map(t => (
                            <button key={t} onClick={() => { setTab(t); setCreated(null) }}
                                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === t ? 'bg-gradient-to-r from-rose/20 to-gold/10 text-cream border border-rose/20' : 'text-cream/35 hover:text-cream/60'}`}>
                                {t === 'join' ? 'Join a Room' : 'Create a Room'}
                            </button>
                        ))}
                    </div>

                    {tab === 'join' && <JoinRoom />}

                    {tab === 'create' && (
                        created ? (
                            <div className="flex flex-col items-center text-center gap-3 animate-fade-up py-2">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose/20 to-gold/15 border border-rose/25 flex items-center justify-center text-2xl animate-card-in">✨</div>
                                <h3 className="font-serif text-xl font-bold mt-1">Your room is ready.</h3>
                                <p className="text-xs text-cream/40">Share this code with your person</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="px-6 py-3 bg-gold/8 border border-gold/25 rounded-full font-serif font-bold text-[1.4rem] text-gold tracking-[0.3em]">{created.roomCode}</div>
                                    <button onClick={() => { navigator.clipboard.writeText(created.roomCode); toast.success('Copied!') }}
                                        className="px-3 py-2 rounded-xl glass text-[0.7rem] text-gold/70 hover:text-gold border border-gold/15 hover:border-gold/30 transition-all">Copy</button>
                                </div>
                                <button onClick={() => { setSession(created); navigate('/diary') }} className="btn-primary w-full justify-center mt-2">Open Our Diary →</button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4 animate-fade-up">
                                <div>
                                    <label className="block text-[0.7rem] font-semibold tracking-[0.08em] uppercase text-cream/40 mb-1.5">Your Name</label>
                                    <div className="relative">
                                        <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream/25" />
                                        <input type="text" value={cName} onChange={e => setCName(e.target.value.slice(0, 30))}
                                            onKeyDown={e => e.key === 'Enter' && handleCreate()} placeholder="How should we call you?"
                                            className={`input-field pl-9 ${nameErr ? 'err' : ''}`} />
                                    </div>
                                    {nameErr ? <p className="text-xs text-rose mt-1">{nameErr}</p> : <p className="text-xs text-cream/25 mt-1">Your partner sees this name.</p>}
                                </div>
                                <div>
                                    <label className="block text-[0.7rem] font-semibold tracking-[0.08em] uppercase text-cream/40 mb-1.5 flex justify-between">
                                        Secret Passphrase <span className="text-[0.62rem] text-cream/20 normal-case font-normal">optional</span>
                                    </label>
                                    <div className="relative">
                                        <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream/25" />
                                        <input type="password" value={cPass} onChange={e => setCPass(e.target.value.slice(0, 40))}
                                            onKeyDown={e => e.key === 'Enter' && handleCreate()} placeholder="Both must know this"
                                            className="input-field pl-9" />
                                    </div>
                                    <p className="text-xs text-cream/25 mt-1">If set, anyone joining must enter this phrase.</p>
                                </div>
                                <button onClick={handleCreate} disabled={loading}
                                    className="btn-primary w-full justify-center mt-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                                    {loading ? <span className="animate-spin-slow w-3.5 h-3.5 border-2 border-ink/30 border-t-ink rounded-full inline-block" /> : null}
                                    {loading ? 'Creating…' : 'Create Our Diary ✦'}
                                </button>
                            </div>
                        )
                    )}

                    <a href="/" className="block text-center mt-5 text-xs text-cream/20 hover:text-cream/45 transition-colors">← Back to home</a>
                    <p className="text-center text-[0.68rem] text-cream/15 mt-3">🔒 Room codes are private.</p>
                </div>
            </div>
        </div>
    )
}