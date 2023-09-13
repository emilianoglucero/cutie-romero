import * as THREE from "three";
import Environment from "./Environment";
import CutiImagePlane from "./CutiPlaneImages";
import CutiDancingModel from "./CutDancingModel";
import SceneSky from "./SceneSky";
import Clouds from "./Clouds";
export default class World {
  constructor(experience) {
    this.experience = experience;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    // Wait for the resources to be ready
    this.resources.on("ready", () => {
      console.log("resources ready");

      //Setup
      this.environment = new Environment(this);
      this.cutiImagePlane = new CutiImagePlane(this);
      this.cutiDancingModel = new CutiDancingModel(this);
      this.sky = new SceneSky(this);
      this.clouds = new Clouds(this);
    });
  }

  update() {
    if (this.cutiDancingModel) {
      this.cutiDancingModel.update();
    }
    if (this.clouds) {
      this.clouds.update();
    }
  }
}
