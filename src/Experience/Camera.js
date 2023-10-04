import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls.js";
import gsap from "gsap";
import { FlyControls } from "three/addons/controls/FlyControls.js";

export default class Camera {
  constructor(experience) {
    this.experience = experience;
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;
    this.debug = this.experience.debug;

    this.setInstance();
    this.setOrbitControls();
  }

  setInstance() {
    this.instance = new THREE.PerspectiveCamera(
      45,
      this.sizes.width / this.sizes.height,
      0.1,
      100
    );
    this.instance.position.set(0, 4.8, 4.8);
    this.instance.rotation.set(0, 0, 0);
    this.instance.lookAt(0, 4.8, 4.8);
    this.scene.add(this.instance);
  }
  setOrbitControls() {
    // this.controls = new OrbitControls(this.instance, this.canvas);
    // this.controls.enableDamping = true;

    // First person camera
    // this.controls = new FirstPersonControls(this.instance, this.canvas);
    // this.controls.movementSpeed = 8;
    // this.controls.lookSpeed = 0.08;
    //add fly controls
    // this.controls = new FlyControls(this.instance, this.canvas);
    // this.controls.movementSpeed = 18;
    // this.controls.domElement = this.canvas;
    // this.controls.rollSpeed = Math.PI / 24;
    // this.controls.autoForward = false;
    // this.controls.dragToLook = false;
    // this.controls.lookHorizontal = true;

    // this.controls.lookVertical = true;
    // this.controls.constrainVertical = true;
    // this.controls.verticalMin = 1.0;
    // this.controls.verticalMax = 2.0;
    // this.controls.lon = -150;
    // this.controls.lat = 120;

    let position = 0;

    window.addEventListener("mouseup", () => {
      console.log(this.instance.position);

      switch (position) {
        case 0:
          this.moveCamera(10.3, -0.3, 4.4);
          this.rotateCamera(-0.48, -3.14, 0);
          position = 1;
          break;
        case 1:
          this.moveCamera(-1.9, 28.8, 13.5);
          this.rotateCamera(0.66, -3.14, 0);
          position = 2;
          break;
        case 2:
          this.moveCamera(-15.1, 2.3, 16.2);
          this.rotateCamera(0, -0.64, 0);
          position = 3;
          break;
        case 3:
          this.moveCamera(-0.3, 0.33, 6.44);
          this.rotateCamera(0.07, -0.02, 0);
          position = 0;
          break;
      }
    });

    // Debug

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("Camera");
      this.debugFolder
        .add(this.instance.position, "x")
        .min(-100)
        .max(100)
        .step(0.1)
        .name("Position x");
      this.debugFolder
        .add(this.instance.position, "y")
        .min(-100)
        .max(100)
        .step(0.1)
        .name("Position y");
      this.debugFolder
        .add(this.instance.position, "z")
        .min(-100)
        .max(100)
        .step(0.1)
        .name("Position z");

      //add rotation
      this.debugFolder
        .add(this.instance.rotation, "x")
        .min(-Math.PI)
        .max(Math.PI)
        .step(0.01)
        .name("Rotation x");
      this.debugFolder
        .add(this.instance.rotation, "y")
        .min(-Math.PI)
        .max(Math.PI)
        .step(0.01)
        .name("Rotation y");
      this.debugFolder
        .add(this.instance.rotation, "z")
        .min(-Math.PI)
        .max(Math.PI)
        .step(0.01)
        .name("Rotation z");
    }
  }

  moveCamera(x, y, z) {
    gsap.to(this.instance.position, {
      duration: 6.5,
      x,
      y,
      z,
      ease: "back.out",
    });
  }

  rotateCamera(x, y, z) {
    gsap.to(this.instance.rotation, {
      duration: 6.5,
      x,
      y,
      z,
      ease: "sine.out",
    });
  }
  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }
  update() {
    // Update controls
    // this.controls.update(this.experience.time.getDeltaClock);
  }
}
