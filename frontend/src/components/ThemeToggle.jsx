import { useStore } from '../store/useStore'

export default function ThemeToggle() {
    const { darkMode, toggleDarkMode } = useStore()

    return (
        <button
            onClick={toggleDarkMode}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.4rem 0.85rem',
                borderRadius: '9999px',
                border: '1px solid',
                borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(232,99,122,0.2)',
                background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(232,99,122,0.07)',
                color: darkMode ? 'rgba(245,237,232,0.6)' : 'rgba(42,26,31,0.6)',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Outfit, sans-serif',
                transition: 'all 0.2s',
            }}
        >
            <span style={{ fontSize: '0.9rem' }}>
                {darkMode ? '☀️' : '🌙'}
            </span>
            {darkMode ? 'Light' : 'Dark'}
        </button>
    )
}
