"""Bake smooth normal maps from the depth maps.

Normals computed in the shader from an 8-bit depth texture show contour-line
banding (quantization). Doing it offline in float with a Gaussian blur first
removes the terracing. Output: RGB normal map (tangent space, OpenGL convention).

Usage: python make_normals.py <garments_dir>
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage


def main(d):
    d = Path(d)
    for side in ("front", "back"):
        z = np.array(Image.open(d / f"ls01-depth-{side}.png")).astype(np.float32) / 255.0
        z = ndimage.gaussian_filter(z, 4.0)
        strength = 28.0
        dy, dx = np.gradient(z)
        n = np.dstack([-dx * strength, dy * strength, np.ones_like(z)])  # +y up in OpenGL
        n /= np.linalg.norm(n, axis=2, keepdims=True)
        rgb = ((n * 0.5 + 0.5) * 255).astype(np.uint8)
        Image.fromarray(rgb).save(d / f"ls01-normal-{side}.png")
        print("wrote normal", side)


if __name__ == "__main__":
    main(sys.argv[1])
