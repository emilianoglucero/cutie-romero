import * as THREE from "three";
import { Sky } from "three/addons/objects/Sky.js";

export default class SceneSky {
  constructor(experience) {
    this.experience = experience;
    this.scene = this.experience.scene;
    this.renderer = this.experience.experience.renderer;
    this.debug = this.experience.experience.debug;
    this.setSceneSky();
  }

  setSceneSky() {
    this.helper = new THREE.GridHelper(10000, 2, 0xffffff, 0xffffff);
    this.scene.add(this.helper);
    this.sky = new Sky();
    this.sky.scale.setScalar(450000);
    this.scene.add(this.sky);
    this.sun = new THREE.Vector3();

    this.effectController = {
      turbidity: 1.6,
      rayleigh: 1.8,
      mieCoefficient: 0.005,
      mieDirectionalG: 0.7,
      elevation: 2.6,
      azimuth: 180,
      exposure: this.renderer.toneMappingExposure,
    };

    this.uniforms = this.sky.material.uniforms;
    this.uniforms["turbidity"].value = this.effectController.turbidity;
    this.uniforms["rayleigh"].value = this.effectController.rayleigh;
    this.uniforms["mieCoefficient"].value =
      this.effectController.mieCoefficient;
    this.uniforms["mieDirectionalG"].value =
      this.effectController.mieDirectionalG;

    this.phi = THREE.MathUtils.degToRad(90 - this.effectController.elevation);
    this.theta = THREE.MathUtils.degToRad(this.effectController.azimuth);

    this.sun.setFromSphericalCoords(1, this.phi, this.theta);

    this.uniforms["sunPosition"].value.copy(this.sun);

    this.renderer.toneMappingExposure = this.effectController.exposure;

    // Debug
    // if (this.debug.active) {
    //   this.skyFolder = this.debug.ui.addFolder("Sky");
    //   this.skyFolder
    //     .add(this.effectController, "turbidity", 0.0, 20.0, 0.1)
    //     .onChange(guiChanged()());
    //   this.skyFolder
    //     .add(this.effectController, "rayleigh", 0.0, 4, 0.001)
    //     .onChange(guiChanged()());
    //   this.skyFolder
    //     .add(this.effectController, "mieCoefficient", 0.0, 0.1, 0.001)
    //     .onChange(guiChanged()());
    //   this.skyFolder
    //     .add(this.effectController, "mieDirectionalG", 0.0, 1, 0.001)
    //     .onChange(guiChanged()());
    //   this.skyFolder
    //     .add(this.effectController, "elevation", 0, 90, 0.1)
    //     .onChange(guiChanged()());
    //   this.skyFolder
    //     .add(this.effectController, "azimuth", -180, 180, 0.1)
    //     .onChange(guiChanged()());
    //   this.skyFolder
    //     .add(this.effectController, "exposure", 0, 1, 0.0001)
    //     .onChange(guiChanged()());
    // }
  }
}
