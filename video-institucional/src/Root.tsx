import React from "react";
import { Composition, Folder } from "remotion";
import { DURATION, InstitutionalVideo } from "./Video";
import { FPS } from "./timeline";

export const RemotionRoot: React.FC = () => (
  <Folder name="Odontocril">
    <Composition id="Vertical" component={InstitutionalVideo} durationInFrames={DURATION} fps={FPS} width={1080} height={1920} />
    <Composition id="Horizontal" component={InstitutionalVideo} durationInFrames={DURATION} fps={FPS} width={1920} height={1080} />
  </Folder>
);
