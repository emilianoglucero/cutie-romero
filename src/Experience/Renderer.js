import * as THREE from "three";
import Experience from "./Experience";

export default class Renderer {
  constructor(experience) {
    this.experience = experience;

    this.canvas = this.experience.canvas;
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;

    this.setInstance();
  }

  setInstance() {
    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      powerPreference: "high-performance",
    });
    // Update renderer
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.instance.shadowMap.autoUpdate = false;
    // console.log(this.instance.info);
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
  update() {
    this.instance.render(this.scene, this.camera.instance);
  }
}
