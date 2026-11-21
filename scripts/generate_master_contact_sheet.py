import subprocess
from pathlib import Path

video_path = "out/master/Incremental_Backup_2008_Vertical_Master.mp4"
out_dir = Path("out/master/stills")
out_dir.mkdir(parents=True, exist_ok=True)

timestamps = [
    ("scene01", "00:00:14"),
    ("scene02", "00:00:50"),
    ("scene03", "00:01:35"),
    ("scene04", "00:02:08"),
    ("scene05", "00:02:35"),
    ("scene06", "00:03:05"),
    ("scene07", "00:03:40"),
    ("scene08", "00:04:18"),
    ("scene09", "00:04:55"),
    ("scene10", "00:05:32")
]

frame_paths = []
for name, ts in timestamps:
    out_file = out_dir / f"{name}.png"
    cmd = [
        "ffmpeg", "-y", "-ss", ts, "-i", video_path,
        "-vframes", "1", "-q:v", "2", str(out_file)
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    frame_paths.append(str(out_file))

print(f"Extracted {len(frame_paths)} keyframes from master video.")

# Combine into 5 columns x 2 rows contact sheet
filter_inputs = "".join([f"[{i}:v]scale=360:640[v{i}];" for i in range(10)])
row1 = "".join([f"[v{i}]" for i in range(5)]) + "hstack=inputs=5[row1];"
row2 = "".join([f"[v{i}]" for i in range(5, 10)]) + "hstack=inputs=5[row2];"
filter_complex = f"{filter_inputs}{row1}{row2}[row1][row2]vstack=inputs=2[out]"

contact_path = "out/master/master_video_contact_sheet.png"
input_args = []
for p in frame_paths:
    input_args.extend(["-i", p])

montage_cmd = ["ffmpeg", "-y"] + input_args + ["-filter_complex", filter_complex, "-map", "[out]", contact_path]
subprocess.run(montage_cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
print("Created contact sheet:", contact_path)
