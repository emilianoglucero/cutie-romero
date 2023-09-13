import * as THREE from "three";
import Environment from "./Environment.js";
import CutiImagePlane from "./CutiPlaneImages.js";
import CutiDancingModel from "./CutDancingModel.js";
import SceneSky from "./SceneSky.js";
import Clouds from "./Clouds.js";
import Rainbow from "./Rainbow.js";
import Title3D from "./Title3D.js";
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
      this.rainbow = new Rainbow(this);
      this.Title3D = new Title3D(this);
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
