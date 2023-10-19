import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls.js";
import gsap from "gsap";
import { FlyControls } from "three/addons/controls/FlyControls.js";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";

export default class Camera {
  constructor(experience) {
    this.experience = experience;
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;
    this.debug = this.experience.debug;

    this.cursorElement = document.querySelector(".cursor");
    this.btnNextElement = document.querySelector(".btn-next");
    this.btnMusic = document.querySelector(".btn-music");

    this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    this.setInstance();
    this.setOrbitControls();
  }

  setInstance() {
    /**
     * Group
     */
    this.instanceGroup = new THREE.Group();
    this.scene.add(this.instanceGroup);

    // Base Camera
    this.instance = new THREE.PerspectiveCamera(
      45,
      this.sizes.width / this.sizes.height,
      0.1,
      50
    );
    this.instance.position.set(0, 5.1, 4.8);
    this.instance.rotation.set(0, 0, 0);
    this.instance.lookAt(0, 5.1, 4.8);
    this.instanceGroup.add(this.instance);
  }
  setOrbitControls() {
    //orbit controls
    // this.controls = new OrbitControls(
    //   this.instance,
    //   this.canvas,
    //   this.sizes.width / this.sizes.height
    // );
    // this.controls.enableDamping = true;

    let position = 0;

    window.addEventListener("mouseup", (event) => {
      if (conditionsToMoveCamera(event.target, this.btnMusic, this.isMobile)) {
        switch (position) {
          case 0:
            // cuti image planes
            this.moveCamera(7.1, 9.5, 5.8);
            this.rotateCamera(0.58, -3.14, 0);
            position = 1;
            break;
          case 1:
            //cuti cloth
            this.moveCamera(0.3, 11.2, 17.1);
            this.rotateCamera(-0.39, 0, 0);
            position = 2;
            break;
          case 2:
            //cutison
            this.moveCamera(-10.8, 0.6, 16.8);
            this.rotateCamera(0, -0.16, 0);
            position = 3;
            break;
          case 3:
            //cuti videos
            this.moveCamera(-0.4, 2.4, 31.9);
            this.rotateCamera(-0.71, 0.1, 0);
            position = 4;
            break;
          case 4:
            //cuti videos
            this.moveCamera(-0.3, 0.33, 6.44);
            this.rotateCamera(0.07, -0.02, 0);
            position = 0;
            break;
        }
      }
    });

    function isInsideBtnMusic(target) {
      if (target.closest(".stop") || target.closest(".play")) {
        return true;
      }
      return false;
    }

    function conditionsToMoveCamera(target, btnMusic, isMobile) {
      if (isMobile === true) {
        if (target.closest(".btn-next")) {
          return true;
        }
        return false;
      } else {
        if (
          isInsideBtnMusic(target) === false &&
          btnMusic.style.display === "block"
        ) {
          return true;
        }
        return false;
      }
    }

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

    /**
     * Cursor
     */

    this.cursor = {};
    this.cursor.x = 0;
    this.cursor.y = 0;

    window.addEventListener("mousemove", (event) => {
      this.cursor.x = event.clientX / this.sizes.width - 0.5;
      this.cursor.y = event.clientY / this.sizes.height - 0.5;
    });
  }

  moveCamera(x, y, z) {
    gsap.to(this.instance.position, {
      duration: 6.5,
      x,
      y,
      z,
      ease: "back.out",
      onComplete: () => {
        this.cursorElement.classList.add("big");
        this.btnNextElement.classList.add("active");
      },
    });
    this.cursorElement.classList.remove("big");
    this.btnNextElement.classList.remove("active");
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

    // Parallax formula
    this.parallaxX = this.cursor.x;
    this.parallaxY = -this.cursor.y;
    this.instanceGroup.position.x +=
      (this.parallaxX - this.instanceGroup.position.x) *
      9 *
      this.experience.time.getDeltaClock;
    this.instanceGroup.position.y +=
      (this.parallaxY - this.instanceGroup.position.y) *
      9 *
      this.experience.time.getDeltaClock;
  }
}
