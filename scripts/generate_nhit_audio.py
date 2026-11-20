#!/usr/bin/env python3
"""
Generates the scene-accurate voiceover for NHIT Advertisement (30 seconds / 900 frames).
Uses Indian English Male narrator (en-IN-PrabhatNeural) with EBU R128 loudness mastering.
"""
import asyncio
import os
import subprocess
import sys
from pathlib import Path
import edge_tts

ROOT = Path(__file__).resolve().parent.parent
PUBLIC_DIR = ROOT / "public"
PUBLIC_DIR.mkdir(parents=True, exist_ok=True)

# Scene-by-scene script lines
SCENE_SCRIPTS = [
    ("Scene 1", "You have the experience. You have the skills. Now it's time to take your career to the next level.", 4.8),
    ("Scene 2", "Introducing The New Horizons Institute of Technology, Durgapur. Your opportunity to advance through technical education.", 5.0),
    ("Scene 3", "Choose your next step. Electrical Engineering or Mechanical Engineering. Two opportunities to build your technical future.", 5.0),
    ("Scene 4", "If you have the required academic qualification and at least one year of regular work experience, this opportunity could be for you.", 5.0),
    ("Scene 5", "With thirty approved seats each in Electrical and Mechanical Engineering, take your next step towards professional growth.", 4.8),
    ("Scene 6", "Don't stop at experience. Add a qualification to your skills. NHIT Durgapur. Your future starts with your next step.", 5.0)
]

VOICE = "en-IN-PrabhatNeural"

async def synthesize_all():
    print("🎙️ Synthesizing NHIT 30-second voiceover tracks...")
    scene_files = []
    
    for i, (name, text, max_dur) in enumerate(SCENE_SCRIPTS):
        temp_mp3 = PUBLIC_DIR / f"nhit_scene_{i+1}_temp.mp3"
        temp_wav = PUBLIC_DIR / f"nhit_scene_{i+1}.wav"
        
        # Slightly fast pacing to fit within 5s scene windows cleanly
        communicate = edge_tts.Communicate(text, VOICE, rate="+8%")
        await communicate.save(str(temp_mp3))
        
        # Convert and pad/trim to 5.0 seconds exactly with silence
        # FFmpeg filter: atempo=1.0, apad=whole_dur=5.0
        cmd = [
            "ffmpeg", "-y", "-i", str(temp_mp3),
            "-af", "silenceremove=start_periods=1:start_threshold=-50dB,apad=whole_dur=5.0",
            "-t", "5.0",
            "-ar", "44100", "-ac", "2",
            str(temp_wav)
        ]
        subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        if temp_mp3.exists():
            temp_mp3.unlink()
        scene_files.append(temp_wav)
        print(f"  ✓ {name}: 5.0s mastered audio")

    # Concatenate all 6 scenes into a single 30.0s master track
    concat_list = PUBLIC_DIR / "nhit_concat_list.txt"
    with open(concat_list, "w", encoding="utf-8") as f:
        for sf in scene_files:
            f.write(f"file '{sf.name}'\n")

    master_raw = PUBLIC_DIR / "nhit_master_raw.wav"
    cmd_cat = [
        "ffmpeg", "-y", "-f", "concat", "-safe", "0",
        "-i", str(concat_list),
        "-c", "copy",
        str(master_raw)
    ]
    subprocess.run(cmd_cat, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    # Master final loudness to EBU R128 (-16 LUFS)
    final_output = PUBLIC_DIR / "nhit_voiceover.wav"
    final_mp3 = PUBLIC_DIR / "nhit_voiceover.mp3"
    cmd_master = [
        "ffmpeg", "-y", "-i", str(master_raw),
        "-af", "loudnorm=I=-16:TP=-1.5:LRA=11",
        "-ar", "44100", "-ac", "2",
        str(final_output)
    ]
    subprocess.run(cmd_master, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    # Also make mp3 version for staticFile
    cmd_mp3 = [
        "ffmpeg", "-y", "-i", str(final_output),
        "-b:a", "192k",
        str(final_mp3)
    ]
    subprocess.run(cmd_mp3, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    # Cleanup temp files
    if concat_list.exists():
        concat_list.unlink()
    if master_raw.exists():
        master_raw.unlink()
    for sf in scene_files:
        if sf.exists():
            sf.unlink()

    print(f"\n✅ Master NHIT voiceover created: {final_output} (30.0s @ 44.1kHz EBU R128)")

if __name__ == "__main__":
    asyncio.run(synthesize_all())

