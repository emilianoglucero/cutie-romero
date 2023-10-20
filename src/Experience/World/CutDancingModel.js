import * as THREE from "three";
export default class CutiDancingModel {
  constructor(experience) {
    this.experience = experience;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.experience.time;
    this.debug = this.experience.experience.debug;

    // Setup
    this.resource = this.resources.items.cutiDancingModel;

    this.setModel();
    this.setAnimation();
  }

  setModel() {
    this.model = this.resource;
    this.model.scale.set(0.006, 0.006, 0.006);
    this.model.position.set(3, 0, 0);
    this.scene.add(this.model);

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("Cuti Dancing Model");
      this.debugFolder
        .add(this.model.position, "x", -10, 10, 0.01)
        .name("Model x position");
      this.debugFolder
        .add(this.model.position, "y", -10, 10, 0.01)
        .name("Model y position");
      this.debugFolder
        .add(this.model.position, "z", -10, 10, 0.01)
        .name("Model z position");
    }
  }

  setAnimation() {
    this.mixer = new THREE.AnimationMixer(this.model);
    this.action = this.mixer.clipAction(this.model.animations[0]);
    this.action.play();
  }

  update() {
    if (this.mixer) {
      this.mixer.update(this.time.delta * 0.001);
    }
  }
}
