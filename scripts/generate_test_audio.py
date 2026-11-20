import wave, math, struct

with wave.open('inputs/test_voiceover.wav', 'w') as f:
    f.setnchannels(1)
    f.setsampwidth(2)
    f.setframerate(44100)
    for i in range(44100 * 35):
        val = int(32767.0 * 0.5 * math.sin(2.0 * math.pi * 440.0 * i / 44100))
        f.writeframes(struct.pack('<h', val))

print("Created inputs/test_voiceover.wav successfully!")

