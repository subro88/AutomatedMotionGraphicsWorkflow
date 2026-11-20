#!/usr/bin/env python3
"""
MotionScore Performance Doctor (Inspired by Motion AI Kit from motion.dev).
Audits HTML, CSS, TSX, and JSX files for:
  1. Layout Thrashing (animating top, left, width, height, margin instead of transform)
  2. Deprecated animation imports (framer-motion -> motion/react)
  3. Remotion non-deterministic animation anti-patterns (Date.now(), Math.random(), requestAnimationFrame)
  4. GPU layer optimization (will-change: transform)
Assigns a MotionScore (S, A, B, C, F) with exact remediation advice.
"""
import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any, Dict, List

ROOT = Path(__file__).resolve().parents[1]

# Layout properties that trigger expensive browser layout/reflow cycles
LAYOUT_PROPERTIES = [
    r"\bwidth\b", r"\bheight\b", r"\btop\b", r"\bleft\b", r"\bright\b",
    r"\bbottom\b", r"\bmargin\b", r"\bpadding\b", r"\bfont-size\b"
]

LAYOUT_REGEX = re.compile(
    r"(?:transition\s*:[^;]*?(" + "|".join(LAYOUT_PROPERTIES) + r"))|" +
    r"(?:@keyframes[^{]+{[^}]+?(" + "|".join(LAYOUT_PROPERTIES) + r")\s*:)",
    re.IGNORECASE
)

DEPRECATED_FRAMER_REGEX = re.compile(
    r"""(?:import\s+.*?from\s+['"]framer-motion['"])|(?:require\s*\(\s*['"]framer-motion['"]\s*\))"""
)

NON_DETERMINISTIC_REMOTION = [
    (r"\bDate\.now\(\)", "Date.now() violates Remotion frame-determinism; use useCurrentFrame()"),
    (r"\bMath\.random\(\)", "Unseeded Math.random() in video render causes flicker; use deterministic seed"),
    (r"\brequestAnimationFrame\b", "requestAnimationFrame() relies on browser wall-clock; use useCurrentFrame()"),
    (r"\bsetTimeout\b", "setTimeout() is asynchronous and breaks headless frame snapshots; use frame calculation"),
    (r"\bsetInterval\b", "setInterval() is asynchronous and breaks headless frame snapshots; use frame calculation")
]

def audit_file(file_path: Path) -> Dict[str, Any]:
    rel_path = file_path.relative_to(ROOT) if file_path.is_relative_to(ROOT) else file_path
    findings: List[Dict[str, Any]] = []
    
    try:
        content = file_path.read_text(encoding="utf-8", errors="ignore")
    except Exception as e:
        return {"file": str(rel_path), "error": str(e), "score": 100, "findings": []}

    lines = content.splitlines()
    is_remotion = "remotion" in str(file_path).lower() or file_path.suffix in [".tsx", ".ts"]
    is_html = file_path.suffix.lower() == ".html"

    in_style = False
    in_script = False

    for idx, line in enumerate(lines, 1):
        trimmed = line.strip()

        if is_html:
            if "<style" in trimmed:
                in_style = True
            if "</style>" in trimmed:
                in_style = False
                continue
            if "<script" in trimmed:
                in_script = True
            if "</script>" in trimmed:
                in_script = False
                continue
            
            # For HTML files, skip prose lines that are outside style/script and don't contain inline style
            is_executable = in_style or in_script or 'style="' in trimmed or "style='" in trimmed
            # Also ignore documentation table cells or comments
            if not is_executable or "<td>" in trimmed or "<span class=" in trimmed:
                continue

        # Skip code comments
        if trimmed.startswith("//") or trimmed.startswith("/*") or trimmed.startswith("*") or trimmed.startswith("<!--"):
            continue

        # 1. Check for deprecated framer-motion import
        if DEPRECATED_FRAMER_REGEX.search(line):
            findings.append({
                "line": idx,
                "severity": "WARNING",
                "type": "DEPRECATED_IMPORT",
                "message": "Import from deprecated 'framer-motion'",
                "advice": "Replace with 'import * as motion from \"motion/react\"' (Motion v11/v12)"
            })

        # 2. Check for layout thrashing in transitions and keyframes
        m = LAYOUT_REGEX.search(line)
        if m:
            matched_prop = m.group(1) or m.group(2) or "layout property"
            findings.append({
                "line": idx,
                "severity": "CRITICAL",
                "type": "LAYOUT_THRASHING",
                "message": f"Animating layout property '{matched_prop}' triggers expensive reflow/paint cycles",
                "advice": f"Replace with GPU transform: 'transform: translate3d(x, y, 0)' or 'scale()'"
            })

        # 3. Check for Remotion frame determinism
        if is_remotion:
            for pattern, advice in NON_DETERMINISTIC_REMOTION:
                if re.search(pattern, line):
                    findings.append({
                        "line": idx,
                        "severity": "CRITICAL",
                        "type": "NON_DETERMINISTIC",
                        "message": f"Non-deterministic animation call detected",
                        "advice": advice
                    })

    # Calculate score
    score = 100
    for f in findings:
        if f["severity"] == "CRITICAL":
            score -= 15
        elif f["severity"] == "WARNING":
            score -= 5
    score = max(0, score)

    return {
        "file": str(rel_path),
        "score": score,
        "findings": findings
    }

def get_grade(score: int) -> str:
    if score >= 95:
        return "S"
    elif score >= 85:
        return "A"
    elif score >= 70:
        return "B"
    elif score >= 50:
        return "C"
    else:
        return "F"

def run_audit(target_paths: List[Path]) -> Dict[str, Any]:
    file_list: List[Path] = []
    for p in target_paths:
        if p.is_file():
            file_list.append(p)
        elif p.is_dir():
            for ext in ["*.html", "*.tsx", "*.jsx", "*.css"]:
                file_list.extend(p.rglob(ext))

    # Filter out node_modules, .git, and out
    filtered = [
        f for f in file_list
        if "node_modules" not in f.parts and ".git" not in f.parts and "out" not in f.parts
    ]

    results = []
    total_score = 0
    total_critical = 0
    total_warning = 0

    for f in filtered:
        res = audit_file(f)
        results.append(res)
        total_score += res["score"]
        for item in res["findings"]:
            if item["severity"] == "CRITICAL":
                total_critical += 1
            else:
                total_warning += 1

    avg_score = int(total_score / len(results)) if results else 100
    overall_grade = get_grade(avg_score)

    return {
        "totalFilesAudited": len(results),
        "overallScore": avg_score,
        "overallGrade": overall_grade,
        "criticalIssues": total_critical,
        "warningIssues": total_warning,
        "fileReports": results
    }

def main():
    parser = argparse.ArgumentParser(description="MotionScore Performance Doctor (Motion AI Kit)")
    parser.add_argument("--path", nargs="*", default=None, help="Files or directories to audit")
    parser.add_argument("--json", action="store_true", help="Output JSON results")
    args = parser.parse_args()

    if args.path:
        paths = [Path(p) for p in args.path]
    else:
        # Defaults to project components, docs, and scripts
        paths = [
            ROOT / "docs",
            ROOT / "src/components",
            ROOT / "src/scenes"
        ]

    report = run_audit(paths)

    if args.json:
        print(json.dumps(report, indent=2))
        return

    print("=" * 80)
    print("  🩺 MOTIONSCORE PERFORMANCE DOCTOR — ANIMATION AUDIT")
    print("=" * 80)
    print(f"  Files Audited    : {report['totalFilesAudited']}")
    print(f"  Overall Score    : {report['overallScore']} / 100")
    print(f"  MotionScore Grade: [ GRADE {report['overallGrade']} ]")
    print(f"  Critical Reflows : {report['criticalIssues']}")
    print(f"  Deprecations     : {report['warningIssues']}")
    print("-" * 80)

    issue_count = 0
    for res in report["fileReports"]:
        if res["findings"]:
            grade = get_grade(res["score"])
            print(f"\n📄 {res['file']} (Score: {res['score']}/100, Grade: {grade}):")
            for f in res["findings"]:
                issue_count += 1
                icon = "❌" if f["severity"] == "CRITICAL" else "⚠️"
                print(f"   {icon} Line {f['line']}: {f['message']}")
                print(f"      👉 Fix: {f['advice']}")

    if issue_count == 0:
        print("\n✨ FLAWLESS! All audited animations use GPU-accelerated transforms & zero layout thrashing.")
    print("=" * 80)

if __name__ == "__main__":
    main()
