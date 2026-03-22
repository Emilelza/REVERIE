import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useStore = create(
    persist(
        (set) => ({
            // ── Session ──────────────────────────────────────────
            roomCode: '', authorName: '', pairId: '',
            setSession: (s) => set(s),
            clearSession: () => set({ roomCode: '', authorName: '', pairId: '' }),

            // ── Entries ───────────────────────────────────────────
            entries: [],
            setEntries: (entries) => set({ entries }),
            addEntry: (entry) => set((s) => ({ entries: [entry, ...s.entries] })),
            updateEntry: (id, patch) => set((s) => ({ entries: s.entries.map((e) => e.id === id ? { ...e, ...patch } : e) })),
            removeEntry: (id) => set((s) => ({ entries: s.entries.filter((e) => e.id !== id) })),

            // ── Memories ──────────────────────────────────────────
            memories: [],
            setMemories: (m) => set({ memories: m }),

            // ── Presence ──────────────────────────────────────────
            presences: [],
            setPresences: (p) => set({ presences: p }),

            // ── Vibe ──────────────────────────────────────────────
            myVibe: { emoji: '', text: '' },
            setMyVibe: (v) => set({ myVibe: v }),

            // ── UI ────────────────────────────────────────────────
            activeView: 'diary',
            setActiveView: (v) => set({ activeView: v }),

            sidebarOpen: false,
            setSidebarOpen: (v) => set({ sidebarOpen: v }),

            showMemoryModal: false,
            setShowMemoryModal: (v) => set({ showMemoryModal: v }),

            showVibeModal: false,
            setShowVibeModal: (v) => set({ showVibeModal: v }),

            showAnniversaryPopup: false,
            setShowAnniversaryPopup: (v) => set({ showAnniversaryPopup: v }),

            // ── THEME ─────────────────────────────────────────────
            darkMode: true,
            toggleDarkMode: () => set((s) => {
                const next = !s.darkMode
                // Apply class to <html> immediately
                if (next) {
                    document.documentElement.classList.remove('light')
                } else {
                    document.documentElement.classList.add('light')
                }
                return { darkMode: next }
            }),
        }),
        {
            name: 'reverie-session',
            partialize: (s) => ({
                roomCode: s.roomCode,
                authorName: s.authorName,
                pairId: s.pairId,
                myVibe: s.myVibe,
                darkMode: s.darkMode,
            }),
            // Restore theme class on page load
            onRehydrateStorage: () => (state) => {
                if (state && !state.darkMode) {
                    document.documentElement.classList.add('light')
                }
            },
        }
    )
)
