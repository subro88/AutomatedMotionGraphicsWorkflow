#!/usr/bin/env python3
import argparse
import os
import shutil
import subprocess
from pathlib import Path
from faster_whisper import WhisperModel

# Ensure FFmpeg is found on Windows even if shell environment is stale
for extra_p in [
    r"C:\Users\User\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.2-full_build\bin",
    r"C:\Users\User\AppData\Local\Programs\Python\Python312\Scripts",
    r"C:\Users\User\AppData\Local\Programs\Python\Python312"
]:
    if os.path.exists(extra_p) and extra_p not in os.environ.get("PATH", ""):
        os.environ["PATH"] = extra_p + os.pathsep + os.environ.get("PATH", "")

CANVAS_WIDTH = 1080
CANVAS_HEIGHT = 1920
FONT_NAME = "Nirmala UI"
FONT_SIZE = 76
COLOR_WHITE = "&H00FFFFFF"
COLOR_CYAN_ACTIVE = "&H00FEF200"
COLOR_BLACK_OUTLINE = "&H00000000"
COLOR_DROP_SHADOW = "&H80000000"

def format_ass_timestamp(seconds: float) -> str:
    hrs = int(seconds // 3600)
    mins = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    centis = int(round((seconds - int(seconds)) * 100))
    if centis >= 100:
        secs += 1
        centis = 0
    return f"{hrs}:{mins:02d}:{secs:02d}.{centis:02d}"

def generate_ass_karaoke(audio_path: Path, output_ass: Path, model_size: str = "small", words_per_group: int = 3, language: str = "auto") -> bool:
    # Prefer pre-downloaded local model if present
    model_target = model_size
    if Path("models/whisper-small/model.bin").exists():
        model_target = str(Path("models/whisper-small").resolve())
    elif Path("models/whisper-tiny/model.bin").exists():
        model_target = str(Path("models/whisper-tiny").resolve())

    try:
        model = WhisperModel(model_target, device="cuda", compute_type="float16")
    except Exception as e:
        print(f"CUDA Whisper init failed ({e}), falling back to CPU...")
        try:
            model = WhisperModel(model_target, device="cpu", compute_type="int8")
        except Exception as e2:
            print(f"CPU Whisper fallback error ({e2}), falling back to default model...")
            model = WhisperModel("tiny", device="cpu", compute_type="int8")

    try:
        lang_arg = None if language in ["auto", "", None] else language
        segments, info = model.transcribe(str(audio_path), word_timestamps=True, language=lang_arg)
        print(f"🎙️ [Faster-Whisper] Detected Language: {info.language} (Probability: {round(info.language_probability, 2)})")
        all_words = []
        for segment in segments:
            for word in segment.words:
                clean = word.word.strip()
                if clean:
                    # Uppercase English words for punchy kinetic look; preserve Unicode for Bengali/Hindi
                    display_word = clean.upper() if clean.isascii() else clean
                    all_words.append({"word": display_word, "start": word.start, "end": word.end})
    except Exception as e:
        print(f"Transcription warning: {e}")
        all_words = []

    if not all_words:
        all_words = [
            {"word": "KINETIC", "start": 0.5, "end": 1.5},
            {"word": "AUDIO", "start": 1.5, "end": 2.5},
            {"word": "TRACK", "start": 2.5, "end": 3.5}
        ]

    word_groups = [all_words[i : i + words_per_group] for i in range(0, len(all_words), words_per_group)]
    ass_header = f"""[Script Info]
ScriptType: v4.00+
PlayResX: {CANVAS_WIDTH}
PlayResY: {CANVAS_HEIGHT}
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: BounceShorts,{FONT_NAME},{FONT_SIZE},{COLOR_WHITE},{COLOR_BLACK_OUTLINE},{COLOR_BLACK_OUTLINE},{COLOR_DROP_SHADOW},-1,0,0,0,100,100,2,0,1,6,2,5,80,80,960,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    events = []
    bounce_transform = r"{\fscx0\fscy0\t(0,80,\fscx125\fscy125)\t(80,170,\fscx100\fscy100)}"

    for group in word_groups:
        for target_idx, active_word in enumerate(group):
            w_start = format_ass_timestamp(active_word["start"])
            w_end = format_ass_timestamp(active_word["end"])
            line_parts = []
            for idx, w in enumerate(group):
                if idx == target_idx:
                    tag = r"{\c" + COLOR_CYAN_ACTIVE + r"\fscx110\fscy110}" + w["word"] + r"{\rBounceShorts}"
                    line_parts.append(tag)
                else:
                    line_parts.append(r"{\c" + COLOR_WHITE + r"}" + w["word"])

            dialogue = (bounce_transform + " " + " ".join(line_parts)) if target_idx == 0 else " ".join(line_parts)
            events.append(f"Dialogue: 0,{w_start},{w_end},BounceShorts,,0,0,0,,{dialogue}")

    output_ass.write_text(ass_header + "\n".join(events), encoding="utf-8")
    return True

def process_video_subtitles(video_file: Path, model_size: str = "small", language: str = "auto") -> Path:
    scratch_wav = video_file.parent / f"temp_{video_file.stem}.wav"
    ass_file = video_file.parent / f"{video_file.stem}_karaoke.ass"
    out_video = video_file.parent / f"{video_file.stem}_subtitled.mp4"

    try:
        subprocess.run(["ffmpeg", "-y", "-i", str(video_file), "-vn", "-ac", "1", "-ar", "16000", "-c:a", "pcm_s16le", str(scratch_wav)], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        if generate_ass_karaoke(scratch_wav, ass_file, model_size=model_size, language=language):
            escaped_ass = ass_file.resolve().as_posix().replace(":", r"\:")
            try:
                cmd = [
                    "ffmpeg", "-y", "-i", str(video_file),
                    "-vf", f"ass='{escaped_ass}'",
                    "-c:v", "h264_nvenc", "-preset", "p6", "-cq", "18",
                    "-pix_fmt", "yuv420p", "-c:a", "copy",
                    "-movflags", "+faststart", str(out_video)
                ]
                subprocess.run(cmd, check=True)
            except subprocess.CalledProcessError:
                cmd = [
                    "ffmpeg", "-y", "-i", str(video_file),
                    "-vf", f"ass='{escaped_ass}'",
                    "-c:v", "libx264", "-preset", "fast", "-crf", "18",
                    "-pix_fmt", "yuv420p", "-c:a", "copy",
                    "-movflags", "+faststart", str(out_video)
                ]
                subprocess.run(cmd, check=True)
        else:
            shutil.copy2(video_file, out_video)
    finally:
        if scratch_wav.exists():
            scratch_wav.unlink()
        if ass_file.exists():
            ass_file.unlink()

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--video", required=True)
    parser.add_argument("--model", default="small")
    parser.add_argument("--language", default="auto", help="Spoken language: auto, en, bn, hi, etc.")
    args = parser.parse_args()
    process_video_subtitles(Path(args.video), model_size=args.model, language=args.language)
