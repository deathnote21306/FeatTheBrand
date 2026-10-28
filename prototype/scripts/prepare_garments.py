"""Turn the Wikimedia Commons long-sleeve tee photos (white, with prints) into
clean placeholder garment cutouts: background removed, prints inpainted,
plus a recolored black version.

Source (CC BY-SA 4.0, User:Bodhisattwa):
  https://commons.wikimedia.org/wiki/File:Wiki_Loves_Monuments_2021_in_India_Men%27s_long_sleeve_T-shirt_-_front_side.png
  https://commons.wikimedia.org/wiki/File:Wiki_Loves_Monuments_2021_in_India_Men%27s_long_sleeve_T-shirt_-_reverse_side.png

Usage: python prepare_garments.py <front.png> <back.png> <out_dir>
Needs: opencv-python-headless, numpy, pillow, scipy
"""
import sys
from pathlib import Path

import cv2
import numpy as np
from scipy import ndimage


def cutout(rgb: np.ndarray) -> np.ndarray:
    """Alpha mask: near-white pixels connected to the border are background."""
    near_white = rgb.min(axis=2) >= 247
    labels, _ = ndimage.label(near_white)
    border = np.unique(np.concatenate([labels[0], labels[-1], labels[:, 0], labels[:, -1]]))
    bg = np.isin(labels, border[border > 0])
    fg = ~bg
    fg = ndimage.binary_opening(fg, iterations=1)
    fg = ndimage.binary_fill_holes(fg)
    # keep largest component
    lab, n = ndimage.label(fg)
    if n > 1:
        sizes = ndimage.sum(fg, lab, range(1, n + 1))
        fg = lab == (np.argmax(sizes) + 1)
    alpha = cv2.GaussianBlur(fg.astype(np.float32), (3, 3), 0)
    return alpha


def remove_prints(rgb: np.ndarray, alpha: np.ndarray) -> np.ndarray:
    hsv = cv2.cvtColor(rgb, cv2.COLOR_RGB2HSV)
    sat = hsv[..., 1] > 40
    dark = rgb.max(axis=2) < 175
    inner = ndimage.binary_erosion(alpha > 0.5, iterations=6)
    mask = (sat | dark) & inner
    mask = ndimage.binary_dilation(mask, iterations=4).astype(np.uint8) * 255
    return cv2.inpaint(rgb, mask, 9, cv2.INPAINT_TELEA)


def to_black(rgb: np.ndarray) -> np.ndarray:
    """Map white-garment shading to a near-black garment, keeping the folds."""
    lum = cv2.cvtColor(rgb, cv2.COLOR_RGB2GRAY).astype(np.float32) / 255.0
    lo, hi = np.percentile(lum, 2), np.percentile(lum, 99.5)
    t = np.clip((lum - lo) / max(hi - lo, 1e-3), 0, 1)
    v = 0.035 + 0.16 * t ** 1.6  # deep black base, soft highlights
    out = np.stack([v * 0.98, v * 0.98, v * 1.02], axis=-1)
    return np.clip(out * 255, 0, 255).astype(np.uint8)


def save_rgba(rgb, alpha, path, scale=2):
    rgba = np.dstack([rgb, (alpha * 255).astype(np.uint8)])
    h, w = rgba.shape[:2]
    rgba = cv2.resize(rgba, (w * scale, h * scale), interpolation=cv2.INTER_LANCZOS4)
    # tight crop with padding
    ys, xs = np.where(rgba[..., 3] > 8)
    pad = 24
    y0, y1 = max(ys.min() - pad, 0), min(ys.max() + pad, rgba.shape[0])
    x0, x1 = max(xs.min() - pad, 0), min(xs.max() + pad, rgba.shape[1])
    rgba = rgba[y0:y1, x0:x1]
    cv2.imwrite(str(path), cv2.cvtColor(rgba, cv2.COLOR_RGBA2BGRA))


def main(front, back, out):
    out = Path(out)
    out.mkdir(parents=True, exist_ok=True)
    for name, src in (("front", front), ("back", back)):
        rgb = cv2.cvtColor(cv2.imread(src, cv2.IMREAD_COLOR), cv2.COLOR_BGR2RGB)
        alpha = cutout(rgb)
        clean = remove_prints(rgb, alpha)
        save_rgba(clean, alpha, out / f"ls01-white-{name}.png")
        save_rgba(to_black(clean), alpha, out / f"ls01-black-{name}.png")
        print("wrote", name)
    # back photo has a different framing: pad it to the front canvas so both
    # sides share one plane size in the viewer
    fw, fh = cv2.imread(str(out / "ls01-black-front.png"), cv2.IMREAD_UNCHANGED).shape[1::-1]
    for f in ("ls01-black-back.png", "ls01-white-back.png"):
        im = cv2.imread(str(out / f), cv2.IMREAD_UNCHANGED)
        h, w = im.shape[:2]
        canvas = np.zeros((fh, fw, 4), np.uint8)
        y, x = (fh - h) // 2, (fw - w) // 2
        canvas[max(y, 0):max(y, 0) + min(h, fh), max(x, 0):max(x, 0) + min(w, fw)] = im[: min(h, fh), : min(w, fw)]
        cv2.imwrite(str(out / f), canvas)


if __name__ == "__main__":
    main(*sys.argv[1:4])
