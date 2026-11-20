---
name: multi-genre-router
description: Universal Multi-Genre Production Video Router. Dynamically directs projects to 4 specialized broadcast-grade engines (Motion Graphics, 3D Realistic Branch Education, Documentary/History, and Podcasts).
---

# 🎬 Multi-Genre Production Video Router

This skill unifies the workstation's rendering capabilities, routing video projects to **4 specialized, broadcast-grade production pipelines** based on creative genre and technical requirements:

1. **`motion-graphics`** *(Ads, Corporate Flyers, Concept Explainers, Vox, Infographics)*
   - **Engine:** Remotion + GSAP 3 Physics + Anime.js + DaVinci Resolve Fusion DRFX.
   - **Quality Features:** Custom spring inertia curves ($\zeta = 0.72$), 2-3% paper/film grain overlay, dynamic Bezier charts, and Vox-style territory maps.
2. **`3d-realistic`** *(Branch Education Hardware Teardowns)*
   - **Engine:** Headless Blender 4.2 Cycles GPU + Multi-Pass OpenEXR + Remotion Vector HUD.
   - **Quality Features:** 100mm optical macro lens ($f/3.5$ DoF), thin-film silicon iridescence, translucent FR4 substrate, dynamic boolean FinFET slicing, and non-destructive `.blend` timeline project.
3. **`documentary`** *(Vox Borders, Johnny Harris, Kurzgesagt, History)*
   - **Engine:** 2.5D Parallax & Vector Storyteller (`src/DocumentaryHistoryScene.tsx`).
   - **Quality Features:** Ken Burns 2.0 depth-separated photo pushes, yellow highlighter sweeps on vintage newspapers, red ink stamps, dynamic route maps, and Kurzgesagt vector puppets.
4. **`podcast`** *(Video Podcasts, Vodcasts, Audiograms)*
   - **Engine:** Intelligent Multi-Speaker Podcast Suite (`src/PodcastStudioScene.tsx`).
   - **Quality Features:** Speaker diarization layout switching (Host/Guest/Split), 60-band reactive FFT audio spectrum waveforms, and bouncing word-level subtitles.

---

## CLI Usage

```powershell
# 1. Route to Motion Graphics (2D Ads & Infographics)
python .agent/skills/motion-pipeline/run.py --genre motion-graphics --project "MyAd" --aspect 16:9

# 2. Route to 3D Realistic Explainer (Branch Education Teardown)
python .agent/skills/motion-pipeline/run.py --genre 3d-realistic --project "SmartphoneTeardown" --aspect 16:9

# 3. Route to Documentary, History & Cartoon Animation (Vox / Kurzgesagt)
python .agent/skills/motion-pipeline/run.py --genre documentary --project "HistoricalReport" --aspect 16:9

# 4. Route to Podcast, Vodcast & Audiograms
python .agent/skills/motion-pipeline/run.py --genre podcast --project "Episode42" --audio "inputs/podcast_audio.wav"

# 5. Direct Router Execution with Full Video Render
python scripts/video_engine_router.py --genre documentary --project "HistoryReel" --render
```
