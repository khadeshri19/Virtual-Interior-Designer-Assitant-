import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DesignState {
    currentDesignId: string | null;
    recentDesigns: string[];
    favoriteStyles: string[];
    setCurrentDesign: (id: string | null) => void;
    addRecentDesign: (id: string) => void;
    toggleFavoriteStyle: (style: string) => void;
}

export const useDesignStore = create<DesignState>()(
    persist(
        (set) => ({
            currentDesignId: null,
            recentDesigns: [],
            favoriteStyles: [],

            setCurrentDesign: (id) => set({ currentDesignId: id }),

            addRecentDesign: (id) =>
                set((state) => ({
                    recentDesigns: [id, ...state.recentDesigns.filter((d) => d !== id)].slice(0, 10),
                })),

            toggleFavoriteStyle: (style) =>
                set((state) => ({
                    favoriteStyles: state.favoriteStyles.includes(style)
                        ? state.favoriteStyles.filter((s) => s !== style)
                        : [...state.favoriteStyles, style],
                })),
        }),
        {
            name: 'vd-design-store',
        }
    )
);

interface UIState {
    isChatOpen: boolean;
    theme: 'light' | 'dark' | 'system' | 'skin';
    toggleChat: () => void;
    setTheme: (theme: 'light' | 'dark' | 'system' | 'skin') => void;
}

export const useUIStore = create<UIState>()(
    persist(
        (set) => ({
            isChatOpen: false,
            theme: 'dark',

            toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
            setTheme: (theme) => set({ theme }),
        }),
        {
            name: 'vd-ui-store',
        }
    )
);

interface UserState {
    userId: string | null;
    name: string | null;
    email: string | null;
    setUser: (user: { id: string; name?: string; email?: string }) => void;
    clearUser: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            userId: null,
            name: null,
            email: null,

            setUser: (user) => set({
                userId: user.id,
                name: user.name || null,
                email: user.email || null
            }),

            clearUser: () => set({ userId: null, name: null, email: null }),
        }),
        {
            name: 'vd-user-store',
        }
    )
);
