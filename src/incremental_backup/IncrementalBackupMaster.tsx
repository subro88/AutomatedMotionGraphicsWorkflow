import React from "react";
import { Series } from "remotion";
import { Scene01Intro } from "./scenes/Scene01Intro";
import { Scene02WhatIsIncremental } from "./scenes/Scene02WhatIsIncremental";
import { Scene03IncrementalVsDiff } from "./scenes/Scene03IncrementalVsDiff";
import { Scene04WindowsServerBackup } from "./scenes/Scene04WindowsServerBackup";
import { Scene05ConfigurePerformance } from "./scenes/Scene05ConfigurePerformance";
import { Scene06ScheduleBackup } from "./scenes/Scene06ScheduleBackup";
import { Scene07AomeiBackupper } from "./scenes/Scene07AomeiBackupper";
import { Scene08Limitations } from "./scenes/Scene08Limitations";
import { Scene09EndOfSupport } from "./scenes/Scene09EndOfSupport";
import { Scene10FinalSummary } from "./scenes/Scene10FinalSummary";

/**
 * Total Sequence Durations based on high-fidelity audio tracks:
 * Scene 1: 914 frames
 * Scene 2: 1510 frames
 * Scene 3: 1111 frames
 * Scene 4: 780 frames
 * Scene 5: 893 frames
 * Scene 6: 1022 frames
 * Scene 7: 1216 frames
 * Scene 8: 1217 frames
 * Scene 9: 763 frames
 * Scene 10: 1061 frames
 * Total = 10,487 frames (~349.57 seconds / ~5.83 minutes)
 */

export const IncrementalBackupMaster: React.FC = () => {
  return (
    <Series>
      <Series.Sequence durationInFrames={914}>
        <Scene01Intro />
      </Series.Sequence>
      <Series.Sequence durationInFrames={1510}>
        <Scene02WhatIsIncremental />
      </Series.Sequence>
      <Series.Sequence durationInFrames={1111}>
        <Scene03IncrementalVsDiff />
      </Series.Sequence>
      <Series.Sequence durationInFrames={780}>
        <Scene04WindowsServerBackup />
      </Series.Sequence>
      <Series.Sequence durationInFrames={893}>
        <Scene05ConfigurePerformance />
      </Series.Sequence>
      <Series.Sequence durationInFrames={1022}>
        <Scene06ScheduleBackup />
      </Series.Sequence>
      <Series.Sequence durationInFrames={1216}>
        <Scene07AomeiBackupper />
      </Series.Sequence>
      <Series.Sequence durationInFrames={1217}>
        <Scene08Limitations />
      </Series.Sequence>
      <Series.Sequence durationInFrames={763}>
        <Scene09EndOfSupport />
      </Series.Sequence>
      <Series.Sequence durationInFrames={1061}>
        <Scene10FinalSummary />
      </Series.Sequence>
    </Series>
  );
};
