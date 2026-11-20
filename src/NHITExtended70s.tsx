import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { BroadcastScene01Hook } from "./scenes/broadcast/BroadcastScene01Hook";
import { BroadcastScene02Intro } from "./scenes/broadcast/BroadcastScene02Intro";
import { BroadcastScene03Branches } from "./scenes/broadcast/BroadcastScene03Branches";
import { BroadcastScene04Eligibility } from "./scenes/broadcast/BroadcastScene04Eligibility";
import { BroadcastScene05Affiliation } from "./scenes/broadcast/BroadcastScene05Affiliation";
import { BroadcastScene06Urgency } from "./scenes/broadcast/BroadcastScene06Urgency";
import { BroadcastScene07CTA } from "./scenes/broadcast/BroadcastScene07CTA";
import { BroadcastTicker } from "./components/broadcast/BroadcastTicker";

export interface NHITExtendedProps {
  enableAudio?: boolean;
}

export const NHITExtended70s: React.FC<NHITExtendedProps> = ({
  enableAudio = true,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#071B33" }}>
      {/* 1. The Career Challenge Hook (0s - 7.5s | 225 frames) */}
      <Sequence
        from={0}
        durationInFrames={225}
        name="Scene 1: Career Hook"
        style={{
          scale: 0.87
        }}
      >
        <BroadcastScene01Hook />
      </Sequence>

      {/* 2. Introducing NHIT Durgapur (7.5s - 13s | 165 frames) */}
      <Sequence from={225} durationInFrames={165} name="Scene 2: NHIT Durgapur">
        <BroadcastScene02Intro />
      </Sequence>

      {/* 3. Choose Your Engineering Branch (13s - 22.5s | 285 frames) */}
      <Sequence from={390} durationInFrames={285} name="Scene 3: Programmes">
        <BroadcastScene03Branches />
      </Sequence>

      {/* 4. Candidate Eligibility (22.5s - 32.5s | 300 frames) */}
      <Sequence from={675} durationInFrames={300} name="Scene 4: Eligibility">
        <BroadcastScene04Eligibility />
      </Sequence>

      {/* 5. Statutory Affiliation & AICTE (32.5s - 44s | 345 frames) */}
      <Sequence from={975} durationInFrames={345} name="Scene 5: Affiliation">
        <BroadcastScene05Affiliation />
      </Sequence>

      {/* 6. Limited Seats Capacity & Urgency (44s - 55s | 330 frames) */}
      <Sequence from={1320} durationInFrames={330} name="Scene 6: Limited Seats">
        <BroadcastScene06Urgency />
      </Sequence>

      {/* 7. Final Brand Reveal & Direct Contact (55s - 70s | 450 frames) */}
      <Sequence from={1650} durationInFrames={450} name="Scene 7: CTA & Helpline">
        <BroadcastScene07CTA />
      </Sequence>

      {/* Persistent Broadcast Bottom Marquee Ticker */}
      <BroadcastTicker />

      {/* Synchronized 70.00s Master Indian Female Voiceover */}
      {enableAudio && (
        <Audio src={staticFile("nhit_female_70s.mp3")} volume={1.0} />
      )}
    </AbsoluteFill>
  );
};

