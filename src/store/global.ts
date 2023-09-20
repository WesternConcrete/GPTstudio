import { create } from 'zustand'

interface GlobalState {
  bears: number
  increase: (by: number) => void
}

const useBearStore = create<GlobalState>()((set) => ({
  bears: 0,
  increase: (by) => set((state) => ({ bears: state.bears + by })),
}))