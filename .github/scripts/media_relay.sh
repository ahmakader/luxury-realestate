#!/usr/bin/env bash
# Media pipeline. Two tasks:
#   chain    — download one clip, extract its final frame, PUT it to the
#              presigned Higgsfield upload URL (start frame of the next clip),
#              and commit small preview frames for continuity review.
#   finalize — download all clips + hero, stitch, extract the scroll-scrub
#              frame sequence (WebP + JPEG fallback), stills, gallery images,
#              placeholder, and the mobile fallback video into public/media.
set -euo pipefail

WORK=$(mktemp -d)

extract_frame() { # $1=input $2=time $3=out $4=width $5=quality(webp)
  ffmpeg -y -loglevel error -ss "$2" -i "$1" -frames:v 1 \
    -vf "scale=$4:-2:flags=lanczos" -c:v libwebp -quality "$5" "$3"
}

case "$TASK" in
  chain)
    [ -n "$PREFIX" ] && [ -n "$VIDEO_URL" ] || { echo "missing inputs"; exit 1; }
    clip="$WORK/clip.mp4"
    curl -sSL --retry 3 -o "$clip" "$VIDEO_URL"
    dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$clip")
    echo "clip $PREFIX duration=$dur"

    # Final frame (full resolution JPEG) -> presigned upload for chaining.
    mkdir -p "$WORK/tail"
    ffmpeg -y -loglevel error -sseof -0.3 -i "$clip" -vsync 0 -q:v 1 "$WORK/tail/%04d.jpg"
    last=$(ls "$WORK/tail"/*.jpg | sort | tail -1)
    echo "last frame: $last ($(stat -c%s "$last") bytes)"
    if [ -n "$UPLOAD_URL" ]; then
      curl -sS -X PUT -H "Content-Type: image/jpeg" --data-binary @"$last" "$UPLOAD_URL"
      echo "uploaded last frame"
    fi

    # Small previews (first / 25% / 50% / 75% / last) for continuity review.
    out=".assets-src/previews/$PREFIX"
    mkdir -p "$out"
    for pct in 0 25 50 75; do
      t=$(python3 -c "print(max(0, float('$dur') * $pct / 100))")
      extract_frame "$clip" "$t" "$out/at${pct}.webp" 640 70
    done
    ffmpeg -y -loglevel error -i "$last" -vf "scale=640:-2" "$out/at100.webp"
    ;;

  finalize)
    [ -n "$VIDEO_URLS" ] && [ -n "$HERO_URL" ] || { echo "missing inputs"; exit 1; }

    # Download hero + clips.
    curl -sSL --retry 3 -o "$WORK/hero.png" "$HERO_URL"
    i=0
    list="$WORK/list.txt"; : > "$list"
    for u in $VIDEO_URLS; do
      i=$((i+1))
      curl -sSL --retry 3 -o "$WORK/clip$i.mp4" "$u"
      echo "file '$WORK/clip$i.mp4'" >> "$list"
    done
    echo "downloaded $i clips"

    # Stitch into one continuous source (re-encode for uniformity).
    stitched="$WORK/stitched.mp4"
    ffmpeg -y -loglevel error -f concat -safe 0 -i "$list" \
      -an -c:v libx264 -preset slow -crf 16 -pix_fmt yuv420p "$stitched"
    dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$stitched")
    echo "stitched duration=$dur"

    N=140
    fps=$(python3 -c "print($N / float('$dur'))")

    # Scroll-scrub frame sequence: WebP primary, JPEG fallback, 1280px wide.
    mkdir -p public/media/tour/webp public/media/tour/jpg public/media/tour/stills public/media/gallery
    ffmpeg -y -loglevel error -i "$stitched" \
      -vf "fps=$fps,scale=1280:-2:flags=lanczos" -frames:v $N -start_number 0 \
      -c:v libwebp -quality 68 public/media/tour/webp/%04d.webp
    ffmpeg -y -loglevel error -i "$stitched" \
      -vf "fps=$fps,scale=1280:-2:flags=lanczos" -frames:v $N -start_number 0 \
      -q:v 7 public/media/tour/jpg/%04d.jpg
    # If rounding produced fewer than N frames, duplicate the last one up to N.
    for dir_ext in "webp webp" "jpg jpg"; do
      set -- $dir_ext; d=$1; e=$2
      lastf=$(ls public/media/tour/$d/*.$e | sort | tail -1)
      count=$(ls public/media/tour/$d/*.$e | wc -l)
      j=$count
      while [ $j -lt $N ]; do
        cp "$lastf" "public/media/tour/$d/$(printf '%04d' $j).$e"
        j=$((j+1))
      done
    done
    echo "frames: $(ls public/media/tour/webp | wc -l) webp, $(ls public/media/tour/jpg | wc -l) jpg"

    # Low-res blurred placeholder (first frame).
    ffmpeg -y -loglevel error -i "$stitched" -frames:v 1 \
      -vf "scale=48:-2" -q:v 12 public/media/tour/placeholder.jpg

    # Section stills at the midpoint of each quarter (reduced-motion + mobile).
    names=(approach arrival flow terrace)
    for k in 0 1 2 3; do
      t=$(python3 -c "print(float('$dur') * (0.125 + 0.25 * $k))")
      extract_frame "$stitched" "$t" "public/media/tour/stills/${names[$k]}.webp" 1600 80
    done

    # Gallery: hero-derived cover + five frames along the tour.
    ffmpeg -y -loglevel error -i "$WORK/hero.png" \
      -vf "scale=1600:-2:flags=lanczos" -c:v libwebp -quality 80 public/media/gallery/01.webp
    g=2
    for pct in 18 34 52 68 90; do
      t=$(python3 -c "print(float('$dur') * $pct / 100)")
      extract_frame "$stitched" "$t" "public/media/gallery/0${g}.webp" 1600 80
      g=$((g+1))
    done

    # Hero image (full-bleed).
    ffmpeg -y -loglevel error -i "$WORK/hero.png" \
      -vf "scale=2560:-2:flags=lanczos" -c:v libwebp -quality 82 public/media/hero.webp

    # Mobile fallback: lightweight autoplay-muted-loop video.
    ffmpeg -y -loglevel error -i "$stitched" \
      -vf "scale=960:-2:flags=lanczos" -an -c:v libx264 -preset slow -crf 28 \
      -pix_fmt yuv420p -movflags +faststart public/media/tour/mobile-tour.mp4

    du -sh public/media/* public/media/tour/* | sort
    ;;

  *)
    echo "unknown task: $TASK"; exit 1 ;;
esac
