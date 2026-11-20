# 📜 Production Execution Receipt & Provenance Ledger
> **Receipt ID:** `RCPT-20261119-D47E9B`  
> **Generated:** `2026-11-19 20:01:12`  
> **Target Asset:** `NHIT_Infographic_Admission_16x9_sfx_master.mp4`  
> **Audit Status:** 🔴 FAIL

---

## 1. 🎯 Executive Production Summary
| Parameter | Value |
| :--- | :--- |
| **Institution** | The New Horizons Institute of Technology (NHIT), Durgapur |
| **Campaign** | Diploma Engineering for Working Professionals (2026–27) |
| **Intake Capacity** | 60 Approved Seats (30 Electrical + 30 Mechanical) |
| **Affiliation Memo** | `WBSCTVESD/TED/2026-27/AFF/DET/WP/0004` (Dated 06-Nov-2026) |
| **Render Engine** | Remotion v4.0.541 + DaVinci Resolve Studio + Crucible 3D |
| **Master Resolution** | `1920 × 1080` (16:9) |
| **Duration & FPS** | `84.69s` (2540 frames) @ `30.0 FPS` |
| **Output File Size** | `38.11 MB` |

---

## 2. 🛡️ QA Broadcast & Safe-Area Verification
| Checkpoint | Target / Tolerance | Measured Value | Result |
| :--- | :--- | :--- | :--- |
| **Integrated Loudness** | `-16.0 LUFS (±1.5 LUFS)` | `-24.2 LUFS` | 🔴 FAIL |
| **Maximum True Peak** | `≤ -1.0 dBTP` | `-10.0 dBTP` | 🟢 PASS |
| **Loudness Range (LRA)** | `≤ 14.0 LU` | `4.3 LU` | 🟢 PASS |
| **Action Safe Zone** | `90% Frame Geometry` | `5% Edge Margin Clear` | 🟢 PASS |
| **Title Safe Zone** | `80% Frame Geometry` | `10% Edge Margin Clear` | 🟢 PASS |
| **Social UI Clearance** | `Top 15% / Bottom 20% Clear` | `Feed Chrome Checked` | 🟢 PASS |

### ⚠️ QA Audit Advisories
- ⚠️ Loudness deviation: -24.2 LUFS vs -16.0 target
- ⚠️ High-contrast content detected in outermost 3% raster border



---

## 3. 🔐 Cryptographic Provenance Ledger
| Component | Identifier / File Path | SHA-256 Digest |
| :--- | :--- | :--- |
| **Master Video** | `NHIT_Infographic_Admission_16x9_sfx_master.mp4` | `12ad54afa160a05678f1794d93851e9c868bfe98bf41728f43eb06e7a55f0b0f` |
| **Input Audio Source** | `audio.mp3` | `c2026a5d4e2cf1d4f75ec103ab5ee11ccc4707f129d4814d2769b113de1de9d2` |
| **Real SFX Audio Stem** | `master_sfx.wav (6 cues, peak -12.04 dBFS)` | `c265fd05dd9986694d42219d01d0522b5990d40ad098f4408b373e27173a8983` |
| **Git Commit Reference** | `commit LOCAL_WORKSPACE` (`main`) | `LOCAL_WORKSPACE_NO_GIT` |

---

## 4. 🎨 Design System & Visual Assets
- **Color Identity:**
  - `Primary Background:` Deep Engineering Navy (`#071B33`)
  - `Secondary Brand:` Electric Blue (`#087EFF`)
  - `Accent Highlight:` Industrial Orange (`#FF9D32`)
  - `High-Contrast Text:` Pure White (`#FFFFFF`)
- **Typography Matrix:**
  - `Headlines:` Montserrat ExtraBold (800)
  - `Body / Subtitles:` Inter Medium (500)
  - `Meta / Footers:` Inter Regular (400)
- **3D Synthetic Plates (Crucible Engine):**
  - Interlocking Mechanical Gears (`src/crucible_scenes/mechanical_gears.json`)
  - High-Voltage Substation Transformer (`src/crucible_scenes/electrical_transformer.json`)
  - Holographic Qualification Diploma Seal (`src/crucible_scenes/holographic_diploma.json`)
- **Native DaVinci Resolve Integration:**
  - Installed Fusion DRFX Pack: `NHIT_Admission_Kit.drfx`
  - Timeline Interchange: `out/resolve_exports/NHIT_Hybrid_3D_Resolve_Timeline.fcpxml`

---

## 5. 🌐 Openverse Creative Commons Attribution Ledger
> **Licensing Policy:** Commercial-Safe (Strictly CC0, PDM, CC-BY)

| Asset Role | Title / Work | Creator & License | Source Link | SHA-256 Digest |
| :--- | :--- | :--- | :--- | :--- |
| **IMAGE** (`scene_1_broll.jpg`) | 6 windows | [kevin dooley](https://www.flickr.com/photos/12836528@N00) ([BY](https://creativecommons.org/licenses/by/2.0/)) | [View Source](https://www.flickr.com/photos/12836528@N00/8603887892) | `151fe7f8eba857b6...` |
| **IMAGE** (`scene_2_broll.jpg`) | 6 windows | [kevin dooley](https://www.flickr.com/photos/12836528@N00) ([BY](https://creativecommons.org/licenses/by/2.0/)) | [View Source](https://www.flickr.com/photos/12836528@N00/8603887892) | `151fe7f8eba857b6...` |
| **IMAGE** (`scene_3_broll.jpg`) | 6 windows | [kevin dooley](https://www.flickr.com/photos/12836528@N00) ([BY](https://creativecommons.org/licenses/by/2.0/)) | [View Source](https://www.flickr.com/photos/12836528@N00/8603887892) | `151fe7f8eba857b6...` |
| **IMAGE** (`scene_4_broll.jpg`) | 6 windows | [kevin dooley](https://www.flickr.com/photos/12836528@N00) ([BY](https://creativecommons.org/licenses/by/2.0/)) | [View Source](https://www.flickr.com/photos/12836528@N00/8603887892) | `151fe7f8eba857b6...` |
| **AUDIO_BGM** (`master_bgm.mp3`) | scaryscape_voicestringcalling.wav | [suonho](https://freesound.org/people/suonho) ([BY](https://creativecommons.org/licenses/by/4.0/)) | [View Source](https://freesound.org/people/suonho/sounds/58962) | `362aa91663a0c0d2...` |

---

## 6. 🔬 Branch Education Hardware Teardown 3D Verification
> **Choreography:** Exploded 3D Assembly & Macro Silicon Zoom  
> **3D-to-2D Tracking Matrix:** Precision pinhole lookAt projection (14 discrete components tracked)  
> **Tracking Coordinates:** `out\tracking\screen_coords.json`  
> **DaVinci Resolve Spine:** `out/resolve_exports/Hardware_Teardown_Resolve_Timeline.fcpxml`  
> **Dual Engine:** Blender Headless Automation + Remotion Three.js WebGL Fallback Active

---

## 7. 💻 Host & Toolchain Provenance
- **Operating System:** `Windows-11-10.0.26300-SP0`
- **Python Runtime:** `3.12.10`
- **Node.js Runtime:** `v24.20.0`
- **Remotion Version:** `4.0.541` (Angle / Skia GPU pipeline)
- **FFmpeg Build:** `Gyan full-build v9.0.2 (libavutil 61.1.102)`

> *This receipt was cryptographically generated by the Motion Graphics Workstation automated QA system.*
