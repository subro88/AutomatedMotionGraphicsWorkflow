#!/usr/bin/env python3
"""
Generates a multi-track DaVinci Resolve FCPXML project integrating:
  - Track V1: Crucible 3D B-Roll Plates (Mechanical Gears, Electrical Transformer, Holographic Diploma)
  - Track V2: Remotion 2D Infographic Overlay Master
  - Track V3: Native DRFX Titles (NHIT Admission Kit)
  - Track A1: ElevenLabs Master Audio
"""

import os
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "out/resolve_exports"
OUT_DIR.mkdir(parents=True, exist_ok=True)

def generate_hybrid_timeline():
    video_master = ROOT / "out/master/NHIT_Infographic_Admission_16x9.mp4"
    audio_master = ROOT / "public/nhit_elevenlabs_audio.wav"
    sfx_master = ROOT / "out/sfx/master_sfx.wav"
    bgm_candidates = list((ROOT / "assets/bgm").glob("master_bgm.*"))
    bgm_master = bgm_candidates[0] if bgm_candidates else (ROOT / "assets/bgm/master_bgm.mp3")
    output_xml = OUT_DIR / "NHIT_Hybrid_3D_Resolve_Timeline.fcpxml"

    fps = 30
    duration_frames = 2541  # 84.7s
    dur_str = f"{duration_frames}/{fps}s"
    frame_dur = f"1/{fps}s"

    fcpxml = ET.Element("fcpxml", version="1.10")
    resources = ET.SubElement(fcpxml, "resources")

    # Format
    ET.SubElement(
        resources, "format",
        id="r1",
        name="FFVideoFormat1080p30",
        frameDuration=frame_dur,
        width="1920",
        height="1080",
        colorSpace="1-1-1 (Rec. 709)"
    )

    # Master Video
    video_hud_candidates = [
        ROOT / "out/master/Hardware_Teardown_HUD_16x9.mov",
        ROOT / "out/master/Hardware_Teardown_HUD_16x9.mp4"
    ]
    video_hud = next((f for f in video_hud_candidates if f.exists()), None)

    if video_master.exists():
        ET.SubElement(
            resources, "asset",
            id="r2",
            name=video_master.name,
            src=video_master.resolve().as_uri(),
            start="0s",
            duration=dur_str,
            hasVideo="1",
            format="r1"
        )

    if video_hud:
        ET.SubElement(
            resources, "asset",
            id="r_hud",
            name=video_hud.name,
            src=video_hud.resolve().as_uri(),
            start="0s",
            duration=dur_str,
            hasVideo="1",
            format="r1"
        )

    # Voiceover Audio
    if audio_master.exists():
        ET.SubElement(
            resources, "asset",
            id="r3",
            name=audio_master.name,
            src=audio_master.resolve().as_uri(),
            start="0s",
            duration=dur_str,
            hasAudio="1"
        )

    # Real SFX Audio Stem
    if sfx_master.exists():
        ET.SubElement(
            resources, "asset",
            id="r4",
            name=sfx_master.name,
            src=sfx_master.resolve().as_uri(),
            start="0s",
            duration=dur_str,
            hasAudio="1"
        )

    # Openverse BGM Audio Track
    if bgm_master.exists():
        ET.SubElement(
            resources, "asset",
            id="r5",
            name=bgm_master.name,
            src=bgm_master.resolve().as_uri(),
            start="0s",
            duration=dur_str,
            hasAudio="1"
        )

    library = ET.SubElement(fcpxml, "library")
    event = ET.SubElement(library, "event", name="Crucible_3D_Productions")
    project = ET.SubElement(event, "project", name="NHIT_Admission_Hybrid_3D_Master")

    sequence = ET.SubElement(
        project, "sequence",
        format="r1",
        duration=dur_str,
        tcStart="0s",
        tcFormat="NDF"
    )

    spine = ET.SubElement(sequence, "spine")

    # Primary Video Track V1
    v1_clip = ET.SubElement(
        spine, "asset-clip",
        ref="r2",
        offset="0s",
        name="[V1 Remotion Base + Crucible 3D Plates]",
        start="0s",
        duration=dur_str,
        format="r1"
    )

    # Markers for 3D Scenes
    markers = [
      (0, "Scene 1: Holographic Diploma 3D Hook", "cyan"),
      (210, "Scene 2: NHIT Campus Intro", "blue"),
      (420, "Scene 3A: Electrical Transformer 3D B-Roll", "yellow"),
      (600, "Scene 3B: Mechanical Gears 3D B-Roll", "orange"),
      (780, "Scene 4: Candidate Eligibility Matrix", "blue"),
      (1320, "Scene 5: AICTE & Council Affiliation", "green"),
      (1755, "Scene 6: Limited Seats Urgency (60 Seats)", "magenta"),
      (1935, "Scene 7: Holographic Seal Final CTA Helpline", "cyan"),
    ]

    for sf, title, color in markers:
        ET.SubElement(
            v1_clip, "marker",
            start=f"{sf}/{fps}s",
            duration=frame_dur,
            value=f"[3D MARKER] {title}",
            color=color
        )

    # Track V2 Placeholder for DRFX Editable Titles (lane="1")
    ET.SubElement(
        v1_clip, "gap",
        name="[V2 Track for NHIT_Admission_Kit.drfx Titles]",
        offset="0s",
        duration=dur_str,
        lane="1"
    )

    # Track A1 Audio Voiceover
    if audio_master.exists():
        ET.SubElement(
            v1_clip, "asset-clip",
            ref="r3",
            offset="0s",
            name=f"[A1 Voiceover] {audio_master.name}",
            start="0s",
            duration=dur_str,
            lane="-1"
        )

    # Track A2 Real SFX Sound Design
    if sfx_master.exists():
        ET.SubElement(
            v1_clip, "asset-clip",
            ref="r4",
            offset="0s",
            name=f"[A2 Real SFX] {sfx_master.name}",
            start="0s",
            duration=dur_str,
            lane="-2"
        )

    # Track A3 Openverse Background Music
    if bgm_master.exists():
        ET.SubElement(
            v1_clip, "asset-clip",
            ref="r5",
            offset="0s",
            name=f"[A3 Openverse BGM] {bgm_master.name}",
            start="0s",
            duration=dur_str,
            lane="-3"
        )

    tree = ET.ElementTree(fcpxml)
    ET.indent(tree, space="  ", level=0)
    tree.write(str(output_xml), encoding="utf-8", xml_declaration=True)
    print(f"✔ DaVinci Resolve Hybrid FCPXML generated: {output_xml}")

def generate_teardown_timeline(fps: int = 30) -> Path:
    """Generates DaVinci Resolve FCPXML v1.10 for the Branch Education 3D Hardware Teardown."""
    video_master = ROOT / "out/master/Hardware_Teardown_16x9.mp4"
    if not video_master.exists():
        candidates = list((ROOT / "out/master").glob("*.mp4"))
        if candidates:
            video_master = candidates[0]
            
    audio_candidates = list((ROOT / "inputs").glob("*.wav")) + list((ROOT / "public").glob("*.wav"))
    audio_master = audio_candidates[0] if audio_candidates else (ROOT / "public/nhit_elevenlabs_audio.wav")
    sfx_master = ROOT / "out/sfx/hardware_teardown_sfx.wav"
    if not sfx_master.exists():
        sfx_master = ROOT / "out/sfx/master_sfx.wav"
        
    bgm_candidates = list((ROOT / "assets/bgm").glob("master_bgm.*"))
    bgm_master = bgm_candidates[0] if bgm_candidates else (ROOT / "assets/bgm/master_bgm.mp3")
    output_xml = OUT_DIR / "Hardware_Teardown_Resolve_Timeline.fcpxml"

    duration_frames = 900  # 30.0s
    dur_str = f"{duration_frames}/{fps}s"
    frame_dur = f"1/{fps}s"

    fcpxml = ET.Element("fcpxml", version="1.10")
    resources = ET.SubElement(fcpxml, "resources")

    ET.SubElement(
        resources, "format",
        id="r1",
        name="FFVideoFormat1080p30",
        frameDuration=frame_dur,
        width="1920",
        height="1080",
        colorSpace="1-1-1 (Rec. 709)"
    )

    video_hud_candidates = [
        ROOT / "out/master/Hardware_Teardown_HUD_16x9.mov",
        ROOT / "out/master/Hardware_Teardown_HUD_16x9.mp4"
    ]
    video_hud = next((f for f in video_hud_candidates if f.exists()), None)

    if video_master.exists():
        ET.SubElement(
            resources, "asset",
            id="r2",
            name=video_master.name,
            src=video_master.resolve().as_uri(),
            start="0s",
            duration=dur_str,
            hasVideo="1",
            format="r1"
        )

    if video_hud:
        ET.SubElement(
            resources, "asset",
            id="r_hud",
            name=video_hud.name,
            src=video_hud.resolve().as_uri(),
            start="0s",
            duration=dur_str,
            hasVideo="1",
            format="r1"
        )

    if audio_master.exists():
        ET.SubElement(
            resources, "asset",
            id="r3",
            name=audio_master.name,
            src=audio_master.resolve().as_uri(),
            start="0s",
            duration=dur_str,
            hasAudio="1"
        )

    if sfx_master.exists():
        ET.SubElement(
            resources, "asset",
            id="r4",
            name=sfx_master.name,
            src=sfx_master.resolve().as_uri(),
            start="0s",
            duration=dur_str,
            hasAudio="1"
        )

    if bgm_master.exists():
        ET.SubElement(
            resources, "asset",
            id="r5",
            name=bgm_master.name,
            src=bgm_master.resolve().as_uri(),
            start="0s",
            duration=dur_str,
            hasAudio="1"
        )

    library = ET.SubElement(fcpxml, "library")
    event = ET.SubElement(library, "event", name="Branch_Education_Teardowns")
    project = ET.SubElement(event, "project", name="Smartphone_Exploded_3D_Master")

    sequence = ET.SubElement(
        project, "sequence",
        format="r1",
        duration=dur_str,
        tcStart="0s",
        tcFormat="NDF"
    )

    spine = ET.SubElement(sequence, "spine")

    # Primary Video Track V1
    v1_clip = ET.SubElement(
        spine, "asset-clip",
        ref="r2" if video_master.exists() else "r1",
        offset="0s",
        name="[V1 3D Smartphone Teardown Plates]",
        start="0s",
        duration=dur_str,
        format="r1"
    )

    # Teardown Scene Markers
    teardown_markers = [
        (0, "Scene 1: Hero Smartphone Exterior Assembly", "cyan"),
        (150, "Scene 2: Display & Adhesive Unlatching (Z: 120mm)", "yellow"),
        (300, "Scene 3: Battery & Induction Coil Separation", "green"),
        (450, "Scene 4: Main Logic Board & 3nm Silicon Die", "magenta"),
        (600, "Scene 5: High-Speed Bus & Electrical Signal Pulse", "blue"),
        (750, "Scene 6: Reassembly Registration & Specs Summary", "cyan"),
    ]

    for sf, title, color in teardown_markers:
        ET.SubElement(
            v1_clip, "marker",
            start=f"{sf}/{fps}s",
            duration=frame_dur,
            value=f"[TEARDOWN] {title}",
            color=color
        )

    # Track V2 Technical HUD Overlays
    if video_hud:
        ET.SubElement(
            v1_clip, "asset-clip",
            ref="r_hud",
            name=f"[V2 HUD Overlay] {video_hud.name}",
            offset="0s",
            start="0s",
            duration=dur_str,
            lane="1",
            format="r1"
        )
    else:
        ET.SubElement(
            v1_clip, "gap",
            name="[V2 Remotion Technical HUD & Callout Overlays]",
            offset="0s",
            duration=dur_str,
            lane="1"
        )

    # Track A1 Narration
    if audio_master.exists():
        ET.SubElement(
            v1_clip, "asset-clip",
            ref="r3",
            offset="0s",
            name=f"[A1 Voiceover] {audio_master.name}",
            start="0s",
            duration=dur_str,
            lane="-1"
        )

    # Track A2 Teardown Foley
    if sfx_master.exists():
        ET.SubElement(
            v1_clip, "asset-clip",
            ref="r4",
            offset="0s",
            name=f"[A2 Teardown Foley] {sfx_master.name}",
            start="0s",
            duration=dur_str,
            lane="-2"
        )

    # Track A3 Openverse BGM
    if bgm_master.exists():
        ET.SubElement(
            v1_clip, "asset-clip",
            ref="r5",
            offset="0s",
            name=f"[A3 Openverse BGM] {bgm_master.name}",
            start="0s",
            duration=dur_str,
            lane="-3"
        )

    tree = ET.ElementTree(fcpxml)
    ET.indent(tree, space="  ", level=0)
    tree.write(str(output_xml), encoding="utf-8", xml_declaration=True)
    print(f"✔ DaVinci Resolve Hardware Teardown FCPXML generated: {output_xml}")
    return output_xml

if __name__ == "__main__":
    import sys
    if "--teardown" in sys.argv:
        generate_teardown_timeline()
    else:
        generate_hybrid_timeline()
        generate_teardown_timeline()
