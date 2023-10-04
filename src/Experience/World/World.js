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
import CutiVideos from "./CutiVideos.js";
export default class World {
  constructor(experience) {
    this.experience = experience;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    // Wait for the resources to be ready
    this.resources.on("ready", () => {
      //Setup

      this.title3D = new Title3D(this);
      this.environment = new Environment(this);
      this.sky = new SceneSky(this);
      this.cutiDancingModel = new CutiDancingModel(this);
      this.cutiPlaneImageTitle = new CutiPlaneImagesTitle(this);
      this.clouds = new Clouds(this);
      this.butterflies = new Butterflies(this);
      this.cutiPlaneImages = new CutiPlaneImages(this);
      this.rainbow = new Rainbow(this);
      this.stats = new ExperienceStats(this);
      this.clothPlane = new ClothPlane(this);
      this.cutiVideos = new CutiVideos(this);
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
    if (this.cutiVideos) {
      this.cutiVideos.update();
    }
  }
}
