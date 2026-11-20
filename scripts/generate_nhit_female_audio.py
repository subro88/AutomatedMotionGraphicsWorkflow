#!/usr/bin/env python3
import asyncio
import os
import subprocess
from pathlib import Path
import edge_tts

VOICE = "en-IN-NeerjaExpressiveNeural"
# Fallback if Expressive not supported in certain regions: en-IN-NeerjaNeural

SEGMENTS = [
    {
        "id": "s1",
        "text": "You have the experience. You have the skills. Now it's time to take your career to the next level!",
        "target_dur": 6.0,
        "rate": "+0%"
    },
    {
        "id": "s2",
        "text": "Introducing NHIT Durgapur – your opportunity to advance through technical education.",
        "target_dur": 6.0,
        "rate": "+0%"
    },
    {
        "id": "s3",
        "text": "Choose your next step. Diploma in Electrical Engineering or Mechanical Engineering, specially offered under the Working Professionals category.",
        "target_dur": 7.0,
        "rate": "+5%"
    },
    {
        "id": "s4",
        "text": "Are you eligible? If you have the required academic qualification along with a minimum of one year of full-time work experience, this opportunity could be for you.",
        "target_dur": 7.0,
        "rate": "+4%"
    },
    {
        "id": "s5",
        "text": "We are Affiliated to the West Bengal State Council of Technical and Vocational Education and Skill Development and Approved by AICTE for the academic session 2026–27.",
        "target_dur": 7.0,
        "rate": "+8%"
    },
    {
        "id": "s6",
        "text": "Don't stop at experience. Add a qualification to your skills. Hurry up we have limited seats capacity, NHIT brings you an opportunity to strengthen your technical qualifications.",
        "target_dur": 6.0,
        "rate": "+8%"
    },
    {
        "id": "s7",
        "text": "NHIT Durgapur – Shaping Engineers, Building Futures. Visit www dot n h i t dot in or contact NHIT at +91 98005 71423 for admission details. Your Experience. Your Next Qualification. Your Future.",
        "target_dur": 6.0,
        "rate": "+10%"
    }
]

async def synth_segment(text, voice, rate, out_file):
    try:
        communicate = edge_tts.Communicate(text, voice, rate=rate)
        await communicate.save(str(out_file))
    except Exception as e:
        print(f"Expressive failed, trying standard Neerja: {e}")
        communicate = edge_tts.Communicate(text, "en-IN-NeerjaNeural", rate=rate)
        await communicate.save(str(out_file))

def get_duration(file_path):
    cmd = [
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1", str(file_path)
    ]
    res = subprocess.run(cmd, stdout=subprocess.PIPE, text=True, check=True)
    return float(res.stdout.strip())

def pad_or_trim(in_file, target_dur, out_file):
    dur = get_duration(in_file)
    print(f"Segment raw duration: {dur:.2f}s (Target: {target_dur:.2f}s)")
    if dur < target_dur:
        pad_dur = target_dur - dur
        # Pad with silence at the end
        cmd = [
            "ffmpeg", "-y", "-i", str(in_file),
            "-af", f"apad=pad_dur={pad_dur:.3f}",
            "-t", f"{target_dur:.3f}",
            str(out_file)
        ]
    else:
        # Speed adjust slightly to fit exact target duration without cutting off
        speed = dur / target_dur
        cmd = [
            "ffmpeg", "-y", "-i", str(in_file),
            "-filter:a", f"atempo={speed:.4f}",
            "-t", f"{target_dur:.3f}",
            str(out_file)
        ]
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

async def main():
    tmp_dir = Path("inputs/temp_audio_nhit_female")
    tmp_dir.mkdir(parents=True, exist_ok=True)
    
    padded_files = []
    for i, seg in enumerate(SEGMENTS):
        raw_mp3 = tmp_dir / f"seg_{i}_raw.mp3"
        padded_wav = tmp_dir / f"seg_{i}_padded.wav"
        print(f"Synthesizing Segment {i+1}: {seg['text'][:40]}...")
        await synth_segment(seg["text"], VOICE, seg["rate"], raw_mp3)
        pad_or_trim(raw_mp3, seg["target_dur"], padded_wav)
        padded_files.append(padded_wav)
        
    concat_list = tmp_dir / "concat_list.txt"
    with open(concat_list, "w", encoding="utf-8") as f:
        for p in padded_files:
            f.write(f"file '{p.resolve().as_posix()}'\n")
            
    combined_wav = Path("public/nhit_female_voiceover_raw.wav")
    cmd_concat = [
        "ffmpeg", "-y", "-f", "concat", "-safe", "0",
        "-i", str(concat_list),
        "-c", "pcm_s16le", "-ar", "48000", str(combined_wav)
    ]
    subprocess.run(cmd_concat, check=True)
    
    master_wav = Path("public/nhit_female_voiceover.wav")
    master_mp3 = Path("public/nhit_female_voiceover.mp3")
    
    print("Applying EBU R128 loudness normalization (-16 LUFS)...")
    cmd_norm = [
        "ffmpeg", "-y", "-i", str(combined_wav),
        "-af", "loudnorm=I=-16:TP=-1.5:LRA=11",
        "-ar", "48000", "-c:a", "pcm_s16le", str(master_wav)
    ]
    subprocess.run(cmd_norm, check=True)
    
    cmd_mp3 = [
        "ffmpeg", "-y", "-i", str(master_wav),
        "-b:a", "192k", str(master_mp3)
    ]
    subprocess.run(cmd_mp3, check=True)
    
    final_dur = get_duration(master_wav)
    print(f"✔ Final Master Audio Generated: {master_wav} ({final_dur:.4f}s)")
    print(f"✔ Web Preview MP3 Generated: {master_mp3}")

if __name__ == "__main__":
    asyncio.run(main())

