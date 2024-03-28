import {Scene} from "@babylonjs/core";
import { ParticleGenerator } from "./particleGenerator";
import { FluidSimulator } from "./fluidSimulator";
import { FluidRenderer } from "@babylonjs/core";

export class FluidSimulation {
    scene: Scene;
    protected _fluidRenderer: FluidRenderer;
    protected _particleGenerator: ParticleGenerator;
    protected _fluidSimulator: FluidSimulator;
    constructor(scene) {
        this.scene = scene;
    }

    setupFluidContainerAndEmission() {

    }
}
