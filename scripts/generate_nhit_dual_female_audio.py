#!/usr/bin/env python3
import asyncio
import os
import subprocess
from pathlib import Path
import edge_tts

VOICE = "en-IN-NeerjaExpressiveNeural"

SEGMENTS_RAW = [
    {
        "id": "s1",
        "title": "Scene 1: Experience & Skills Hook",
        "text": "You have the experience. You have the skills. Now it's time to take your career to the next level!",
        "ratio": 6.0 / 45.0
    },
    {
        "id": "s2",
        "title": "Scene 2: NHIT Durgapur Introduction",
        "text": "Introducing NHIT Durgapur – your opportunity to advance through technical education.",
        "ratio": 5.0 / 45.0
    },
    {
        "id": "s3",
        "title": "Scene 3: Diploma Engineering Branches",
        "text": "Choose your next step. Diploma in Electrical Engineering or Mechanical Engineering, specially offered under the Working Professionals category.",
        "ratio": 7.0 / 45.0
    },
    {
        "id": "s4",
        "title": "Scene 4: Candidate Eligibility",
        "text": "Are you eligible? If you have the required academic qualification along with a minimum of one year of full-time work experience, this opportunity could be for you.",
        "ratio": 7.0 / 45.0
    },
    {
        "id": "s5",
        "title": "Scene 5: AICTE & Council Affiliation",
        "text": "We are Affiliated to the West Bengal State Council of Technical and Vocational Education and Skill Development and Approved by AICTE for the academic session 2026–27.",
        "ratio": 7.0 / 45.0
    },
    {
        "id": "s6",
        "title": "Scene 6: Limited Seats & Urgency Callout",
        "text": "Don't stop at experience. Add a qualification to your skills. Hurry up we have limited seats capacity, NHIT brings you an opportunity to strengthen your technical qualifications.",
        "ratio": 6.5 / 45.0
    },
    {
        "id": "s7",
        "title": "Scene 7: Final Branding & Direct CTA",
        "text": "NHIT Durgapur – Shaping Engineers, Building Futures. Visit www dot n h i t dot in or contact NHIT at +91 98005 71423 for admission details. Your Experience. Your Next Qualification. Your Future.",
        "ratio": 6.5 / 45.0
    }
]

async def synth_text(text, voice, rate, out_file):
    try:
        communicate = edge_tts.Communicate(text, voice, rate=rate)
        await communicate.save(str(out_file))
    except Exception as e:
        print(f"Fallback to NeerjaStandard: {e}")
        communicate = edge_tts.Communicate(text, "en-IN-NeerjaNeural", rate=rate)
        await communicate.save(str(out_file))

def get_duration(file_path):
    cmd = [
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1", str(file_path)
    ]
    res = subprocess.run(cmd, stdout=subprocess.PIPE, text=True, check=True)
    return float(res.stdout.strip())

def fit_segment(in_file, target_dur, out_file):
    dur = get_duration(in_file)
    if dur < target_dur:
        pad_dur = target_dur - dur
        cmd = [
            "ffmpeg", "-y", "-i", str(in_file),
            "-af", f"apad=pad_dur={pad_dur:.3f}",
            "-t", f"{target_dur:.3f}",
            str(out_file)
        ]
    else:
        speed = dur / target_dur
        cmd = [
            "ffmpeg", "-y", "-i", str(in_file),
            "-filter:a", f"atempo={speed:.4f}",
            "-t", f"{target_dur:.3f}",
            str(out_file)
        ]
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

async def build_variant(variant_name, total_duration, rate_str, segment_durations, target_wav, target_mp3):
    tmp_dir = Path(f"inputs/temp_audio_{variant_name}")
    tmp_dir.mkdir(parents=True, exist_ok=True)
    
    padded_files = []
    print(f"\n--- Building {variant_name} ({total_duration:.1f}s) at rate {rate_str} ---")
    for i, seg in enumerate(SEGMENTS_RAW):
        t_dur = segment_durations[i]
        raw_mp3 = tmp_dir / f"seg_{i}_raw.mp3"
        fitted_wav = tmp_dir / f"seg_{i}_fitted.wav"
        print(f"[{i+1}/7] Synthesizing for {t_dur:.2f}s: {seg['text'][:38]}...")
        await synth_text(seg["text"], VOICE, rate_str, raw_mp3)
        fit_segment(raw_mp3, t_dur, fitted_wav)
        padded_files.append(fitted_wav)
        
    concat_list = tmp_dir / "concat_list.txt"
    with open(concat_list, "w", encoding="utf-8") as f:
        for p in padded_files:
            f.write(f"file '{p.resolve().as_posix()}'\n")
            
    raw_combined = tmp_dir / "raw_combined.wav"
    cmd_concat = [
        "ffmpeg", "-y", "-f", "concat", "-safe", "0",
        "-i", str(concat_list),
        "-c", "pcm_s16le", "-ar", "48000", str(raw_combined)
    ]
    subprocess.run(cmd_concat, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    print(f"Normalizing loudness to EBU R128 (-16 LUFS) -> {target_wav}...")
    cmd_norm = [
        "ffmpeg", "-y", "-i", str(raw_combined),
        "-af", "loudnorm=I=-16:TP=-1.5:LRA=11",
        "-ar", "48000", "-c:a", "pcm_s16le", str(target_wav)
    ]
    subprocess.run(cmd_norm, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    cmd_mp3 = [
        "ffmpeg", "-y", "-i", str(target_wav),
        "-b:a", "192k", str(target_mp3)
    ]
    subprocess.run(cmd_mp3, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    final_dur = get_duration(target_wav)
    print(f"✔ Completed {variant_name}: {target_wav} ({final_dur:.3f}s)")

async def main():
    # Variant 1: 45.0s (1350 frames @ 30 FPS)
    # Segment allocation: 6.0s, 5.0s, 7.0s, 7.0s, 7.0s, 6.5s, 6.5s = 45.0s
    durs_45 = [6.0, 5.0, 7.0, 7.0, 7.0, 6.5, 6.5]
    await build_variant(
        variant_name="variant_1_45s",
        total_duration=45.0,
        rate_str="+24%",
        segment_durations=durs_45,
        target_wav=Path("public/nhit_female_45s.wav"),
        target_mp3=Path("public/nhit_female_45s.mp3")
    )

    # Variant 2: 70.0s (2100 frames @ 30 FPS)
    # Segment allocation based on natural relaxed speaking pace:
    # 7.5s, 5.5s, 9.5s, 10.0s, 11.5s, 11.0s, 15.0s = 70.0s
    durs_70 = [7.5, 5.5, 9.5, 10.0, 11.5, 11.0, 15.0]
    await build_variant(
        variant_name="variant_2_70s",
        total_duration=70.0,
        rate_str="+10%",
        segment_durations=durs_70,
        target_wav=Path("public/nhit_female_70s.wav"),
        target_mp3=Path("public/nhit_female_70s.mp3")
    )

if __name__ == "__main__":
    asyncio.run(main())

