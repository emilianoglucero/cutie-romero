import * as THREE from "three";
import Sizes from "./Utils/Sizes.js";
import Time from "./Utils/Time.js";
import Camera from "./Camera.js";
import Renderer from "./Renderer.js";
import World from "./World/World.js";
import Environment from "./World/Environment.js";
import Resources from "./Utils/Resources.js";
import sources from "./sources.js";
import Debug from "./Utils/Debug.js";

export default class Experience {
  constructor() {
    // Global access
    window.experience = this;

    //Options
    this.canvas = document.querySelector("canvas.webgl");

    //Setup
    this.debug = new Debug();
    this.sizes = new Sizes();
    this.time = new Time();
    this.scene = new THREE.Scene();
    this.resources = new Resources(sources);
    this.camera = new Camera(this);
    this.renderer = new Renderer(this);
    this.world = new World(this);
    this.environment = new Environment(this);

    //Sizes resize Events
    this.sizes.on("resize", () => {
      this.resize();
    });

    //Time tick Events
    this.time.on("tick", () => {
      this.update();
    });
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
  }

  update() {
    //Update camera
    this.camera.update();
    this.world.update();
    this.renderer.update();

    // //Render
    // window.experience.renderer.render(
    //   window.experience.scene,
    //   window.experience.camera.instance
    // );
  }
}
