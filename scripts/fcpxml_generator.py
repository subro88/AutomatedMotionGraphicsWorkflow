#!/usr/bin/env python3
import argparse
import json
import xml.etree.ElementTree as ET
from pathlib import Path
from xml.dom import minidom

def create_fcpxml_timeline(
    project_name: str,
    video_path: Path,
    voiceover_path: Path,
    bgm_path: Path = None,
    storyboard_path: Path = None,
    output_xml: Path = Path("out/resolve_exports/timeline.fcpxml"),
    aspect_ratio: str = "9:16",
    fps: int = 30,
    duration_sec: float = 30.0,
    two_track: bool = True
):
    output_xml.parent.mkdir(parents=True, exist_ok=True)
    is_vertical = aspect_ratio == "9:16"
    width = 1080 if is_vertical else 1920
    height = 1920 if is_vertical else 1080

    total_frames = int(duration_sec * fps)
    dur_str = f"{total_frames}/{fps}s"
    frame_dur = f"1/{fps}s"

    fcpxml = ET.Element("fcpxml", version="1.9")
    resources = ET.SubElement(fcpxml, "resources")

    # Format
    format_elem = ET.SubElement(
        resources, "format",
        id="r1",
        name=f"FFVideoFormat{height}p{fps}",
        frameDuration=frame_dur,
        width=str(width),
        height=str(height),
        colorSpace="1-1-1 (Rec. 709)"
    )

    # Assets
    asset_vid = ET.SubElement(
        resources, "asset",
        id="r2",
        name=video_path.name,
        src=video_path.resolve().as_uri(),
        start="0s",
        duration=dur_str,
        hasVideo="1",
        hasAudio="1",
        format="r1"
    )

    asset_vo = None
    if voiceover_path and voiceover_path.exists():
        asset_vo = ET.SubElement(
            resources, "asset",
            id="r3",
            name=voiceover_path.name,
            src=voiceover_path.resolve().as_uri(),
            start="0s",
            duration=dur_str,
            hasAudio="1"
        )

    asset_bgm = None
    if bgm_path and bgm_path.exists():
        asset_bgm = ET.SubElement(
            resources, "asset",
            id="r4",
            name=bgm_path.name,
            src=bgm_path.resolve().as_uri(),
            start="0s",
            duration=dur_str,
            hasAudio="1"
        )

    # Library / Event / Project
    library = ET.SubElement(fcpxml, "library")
    event = ET.SubElement(library, "event", name="Antigravity_Productions")
    project = ET.SubElement(event, "project", name=project_name)

    sequence = ET.SubElement(
        project, "sequence",
        format="r1",
        duration=dur_str,
        tcStart="0s",
        tcFormat="NDF"
    )

    spine = ET.SubElement(sequence, "spine")

    # Track V1: Primary Motion Graphics Video Clip
    v1_clip = ET.SubElement(
        spine, "asset-clip",
        ref="r2",
        offset="0s",
        name=f"[V1 Background] {video_path.stem}",
        start="0s",
        duration=dur_str,
        format="r1"
    )

    # Load Storyboard scenes for Track V2 cuts & chapter markers
    scenes = []
    if storyboard_path and storyboard_path.exists():
        try:
            sb = json.loads(storyboard_path.read_text(encoding="utf-8"))
            scenes = sb.get("scenes", [])
        except Exception:
            pass

    if not scenes:
        scenes = [
            {"id": "scene_1", "title": "Intro Hook", "startFrame": 0, "durationInFrames": int(total_frames / 3), "type": "kinetic"},
            {"id": "scene_2", "title": "Corporate Overview", "startFrame": int(total_frames / 3), "durationInFrames": int(total_frames / 3), "type": "corporate_slide"},
            {"id": "scene_3", "title": "Performance Metric", "startFrame": int(2 * total_frames / 3), "durationInFrames": int(total_frames / 3), "type": "infographic"},
        ]

    # Track V2: Pre-sliced Placeholder Cuts for B-Roll / Talking-Head (lane="1")
    # And Timeline Chapter Markers
    for sc in scenes:
        sf = sc.get("startFrame", 0)
        df = sc.get("durationInFrames", 300)
        start_sec = f"{sf}/{fps}s"
        scene_dur = f"{df}/{fps}s"
        sc_title = sc.get("title", "Scene")
        sc_type = sc.get("type", "kinetic")

        # Color Marker on V1 clip
        marker_color = "yellow" if sc_type == "infographic" else ("cyan" if sc_type == "corporate_slide" else "blue")
        ET.SubElement(
            v1_clip, "marker",
            start=start_sec,
            duration=frame_dur,
            value=f"[{sc_type.upper()}] {sc_title}",
            color=marker_color
        )

        # Track V2 Placeholder Gap (lane="1")
        # In FCPXML, a gap or clip with lane="1" creates a secondary video track (Track V2)
        if not two_track:
            placeholder = ET.SubElement(
                v1_clip, "gap",
                name=f"[V2 B-ROLL / FACECAM] {sc_title[:28]}",
                offset=start_sec,
                duration=scene_dur,
                lane="1"
            )
            ET.SubElement(
                placeholder, "marker",
                start="0s",
                duration=frame_dur,
                value=f"Drop footage here: {sc_title[:30]}",
                color="green"
            )

    # Track A1: Clean Voiceover Audio (lane="-1")
    if asset_vo is not None:
        ET.SubElement(
            v1_clip, "asset-clip",
            ref="r3",
            offset="0s",
            name=f"[A1 Voiceover] {voiceover_path.stem}",
            start="0s",
            duration=dur_str,
            lane="-1"
        )

    # Track A2: Background Music (lane="-2")
    if asset_bgm is not None:
        ET.SubElement(
            v1_clip, "asset-clip",
            ref="r4",
            offset="0s",
            name=f"[A2 Background Music] {bgm_path.stem}",
            start="0s",
            duration=dur_str,
            lane="-2"
        )

    # Pretty print XML
    xml_str = minidom.parseString(ET.tostring(fcpxml)).toprettyxml(indent="  ")
    output_xml.write_text(xml_str, encoding="utf-8")
    print(f"✔ DaVinci Resolve FCPXML Timeline generated: {output_xml}")
    return output_xml

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--project", default="MotionGraphics_Master")
    parser.add_argument("--video", required=True)
    parser.add_argument("--voiceover", default="")
    parser.add_argument("--bgm", default="")
    parser.add_argument("--storyboard", default="src/data/storyboard.json")
    parser.add_argument("--out", default="out/resolve_exports/timeline.fcpxml")
    parser.add_argument("--aspect", default="9:16")
    parser.add_argument("--duration", type=float, default=30.0)
    parser.add_argument("--two_track", action="store_true", default=True, help="Generate direct 2-track timeline (V1 + A1)")
    args = parser.parse_args()

    create_fcpxml_timeline(
        project_name=args.project,
        video_path=Path(args.video),
        voiceover_path=Path(args.voiceover) if args.voiceover else None,
        bgm_path=Path(args.bgm) if args.bgm else None,
        storyboard_path=Path(args.storyboard) if args.storyboard else None,
        output_xml=Path(args.out),
        aspect_ratio=args.aspect,
        duration_sec=args.duration,
        two_track=args.two_track
    )

