import React from "react";
import { Composition, Folder } from "remotion";
import { DURATION, InstitutionalVideo } from "./Video";
import { DURATION_V2, VideoV2 } from "./v2/VideoV2";
import { FPS } from "./timeline";
import { DURATION_TV, VideoTecvertex } from "./tecvertex/VideoTecvertex";

export const RemotionRoot: React.FC = () => (
  <>
    <Folder name="Odontocril">
      <Composition id="Vertical" component={VideoV2} durationInFrames={DURATION_V2} fps={FPS} width={1080} height={1920} />
      <Composition id="Horizontal" component={VideoV2} durationInFrames={DURATION_V2} fps={FPS} width={1920} height={1080} />
    </Folder>
    <Folder name="Tecvertex">
      <Composition id="Tecvertex-Vertical" component={VideoTecvertex} durationInFrames={DURATION_TV} fps={FPS} width={1080} height={1920} />
      <Composition id="Tecvertex-Horizontal" component={VideoTecvertex} durationInFrames={DURATION_TV} fps={FPS} width={1920} height={1080} />
    </Folder>
    <Folder name="Versao-1">
      <Composition id="V1-Vertical" component={InstitutionalVideo} durationInFrames={DURATION} fps={FPS} width={1080} height={1920} />
      <Composition id="V1-Horizontal" component={InstitutionalVideo} durationInFrames={DURATION} fps={FPS} width={1920} height={1080} />
    </Folder>
  </>
);
