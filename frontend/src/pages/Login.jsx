import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { User, Lock, KeyRound } from 'lucide-react'
import { useStore } from '../store/useStore'
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

    const [jCode, setJCode] = useState('')
    const [jName, setJName] = useState('')
    const [jPass, setJPass] = useState('')
    const [showPass, setShowPass] = useState(false)
    const [jLoading, setJLoading] = useState(false)
    const [jErrors, setJErrors] = useState({})

    useEffect(() => {
        if (roomCode) navigate('/diary', { replace: true })
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const handleCreate = async () => {
        if (!cName.trim()) {
            setNameErr('Please enter your name.')
            return
        }
        setNameErr('')
        setLoading(true)
        try {
            const data = await api.createRoom(cName.trim(), cPass.trim())
            setCreated({
                roomCode: data.pair.room_code,
                authorName: data.author_name,
                pairId: data.pair.id,
            })
        } catch (err) {
            toast.error(err.message || 'Could not create room. Is the backend running?')
        } finally {
            setLoading(false)
        }
    }

    const handleJoin = async () => {
        const errors = {}
        if (!/^\d{6}$/.test(jCode.trim())) errors.code = 'Must be exactly 6 digits.'
        if (!jName.trim()) errors.name = 'Please enter your name.'
        setJErrors(errors)
        if (Object.keys(errors).length > 0) return

        setJLoading(true)
        try {
            const data = await api.joinRoom(jCode.trim(), jName.trim(), jPass.trim())
            setSession({
                roomCode: data.pair.room_code,
                authorName: data.author_name,
                pairId: data.pair.id,
            })
            navigate('/diary')
        } catch (err) {
            if (err.status === 403) {
                setShowPass(true)
                setJErrors({ pass: 'Incorrect passphrase. Ask your partner.' })
            } else if (err.status === 404) {
                setJErrors({ code: 'Room not found. Check the code.' })
            } else if (err.status === 409) {
                setJErrors({ code: 'This room is already full.' })
            } else {
                toast.error(err.message || 'Could not join room.')
            }
        } finally {
            setJLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-ink flex items-center justify-center p-4 relative overflow-hidden">
            <StarField />

            <div
                className="fixed w-[480px] h-[480px] rounded-full pointer-events-none"
                style={{
                    background: 'radial-gradient(circle, rgba(232,99,122,0.1), transparent 70%)',
                    top: '-120px',
                    left: '-100px',
                }}
            />
            <div
                className="fixed w-[560px] h-[560px] rounded-full pointer-events-none"
                style={{
                    background: 'radial-gradient(circle, rgba(110,90,160,0.08), transparent 70%)',
                    bottom: '-140px',
                    right: '-140px',
                }}
            />

            <div className="relative z-10 w-full max-w-[440px]">
                <div
                    className="rounded-[28px] p-10 animate-card-in"
                    style={{
                        background: 'rgba(232,99,122,0.05)',
                        backdropFilter: 'blur(28px)',
                        WebkitBackdropFilter: 'blur(28px)',
                        border: '1px solid rgba(232,99,122,0.14)',
                        boxShadow: '0 50px 80px rgba(0,0,0,0.5)',
                    }}
                >
                    <div className="text-center mb-8">
                        <span className="font-serif text-[2.2rem] font-black text-cream block">
                            Re<em className="text-rose not-italic">v</em>erie
                        </span>
                        <span className="text-[0.72rem] text-cream/30 tracking-[0.1em] uppercase">
                            Your private shared diary
                        </span>
                    </div>

                    <div
                        className="flex rounded-2xl p-1 gap-1 mb-7"
                        style={{
                            background: 'rgba(255,255,255,0.035)',
                            border: '1px solid rgba(255,255,255,0.05)',
                        }}
                    >
                        {['join', 'create'].map((t) => (
                            <button
                                key={t}
                                onClick={() => { setTab(t); setCreated(null) }}
                                className={[
                                    'flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all',
                                    tab === t
                                        ? 'bg-gradient-to-r from-rose/20 to-gold/10 text-cream border border-rose/20'
                                        : 'text-cream/35 hover:text-cream/60',
                                ].join(' ')}
                            >
                                {t === 'join' ? 'Join a Room' : 'Create a Room'}
                            </button>
                        ))}
                    </div>

                    {tab === 'join' && (
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="block text-[0.7rem] font-semibold tracking-[0.08em] uppercase text-cream/40 mb-1.5">
                                    Room Code
                                </label>
                                <div className="relative">
                                    <KeyRound
                                        size={14}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream/25"
                                    />
                                    <input
                                        type="text"
                                        value={jCode}
                                        onChange={(e) => setJCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
                                        placeholder="000000"
                                        inputMode="numeric"
                                        maxLength={6}
                                        className={[
                                            'input-field pl-9 text-center font-serif text-2xl font-bold tracking-[0.4em]',
                                            jErrors.code ? 'err' : '',
                                        ].join(' ')}
                                    />
                                </div>
                                {jErrors.code && (
                                    <p className="text-xs text-rose mt-1">{jErrors.code}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-[0.7rem] font-semibold tracking-[0.08em] uppercase text-cream/40 mb-1.5">
                                    Your Name
                                </label>
                                <div className="relative">
                                    <User
                                        size={14}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream/25"
                                    />
                                    <input
                                        type="text"
                                        value={jName}
                                        onChange={(e) => setJName(e.target.value.slice(0, 30))}
                                        onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
                                        placeholder="How should we call you?"
                                        className={[
                                            'input-field pl-9',
                                            jErrors.name ? 'err' : '',
                                        ].join(' ')}
                                    />
                                </div>
                                {jErrors.name && (
                                    <p className="text-xs text-rose mt-1">{jErrors.name}</p>
                                )}
                            </div>

                            {showPass && (
                                <div className="animate-fade-up">
                                    <label className="block text-[0.7rem] font-semibold tracking-[0.08em] uppercase text-cream/40 mb-1.5">
                                        Passphrase
                                    </label>
                                    <div className="relative">
                                        <Lock
                                            size={14}
                                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream/25"
                                        />
                                        <input
                                            type="password"
                                            value={jPass}
                                            onChange={(e) => setJPass(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
                                            placeholder="Enter room passphrase"
                                            className={[
                                                'input-field pl-9',
                                                jErrors.pass ? 'err' : '',
                                            ].join(' ')}
                                        />
                                    </div>
                                    {jErrors.pass && (
                                        <p className="text-xs text-rose mt-1">{jErrors.pass}</p>
                                    )}
                                </div>
                            )}

                            <button
                                onClick={handleJoin}
                                disabled={jLoading}
                                className="w-full py-3 rounded-full bg-rose text-ink font-bold text-sm hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(232,99,122,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-1"
                            >
                                {jLoading ? 'Joining...' : 'Enter Our Diary'}
                            </button>
                        </div>
                    )}

                    {tab === 'create' && (
                        <div>
                            {created ? (
                                <div className="flex flex-col items-center text-center gap-3 animate-fade-up py-2">
                                    <div
                                        className="w-16 h-16 rounded-full flex items-center justify-center text-2xl animate-card-in"
                                        style={{
                                            background: 'linear-gradient(135deg, rgba(232,99,122,0.2), rgba(232,184,109,0.15))',
                                            border: '1px solid rgba(232,99,122,0.25)',
                                        }}
                                    >
                                        ✨
                                    </div>

                                    <h3 className="font-serif text-xl font-bold mt-1">Your room is ready.</h3>
                                    <p className="text-xs text-cream/40">Share this code with your person</p>

                                    <div className="flex items-center gap-2 mt-1">
                                        <div
                                            className="px-6 py-3 rounded-full font-serif font-bold text-[1.4rem] text-gold tracking-[0.3em]"
                                            style={{
                                                background: 'rgba(232,184,109,0.08)',
                                                border: '1px solid rgba(232,184,109,0.25)',
                                            }}
                                        >
                                            {created.roomCode}
                                        </div>
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(created.roomCode)
                                                toast.success('Copied!')
                                            }}
                                            className="px-3 py-2 rounded-xl text-[0.7rem] text-gold/70 hover:text-gold transition-all"
                                            style={{ border: '1px solid rgba(232,184,109,0.2)' }}
                                        >
                                            Copy
                                        </button>
                                    </div>

                                    <p className="text-[0.72rem] text-cream/30">
                                        They need this code to join your diary.
                                    </p>

                                    <button
                                        onClick={() => { setSession(created); navigate('/diary') }}
                                        className="w-full py-3 rounded-full bg-rose text-ink font-bold text-sm hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(232,99,122,0.4)] transition-all mt-2"
                                    >
                                        Open Our Diary
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4 animate-fade-up">
                                    <div>
                                        <label className="block text-[0.7rem] font-semibold tracking-[0.08em] uppercase text-cream/40 mb-1.5">
                                            Your Name
                                        </label>
                                        <div className="relative">
                                            <User
                                                size={14}
                                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream/25"
                                            />
                                            <input
                                                type="text"
                                                value={cName}
                                                onChange={(e) => setCName(e.target.value.slice(0, 30))}
                                                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                                                placeholder="How should we call you?"
                                                className={['input-field pl-9', nameErr ? 'err' : ''].join(' ')}
                                            />
                                        </div>
                                        {nameErr ? (
                                            <p className="text-xs text-rose mt-1">{nameErr}</p>
                                        ) : (
                                            <p className="text-xs text-cream/25 mt-1">Your partner sees this name.</p>
                                        )}
                                    </div>

                                    <div>
                                        <div className="flex justify-between mb-1.5">
                                            <label className="text-[0.7rem] font-semibold tracking-[0.08em] uppercase text-cream/40">
                                                Secret Passphrase
                                            </label>
                                            <span className="text-[0.62rem] text-cream/20">optional</span>
                                        </div>
                                        <div className="relative">
                                            <Lock
                                                size={14}
                                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream/25"
                                            />
                                            <input
                                                type="password"
                                                value={cPass}
                                                onChange={(e) => setCPass(e.target.value.slice(0, 40))}
                                                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                                                placeholder="Both must know this"
                                                className="input-field pl-9"
                                            />
                                        </div>
                                        <p className="text-xs text-cream/25 mt-1">
                                            If set, anyone joining must enter this phrase.
                                        </p>
                                    </div>

                                    <button
                                        onClick={handleCreate}
                                        disabled={loading}
                                        className="w-full py-3 rounded-full bg-rose text-ink font-bold text-sm hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(232,99,122,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-1"
                                    >
                                        {loading ? 'Creating...' : 'Create Our Diary'}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    <a
                        href="/"
                        className="block text-center mt-5 text-xs text-cream/20 hover:text-cream/45 transition-colors"
                    >
                        Back to home
                    </a>
                    <p className="text-center text-[0.68rem] text-cream/15 mt-3">
                        Room codes are private. Only you decide who enters.
                    </p>
                </div>
            </div>
        </div>
    )
}
