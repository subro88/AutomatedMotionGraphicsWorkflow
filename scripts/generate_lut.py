#!/usr/bin/env python3
from pathlib import Path
import math

def generate_tech_cinematic_lut(output_path: Path, size: int = 17):
    output_path.parent.mkdir(parents=True, exist_ok=True)
    lines = [
        'TITLE "Tech_Cinematic"',
        f'LUT_3D_SIZE {size}',
        ""
    ]

    for b in range(size):
        for g in range(size):
            for r in range(size):
                rn = r / (size - 1)
                gn = g / (size - 1)
                bn = b / (size - 1)

                # S-curve contrast (smooth sine roll-off)
                r_out = 0.5 * (1.0 + math.sin(math.pi * (rn - 0.5)))
                g_out = 0.5 * (1.0 + math.sin(math.pi * (gn - 0.5)))
                b_out = 0.5 * (1.0 + math.sin(math.pi * (bn - 0.5)))

                # Subtle cyber cyan shadow push
                shadow_mask = max(0.0, 1.0 - (rn + gn + bn) / 1.5)
                b_out = min(1.0, max(0.0, b_out + shadow_mask * 0.04))
                r_out = min(1.0, max(0.0, r_out - shadow_mask * 0.02))

                lines.append(f"{r_out:.6f} {g_out:.6f} {b_out:.6f}")

    output_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"✔ 3D LUT generated: {output_path} ({size}x{size}x{size})")

def generate_warm_saffron_gold_lut(output_path: Path, size: int = 17):
    output_path.parent.mkdir(parents=True, exist_ok=True)
    lines = [
        'TITLE "Warm_Saffron_Gold"',
        f'LUT_3D_SIZE {size}',
        ""
    ]

    for b in range(size):
        for g in range(size):
            for r in range(size):
                rn = r / (size - 1)
                gn = g / (size - 1)
                bn = b / (size - 1)

                # Rich S-curve contrast
                r_out = 0.5 * (1.0 + math.sin(math.pi * (rn - 0.5)))
                g_out = 0.5 * (1.0 + math.sin(math.pi * (gn - 0.5)))
                b_out = 0.5 * (1.0 + math.sin(math.pi * (bn - 0.5)))

                # Warm Saffron (#FF9933) highlight push and golden midtone lift
                highlight_mask = (rn + gn) * 0.5
                r_out = min(1.0, max(0.0, r_out + highlight_mask * 0.05))
                g_out = min(1.0, max(0.0, g_out + highlight_mask * 0.02))
                b_out = min(1.0, max(0.0, b_out - highlight_mask * 0.03))

                lines.append(f"{r_out:.6f} {g_out:.6f} {b_out:.6f}")

    output_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"✔ 3D LUT generated: {output_path} ({size}x{size}x{size})")

if __name__ == "__main__":
    generate_tech_cinematic_lut(Path("assets/grades/Tech_Cinematic.cube"), size=17)
    generate_warm_saffron_gold_lut(Path("assets/grades/Warm_Saffron_Gold.cube"), size=17)

