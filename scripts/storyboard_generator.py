#!/usr/bin/env python3
"""
Autonomous Storyboard Generator for Remotion MultiScene Director & Motion Video Director Skill.
Features 6 reverse-engineered production recipes:
  1. saas-launch: SaaS Product Launch (Slack-style 16:9, Intensity 2-3)
  2. caption-reel: Premium Talking-Head Caption Reel (9:16 Vertical, Intensity 3-4)
  3. documentary: Cinematic Storyteller Documentary (16:9, Intensity 5)
  4. brand-promo: Brand-Agency Kinetic Promo (Frontify-style 16:9, Intensity 4)
  5. nhit-admission: NHIT Industrial Technical Admission Campaign (16:9 / 9:16, Intensity 3-4)
  6. showreel-launch: Showreel / Launch Trailer (60 FPS Beat-Synced 16:9, Intensity 5)
"""
import argparse
import json
import re
from pathlib import Path
from typing import Any, Dict, List

# Production Recipe Configurations based on Section 14 of Motion Video Director
RECIPES: Dict[str, Dict[str, Any]] = {
    "saas-launch": {
        "name": "SaaS Product Launch (Slack-style 16:9)",
        "aspectRatio": "16:9",
        "intensity": "Level 2-3 (Executive)",
        "targetSceneSec": 4.0,
        "palette": {
            "primary": "#38bdf8",     # Cyan
            "secondary": "#818cf8",   # Indigo / Purple
            "accent": "#34d399",      # Mint
            "glow": "rgba(56, 189, 248, 0.4)",
            "bg": "#0B0F19"
        },
        "archetypes": [
            {
                "type": "kinetic",
                "archetype": "monospace_scramble",
                "visualCue": "Monospace headline decode with blinking cursor and cyan glow",
                "sfxCue": "tactile_pop",
                "physics": {"damping": 16, "stiffness": 110, "mass": 0.8}
            },
            {
                "type": "corporate_slide",
                "archetype": "glass_dock_features",
                "visualCue": "Floating glass cards condensing from glowing energy orbs",
                "sfxCue": "dock_open_chime",
                "physics": {"damping": 14, "stiffness": 100, "mass": 0.9}
            },
            {
                "type": "infographic",
                "archetype": "velocity_metric_surge",
                "visualCue": "Animated velocity counter with 3-tier throughput bar graph",
                "sfxCue": "tick_shimmer",
                "physics": {"damping": 12, "stiffness": 90, "mass": 1.0}
            },
            {
                "type": "three_hologram",
                "archetype": "tilted_3d_card",
                "visualCue": "Real UI window tilted in 3D (rotateY: 15deg) with floating tooltips",
                "sfxCue": "subtle_whoosh",
                "physics": {"damping": 18, "stiffness": 95, "mass": 1.1}
            },
            {
                "type": "corporate_slide",
                "archetype": "enterprise_workflow_spec",
                "visualCue": "Staggered feature checklist with pill badges",
                "sfxCue": "soft_click",
                "physics": {"damping": 15, "stiffness": 100, "mass": 0.85}
            },
            {
                "type": "kinetic",
                "archetype": "cta_dock_climax",
                "visualCue": "Blueprint monitor flattening into 2D lines with primary CTA",
                "sfxCue": "sub_boom",
                "physics": {"damping": 13, "stiffness": 120, "mass": 0.75}
            }
        ]
    },
    "caption-reel": {
        "name": "Premium Talking-Head Caption Reel (9:16 Vertical)",
        "aspectRatio": "9:16",
        "intensity": "Level 3-4 (Kinetic)",
        "targetSceneSec": 2.5,
        "palette": {
            "primary": "#10b981",     # Emerald
            "secondary": "#06b6d4",   # Vivid Cyan
            "accent": "#f59e0b",      # Amber
            "glow": "rgba(16, 185, 129, 0.45)",
            "bg": "#06090e"
        },
        "archetypes": [
            {
                "type": "kinetic",
                "archetype": "kinetic_caption_hero",
                "visualCue": "1-3 word kinetic hook at chest height with gradient bevel fill",
                "sfxCue": "sub_boom_drop",
                "physics": {"damping": 12, "stiffness": 140, "mass": 0.6}
            },
            {
                "type": "infographic",
                "archetype": "rolling_counter_proof",
                "visualCue": "Rolling numeric counter with rounded proof cards popping in an arc",
                "sfxCue": "metric_tick_shimmer",
                "physics": {"damping": 10, "stiffness": 130, "mass": 0.7}
            },
            {
                "type": "corporate_slide",
                "archetype": "social_proof_badge_arc",
                "visualCue": "Pop badges (scale 0 -> 1.08 -> 1.0) with glowing borders",
                "sfxCue": "pop_snap",
                "physics": {"damping": 11, "stiffness": 150, "mass": 0.65}
            },
            {
                "type": "three_core",
                "archetype": "spatial_kinetic_orb",
                "visualCue": "Audio-reactive wireframe energy sphere pulsing to bass hits",
                "sfxCue": "whoosh_swipe",
                "physics": {"damping": 14, "stiffness": 110, "mass": 0.8}
            },
            {
                "type": "kinetic",
                "archetype": "rapid_takeaway_punch",
                "visualCue": "High-velocity staggered keywords with punchy contrast",
                "sfxCue": "pop_snap",
                "physics": {"damping": 12, "stiffness": 135, "mass": 0.7}
            },
            {
                "type": "kinetic",
                "archetype": "kinetic_cta_punch",
                "visualCue": "Follow/Enroll CTA pill bouncing with urgency glow",
                "sfxCue": "airy_riser",
                "physics": {"damping": 10, "stiffness": 160, "mass": 0.55}
            }
        ]
    },
    "documentary": {
        "name": "Cinematic Storyteller Documentary (16:9 Landscape)",
        "aspectRatio": "16:9",
        "intensity": "Level 5 (Hyper-Cine)",
        "targetSceneSec": 1.8,
        "palette": {
            "primary": "#c5a059",     # Antique Gold
            "secondary": "#e0e2ec",   # Bone White
            "accent": "#ef4444",      # Film Red
            "glow": "rgba(197, 160, 89, 0.4)",
            "bg": "#08090b"
        },
        "archetypes": [
            {
                "type": "kinetic",
                "archetype": "archival_film_hook",
                "visualCue": "Letterbox 2.39:1 bars, archival grain, slow push with dramatic title",
                "sfxCue": "paper_rip_rustle",
                "physics": {"damping": 18, "stiffness": 80, "mass": 1.2}
            },
            {
                "type": "three_hologram",
                "archetype": "chunky_3d_extruded",
                "visualCue": "3D extruded chunky typography in room casting long floor shadows",
                "sfxCue": "heavy_sub_impact",
                "physics": {"damping": 20, "stiffness": 85, "mass": 1.3}
            },
            {
                "type": "corporate_slide",
                "archetype": "torn_paper_context",
                "visualCue": "Torn-paper framing window revealing archival documentary evidence",
                "sfxCue": "distortion_glitch",
                "physics": {"damping": 16, "stiffness": 100, "mass": 1.0}
            },
            {
                "type": "three_core",
                "archetype": "hyperspace_tunnel",
                "visualCue": "Hyperspace light-streak tunnel with particle streaks flying toward camera",
                "sfxCue": "tension_noise_riser",
                "physics": {"damping": 14, "stiffness": 120, "mass": 0.85}
            },
            {
                "type": "infographic",
                "archetype": "monumental_breakthrough_stat",
                "visualCue": "High-contrast quantitative milestone with slow cinematic count-up",
                "sfxCue": "heavy_sub_impact",
                "physics": {"damping": 17, "stiffness": 90, "mass": 1.1}
            },
            {
                "type": "three_bars",
                "archetype": "monolith_bars",
                "visualCue": "Monolithic 3D isometric scale bars rising from the dark floor",
                "sfxCue": "deep_whoosh",
                "physics": {"damping": 19, "stiffness": 85, "mass": 1.25}
            },
            {
                "type": "kinetic",
                "archetype": "manifesto_climax_cta",
                "visualCue": "Cinematic tagline reveal with light sweep and closing brand mark",
                "sfxCue": "heavy_sub_impact",
                "physics": {"damping": 15, "stiffness": 110, "mass": 0.9}
            }
        ]
    },
    "brand-promo": {
        "name": "Brand-Agency Kinetic Promo (Frontify-style 16:9)",
        "aspectRatio": "16:9",
        "intensity": "Level 4 (Kinetic)",
        "targetSceneSec": 2.2,
        "palette": {
            "primary": "#ff6a1a",     # Frontify Orange
            "secondary": "#faf8fa",   # Off-White
            "accent": "#ff385c",      # Vivid Coral
            "glow": "rgba(255, 106, 26, 0.45)",
            "bg": "#0a0a0a"
        },
        "archetypes": [
            {
                "type": "kinetic",
                "archetype": "stark_contrast_hook",
                "visualCue": "Alternating Off-White (#FAF8FA) and Pure Black (#0A0A0A) staccato cuts",
                "sfxCue": "snappy_pop",
                "physics": {"damping": 11, "stiffness": 150, "mass": 0.65}
            },
            {
                "type": "corporate_slide",
                "archetype": "bezier_card_snake",
                "visualCue": "Card snake trailing dynamically along a smooth cubic bezier curve",
                "sfxCue": "fast_whoosh_swipe",
                "physics": {"damping": 12, "stiffness": 140, "mass": 0.7}
            },
            {
                "type": "infographic",
                "archetype": "grid_4x2_explode",
                "visualCue": "Card stack shuffling on 96 BPM eighths, exploding into a 4x2 grid with 3D Y-flips",
                "sfxCue": "kick_hit",
                "physics": {"damping": 10, "stiffness": 160, "mass": 0.6}
            },
            {
                "type": "three_bars",
                "archetype": "isometric_brand_pillars",
                "visualCue": "3D isometric pillars color-shifting between brand palette tokens",
                "sfxCue": "snappy_pop",
                "physics": {"damping": 13, "stiffness": 125, "mass": 0.8}
            },
            {
                "type": "kinetic",
                "archetype": "kinetic_bold_cta",
                "visualCue": "High-octane hero title with industrial orange badge punch",
                "sfxCue": "sub_bass_drop",
                "physics": {"damping": 11, "stiffness": 145, "mass": 0.65}
            }
        ]
    },
    "nhit-admission": {
        "name": "NHIT Industrial Technical Admission Campaign (16:9 & 9:16)",
        "aspectRatio": "16:9",
        "intensity": "Level 3-4 (Kinetic)",
        "targetSceneSec": 3.8,
        "palette": {
            "primary": "#087eff",     # Electric Blue
            "secondary": "#ff9d32",   # Industrial Orange
            "accent": "#ffd700",      # Gold
            "glow": "rgba(8, 126, 255, 0.45)",
            "bg": "#071b33"
        },
        "archetypes": [
            {
                "type": "kinetic",
                "archetype": "kinetic_hero_badge",
                "visualCue": "AICTE Approved Working Professionals category hero badge with electric blue glow",
                "sfxCue": "whoosh_heavy",
                "physics": {"damping": 14, "stiffness": 110, "mass": 0.8}
            },
            {
                "type": "corporate_slide",
                "archetype": "flexible_shifts_spec",
                "visualCue": "Evening/weekend batches, flexible schedules, and direct B.Tech lateral entry",
                "sfxCue": "circuit_relay_click",
                "physics": {"damping": 15, "stiffness": 100, "mass": 0.85}
            },
            {
                "type": "infographic",
                "archetype": "dual_branch_table",
                "visualCue": "30 Electrical & 30 Mechanical Engineering seats comparison chart",
                "sfxCue": "gear_ratchet_swish",
                "physics": {"damping": 12, "stiffness": 95, "mass": 0.95}
            },
            {
                "type": "three_core",
                "archetype": "crucible_3d_gears",
                "visualCue": "Crucible 3D mechanical gear assembly and transformer core rotating with PBR reflections",
                "sfxCue": "circuit_relay_click",
                "physics": {"damping": 16, "stiffness": 90, "mass": 1.1}
            },
            {
                "type": "three_hologram",
                "archetype": "diploma_seal_hologram",
                "visualCue": "Holographic AICTE & WBSCTVESD government recognized accreditation seal",
                "sfxCue": "whoosh_heavy",
                "physics": {"damping": 14, "stiffness": 105, "mass": 0.9}
            },
            {
                "type": "infographic",
                "archetype": "limited_intake_urgency",
                "visualCue": "Urgency alert: strictly 30 seats per specialization for 2026-27 session",
                "sfxCue": "circuit_relay_click",
                "physics": {"damping": 11, "stiffness": 130, "mass": 0.7}
            },
            {
                "type": "kinetic",
                "archetype": "admissions_climax_cta",
                "visualCue": "Apply Now CTA with campus helpline 9434002626 / 9434007137 and nhit.org portal",
                "sfxCue": "logo_sub_boom",
                "physics": {"damping": 13, "stiffness": 120, "mass": 0.8}
            }
        ]
    },
    "showreel-launch": {
        "name": "Showreel / Launch Trailer (60 FPS Beat-Synced)",
        "aspectRatio": "16:9",
        "intensity": "Level 5 (Hyper-Cine)",
        "targetSceneSec": 1.5,
        "palette": {
            "primary": "#FF5722",     # High-Contrast Agency Orange
            "secondary": "#FFFFFF",   # Stark White
            "accent": "#FFB800",      # Electric Amber
            "glow": "rgba(255, 87, 34, 0.5)",
            "bg": "#0A0A0A"           # Pure Black
        },
        "archetypes": [
            {
                "type": "kinetic",
                "archetype": "showreel_cold_open",
                "visualCue": "High-octane typographic sting with sub-frame shutter blur and stark contrast flash",
                "sfxCue": "sub_boom_drop",
                "physics": {"damping": 9, "stiffness": 180, "mass": 0.5}
            },
            {
                "type": "corporate_slide",
                "archetype": "friction_contrast_break",
                "visualCue": "Alternating inverted frames with high-tension typography and staccato kinetic cuts",
                "sfxCue": "snappy_pop",
                "physics": {"damping": 10, "stiffness": 160, "mass": 0.55}
            },
            {
                "type": "infographic",
                "archetype": "feature_cascade_surge",
                "visualCue": "Synchronized beat-grid cascading metrics accelerating across musical eighths",
                "sfxCue": "kick_hit",
                "physics": {"damping": 8, "stiffness": 190, "mass": 0.45}
            },
            {
                "type": "three_core",
                "archetype": "climax_3d_shockwave",
                "visualCue": "Crucible 3D spatial geometry expanding with radial shockwave and camera zoom punch",
                "sfxCue": "heavy_sub_impact",
                "physics": {"damping": 11, "stiffness": 140, "mass": 0.7}
            },
            {
                "type": "kinetic",
                "archetype": "brand_climax_cta",
                "visualCue": "Final brand lockup explosion resolving into high-conversion action badge",
                "sfxCue": "logo_sub_boom",
                "physics": {"damping": 10, "stiffness": 170, "mass": 0.6}
            }
        ]
    }
}

# Legacy color theme mapping for backward compatibility
LEGACY_THEMES = {
    "saffron-gold": {
        "primary": "#FF9933",
        "secondary": "#FFD700",
        "accent": "#FFA500",
        "glow": "rgba(255, 153, 51, 0.45)",
        "bg": "#0B0B0E"
    },
    "cyber-cyan": {
        "primary": "#00f2fe",
        "secondary": "#38bdf8",
        "accent": "#4facfe",
        "glow": "rgba(0, 242, 254, 0.4)",
        "bg": "#060911"
    },
    "neon-purple": {
        "primary": "#8b5cf6",
        "secondary": "#ec4899",
        "accent": "#00ff88",
        "glow": "rgba(139, 92, 246, 0.4)",
        "bg": "#0A0A0F"
    }
}

def parse_phrases(text: str, fast_reels: bool = True) -> List[str]:
    """Split text into punchy visual beats (4-7 words each)."""
    if not text or not text.strip():
        return []
    
    if not fast_reels:
        raw = re.split(r'(?<=[.!?])\s+', text.strip())
        return [s.strip() for s in raw if s.strip()]

    chunks = re.split(r'[,.!?—;\n]+', text.strip())
    phrases = []

    for c in chunks:
        c = c.strip()
        if not c:
            continue
        words = c.split()
        if len(words) <= 7:
            phrases.append(c)
        else:
            for i in range(0, len(words), 6):
                phrases.append(" ".join(words[i:i+6]))

    return phrases

def build_scene_from_archetype(phrase: str, index: int, recipe_cfg: Dict[str, Any], total_phrases: int) -> Dict[str, Any]:
    """Build a rich Remotion-compatible scene object tailored to the production recipe archetype."""
    archetypes = recipe_cfg["archetypes"]
    palette = recipe_cfg["palette"]
    
    # Select archetype cycling through recipe sequence
    arch = archetypes[index % len(archetypes)]
    scene_type = arch["type"]
    has_stat = bool(re.search(r'(\d+[\d,.]*|\b\d+%\b|\$\d+|\b\d+x\b)', phrase))
    
    title = phrase[:60].rstrip(".")
    if len(phrase) > 60:
        title += "..."

    scene: Dict[str, Any] = {
        "id": f"scene_{index + 1}",
        "type": scene_type,
        "archetype": arch["archetype"],
        "title": title,
        "subtitle": f"{recipe_cfg['name']} • Beat {index + 1}",
        "visualCue": arch["visualCue"],
        "sfxCue": arch["sfxCue"],
        "sfxFrameOffset": 0,
        "motionPhysics": arch["physics"],
        "primaryColor": palette["primary"],
        "secondaryColor": palette["secondary"],
        "accentColor": palette["accent"],
        "glowColor": palette["glow"],
        "backgroundColor": palette["bg"]
    }

    # Add scene-type specific payloads expected by Remotion components
    if scene_type == "infographic":
        m = re.search(r'(\+?\d+[\d,.]*%?|\$\d+[\d,.]*[MBK]?|\d+x)', phrase)
        metric_val = m.group(1) if m else "+142%"
        if not any(c in metric_val for c in ["%", "$", "+", "x"]):
            metric_val = f"+{metric_val}%"
        
        scene["metricValue"] = metric_val
        scene["metricLabel"] = "Quantitative Milestone"
        scene["chartBars"] = [
            {"label": "Baseline / Prev", "value": 35},
            {"label": "Accelerated Run", "value": 72},
            {"label": "Target Milestone", "value": 98}
        ]
    elif scene_type == "corporate_slide":
        words = phrase.split()
        b1 = " ".join(words[:min(5, len(words))])
        b2 = " ".join(words[5:min(10, len(words))]) if len(words) > 5 else "Streamlined workflow delivery"
        b3 = " ".join(words[10:min(15, len(words))]) if len(words) > 10 else "High-fidelity motion execution"
        scene["category"] = recipe_cfg["name"].split("(")[0].strip()
        scene["bullets"] = [b1, b2, b3]
    elif scene_type in ["three_core", "three_bars", "three_hologram"]:
        scene["metricLabel"] = "Spatial PBR Visualization"
        scene["modelAsset"] = f"assets/crucible/{arch['archetype']}.glb"

    return scene

def generate_storyboard(text: str, total_duration_sec: float = 30.0, fps: int = 30,
                        recipe: str = "nhit-admission", theme_name: str = "",
                        fast_reels: bool = True,
                        output_json: Path = Path("src/data/storyboard.json")) -> Dict[str, Any]:
    """Generates an executive multi-scene storyboard based on the chosen production recipe."""
    # Resolve recipe
    rec_key = recipe.lower().strip()
    if rec_key not in RECIPES:
        # Fallback search or default
        for k in RECIPES:
            if k in rec_key:
                rec_key = k
                break
        else:
            rec_key = "nhit-admission"

    recipe_cfg = RECIPES[rec_key]

    # Override palette if explicit legacy theme requested
    if theme_name and theme_name.lower() in LEGACY_THEMES:
        recipe_cfg["palette"].update(LEGACY_THEMES[theme_name.lower()])

    phrases = parse_phrases(text, fast_reels=fast_reels)

    # Defaults if no text provided
    if not phrases:
        if rec_key == "saas-launch":
            phrases = [
                "Introducing NextGen Workflow Automation.",
                "Turn complex distributed tasks into real-time code.",
                "Experience 142% throughput acceleration.",
                "Seamless 3D visual monitoring out of the box.",
                "Deploy instantly with enterprise-grade security."
            ]
        elif rec_key == "caption-reel":
            phrases = [
                "Stop wasting 4 hours on editing.",
                "Here is the secret AI motion system.",
                "Our creators scaled engagement by 320%.",
                "One script produces 16:9 and 9:16 automatically.",
                "Try it free today and accelerate."
            ]
        elif rec_key == "documentary":
            phrases = [
                "In 2026, media automation shifted forever.",
                "A handful of engineers rewrote the rules.",
                "Breaking the barrier between code and cinema.",
                "Processing 10 million frames a second.",
                "This is the dawn of autonomous production."
            ]
        elif rec_key == "brand-promo":
            phrases = [
                "Bold design for ambitious brands.",
                "Kinetic rhythm synced to the beat.",
                "Infinite modular flexibility across all channels.",
                "Elevate your visual identity today."
            ]
        elif rec_key == "showreel-launch":
            phrases = [
                "Command attention with sub-frame precision.",
                "Engineered for 60 FPS cinematic motion.",
                "Pure mathematical beat-grid synchronization.",
                "Pushing creative boundaries beyond the limit.",
                "Build your next masterpiece today."
            ]
        else: # nhit-admission
            phrases = [
                "Boost your technical engineering career at NHIT Durgapur.",
                "AICTE approved Diploma for Working Professionals.",
                "Classes scheduled on evenings and weekends.",
                "Electrical and Mechanical Engineering 30 seats each.",
                "Direct entry to 2nd year B.Tech after completion.",
                "Admissions Open 2026-27. Call 9434002626."
            ]

    total_frames = int(total_duration_sec * fps)
    
    # Calculate duration per scene based on recipe intensity
    target_frames = int(recipe_cfg["targetSceneSec"] * fps)
    num_scenes = len(phrases)
    frames_per_scene = max(45, total_frames // num_scenes) if num_scenes > 0 else total_frames

    scenes: List[Dict[str, Any]] = []
    current_start = 0

    for i, p in enumerate(phrases):
        if current_start >= total_frames:
            break
        dur = frames_per_scene if i < len(phrases) - 1 else (total_frames - current_start)
        dur = min(dur, total_frames - current_start)
        dur = max(30, dur)

        scene_data = build_scene_from_archetype(p, i, recipe_cfg, len(phrases))
        scene_data["startFrame"] = current_start
        scene_data["durationInFrames"] = dur
        scenes.append(scene_data)
        current_start += dur

    # Expand final scene to fill full frame quota
    if current_start < total_frames and scenes:
        scenes[-1]["durationInFrames"] += (total_frames - current_start)

    storyboard: Dict[str, Any] = {
        "fps": fps,
        "totalDurationInFrames": total_frames,
        "recipe": rec_key,
        "recipeName": recipe_cfg["name"],
        "aspectRatio": recipe_cfg["aspectRatio"],
        "intensity": recipe_cfg["intensity"],
        "theme": theme_name or rec_key,
        "palette": recipe_cfg["palette"],
        "scenes": scenes
    }

    output_json.parent.mkdir(parents=True, exist_ok=True)
    output_json.write_text(json.dumps(storyboard, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"🎬 [Storyboard] Generated {len(scenes)} scenes for '{recipe_cfg['name']}' in {output_json} ({total_frames} frames, {total_duration_sec:.1f}s)")
    return storyboard

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Motion Video Director - Storyboard Generator")
    parser.add_argument("--text", default="", help="Script or narration text")
    parser.add_argument("--duration", type=float, default=30.0, help="Total duration in seconds")
    parser.add_argument("--recipe", default="nhit-admission",
                        choices=["saas-launch", "caption-reel", "documentary", "brand-promo", "nhit-admission", "showreel-launch"],
                        help="Motion Video Director production recipe")
    parser.add_argument("--theme", default="", help="Color theme override (saffron-gold, cyber-cyan, neon-purple)")
    parser.add_argument("--pacing", default="fast-reels", choices=["fast-reels", "standard"], help="Visual cut pacing")
    parser.add_argument("--out", default="src/data/storyboard.json", help="Output path")
    args = parser.parse_args()

    generate_storyboard(
        text=args.text,
        total_duration_sec=args.duration,
        recipe=args.recipe,
        theme_name=args.theme,
        fast_reels=(args.pacing == "fast-reels"),
        output_json=Path(args.out)
    )
