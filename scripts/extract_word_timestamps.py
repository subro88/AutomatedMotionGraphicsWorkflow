import os
import json
from pathlib import Path
from faster_whisper import WhisperModel

# Ensure FFmpeg is found on Windows
for extra_p in [
    r"C:\Users\User\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.2-full_build\bin",
    r"C:\Users\User\AppData\Local\Programs\Python\Python312\Scripts",
    r"C:\Users\User\AppData\Local\Programs\Python\Python312"
]:
    if os.path.exists(extra_p) and extra_p not in os.environ.get("PATH", ""):
        os.environ["PATH"] = extra_p + os.pathsep + os.environ.get("PATH", "")

KEYWORD_MAP = {
    "incremental": "#2685D9",
    "backup": "#F45B16",
    "backups": "#F45B16",
    "server": "#292524",
    "2008": "#F45B16",
    "windows": "#2685D9",
    "differential": "#F45B16",
    "full": "#10B981",
    "schedule": "#10B981",
    "faster": "#10B981",
    "performance": "#F45B16",
    "aomei": "#F45B16",
    "security": "#EF4444",
    "limitations": "#EF4444",
    "2tb": "#EF4444",
    "support": "#EF4444",
    "protect": "#10B981",
    "data": "#2685D9",
}

def clean_word(w: str) -> str:
    return w.strip().strip(".,!?:;\"'()[]{}").lower()

def extract_timestamps():
    audio_dir = Path("public/incremental_backup")
    output_json_path = audio_dir / "subtitles.json"
    src_json_path = Path("src/incremental_backup/subtitles.json")

    # Run on CPU with int8 quantization for ultra-fast, robust inference
    model = WhisperModel("tiny", device="cpu", compute_type="int8")

    all_scenes_data = {}

    for scene_num in range(1, 11):
        wav_path = audio_dir / f"scene{scene_num}.wav"
        if not wav_path.exists():
            print(f"Skipping missing {wav_path}")
            continue

        print(f"🎙️ Transcribing {wav_path.name}...")
        segments, info = model.transcribe(str(wav_path), word_timestamps=True, language="en")
        
        words = []
        for segment in segments:
            for w in segment.words:
                cleaned = clean_word(w.word)
                accent = KEYWORD_MAP.get(cleaned, None)
                words.append({
                    "word": w.word.strip(),
                    "start": round(w.start, 3),
                    "end": round(w.end, 3),
                    "startFrame": int(round(w.start * 30)),
                    "endFrame": int(round(w.end * 30)),
                    "isKeyword": accent is not None,
                    "accentColor": accent or "#18181B"
                })

        # Group words into 2-4 word punchy chunks
        chunks = []
        chunk_size = 3
        for i in range(0, len(words), chunk_size):
            group = words[i:i + chunk_size]
            chunks.append({
                "chunkIndex": len(chunks),
                "startFrame": group[0]["startFrame"],
                "endFrame": group[-1]["endFrame"],
                "text": " ".join([item["word"] for item in group]),
                "words": group
            })

        all_scenes_data[f"scene{scene_num}"] = {
            "scene": scene_num,
            "totalWords": len(words),
            "chunks": chunks,
            "rawWords": words
        }

    with open(output_json_path, "w", encoding="utf-8") as f:
        json.dump(all_scenes_data, f, indent=2)

    with open(src_json_path, "w", encoding="utf-8") as f:
        json.dump(all_scenes_data, f, indent=2)

    print(f"✅ Successfully wrote subtitles JSON to {output_json_path} and {src_json_path}")

if __name__ == "__main__":
    extract_timestamps()
