import * as THREE from "three";
export default class CutiDancingModel {
  constructor(experience) {
    this.experience = experience;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.experience.time;
    this.debug = this.experience.experience.debug;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("Cuti Dancing Model");
    }

    // Setup
    this.resource = this.resources.items.cutiDancingModel;

    this.setModel();
    this.setAnimation();
  }

  setModel() {
    this.model = this.resource;
    this.model.scale.set(0.01, 0.01, 0.01);
    this.model.position.set(0, -0.5, 0);
    this.model.rotation.set(0, 0, 0);
    this.scene.add(this.model);
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

  // /*
  //  ** Cuti Model
  //  */
  // // model
  // const loader = new FBXLoader();
  // // loader.load("models/fbx/cutiDancingTwerk.fbx", function (object) {
  // loader.load("models/fbx/cutiDancingTwerk.fbx", function (object) {
  //   mixer = new THREE.AnimationMixer(object);

  //   const action = mixer.clipAction(object.animations[0]);
  //   action.play();

  //   object.traverse(function (child) {
  //     if (child.isMesh) {
  //       child.castShadow = true;
  //       child.receiveShadow = true;
  //     }
  //   });

  //   //scale object
  //   object.scale.set(0.005, 0.005, 0.005);
  //   //position object
  //   object.position.set(2.37, -0.18, -0.43);

  //   scene.add(object);
}
