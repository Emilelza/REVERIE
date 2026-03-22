import { Link } from 'react-router-dom'
import StarField from '../components/StarField'
import ThemeToggle from '../components/ThemeToggle'

const FEATURES = [
    { icon: '📖', title: 'Shared Diary', desc: 'Write daily entries with mood emojis. Both users see updates instantly.' },
    { icon: '⏳', title: 'Remember This?', desc: 'On the anniversary of past entries, both users receive a memory reminder.' },
    { icon: '🟢', title: 'Together Mode', desc: 'See when your partner is online and set a vibe status.' },
    { icon: '🌍', title: 'Time Zone Clock', desc: 'Displays both users local times so you never miss a call.' },
    { icon: '⭐', title: 'Favourite Moments', desc: 'Save special entries. They surface again on their anniversary.' },
    { icon: '🎲', title: 'Date Ideas', desc: 'Random ideas for virtual dates or future meetups.' },
    { icon: '❤️', title: 'Reactions', desc: 'React to entries using emoji responses.' },
    { icon: '🔐', title: 'Private Rooms', desc: '6-digit room code plus optional passphrase. No sign-up needed.' },
    { icon: '💬', title: 'Live Chat', desc: 'Real-time chat between the two of you inside your private room.' },
]

const STEPS = [
    { step: '01', title: 'Create a Room', desc: 'Enter your name. Get a unique 6-digit room code instantly. No account needed.' },
    { step: '02', title: 'Share the Code', desc: 'Send the code to your partner. They join from any device, anywhere.' },
    { step: '03', title: 'Write Together', desc: 'Write diary entries, chat, react with emojis, and relive memories together.' },
]

const AUDIENCE = [
    { icon: '🎓', title: 'Students and Parents', stat: '35M+ migrate yearly', desc: '35M+ students migrate across India every year, moving away from home for education. Reverie helps students and parents stay emotionally connected despite the distance. 📖🤍.' },
    { icon: '💼', title: 'Families and Spouses', stat: 'Millions of families', desc: 'Work migration separates millions. A shared diary helps spouses stay present.' },
    { icon: '🌏', title: 'Long-Distance Couples', stat: 'Any timezone', desc: 'Whether nearby or across an ocean, Reverie gives your relationship a dedicated space.' },
    {
        icon: '🤝',
        title: 'Long-Distance Best Friends',
        stat: 'Miles Apart',
        desc: 'Even across cities or countries, Reverie gives best friends a space to share memories, thoughts, and stay emotionally close.'
    }
]

export default function Landing() {
    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', overflowX: 'hidden', transition: 'background 0.3s, color 0.3s' }}>
            <StarField />

            {/* NAV */}
            <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)', transition: 'background 0.3s' }}>
                <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', fontWeight: 900, color: 'var(--text)' }}>
                    Re<em style={{ color: 'var(--rose)', fontStyle: 'italic' }}>v</em>erie
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <ThemeToggle />
                    <Link to="/login"
                        style={{ padding: '0.5rem 1.25rem', borderRadius: '9999px', background: 'var(--rose)', color: '#fff', fontSize: '0.875rem', fontWeight: 700, textDecoration: 'none', transition: 'all 0.2s' }}>
                        Open Diary
                    </Link>
                </div>
            </nav>

            {/* HERO */}
            <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '6rem 1.5rem 4rem', position: 'relative' }}>
                <div style={{ position: 'relative', zIndex: 2, maxWidth: '760px', margin: '0 auto' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', borderRadius: '9999px', border: '1px solid rgba(232,99,122,0.3)', background: 'rgba(232,99,122,0.07)', color: 'var(--rose)', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '2rem' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--rose)', animation: 'pulseDot 2s ease-in-out infinite' }} />
                        Connect & Share
                    </div>

                    <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2.8rem,7vw,5.5rem)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: '1.5rem', color: 'var(--text)' }}>
                        Distance is real.
                        <br />
                        <em style={{ color: 'var(--rose)' }}>Connection can be too.</em>
                    </h1>

                    <p style={{ fontSize: '1.1rem', color: 'var(--text2)', lineHeight: 1.8, maxWidth: '500px', margin: '0 auto 2.5rem', fontWeight: 300 }}>
                        Reverie is a private shared diary for two. Slow, intentional, and emotionally meaningful. Not another messaging app. A space to remember together.
                    </p>

                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
                        <Link to="/login"
                            style={{ padding: '0.9rem 2rem', borderRadius: '9999px', background: 'var(--rose)', color: '#fff', fontSize: '1rem', fontWeight: 700, textDecoration: 'none', transition: 'all 0.2s' }}>
                            Start Your Diary
                        </Link>
                        <a href="#features"
                            style={{ padding: '0.9rem 2rem', borderRadius: '9999px', border: '1px solid var(--border2)', color: 'var(--text2)', fontSize: '1rem', textDecoration: 'none', transition: 'all 0.2s' }}>
                            See Features
                        </a>
                    </div>

                    <div style={{ display: 'flex', gap: '2.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        {[['35M+', 'Students migrate yearly'], ['#1', 'Fear: feeling forgotten'], ['Free', 'Always and forever']].map(([n, l]) => (
                            <div key={l} style={{ textAlign: 'center' }}>
                                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', fontWeight: 700, color: 'var(--gold)' }}>{n}</div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text3)', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: '0.2rem' }}>{l}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section id="features" style={{ padding: '6rem 1.5rem', borderTop: '1px solid var(--border)' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--rose)', display: 'block', marginBottom: '0.75rem' }}>Features</span>
                        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em' }}>Everything a shared diary should have.</h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '1rem' }}>
                        {FEATURES.map((f) => (
                            <div key={f.title} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '1.25rem', padding: '1.5rem', transition: 'all 0.2s' }}>
                                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(232,99,122,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', marginBottom: '1rem' }}>{f.icon}</div>
                                <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--text)' }}>{f.title}</h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text3)', lineHeight: 1.7 }}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section style={{ padding: '6rem 1.5rem', borderTop: '1px solid var(--border)' }}>
                <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--rose)', display: 'block', marginBottom: '0.75rem' }}>How It Works</span>
                    <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 700, color: 'var(--text)', marginBottom: '3rem', letterSpacing: '-0.02em' }}>Up and running in 2 minutes.</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {STEPS.map((s) => (
                            <div key={s.step} style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', textAlign: 'left', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '1.25rem', padding: '1.5rem' }}>
                                <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.5rem', fontWeight: 900, color: 'rgba(232,99,122,0.3)', flexShrink: 0, width: '48px' }}>{s.step}</span>
                                <div>
                                    <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.4rem', color: 'var(--text)' }}>{s.title}</h3>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text3)', lineHeight: 1.7 }}>{s.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* WHO IT IS FOR */}
            <section id="who" style={{ padding: '6rem 1.5rem', borderTop: '1px solid var(--border)' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--rose)', display: 'block', marginBottom: '0.75rem' }}>Who It Is For</span>
                    <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 700, color: 'var(--text)', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>For anyone who loves someone far away.</h2>
                    <p style={{ color: 'var(--text3)', marginBottom: '3rem' }}>Students, migrant workers, families, couples — anyone separated by distance.</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '1rem' }}>
                        {AUDIENCE.map((a) => (
                            <div key={a.title} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '1.25rem', padding: '2rem', textAlign: 'left', transition: 'all 0.2s' }}>
                                <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1rem' }}>{a.icon}</span>
                                <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text)' }}>{a.title}</h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text3)', lineHeight: 1.7, marginBottom: '1rem' }}>{a.desc}</p>
                                <span style={{ fontSize: '0.78rem', color: 'var(--gold)', fontWeight: 500 }}>{a.stat}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section style={{ padding: '7rem 1.5rem', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
                <div style={{ maxWidth: '560px', margin: '0 auto' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--rose)', display: 'block', marginBottom: '1rem' }}>Free. Always.</span>
                    <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2.5rem,6vw,4.5rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: '1.25rem', color: 'var(--text)' }}>
                        Start writing<br />
                        <em style={{ color: 'var(--rose)' }}>your story.</em>
                    </h2>
                    <p style={{ color: 'var(--text3)', marginBottom: '2.5rem', lineHeight: 1.8 }}>No subscription. No credit card. Just two people, one room, and all the words you have been meaning to write.</p>
                    <Link to="/login"
                        style={{ display: 'inline-block', padding: '1rem 2.5rem', borderRadius: '9999px', background: 'var(--rose)', color: '#fff', fontSize: '1rem', fontWeight: 700, textDecoration: 'none', transition: 'all 0.2s' }}>
                        Open Your Diary
                    </Link>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text4)', marginTop: '1.25rem' }}>Free forever. No sign-up required. Private by design.</p>
                </div>
            </section>

            {/* FOOTER */}
            <footer style={{ borderTop: '1px solid var(--border)', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, color: 'var(--text)' }}>
                    Re<em style={{ color: 'var(--rose)', fontStyle: 'italic' }}>v</em>erie
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text4)' }}>2025 Reverie. Free forever.</span>
            </footer>
        </div>
    )
}
