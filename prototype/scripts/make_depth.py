"""Generate depth maps for garment cutouts with Depth Anything V2 (Small).

Model: depth-anything/Depth-Anything-V2-Small-hf (Apache-2.0), run locally on CPU/MPS.
The depth is estimated on the WHITE garment (clearer shading cues), masked by the
cutout alpha, normalized, softened, and saved as a grayscale PNG (white = near).
The same depth map is reused for the black colorway (identical silhouette).

Usage: python make_depth.py <garments_dir>
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter
from transformers import pipeline


def main(d):
    d = Path(d)
    pipe = pipeline("depth-estimation", model="depth-anything/Depth-Anything-V2-Small-hf")
    for side in ("front", "back"):
        rgba = Image.open(d / f"ls01-white-{side}.png").convert("RGBA")
        alpha = np.array(rgba)[..., 3].astype(np.float32) / 255.0
        bg = Image.new("RGB", rgba.size, (90, 90, 90))
        bg.paste(rgba, mask=rgba.split()[3])
        depth = pipe(bg)["depth"].resize(rgba.size, Image.BICUBIC)
        z = np.array(depth).astype(np.float32)
        inside = alpha > 0.5
        lo, hi = np.percentile(z[inside], 1), np.percentile(z[inside], 99)
        z = np.clip((z - lo) / max(hi - lo, 1e-3), 0, 1)
        # blend with a distance-to-edge dome so the silhouette rolls off smoothly
        from scipy import ndimage

        dist = ndimage.distance_transform_edt(inside)
        dome = np.clip(dist / (dist.max() * 0.35), 0, 1) ** 0.6
        z = (0.6 * z + 0.4 * dome) * alpha
        out = Image.fromarray((z * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(3))
        out.save(d / f"ls01-depth-{side}.png")
        print("wrote depth", side)


if __name__ == "__main__":
    main(sys.argv[1])
