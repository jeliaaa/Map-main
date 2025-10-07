import { create } from 'zustand'

const useProjectModal = create((set) => ({
  isOpen: false,
  data: null,
  onOpen: (data) => set(() => ({ isOpen: true, data })),
  onClose: () => set(() => ({ isOpen: false, data: null })),
}));


export default useProjectModal