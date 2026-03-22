import { useEffect, useRef } from 'react'

export default function StarField() {
    const ref = useRef(null)
    useEffect(() => {
        const canvas = ref.current
        const ctx = canvas.getContext('2d')
        let W, H, stars = [], raf
        const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight }
        resize()
        window.addEventListener('resize', resize)
        for (let i = 0; i < 160; i++) stars.push({ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, r: Math.random() * 1.1 + 0.2, ph: Math.random() * Math.PI * 2, sp: Math.random() * 0.002 + 0.0007, hue: Math.random() > 0.7 ? '232,99,122' : '196,184,216' })
        const draw = () => { ctx.clearRect(0, 0, W, H); stars.forEach((s) => { s.ph += s.sp; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(${s.hue},${0.08 + 0.32 * Math.abs(Math.sin(s.ph))})`; ctx.fill() }); raf = requestAnimationFrame(draw) }
        draw()
        return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
    }, [])
    return <canvas ref={ref} className="fixed inset-0 pointer-events-none z-0 opacity-60" />
}