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

export interface NHITBroadcastProps {
  enableAudio?: boolean;
}

export const NHITBroadcast45s: React.FC<NHITBroadcastProps> = ({
  enableAudio = true,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#071B33" }}>
      {/* 1. The Career Challenge Hook (0s - 6s | 180 frames) */}
      <Sequence from={0} durationInFrames={180} name="Scene 1: Career Hook">
        <BroadcastScene01Hook />
      </Sequence>

      {/* 2. Introducing NHIT Durgapur (6s - 11s | 150 frames) */}
      <Sequence from={180} durationInFrames={150} name="Scene 2: NHIT Durgapur">
        <BroadcastScene02Intro />
      </Sequence>

      {/* 3. Choose Your Engineering Branch (11s - 18s | 210 frames) */}
      <Sequence from={330} durationInFrames={210} name="Scene 3: Programmes">
        <BroadcastScene03Branches />
      </Sequence>

      {/* 4. Candidate Eligibility (18s - 25s | 210 frames) */}
      <Sequence from={540} durationInFrames={210} name="Scene 4: Eligibility">
        <BroadcastScene04Eligibility />
      </Sequence>

      {/* 5. Statutory Affiliation & AICTE (25s - 32s | 210 frames) */}
      <Sequence from={750} durationInFrames={210} name="Scene 5: Affiliation">
        <BroadcastScene05Affiliation />
      </Sequence>

      {/* 6. Limited Seats Capacity & Urgency (32s - 38.5s | 195 frames) */}
      <Sequence from={960} durationInFrames={195} name="Scene 6: Limited Seats">
        <BroadcastScene06Urgency />
      </Sequence>

      {/* 7. Final Brand Reveal & Direct Contact (38.5s - 45s | 195 frames) */}
      <Sequence from={1155} durationInFrames={195} name="Scene 7: CTA & Helpline">
        <BroadcastScene07CTA />
      </Sequence>

      {/* Persistent Broadcast Bottom Marquee Ticker */}
      <BroadcastTicker />

      {/* Synchronized 45.00s Master Indian Female Voiceover */}
      {enableAudio && (
        <Audio src={staticFile("nhit_female_45s.mp3")} volume={1.0} />
      )}
    </AbsoluteFill>
  );
};

