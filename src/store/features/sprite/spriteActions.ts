import { createAction } from "@reduxjs/toolkit";
import {
  Metasprite,
  MetaspriteTile,
  SpriteAnimation,
  SpriteSheet,
} from "../entities/entitiesTypes";

const detectSprite = createAction<{ spriteSheetId: string }>(
  "sprite/detect/pending"
);
const detectSpriteComplete = createAction<{
  spriteSheetId: string;
  spriteAnimations: SpriteAnimation[];
  metasprites: Metasprite[];
  metaspriteTiles: MetaspriteTile[];
  changes: Partial<SpriteSheet>;
}>("sprite/detect/fulfilled");

const compileSprite = createAction(
  "sprite/compile",
  (payload: { spriteSheetId: string }) => ({
    payload,
    meta: { throttle: 2000, key: payload.spriteSheetId },
  })
);

export default {
  detectSprite,
  detectSpriteComplete,
  compileSprite,
};