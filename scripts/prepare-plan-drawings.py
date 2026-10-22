"""
Prepare the client's SketchUp plan drawings for the 3D builder's floor-plan
viewer.

Each export is a view from above with the roof off, on SketchUp's grey: a white
ring for the wall, the porch bulging out of it at the door, and the fitted-out
floor inside. They come at different sizes, off-centre and a few degrees
turned. Each one is normalised to the same frame, so flicking between them in
the viewer, nothing jumps:

  1. Fit the wall ring (robustly: windows break it, and the fit drops those
     rays).
  2. Turn the drawing so the porch points straight down.
  3. Centre the wall in a square, at the same scale for every drawing, and make
     the grey background transparent.

    python scripts/prepare-plan-drawings.py <source.png> <out.webp>
"""

import sys

import numpy as np
from PIL import Image, ImageDraw

OUT_SIZE = 1200
# The wall's outer diameter as a share of the frame: room below for the porch.
WALL_SHARE = 0.80
# SketchUp's background, and how far a pixel may be from it to count as it.
BACKGROUND = np.array([204, 204, 201])
BACKGROUND_TOLERANCE = 10


def fit_circle(points):
    x, y = points[:, 0], points[:, 1]
    A = np.c_[2 * x, 2 * y, np.ones(len(x))]
    (cx, cy, c), *_ = np.linalg.lstsq(A, x**2 + y**2, rcond=None)
    return cx, cy, np.sqrt(c + cx**2 + cy**2)


def wall_circle(white):
    """The outer edge of the wall ring."""
    ys, xs = np.nonzero(white)
    left, right, top = xs.min(), xs.max(), ys.min()
    r0 = (right - left) / 2
    cx0, cy0 = (left + right) / 2, top + r0
    h, w = white.shape

    # Walk in from outside along each ray to the first white pixel, then fit,
    # dropping outliers (the porch, and rays that miss through a window).
    points = []
    for a in np.linspace(0, 2 * np.pi, 1440, endpoint=False):
        dx, dy = np.sin(a), -np.cos(a)
        for t in np.arange(r0 * 1.08, r0 * 0.8, -0.25):
            x, y = int(round(cx0 + dx * t)), int(round(cy0 + dy * t))
            if 0 <= x < w and 0 <= y < h and white[y, x]:
                points.append((cx0 + dx * t, cy0 + dy * t))
                break
    points = np.array(points)
    keep = np.ones(len(points), bool)
    for tol in (12, 6, 3, 1.5):
        cx, cy, r = fit_circle(points[keep])
        keep = np.abs(np.hypot(points[:, 0] - cx, points[:, 1] - cy) - r) < tol
    return cx, cy, r


def porch_turn(white, cx, cy, r):
    """Degrees to turn clockwise so the porch points straight down."""
    ys, xs = np.nonzero(white)
    out = np.hypot(xs - cx, ys - cy) > r + 4
    angle = np.degrees(np.arctan2((xs[out] - cx).mean(), (ys[out] - cy).mean()))
    return angle


def main(src, dst):
    image = Image.open(src).convert("RGB")
    rgb = np.asarray(image).astype(int)
    white = rgb.min(axis=2) > 240

    cx, cy, r = wall_circle(white)
    turn = porch_turn(white, cx, cy, r)

    # Transparent background: everything close to SketchUp's grey that is
    # outside the wall. Inside the wall, grey is floor and stays.
    background = np.abs(rgb - BACKGROUND).max(axis=2) <= BACKGROUND_TOLERANCE
    yy, xx = np.mgrid[: rgb.shape[0], : rgb.shape[1]]
    distance = np.hypot(xx - cx, yy - cy)
    outside = distance > r + 1
    # Outside the wall only the porch is kept: a sector around the door, within
    # its reach. That also drops the axis guide SketchUp leaves on some exports.
    bearing = np.degrees(np.arctan2(xx - cx, yy - cy)) - turn
    porch = (np.abs(bearing) < 35) & (distance < r * 1.22)
    alpha = np.where(outside & (background | ~porch), 0, 255).astype(np.uint8)

    rgba = image.copy()
    rgba.putalpha(Image.fromarray(alpha))

    # PIL turns anticlockwise for a positive angle, about the wall's centre.
    rgba = rgba.rotate(-turn, resample=Image.BICUBIC, center=(cx, cy))

    # The frame can reach past the export's edge: pad it with transparency.
    half = r / WALL_SHARE
    pad = int(np.ceil(half))
    padded = Image.new("RGBA", (rgba.width + 2 * pad, rgba.height + 2 * pad), (0, 0, 0, 0))
    padded.paste(rgba, (pad, pad))
    px, py = cx + pad, cy + pad
    frame = padded.resize(
        (OUT_SIZE, OUT_SIZE), Image.LANCZOS, box=(px - half, py - half, px + half, py + half)
    )
    frame.save(dst, quality=90, method=6)
    print(f"{src}: wall centre ({cx:.1f}, {cy:.1f}), r {r:.1f}px, turned {turn:+.1f}°")


if __name__ == "__main__":
    main(*sys.argv[1:3])
