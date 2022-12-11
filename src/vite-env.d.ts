/// <reference types="svelte" />
/// <reference types="vite/client" />
import type {Engine, Scene, UniversalCamera} from "@babylonjs/core";

declare global {
  interface GameContext {
    get engine(): Engine
    get canvas(): HTMLCanvasElement
    get scene(): Scene
    get camera(): UniversalCamera
  }
}
