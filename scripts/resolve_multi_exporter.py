#!/usr/bin/env python3
"""
Multi-format DaVinci Resolve Timeline Exporter
Generates:
1. FCPXML v1.9 / v1.10 (Final Cut Pro X / DaVinci Resolve)
   - Clean V1 track without invalid anchored gaps
   - Proper hasVideo="1" and hasAudio="1"
   - colorSpace="1-1-1 (Rec. 709)"
   - Timeline chapter markers for each scene
   - A1 voiceover track
2. FCP7 XML / XMEML v5 (Final Cut Pro 7 / DaVinci Resolve native track XML)
   - True track-based architecture (<video><track><clipitem>...)
   - Standard clip items with pathurl and file specs
   - Markers at exact frame points
   - 100% foolproof in all DaVinci Resolve versions
3. CMX 3600 EDL (.edl)
   - Standard non-drop-frame edit decision list for Resolve preconform / import
"""

import argparse
import json
import xml.etree.ElementTree as ET
from pathlib import Path
from xml.dom import minidom
import subprocess

def frames_to_tc(frames: int, fps: int = 30, base_hours: int = 1) -> str:
    total_sec = frames // fps
    rem_frames = frames % fps
    hours = (total_sec // 3600) + base_hours
    mins = (total_sec % 3600) // 60
    secs = total_sec % 60
    return f"{hours:02d}:{mins:02d}:{secs:02d}:{rem_frames:02d}"

def frames_to_tc_zero(frames: int, fps: int = 30) -> str:
    return frames_to_tc(frames, fps, base_hours=0)

def generate_fcpxml(
    project_name: str,
    video_path: Path,
    voiceover_path: Path,
    storyboard: dict,
    total_frames: int,
    fps: int,
    width: int,
    height: int,
    out_file: Path
):
    dur_str = f"{total_frames}/{fps}s"
    frame_dur = f"1/{fps}s"

    fcpxml = ET.Element("fcpxml", version="1.10")
    resources = ET.SubElement(fcpxml, "resources")

    # Format with proper Rec. 709 color space
    ET.SubElement(
        resources, "format",
        id="r1",
        name=f"FFVideoFormat{height}p{fps}",
        frameDuration=frame_dur,
        width=str(width),
        height=str(height),
        colorSpace="1-1-1 (Rec. 709)"
    )

    # Video Asset (marked with both hasVideo and hasAudio to reflect mp4 container)
    ET.SubElement(
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

    # Voiceover Asset
    has_vo = voiceover_path and voiceover_path.exists()
    if has_vo:
        ET.SubElement(
            resources, "asset",
            id="r3",
            name=voiceover_path.name,
            src=voiceover_path.resolve().as_uri(),
            start="0s",
            duration=dur_str,
            hasAudio="1"
        )

    # Library / Event / Project / Sequence
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

    # V1 Video Clip - Clean, NO invalid anchored gaps
    v1_clip = ET.SubElement(
        spine, "asset-clip",
        ref="r2",
        offset="0s",
        name=f"[V1] {video_path.stem}",
        start="0s",
        duration=dur_str,
        format="r1"
    )

    # Timeline Chapter Markers on V1 Clip
    scenes = storyboard.get("scenes", [])
    for sc in scenes:
        sf = sc.get("startFrame", 0)
        df = sc.get("durationInFrames", 300)
        sc_title = sc.get("title", "Scene")
        sc_type = sc.get("type", "infographic")
        marker_color = "yellow" if sc_type == "infographic" else ("cyan" if sc_type == "corporate_slide" else "blue")

        ET.SubElement(
            v1_clip, "marker",
            start=f"{sf}/{fps}s",
            duration=frame_dur,
            value=f"[{sc_type.upper()}] {sc_title}",
            color=marker_color
        )

    # A1 Voiceover Track - anchored to primary clip
    if has_vo:
        ET.SubElement(
            v1_clip, "asset-clip",
            ref="r3",
            offset="0s",
            name=f"[A1 Voiceover] {voiceover_path.stem}",
            start="0s",
            duration=dur_str,
            lane="-1"
        )

    xml_str = minidom.parseString(ET.tostring(fcpxml)).toprettyxml(indent="  ")
    out_file.write_text(xml_str, encoding="utf-8")
    print(f"✔ Generated FCPXML: {out_file}")

def generate_fcp7_xml(
    project_name: str,
    video_path: Path,
    voiceover_path: Path,
    storyboard: dict,
    total_frames: int,
    fps: int,
    width: int,
    height: int,
    out_file: Path
):
    """Generates standard Final Cut Pro 7 / DaVinci Resolve track-based XMEML XML."""
    scenes = storyboard.get("scenes", [])
    has_vo = voiceover_path and voiceover_path.exists()

    xmeml = ET.Element("xmeml", version="5")
    seq = ET.SubElement(xmeml, "sequence", id="sequence-1")
    ET.SubElement(seq, "name").text = project_name
    ET.SubElement(seq, "duration").text = str(total_frames)

    rate = ET.SubElement(seq, "rate")
    ET.SubElement(rate, "timebase").text = str(fps)
    ET.SubElement(rate, "ntsc").text = "FALSE"

    tc = ET.SubElement(seq, "timecode")
    tc_rate = ET.SubElement(tc, "rate")
    ET.SubElement(tc_rate, "timebase").text = str(fps)
    ET.SubElement(tc_rate, "ntsc").text = "FALSE"
    ET.SubElement(tc, "string").text = "01:00:00:00"
    ET.SubElement(tc, "frame").text = str(3600 * fps)
    ET.SubElement(tc, "displayformat").text = "NDF"

    media = ET.SubElement(seq, "media")

    # Video Track
    video = ET.SubElement(media, "video")
    v_format = ET.SubElement(video, "format")
    sc = ET.SubElement(v_format, "samplecharacteristics")
    ET.SubElement(sc, "width").text = str(width)
    ET.SubElement(sc, "height").text = str(height)
    ET.SubElement(sc, "pixelaspectratio").text = "square"
    sc_rate = ET.SubElement(sc, "rate")
    ET.SubElement(sc_rate, "timebase").text = str(fps)
    ET.SubElement(sc_rate, "ntsc").text = "FALSE"

    v_track = ET.SubElement(video, "track")

    # Clipitem on Track V1
    clip_v1 = ET.SubElement(v_track, "clipitem", id="clipitem-v1")
    ET.SubElement(clip_v1, "name").text = video_path.name
    ET.SubElement(clip_v1, "duration").text = str(total_frames)
    c_rate = ET.SubElement(clip_v1, "rate")
    ET.SubElement(c_rate, "timebase").text = str(fps)
    ET.SubElement(c_rate, "ntsc").text = "FALSE"
    ET.SubElement(clip_v1, "start").text = "0"
    ET.SubElement(clip_v1, "end").text = str(total_frames)
    ET.SubElement(clip_v1, "in").text = "0"
    ET.SubElement(clip_v1, "out").text = str(total_frames)

    # File Reference for V1
    file_v1 = ET.SubElement(clip_v1, "file", id="file-v1")
    ET.SubElement(file_v1, "name").text = video_path.name
    ET.SubElement(file_v1, "pathurl").text = video_path.resolve().as_uri()
    f_rate = ET.SubElement(file_v1, "rate")
    ET.SubElement(f_rate, "timebase").text = str(fps)
    ET.SubElement(f_rate, "ntsc").text = "FALSE"
    ET.SubElement(file_v1, "duration").text = str(total_frames)

    f_media = ET.SubElement(file_v1, "media")
    f_video = ET.SubElement(f_media, "video")
    f_sc = ET.SubElement(f_video, "samplecharacteristics")
    ET.SubElement(f_sc, "width").text = str(width)
    ET.SubElement(f_sc, "height").text = str(height)

    # Markers for each scene
    for sc_info in scenes:
        sf = sc_info.get("startFrame", 0)
        df = sc_info.get("durationInFrames", 300)
        sc_title = sc_info.get("title", "Scene")
        marker = ET.SubElement(clip_v1, "marker")
        ET.SubElement(marker, "name").text = sc_title
        ET.SubElement(marker, "comment").text = sc_info.get("description", "")
        ET.SubElement(marker, "in").text = str(sf)
        ET.SubElement(marker, "out").text = str(sf + df)

    # Audio Track A1
    if has_vo:
        audio = ET.SubElement(media, "audio")
        a_track = ET.SubElement(audio, "track")
        clip_a1 = ET.SubElement(a_track, "clipitem", id="clipitem-a1")
        ET.SubElement(clip_a1, "name").text = voiceover_path.name
        ET.SubElement(clip_a1, "duration").text = str(total_frames)
        ca_rate = ET.SubElement(clip_a1, "rate")
        ET.SubElement(ca_rate, "timebase").text = str(fps)
        ET.SubElement(ca_rate, "ntsc").text = "FALSE"
        ET.SubElement(clip_a1, "start").text = "0"
        ET.SubElement(clip_a1, "end").text = str(total_frames)
        ET.SubElement(clip_a1, "in").text = "0"
        ET.SubElement(clip_a1, "out").text = str(total_frames)

        file_a1 = ET.SubElement(clip_a1, "file", id="file-a1")
        ET.SubElement(file_a1, "name").text = voiceover_path.name
        ET.SubElement(file_a1, "pathurl").text = voiceover_path.resolve().as_uri()
        fa_rate = ET.SubElement(file_a1, "rate")
        ET.SubElement(fa_rate, "timebase").text = str(fps)
        ET.SubElement(fa_rate, "ntsc").text = "FALSE"
        ET.SubElement(file_a1, "duration").text = str(total_frames)

        fa_media = ET.SubElement(file_a1, "media")
        fa_audio = ET.SubElement(fa_media, "audio")
        fa_sc = ET.SubElement(fa_audio, "samplecharacteristics")
        ET.SubElement(fa_sc, "depth").text = "16"
        ET.SubElement(fa_sc, "samplerate").text = "48000"
        ET.SubElement(fa_audio, "channelcount").text = "2"

    xml_str = minidom.parseString(ET.tostring(xmeml)).toprettyxml(indent="  ")
    out_file.write_text(xml_str, encoding="utf-8")
    print(f"✔ Generated FCP7 XML: {out_file}")

def generate_edl(
    project_name: str,
    video_path: Path,
    storyboard: dict,
    total_frames: int,
    fps: int,
    out_file: Path
):
    scenes = storyboard.get("scenes", [])
    lines = [
        f"TITLE: {project_name}",
        "FCM: NON-DROP FRAME",
        ""
    ]

    for idx, sc in enumerate(scenes):
        sf = sc.get("startFrame", 0)
        df = sc.get("durationInFrames", 300)
        ef = sf + df

        src_start = frames_to_tc_zero(sf, fps)
        src_end = frames_to_tc_zero(ef, fps)
        rec_start = frames_to_tc(sf, fps, base_hours=1)
        rec_end = frames_to_tc(ef, fps, base_hours=1)

        clip_num = f"{idx+1:03d}"
        lines.append(f"{clip_num}  AX       V     C        {src_start} {src_end} {rec_start} {rec_end}")
        lines.append(f"* FROM CLIP NAME: {video_path.name}")
        lines.append(f"* SCENE: {sc.get('title', 'Scene')}")
        lines.append("")

    out_file.write_text("\n".join(lines), encoding="utf-8")
    print(f"✔ Generated EDL: {out_file}")

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--project", default="Incremental_Backup_2008_Master_16x9")
    parser.add_argument("--video", required=True)
    parser.add_argument("--voiceover", default="")
    parser.add_argument("--storyboard", required=True)
    parser.add_argument("--outdir", default="out/resolve_exports")
    parser.add_argument("--aspect", default="16:9")
    parser.add_argument("--fps", type=int, default=30)
    args = parser.parse_args()

    video_p = Path(args.video).resolve()
    vo_p = Path(args.voiceover).resolve() if args.voiceover else None
    sb_p = Path(args.storyboard).resolve()
    out_dir = Path(args.outdir).resolve()
    out_dir.mkdir(parents=True, exist_ok=True)

    sb_data = json.loads(sb_p.read_text(encoding="utf-8"))
    total_frames = sb_data.get("totalFrames", 10487)
    is_vertical = args.aspect == "9:16"
    width = 1080 if is_vertical else 1920
    height = 1920 if is_vertical else 1080

    # 1. Generate FCPXML v1.10 (Standard Final Cut Pro X / DaVinci Resolve)
    fcpxml_path = out_dir / f"{args.project}.fcpxml"
    generate_fcpxml(args.project, video_p, vo_p, sb_data, total_frames, args.fps, width, height, fcpxml_path)

    # 2. Generate FCP7 XML (Final Cut Pro 7 / DaVinci Resolve Track-Based XML)
    fcp7_path = out_dir / f"{args.project}_FCP7.xml"
    generate_fcp7_xml(args.project, video_p, vo_p, sb_data, total_frames, args.fps, width, height, fcp7_path)

    # 3. Generate CMX 3600 EDL
    edl_path = out_dir / f"{args.project}.edl"
    generate_edl(args.project, video_p, sb_data, total_frames, args.fps, edl_path)

if __name__ == "__main__":
    main()
