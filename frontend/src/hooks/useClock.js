import { useState, useEffect } from 'react'

export function useClock(tz1 = 'Asia/Kolkata', tz2 = null) {
    const [now, setNow] = useState(new Date())
    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 1000)
        return () => clearInterval(id)
    }, [])

    const fmt = (tz) => {
        const t = now.toLocaleTimeString('en-IN', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: true })
        const d = now.toLocaleDateString('en-IN', { timeZone: tz, weekday: 'short', month: 'short', day: 'numeric' })
        const [time, ampm] = t.split(' ')
        return { time, ampm: ampm || '', date: d, city: tz.split('/').pop().replace(/_/g, ' ') }
    }

    return { clock1: fmt(tz1), clock2: fmt(tz2 || tz1) }
}