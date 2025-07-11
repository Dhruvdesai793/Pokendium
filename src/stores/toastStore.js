import { create } from 'zustand';


export const useToastStore = create((set) => ({
    toasts: [],
    
    showToast: (message, type = 'info') => {
        const id = Date.now(); 
        set((state) => ({
            toasts: [...state.toasts, { id, message, type }],
        }));
        
        setTimeout(() => {
            set((state) => ({
                toasts: state.toasts.filter((toast) => toast.id !== id),
            }));
        }, 3000);
    },
}));