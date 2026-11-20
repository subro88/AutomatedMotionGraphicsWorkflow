---
name: openverse
description: Automated Creative Commons (CC0, PDM, CC-BY) stock media search, B-roll image ingestion, and royalty-free BGM sourcing using the WordPress Openverse API.
---

# WordPress Openverse Media Search & Commercial Asset Sourcing Engine

Adapted from **WordPress Openverse** ([github.com/WordPress/openverse](https://github.com/WordPress/openverse)), this skill connects the automated Remotion + DaVinci Resolve workstation to an open catalog of **800+ million Creative Commons and Public Domain digital assets**.

It automates the discovery, filtering, downloading, and cryptographic attribution of:
1. **Commercial-Safe B-Roll Stock Photography:** Filtered by aspect ratio (`wide` for 16:9 landscape, `tall` for 9:16 vertical reels) and licensed exclusively under `CC0`, `PDM`, or `CC-BY`.
2. **Royalty-Free Background Music (BGM):** Full-length ambient and rhythmic music tracks from Jamendo, Freesound, and Wikimedia Commons to populate `assets/bgm/`.
3. **Cryptographic Legal Attribution Ledger:** Automatically logs the creator, license URI, foreign source link, and SHA-256 media digest directly into Showtime-inspired production execution receipts.

---

## 1. Commercial Licensing Policy

The workstation strictly enforces the **Commercial-Safe** standard:

$$\text{Allowed Licenses} \in \{\text{cc0}, \text{pdm}, \text{by}\}$$

Any media carrying Non-Commercial (`nc`), Share-Alike copyleft (`sa`), or No-Derivatives (`nd`) restrictions are filtered out automatically at the API query level using `license_type=commercial`.

| License Key | Common Name | Commercial Use | Derivatives | Attribution Required |
|:---|:---|:---|:---|:---|
| `cc0` | Creative Commons Zero | ✅ Fully Allowed | ✅ Fully Allowed | ❌ Optional (Unencumbered) |
| `pdm` | Public Domain Mark | ✅ Fully Allowed | ✅ Fully Allowed | ❌ Optional (Expired / Govt) |
| `by` | CC Attribution 4.0 | ✅ Fully Allowed | ✅ Fully Allowed | ✅ Required in Receipt Ledger |
| `by-nc` | Non-Commercial | ❌ **FORBIDDEN** | ❌ Forbidden | N/A (Filtered out) |
| `by-nd` | No Derivatives | ❌ **FORBIDDEN** | ❌ Forbidden | N/A (Filtered out) |

---

## 2. API Endpoints & Query Geometry

- **Base URL:** `https://api.openverse.org/v1/`
- **Image Search:** `/images/?q={keywords}&license_type=commercial&aspect_ratio={wide|tall}&page_size=5`
- **Audio Search:** `/audio/?q={keywords}&license_type=commercial&page_size=5`

### Aspect Ratio Mapping
- **16:9 Landscape Video:** Queries use `aspect_ratio=wide` (returns horizontal plates > 1.2 aspect ratio).
- **9:16 Vertical Reels:** Queries use `aspect_ratio=tall` (returns vertical mobile plates < 0.8 aspect ratio).

---

## 3. DaVinci Resolve Fairlight 3-Stem Architecture

Integrating Openverse BGM completes the industry-standard 3-stem audio mix inside DaVinci Resolve:

```
Timeline Spine (FCPXML v1.10)
├── Track V1: Crucible 3D B-Roll Plates + Remotion Base
├── Track V2: Native DRFX Dynamic Titles (NHIT Admission Kit)
├── Track A1 (lane="-1"): Master Voiceover (-16.0 LUFS)
├── Track A2 (lane="-2"): Real SFX / Foley (-9 to -18 dBFS, -4dB speech ducked)
└── Track A3 (lane="-3"): Openverse BGM (-22 dBFS, -6dB speech ducked)
```

---

## 4. CLI Quick Reference

```powershell
# 1. Search and download commercial-safe images
python scripts/openverse_search.py --query "engineering laboratory" --type image --aspect wide --limit 3

# 2. Search and download background music track
python scripts/openverse_search.py --query "cinematic ambient synth" --type audio --limit 1

# 3. Batch-fetch B-Roll and BGM directly from storyboard.json
python scripts/openverse_search.py --storyboard src/data/storyboard.json

# 4. Trigger via unified pipeline runner
python .agent/skills/motion-pipeline/run.py --action fetch-media
```
