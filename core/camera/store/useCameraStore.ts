import { create } from 'zustand';

interface TemporalCameraStoreState {
  selectedImages: SelectedImages[];

  addSelectedImage: (image: SelectedImages) => void;
  clearImages: () => void;
  removeImage: (image: SelectedImages) => void;
}

interface SelectedImages {
  uri: string;
  base64?: string;
}

export const useCameraStore = create<TemporalCameraStoreState>()((set) => ({
  selectedImages: [],

  addSelectedImage: (image: SelectedImages) => {
    set((state) => ({
      selectedImages: [...state.selectedImages, image],
    }));
  },

  clearImages: () => set({ selectedImages: [] }),

  removeImage: (image: SelectedImages) =>
    set((state) => ({
      selectedImages: state.selectedImages.filter(
        (img) => img.uri !== image.uri
      ),
    })),
}));
