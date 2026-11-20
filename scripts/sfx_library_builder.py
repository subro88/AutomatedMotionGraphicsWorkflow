#!/usr/bin/env python3
"""
Procedural Studio SFX Library Builder (Clipwing Real-SFX Inspired).
Synthesizes studio-quality, broadcast-standard 48kHz WAV audio textures for all 15 storyboard SFX cues.
Uses pure Python standard library ('wave', 'struct') and 'numpy' with zero external audio packages.
"""
import math
import struct
import wave
from pathlib import Path
from typing import Dict, Tuple

import numpy as np

ROOT = Path(__file__).resolve().parents[1]
SFX_DIR = ROOT / "assets/sfx"

SAMPLE_RATE = 48000  # Broadcast standard 48kHz audio

def write_wav(path: Path, samples: np.ndarray, sample_rate: int = SAMPLE_RATE):
    """Writes a float numpy array (-1.0 to 1.0) to a 16-bit PCM stereo/mono WAV file."""
    path.parent.mkdir(parents=True, exist_ok=True)
    # Clip and convert to 16-bit PCM
    samples = np.clip(samples, -0.999, 0.999)
    int_samples = (samples * 32767.0).astype(np.int16)
    
    # Ensure stereo (2 channels)
    if int_samples.ndim == 1:
        stereo_samples = np.column_stack((int_samples, int_samples))
    else:
        stereo_samples = int_samples

    with wave.open(str(path), "wb") as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)  # 16-bit
        wf.setframerate(sample_rate)
        wf.writeframes(stereo_samples.tobytes())

# --- Procedural Synthesis Recipes ---

def synth_sub_boom_drop() -> np.ndarray:
    """Deep 40Hz resonant sub-bass drop with exponential decay (0.9s)."""
    duration = 0.9
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), endpoint=False)
    # Pitch drops from 85 Hz to 35 Hz
    freq = 85.0 * np.exp(-t * 2.8) + 35.0
    phase = 2.0 * np.pi * np.cumsum(freq) / SAMPLE_RATE
    body = np.sin(phase) + 0.3 * np.sin(2.0 * phase)
    # Saturation
    body = np.tanh(body * 1.5)
    # Envelope
    env = np.exp(-t * 4.2)
    return body * env * 0.85

def synth_logo_sub_boom() -> np.ndarray:
    """Punchy brand logo thud with subtle higher harmonic ring (0.7s)."""
    duration = 0.7
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), endpoint=False)
    freq = 110.0 * np.exp(-t * 4.0) + 45.0
    phase = 2.0 * np.pi * np.cumsum(freq) / SAMPLE_RATE
    body = np.sin(phase) + 0.4 * np.sin(2.0 * phase) + 0.15 * np.sin(3.0 * phase)
    env = np.exp(-t * 5.5)
    return np.tanh(body * env * 1.8) * 0.8

def synth_heavy_sub_impact() -> np.ndarray:
    """Cinema trailer impact: broadband noise burst + 45Hz sub punch (1.2s)."""
    duration = 1.2
    n_samples = int(SAMPLE_RATE * duration)
    t = np.linspace(0, duration, n_samples, endpoint=False)
    # Transient noise burst (first 15ms)
    noise = np.random.uniform(-1, 1, n_samples)
    noise_env = np.exp(-t * 80.0)
    transient = noise * noise_env * 0.7
    # Low punch
    freq = 95.0 * np.exp(-t * 3.5) + 38.0
    phase = 2.0 * np.pi * np.cumsum(freq) / SAMPLE_RATE
    sub = (np.sin(phase) + 0.35 * np.sin(2 * phase)) * np.exp(-t * 3.2)
    return (transient + sub * 0.8) * 0.9

def synth_snappy_pop() -> np.ndarray:
    """Clean UI bubble pop with rapid frequency drop (0.08s)."""
    duration = 0.08
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), endpoint=False)
    freq = 800.0 * np.exp(-t * 45.0) + 120.0
    phase = 2.0 * np.pi * np.cumsum(freq) / SAMPLE_RATE
    env = np.sin(np.pi * (t / duration) ** 0.5) * np.exp(-t * 30.0)
    return np.sin(phase) * env * 0.75

def synth_tactile_pop() -> np.ndarray:
    """Organic woody/membrane pop click (0.05s)."""
    duration = 0.05
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), endpoint=False)
    freq = 450.0 * np.exp(-t * 60.0) + 180.0
    phase = 2.0 * np.pi * np.cumsum(freq) / SAMPLE_RATE
    env = np.exp(-t * 70.0)
    return np.sin(phase) * env * 0.7

def synth_pop_snap() -> np.ndarray:
    """Crisp snare-like transient snap (0.09s)."""
    duration = 0.09
    n_samples = int(SAMPLE_RATE * duration)
    t = np.linspace(0, duration, n_samples, endpoint=False)
    click = np.random.uniform(-1, 1, n_samples) * np.exp(-t * 120.0)
    body = np.sin(2.0 * np.pi * 1400.0 * t) * np.exp(-t * 40.0)
    return (click * 0.6 + body * 0.4) * 0.75

def synth_whoosh_swipe() -> np.ndarray:
    """Dynamic air displacement swipe with stereo pan motion (0.45s)."""
    duration = 0.45
    n_samples = int(SAMPLE_RATE * duration)
    t = np.linspace(0, duration, n_samples, endpoint=False)
    noise = np.random.uniform(-1, 1, n_samples)
    # Bandpass center frequency sweeps 250 -> 2200 -> 350
    center_freq = 250.0 + 1950.0 * np.sin(np.pi * (t / duration)) ** 1.8
    # Fast pseudo-filtering via sinusoidal modulation
    mod = np.sin(2.0 * np.pi * np.cumsum(center_freq) / SAMPLE_RATE)
    env = np.sin(np.pi * (t / duration)) ** 2.2
    mono = noise * mod * env
    # Stereo panning from Left (-0.7) to Right (+0.7)
    pan = np.linspace(-0.7, 0.7, n_samples)
    left = mono * np.sqrt(0.5 * (1.0 - pan))
    right = mono * np.sqrt(0.5 * (1.0 + pan))
    return np.column_stack((left, right)) * 0.8

def synth_whoosh_heavy() -> np.ndarray:
    """Low-end heavy air displacement whoosh (0.75s)."""
    duration = 0.75
    n_samples = int(SAMPLE_RATE * duration)
    t = np.linspace(0, duration, n_samples, endpoint=False)
    noise = np.random.uniform(-1, 1, n_samples)
    center_freq = 150.0 + 950.0 * np.sin(np.pi * (t / duration)) ** 2.0
    mod = np.sin(2.0 * np.pi * np.cumsum(center_freq) / SAMPLE_RATE)
    sub = np.sin(2.0 * np.pi * (70.0 + 80.0 * np.sin(np.pi * t / duration)) * t)
    env = np.sin(np.pi * (t / duration)) ** 2.5
    return (noise * mod * 0.6 + sub * 0.4) * env * 0.85

def synth_fast_whoosh_swipe() -> np.ndarray:
    """Rapid 180ms transition whip swoosh."""
    duration = 0.18
    n_samples = int(SAMPLE_RATE * duration)
    t = np.linspace(0, duration, n_samples, endpoint=False)
    noise = np.random.uniform(-1, 1, n_samples)
    center_freq = 400.0 + 3500.0 * np.sin(np.pi * (t / duration))
    mod = np.sin(2.0 * np.pi * np.cumsum(center_freq) / SAMPLE_RATE)
    env = np.sin(np.pi * (t / duration)) ** 2.0
    return noise * mod * env * 0.8

def synth_circuit_relay_click() -> np.ndarray:
    """Dual-click industrial relay bounce: contact + mechanical latch (0.12s)."""
    duration = 0.12
    n_samples = int(SAMPLE_RATE * duration)
    t = np.linspace(0, duration, n_samples, endpoint=False)
    # First click at t=0
    click1 = np.sin(2.0 * np.pi * 3200.0 * t) * np.exp(-t * 90.0)
    # Second mechanical latch click at t=16ms
    t2 = np.maximum(0, t - 0.016)
    click2 = np.sin(2.0 * np.pi * 1800.0 * t2) * np.exp(-t2 * 75.0) * (t >= 0.016)
    # Metallic ringing body
    ring = np.sin(2.0 * np.pi * 5400.0 * t) * np.exp(-t * 35.0) * 0.25
    return (click1 * 0.5 + click2 * 0.6 + ring) * 0.7

def synth_gear_ratchet_swish() -> np.ndarray:
    """Crucible 3D mechanical gear ratchet clicks with metallic decay (0.28s)."""
    duration = 0.28
    n_samples = int(SAMPLE_RATE * duration)
    t = np.linspace(0, duration, n_samples, endpoint=False)
    total = np.zeros(n_samples)
    # 4 ratchet teeth clicks
    for idx, offset in enumerate([0.0, 0.045, 0.09, 0.135]):
        t_click = np.maximum(0, t - offset)
        click = np.sin(2.0 * np.pi * (2200.0 + idx * 250.0) * t_click) * np.exp(-t_click * 65.0)
        click *= (t >= offset)
        total += click * (1.0 - idx * 0.15)
    return total * 0.65

def synth_tick_shimmer() -> np.ndarray:
    """Quartz clock tick with high-frequency harmonic shimmer (0.15s)."""
    duration = 0.15
    n_samples = int(SAMPLE_RATE * duration)
    t = np.linspace(0, duration, n_samples, endpoint=False)
    tick = np.random.uniform(-1, 1, n_samples) * np.exp(-t * 150.0)
    shimmer = (np.sin(2.0 * np.pi * 4800.0 * t) + 0.5 * np.sin(2.0 * np.pi * 9600.0 * t)) * np.exp(-t * 30.0)
    return (tick * 0.4 + shimmer * 0.6) * 0.65

def synth_metric_tick_shimmer() -> np.ndarray:
    """Cascading 3-burst rolling data metric tick (0.18s)."""
    duration = 0.18
    n_samples = int(SAMPLE_RATE * duration)
    t = np.linspace(0, duration, n_samples, endpoint=False)
    total = np.zeros(n_samples)
    for idx, offset in enumerate([0.0, 0.035, 0.070]):
        t_sub = np.maximum(0, t - offset)
        tick = np.sin(2.0 * np.pi * (3500.0 + idx * 600.0) * t_sub) * np.exp(-t_sub * 80.0) * (t >= offset)
        total += tick
    return total * 0.6

def synth_dock_open_chime() -> np.ndarray:
    """Glass dock opening: sweet pentatonic chime chord (0.65s)."""
    duration = 0.65
    n_samples = int(SAMPLE_RATE * duration)
    t = np.linspace(0, duration, n_samples, endpoint=False)
    # C major 9 chord partials: E5 (659Hz), G5 (784Hz), B5 (988Hz), D6 (1175Hz)
    chime = (
        0.40 * np.sin(2.0 * np.pi * 659.25 * t) * np.exp(-t * 4.5) +
        0.35 * np.sin(2.0 * np.pi * 783.99 * t) * np.exp(-t * 5.0) +
        0.30 * np.sin(2.0 * np.pi * 987.77 * t) * np.exp(-t * 5.5) +
        0.25 * np.sin(2.0 * np.pi * 1174.66 * t) * np.exp(-t * 6.0)
    )
    return chime * 0.75

def synth_airy_riser() -> np.ndarray:
    """Smooth 1.1s rising pitch/tension swell leading to climax."""
    duration = 1.1
    n_samples = int(SAMPLE_RATE * duration)
    t = np.linspace(0, duration, n_samples, endpoint=False)
    # Exponential rising tone from 180 Hz to 1400 Hz
    freq = 180.0 * np.exp(t * 1.85)
    phase = 2.0 * np.pi * np.cumsum(freq) / SAMPLE_RATE
    tone = np.sin(phase)
    # Air noise layer
    noise = np.random.uniform(-1, 1, n_samples)
    mod = np.sin(2.0 * np.pi * np.cumsum(freq * 1.5) / SAMPLE_RATE)
    air = noise * mod * 0.35
    # Swell crescendo envelope
    env = (t / duration) ** 2.2
    return (tone * 0.65 + air) * env * 0.8

# --- Branch Education Hardware Teardown Foley Recipes ---

def synth_metallic_unlatch() -> np.ndarray:
    """Crisp high-frequency chassis latch/clip release with metallic ping (0.35s)."""
    duration = 0.35
    n_samples = int(SAMPLE_RATE * duration)
    t = np.linspace(0, duration, n_samples, endpoint=False)
    # Dual metallic resonant ring: 2450Hz & 4120Hz
    ping = (
        0.55 * np.sin(2.0 * np.pi * 2450.0 * t) * np.exp(-t * 22.0) +
        0.35 * np.sin(2.0 * np.pi * 4120.0 * t) * np.exp(-t * 30.0)
    )
    # Mechanical snap transient (5ms)
    snap = np.random.uniform(-1, 1, n_samples) * np.exp(-t * 140.0) * 0.45
    return (ping + snap) * 0.75

def synth_glass_lift() -> np.ndarray:
    """Resonant glass suction and adhesive detaching tension release (0.45s)."""
    duration = 0.45
    n_samples = int(SAMPLE_RATE * duration)
    t = np.linspace(0, duration, n_samples, endpoint=False)
    # Low suction release pop (140Hz sliding down to 60Hz)
    freq_pop = 140.0 * np.exp(-t * 12.0) + 60.0
    phase_pop = 2.0 * np.pi * np.cumsum(freq_pop) / SAMPLE_RATE
    pop = np.sin(phase_pop) * np.exp(-t * 18.0) * 0.7
    # High glass resonance shimmer (1850Hz)
    shimmer = np.sin(2.0 * np.pi * 1850.0 * t) * np.exp(-t * 9.0) * 0.35
    return (pop + shimmer) * 0.8

def synth_silicon_macro_riser() -> np.ndarray:
    """Sweeping pitch-shifted microchip macro zoom riser with digital harmonics (0.85s)."""
    duration = 0.85
    n_samples = int(SAMPLE_RATE * duration)
    t = np.linspace(0, duration, n_samples, endpoint=False)
    # Pitch sweep from 380Hz to 2400Hz
    freq = 380.0 * np.exp(t * 2.2)
    phase = 2.0 * np.pi * np.cumsum(freq) / SAMPLE_RATE
    carrier = np.sin(phase) + 0.25 * np.sin(2.0 * phase)
    # Subtle amplitude modulation simulating scanning radar
    am = 0.5 * (1.0 + np.sin(2.0 * np.pi * 28.0 * t))
    env = (t / duration) ** 1.8
    return carrier * am * env * 0.7

def synth_data_packet_pulse() -> np.ndarray:
    """High-tech electromagnetic data chatter / micro-packet pulse sequence (0.4s)."""
    duration = 0.4
    n_samples = int(SAMPLE_RATE * duration)
    t = np.linspace(0, duration, n_samples, endpoint=False)
    # 6 rapid micro pulses
    pulses = np.zeros(n_samples)
    pulse_times = [0.03, 0.08, 0.14, 0.21, 0.27, 0.33]
    freqs = [1400.0, 1850.0, 2200.0, 2600.0, 3100.0, 3800.0]
    for pt, pf in zip(pulse_times, freqs):
        idx = int(pt * SAMPLE_RATE)
        p_len = min(int(0.025 * SAMPLE_RATE), n_samples - idx)
        if p_len > 0:
            tp = np.linspace(0, 0.025, p_len, endpoint=False)
            pulses[idx : idx + p_len] += np.sin(2.0 * np.pi * pf * tp) * np.exp(-tp * 160.0)
    return pulses * 0.65

# Registry of generators
SYNTH_RECIPES: Dict[str, any] = {
    "sub_boom_drop": synth_sub_boom_drop,
    "logo_sub_boom": synth_logo_sub_boom,
    "heavy_sub_impact": synth_heavy_sub_impact,
    "snappy_pop": synth_snappy_pop,
    "tactile_pop": synth_tactile_pop,
    "pop_snap": synth_pop_snap,
    "whoosh_swipe": synth_whoosh_swipe,
    "whoosh_heavy": synth_whoosh_heavy,
    "fast_whoosh_swipe": synth_fast_whoosh_swipe,
    "circuit_relay_click": synth_circuit_relay_click,
    "gear_ratchet_swish": synth_gear_ratchet_swish,
    "tick_shimmer": synth_tick_shimmer,
    "metric_tick_shimmer": synth_metric_tick_shimmer,
    "dock_open_chime": synth_dock_open_chime,
    "airy_riser": synth_airy_riser,
    "metallic_unlatch": synth_metallic_unlatch,
    "glass_lift": synth_glass_lift,
    "silicon_macro_riser": synth_silicon_macro_riser,
    "data_packet_pulse": synth_data_packet_pulse,
}

def build_all_sfx(target_dir: Path = SFX_DIR) -> Dict[str, Path]:
    """Generates all 15 procedural sound effects and saves to target directory."""
    target_dir.mkdir(parents=True, exist_ok=True)
    results = {}
    print(f"🔊 [SFX Builder] Synthesizing {len(SYNTH_RECIPES)} studio-grade 48kHz audio assets in: {target_dir}")
    
    for name, func in SYNTH_RECIPES.items():
        out_file = target_dir / f"{name}.wav"
        samples = func()
        write_wav(out_file, samples, SAMPLE_RATE)
        size_kb = out_file.stat().st_size / 1024
        print(f"  ✓ {name:<22} -> {out_file.name:<25} ({size_kb:.1f} KB)")
        results[name] = out_file

    print(f"✨ [SFX Builder] Successfully generated {len(results)} sound effect assets.")
    return results

if __name__ == "__main__":
    build_all_sfx()
