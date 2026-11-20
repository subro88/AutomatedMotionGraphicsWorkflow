---
name: real-sfx
description: Automated frame-accurate sound effects designer, Foley synthesizer, and audio mixer for Remotion and DaVinci Resolve.
---

# Real SFX: Frame-Accurate Motion Sound Design Engine

Adapted from **Clipwing's Real SFX** ([Clipwing/skills/skills/real-sfx](https://github.com/Clipwing/skills/tree/edbefcbc3474869e6cc1e8a7ca583b0efd0dab7e/skills/real-sfx)), this skill automates sound design for kinetic motion graphics, UI animations, 3D spatial scenes, and promotional video master tracks.

Instead of generating synthetic artificial audio or requiring tedious manual keyframing in video editing software, `real-sfx` takes storyboard visual cues and exact frame timestamps, pulls acoustic recordings from a curated local library, applies intelligent sidechain speech ducking, and composites a broadcast-ready stereo SFX stem (`out/sfx/master_sfx.wav`) and auto-muxed master video.

---

## 1. Core Principles

1. **Acoustic Authenticity over Generative Hallucination:**
   Real physical impacts, air displacement whooshes, mechanical relay contacts, and organic UI pops deliver superior tactile punch compared to synthetic AI audio generators.
2. **Frame-Accurate Temporal Alignment:**
   Audio hits are anchored to the visual strike frame:
   $$t_{\text{hit}} = \frac{\text{startFrame} + \text{sfxFrameOffset}}{\text{FPS}}$$
   For high-velocity impacts, the transient peak is aligned within $\pm 0.5$ frames of visual contact.
3. **Speech Intelligibility First (Ducking & Normalization):**
   Sound effects must never overpower narration. Any sound effect triggering during active speech is automatically attenuated by $4\text{ dB}$ to preserve voice clarity.
4. **DaVinci Resolve Fairlight Stems:**
   Sound effects are exported as independent stems (`Track A2: SFX`) in addition to muxed master MP4s, allowing colorists and sound mixers full control over volume, panning, and reverb in DaVinci Resolve Fairlight.

---

## 2. Acoustic Categories & Cue Taxonomy

| Cue Archetype | Acoustic Family | Frequency Range | Peak dBFS | Target Visual Element |
|:---|:---|:---|:---|:---|
| `sub_boom_drop` | Cinematic Bass Impact | 35 Hz – 90 Hz | -10.0 dBFS | Cold open stings, major chapter breaks |
| `logo_sub_boom` | Resonant Thud | 45 Hz – 120 Hz | -11.0 dBFS | Final brand logo lockups, CTA landing |
| `heavy_sub_impact` | Trailer Shockwave | 30 Hz – 200 Hz | -9.0 dBFS | 3D object collisions, explosive transitions |
| `snappy_pop` | High-Tension UI Pop | 150 Hz – 1.2 kHz | -15.0 dBFS | Staccato card flips, bullet point reveals |
| `tactile_pop` | Organic Wood/Membrane | 180 Hz – 850 Hz | -16.0 dBFS | Tooltips, badge pops, interactive toggles |
| `pop_snap` | Crisp Snare Click | 300 Hz – 2.5 kHz | -14.0 dBFS | Stat badge scale bounces, milestone ticks |
| `whoosh_swipe` | Air Displacement | 200 Hz – 3.5 kHz | -14.0 dBFS | Scene slides, wipe transitions, pan sweeps |
| `whoosh_heavy` | Low-End Wind Rush | 100 Hz – 1.8 kHz | -12.0 dBFS | Massive 3D rotations, full-screen transitions |
| `fast_whoosh_swipe` | Rapid Dynamic Whip | 400 Hz – 5.0 kHz | -15.0 dBFS | Fast card trailing, camera whip transitions |
| `circuit_relay_click` | Industrial Mechanism | 800 Hz – 7.0 kHz | -16.0 dBFS | NHIT engineering graphics, circuit traces |
| `gear_ratchet_swish` | Metallic Ratchet | 600 Hz – 8.5 kHz | -15.0 dBFS | Crucible 3D mechanical gears rotating |
| `tick_shimmer` | Quartz Clock / Glass | 1.5 kHz – 12 kHz | -18.0 dBFS | Numeric counter rolls, throughput meters |
| `metric_tick_shimmer` | Rapid 3-Burst Tick | 2.0 kHz – 14 kHz | -17.0 dBFS | Rapid rolling data counter cascade |
| `dock_open_chime` | Pentatonic Glass Bell | 800 Hz – 4.5 kHz | -16.0 dBFS | Glass dock opening, feature card dock |
| `airy_riser` | Tension Sweep | 150 Hz – 6.0 kHz | -13.0 dBFS | Pre-climax crescendo, countdown riser |

---

## 3. Automated Ducking Mathematics

When voiceover narration is present, speech energy $E_{\text{voice}}(t)$ is analyzed via sliding RMS window ($50\text{ ms}$ hops):

$$\text{VoiceActive}(t) = \begin{cases} \text{True} & \text{if } E_{\text{voice}}(t) > \text{Threshold}_{\text{silence}} \\ \text{False} & \text{otherwise} \end{cases}$$

If $\text{VoiceActive}(t_{\text{hit}}) == \text{True}$:
$$\text{Gain}_{\text{effective}} = \text{Gain}_{\text{nominal}} \times 10^{-4.0 / 20} \approx 0.631 \times \text{Gain}_{\text{nominal}}$$

This guarantees a $4\text{ dB}$ dynamic headroom buffer preventing speech masking.

---

## 4. Workstation Architecture & Dataflow

```
src/data/storyboard.json ───┐
                            ▼
assets/sfx/*.wav  ──► scripts/sfx_designer.py ──► out/sfx/master_sfx.wav
                            ▲                                │
inputs/*_voicebox.wav ──────┘                                │
                                                             ▼
out/master/*.mp4 ──────────────────────────────────► out/master/*_sfx_master.mp4
                                                             │
scripts/generate_hybrid_3d_fcpxml.py ────────────────► DaVinci Resolve Track A2
```

---

## 5. CLI Quick Reference

```powershell
# 1. Synthesize procedural studio-grade SFX audio assets
python scripts/sfx_library_builder.py

# 2. Design and mix master SFX audio stem from storyboard cues
python scripts/sfx_designer.py --storyboard src/data/storyboard.json --fps 30

# 3. Mux SFX track with master video and voiceover
python scripts/sfx_designer.py --mux --video out/master/NHIT_Infographic_Admission_16x9.mp4

# 4. Run end-to-end via pipeline runner
python .agent/skills/motion-pipeline/run.py --action sfx
```
