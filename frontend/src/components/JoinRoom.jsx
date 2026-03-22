import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { KeyRound, User, Lock } from 'lucide-react'
import { useStore } from '../store/useStore'
import * as api from '../lib/api'

export default function JoinRoom() {
    const navigate = useNavigate()
    const setSession = useStore(s => s.setSession)
    const [code, setCode] = useState('')
    const [name, setName] = useState('')
    const [pass, setPass] = useState('')
    const [showPass, setShowPass] = useState(false)
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})

    const validate = () => {
        const e = {}
        if (!/^\d{6}$/.test(code.trim())) e.code = 'Must be exactly 6 digits.'
        if (!name.trim()) e.name = 'Please enter your name.'
        setErrors(e)
        return !Object.keys(e).length
    }

    const join = async () => {
        if (!validate()) return
        setLoading(true)
        try {
            const data = await api.joinRoom(code.trim(), name.trim(), pass.trim())
            setSession({ roomCode: data.pair.room_code, authorName: data.author_name, pairId: data.pair.id })
            navigate('/diary')
        } catch (err) {
            if (err.status === 403) { setShowPass(true); setErrors({ pass: 'Incorrect passphrase.' }) }
            else if (err.status === 404) setErrors({ code: 'Room not found.' })
            else if (err.status === 409) setErrors({ code: 'Room is full.' })
            else toast.error(err.message || 'Could not join')
        } finally { setLoading(false) }
    }

    return (
        <div className="flex flex-col gap-4">
            <div>
                <label className="block text-[0.7rem] font-semibold tracking-[0.08em] uppercase text-cream/40 mb-1.5">Room Code</label>
                <div className="relative">
                    <KeyRound size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream/25" />
                    <input type="text" value={code} onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        onKeyDown={e => e.key === 'Enter' && join()} placeholder="000000" inputMode="numeric" maxLength={6}
                        className={`input-field pl-9 text-center font-serif text-2xl font-bold tracking-[0.4em] ${errors.code ? 'err' : ''}`} />
                </div>
                {errors.code && <p className="text-xs text-rose mt-1">{errors.code}</p>}
            </div>
            <div>
                <label className="block text-[0.7rem] font-semibold tracking-[0.08em] uppercase text-cream/40 mb-1.5">Your Name</label>
                <div className="relative">
                    <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream/25" />
                    <input type="text" value={name} onChange={e => setName(e.target.value.slice(0, 30))}
                        onKeyDown={e => e.key === 'Enter' && join()} placeholder="How should we call you?"
                        className={`input-field pl-9 ${errors.name ? 'err' : ''}`} />
                </div>
                {errors.name && <p className="text-xs text-rose mt-1">{errors.name}</p>}
            </div>
            {showPass && (
                <div className="animate-fade-up">
                    <label className="block text-[0.7rem] font-semibold tracking-[0.08em] uppercase text-cream/40 mb-1.5">Passphrase</label>
                    <div className="relative">
                        <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream/25" />
                        <input type="password" value={pass} onChange={e => setPass(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && join()} placeholder="Enter room passphrase"
                            className={`input-field pl-9 ${errors.pass ? 'err' : ''}`} />
                    </div>
                    {errors.pass && <p className="text-xs text-rose mt-1">{errors.pass}</p>}
                </div>
            )}
            <button onClick={join} disabled={loading}
                className="btn-primary w-full justify-center mt-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                {loading ? <span className="animate-spin-slow w-3.5 h-3.5 border-2 border-ink/30 border-t-ink rounded-full inline-block" /> : null}
                {loading ? 'Joining…' : 'Enter Our Diary →'}
            </button>
        </div>
    )
}