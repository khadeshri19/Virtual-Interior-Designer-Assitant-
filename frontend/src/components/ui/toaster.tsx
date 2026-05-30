"use client";

import * as React from "react";

interface Toast {
    id: string;
    title?: string;
    description?: string;
    variant?: "default" | "destructive";
}

interface ToasterContextType {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, "id">) => void;
    removeToast: (id: string) => void;
}

const ToasterContext = React.createContext<ToasterContextType | undefined>(undefined);

export function ToasterProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = React.useState<Toast[]>([]);

    const addToast = React.useCallback((toast: Omit<Toast, "id">) => {
        const id = Math.random().toString(36).substring(7);
        setToasts((prev) => [...prev, { ...toast, id }]);

        // Auto remove after 5 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 5000);
    }, []);

    const removeToast = React.useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToasterContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
        </ToasterContext.Provider>
    );
}

export function useToast() {
    const context = React.useContext(ToasterContext);

    if (!context) {
        // Return a no-op toast function if not wrapped in provider
        return {
            toast: (props: Omit<Toast, "id">) => console.log("Toast:", props),
            toasts: [],
        };
    }

    return {
        toast: context.addToast,
        toasts: context.toasts,
    };
}

export function Toaster() {
    const [toasts, setToasts] = React.useState<Toast[]>([]);

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`px-4 py-3 rounded-lg shadow-lg transition-all ${toast.variant === "destructive"
                            ? "bg-destructive text-destructive-foreground"
                            : "bg-card text-card-foreground border border-border"
                        }`}
                >
                    {toast.title && <p className="font-semibold">{toast.title}</p>}
                    {toast.description && <p className="text-sm opacity-90">{toast.description}</p>}
                </div>
            ))}
        </div>
    );
}
