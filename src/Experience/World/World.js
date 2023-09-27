import * as THREE from "three";
import Environment from "./Environment.js";
import CutiPlaneImages from "./CutiPlaneImages.js";
import CutiDancingModel from "./CutDancingModel.js";
import SceneSky from "./SceneSky.js";
import Clouds from "./Clouds.js";
import Rainbow from "./Rainbow.js";
import Title3D from "./Title3D.js";
import Butterflies from "./Butterflies.js";
import Stats from "stats-gl";
import ExperienceStats from "../Utils/ExperienceStats.js";
import ClothPlane from "./ClothPlane.js";
import CutiPlaneImagesTitle from "./CutiPlaneImagesTitle.js";
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
      this.cutiPlaneImages = new CutiPlaneImages(this);
      this.cutiDancingModel = new CutiDancingModel(this);
      this.sky = new SceneSky(this);
      this.clouds = new Clouds(this);
      this.rainbow = new Rainbow(this);
      this.title3D = new Title3D(this);
      this.butterflies = new Butterflies(this);
      this.stats = new ExperienceStats(this);
      this.clothPlane = new ClothPlane(this);
      this.cutiPlaneImageTitle = new CutiPlaneImagesTitle(this);
    });
  }

  update() {
    if (this.cutiDancingModel) {
      this.cutiDancingModel.update();
    }
    if (this.clouds) {
      this.clouds.update();
    }
    if (this.butterflies) {
      this.butterflies.update();
    }
    if (this.clothPlane) {
      this.clothPlane.update();
    }
  }
}
