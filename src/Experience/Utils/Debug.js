import { GUI } from "three/addons/libs/lil-gui.module.min.js";
export default class Debug {
  constructor() {
    this.active = window.location.hash === "#debug";

    if (this.active) {
      this.ui = new GUI();
    }
    // this.setConfig();
    // this.setGUI();
  }
}

// setConfig() {
//     this.config = {};
//     this.config.debug = true;
//     this.config.debugCamera = false;
//     this.config.debugScene = false;
//     this.config.debugLight = false;
//     this.config.debugModel = false;
//     this.config.debugPlane = false;
//     this.config.debugPlaneImage = false;
//     this.config.debugPlaneVideo = false;
//     this.config.debugPlaneVideoControls = false;
