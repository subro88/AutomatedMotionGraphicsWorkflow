import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Scene01CareerChallenge } from "./scenes/nhit/Scene01CareerChallenge";
import { Scene02NHITIntroduction } from "./scenes/nhit/Scene02NHITIntroduction";
import { Scene03EngineeringBranches } from "./scenes/nhit/Scene03EngineeringBranches";
import { Scene04Eligibility } from "./scenes/nhit/Scene04Eligibility";
import { Scene05ApprovedIntake } from "./scenes/nhit/Scene05ApprovedIntake";
import { Scene06FinalReveal } from "./scenes/nhit/Scene06FinalReveal";

export interface NHITAdvertisementProps {
  enableAudio?: boolean;
}

export const NHITAdvertisement: React.FC<NHITAdvertisementProps> = ({
  enableAudio = true,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#071B33" }}>
      {/* Scene 1: The Career Challenge (0s - 5s | Frames 0 - 149) */}
      <Sequence from={0} durationInFrames={150} name="Scene 1: Career Challenge">
        <Scene01CareerChallenge />
      </Sequence>

      {/* Scene 2: Introducing NHIT Durgapur (5s - 10s | Frames 150 - 299) */}
      <Sequence from={150} durationInFrames={150} name="Scene 2: NHIT Durgapur">
        <Scene02NHITIntroduction />
      </Sequence>

      {/* Scene 3: Choose Your Engineering Branch (10s - 15s | Frames 300 - 449) */}
      <Sequence from={300} durationInFrames={150} name="Scene 3: Engineering Branches">
        <Scene03EngineeringBranches />
      </Sequence>

      {/* Scene 4: Candidate Eligibility (15s - 20s | Frames 450 - 599) */}
      <Sequence from={450} durationInFrames={150} name="Scene 4: Candidate Eligibility">
        <Scene04Eligibility />
      </Sequence>

      {/* Scene 5: Affiliation and Approved Intake (20s - 25s | Frames 600 - 749) */}
      <Sequence from={600} durationInFrames={150} name="Scene 5: Approved Intake">
        <Scene05ApprovedIntake />
      </Sequence>

      {/* Scene 6: Final Brand Reveal & Call to Action (25s - 30s | Frames 750 - 899) */}
      <Sequence from={750} durationInFrames={150} name="Scene 6: Final Call to Action">
        <Scene06FinalReveal />
      </Sequence>

      {/* Synchronized 30.00s Master Indian English Voiceover */}
      {enableAudio && (
        <Audio
          src={staticFile("nhit_voiceover.mp3")}
          volume={1.0}
        />
      )}
    </AbsoluteFill>
  );
};

