import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { RedHeaderBanner } from "./components/infographic/RedHeaderBanner";
import { InfographicTicker } from "./components/infographic/InfographicTicker";
import { InfographicScene01Hook } from "./scenes/infographic/InfographicScene01Hook";
import { InfographicScene02Campus } from "./scenes/infographic/InfographicScene02Campus";
import { InfographicScene03Branches } from "./scenes/infographic/InfographicScene03Branches";
import { InfographicScene04Eligibility } from "./scenes/infographic/InfographicScene04Eligibility";
import { InfographicScene05Affiliation } from "./scenes/infographic/InfographicScene05Affiliation";
import { InfographicScene06Urgency } from "./scenes/infographic/InfographicScene06Urgency";
import { InfographicScene07CTA } from "./scenes/infographic/InfographicScene07CTA";

export interface InfographicProps {
  enableAudio?: boolean;
}

export const NHITInfographic16x9: React.FC<InfographicProps> = ({
  enableAudio = true,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0F19" }}>
      {/* Top Persistent Header Banner */}
      <RedHeaderBanner isVertical={false} />

      {/* Main 7 Scenes Track (Total 2541 frames / 84.7s) */}
      <div style={{ position: "absolute", top: "82px", bottom: "56px", left: 0, right: 0 }}>
        {/* Scene 1: 0 - 7s (210 frames) */}
        <Sequence from={0} durationInFrames={210} name="Scene 1: Career Hook">
          <InfographicScene01Hook isVertical={false} />
        </Sequence>

        {/* Scene 2: 7 - 14s (210 frames) */}
        <Sequence from={210} durationInFrames={210} name="Scene 2: NHIT Durgapur Intro">
          <InfographicScene02Campus isVertical={false} />
        </Sequence>

        {/* Scene 3: 14 - 26s (360 frames) */}
        <Sequence from={420} durationInFrames={360} name="Scene 3: Programmes EE & ME">
          <InfographicScene03Branches isVertical={false} />
        </Sequence>

        {/* Scene 4: 26 - 44s (540 frames) */}
        <Sequence from={780} durationInFrames={540} name="Scene 4: Candidate Eligibility">
          <InfographicScene04Eligibility isVertical={false} />
        </Sequence>

        {/* Scene 5: 44 - 58.5s (435 frames) */}
        <Sequence from={1320} durationInFrames={435} name="Scene 5: AICTE & Council Affiliation">
          <InfographicScene05Affiliation isVertical={false} />
        </Sequence>

        {/* Scene 6: 58.5 - 64.5s (180 frames) */}
        <Sequence from={1755} durationInFrames={180} name="Scene 6: Limited Seats Urgency">
          <InfographicScene06Urgency isVertical={false} />
        </Sequence>

        {/* Scene 7: 64.5 - 84.7s (606 frames) */}
        <Sequence from={1935} durationInFrames={606} name="Scene 7: Final Branding & Helpline">
          <InfographicScene07CTA isVertical={false} />
        </Sequence>
      </div>

      {/* Persistent Bottom Marquee Ticker */}
      <InfographicTicker isVertical={false} />

      {/* Synchronized Master ElevenLabs Voiceover */}
      {enableAudio && (
        <Audio src={staticFile("nhit_elevenlabs_audio.mp3")} volume={1.0} />
      )}
    </AbsoluteFill>
  );
};

