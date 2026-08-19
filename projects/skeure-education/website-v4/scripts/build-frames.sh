#!/usr/bin/env bash
# Rebuilds the hero frame sets from the ungraded source sequence in website-v3.
#
# FIELD FLATTEN + COLOUR GRADE, in one pass. The source frames sit on a vignetted
# neutral studio field (bright bloom top-centre, darker corners) while the page field
# is a flat warm #f2f1ed = rgb(242,241,237). A flat gain cannot reconcile those — the
# vignette showed as a visible rectangle around the machine on the first build. So
# the vignette itself is measured and divided out: FIELD below is a least-squares
# quadratic surface fitted to machine-free samples of the source field (mean abs
# residual 1.2/255), and each channel is scaled per pixel by target/FIELD(X,Y). The
# field lands within ~1 step of the page colour everywhere, the machine gets a smooth
# <5% regional lift it cannot show, and black glass stays black (0 * gain = 0).
# Refit if the frames are ever re-rendered: sample the field outside the machine
# bbox (and outside the shadow at bottom-centre), least-squares a quadratic in X,Y.
#
# NO LUMA MATTE, DELIBERATELY. Keying the machine out of the field was measured and
# rejected: the closed lid peaks at luma 228 and the darkest field pixel is 229. There
# is no separation to key on, and any ramp wide enough to catch the field also eats
# the lid.
#
# EDGE FEATHER instead, and asymmetric on purpose. The machine occupies x 440..1480
# and y 100..900 of the 1920x960 frame, so there is 440px of pure field to each side,
# ~100px above and ~60px below. The per-edge radii keep the feather entirely off the
# machine at every lid angle. It cannot be done in CSS because the frame moves and
# rescales during the film, so a static mask would either clip the machine when
# docked or miss the edge when centred. FilmStage fills the canvas with the flat page
# colour and this feather dissolves the frame's rectangle into it.
#
# TWO FILMS. Desktop scrubs all 61 frames at full frame size. Mobile does not scrub
# at all: it gets one still per beat, cropped to the machine. v3 shipped 61 desktop
# frames to phones and drew exactly one of them; this is the fix.
set -euo pipefail

SRC="${1:-../website-v3/public/render/frames/desktop}"
OUT="public/render/frames"
FIELD="(231.774886+(0.024754769)*X+(0.002749153)*Y+(-0.000013071370)*X*X+(0.000008000373)*Y*Y+(-0.000000983034)*X*Y)"
GRADE="geq=r='clip(r(X,Y)*242/$FIELD,0,255)':g='clip(g(X,Y)*241/$FIELD,0,255)':b='clip(b(X,Y)*237/$FIELD,0,255)'"
# Mobile crop: the machine plus a field margin for its own feather to work in. Within
# this crop the machine sits at x 180..1220 and y 70..870, so the feather radii below
# stay clear of it on every side.
MOBILE_CROP="1400:900:260:30"
# Radii per edge (x, top, bottom), sized to the field margin actually available
# around the machine on that edge. With the field flattened to the page colour the
# feather dissolves into a flat fill, so it only has to hide the frame's rectangle,
# not reconcile two different fields.
feather() { # $1 = horizontal radius, $2 = top radius, $3 = bottom radius
  echo "format=rgba,geq=r='r(X,Y)':g='g(X,Y)':b='b(X,Y)':a='255*min(1,min(min(X,W-1-X)/$1,min(Y/$2,(H-1-Y)/$3)))'"
}
FEATHER="$(feather 320 90 52)"
# The mobile crop has tighter margins than the full frame, so it needs its own radii.
MOBILE_FEATHER="$(feather 160 55 26)"

# NOT hand-picked. Derived from the `open` values in src/data/filmBeats.ts so the
# mobile stills and the desktop scrub can never describe different choreography.
# Re-run this script after editing the beat map.
mapfile -t BEATS < <(node -e '
  const s = require("fs").readFileSync("src/data/filmBeats.ts","utf8");
  const o = [...s.matchAll(/open:\s*([0-9.]+)/g)].map(m => parseFloat(m[1]));
  if (!o.length) { console.error("build-frames: parsed no beats"); process.exit(1); }
  o.forEach(v => console.log(Math.round(v * 60) + 1));
')

rm -rf "$OUT"
mkdir -p "$OUT/desktop" "$OUT/mobile"

for i in $(seq 1 61); do
  n=$(printf "%03d" "$i")
  ffmpeg -loglevel error -y -i "$SRC/f-$n.webp" -vf "$GRADE,$FEATHER" \
    -c:v libwebp -quality 82 -compression_level 6 -pix_fmt yuva420p "$OUT/desktop/f-$n.webp"
done

b=0
for i in "${BEATS[@]}"; do
  b=$((b + 1))
  n=$(printf "%03d" "$i")
  ffmpeg -loglevel error -y -i "$SRC/f-$n.webp" -vf "$GRADE,crop=$MOBILE_CROP,$MOBILE_FEATHER,scale=760:-1" \
    -c:v libwebp -quality 76 -compression_level 6 -pix_fmt yuva420p "$OUT/mobile/b-$b.webp"
done

echo "desktop: $(ls "$OUT/desktop" | wc -l) frames, $(du -sh "$OUT/desktop" | cut -f1)"
echo "mobile:  $(ls "$OUT/mobile"  | wc -l) beats,  $(du -sh "$OUT/mobile"  | cut -f1)"
