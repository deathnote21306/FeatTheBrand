// GLB models produced by AI image-to-3D for the comparison (see NOTES.md).
export type ModelEntry = {
  id: string;
  label: string;
  src: string;
  /** project the product photos onto the mesh (front/back planar projection) */
  project?: { front: string; back: string };
};

export const MODELS: ModelEntry[] = [
  {
    id: "hunyuan-photo",
    label: "Hunyuan3D-2 + photo projetée",
    src: "/models/ls01-hunyuan-shape.glb",
    project: { front: "/garments/ls01-black-front.png", back: "/garments/ls01-black-back.png" },
  },
  { id: "hunyuan-raw", label: "Hunyuan3D-2 (forme brute)", src: "/models/ls01-hunyuan-shape.glb" },
];
