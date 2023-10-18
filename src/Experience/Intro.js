import * as THREE from "three";
import gsap from "gsap";
export default class Intro {
  constructor(experience) {
    this.experience = experience;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.loadingBarElement = document.querySelector(".loading-bar");
    this.cursorElement = document.querySelector(".cursor");
    this.btnNextElement = document.querySelector(".btn-next");
    this.btnMusic = document.querySelector(".btn-music");

    this.setIntro();
  }

  setIntro() {
    this.overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);
    this.overlayMaterial = new THREE.ShaderMaterial({
      transparent: true,
      //precision: "lowp" causes the shader to not work on some devices,
      // precision: "lowp",
      uniforms: {
        uAlpha: { value: 1 },
      },
      vertexShader: `
            void main() {
                gl_Position = vec4(position, 1.0);
            }
        `,
      fragmentShader: `
            uniform float uAlpha;
            void main() {
                gl_FragColor = vec4(1.0, 1.0, 1.0, uAlpha);
            }
        `,
    });
    this.overlayMesh = new THREE.Mesh(
      this.overlayGeometry,
      this.overlayMaterial
    );
    this.overlayMesh.position.set(0, 4.4, 4.8);
    this.scene.add(this.overlayMesh);

    this.resources.on("ready", () => {
      // Create a timeline to sequence animations
      var timeline = gsap.timeline();
      gsap.delayedCall(0.5, () => {
        timeline.to(this.overlayMaterial.uniforms.uAlpha, {
          duration: 3,
          value: 0,
          delay: 1,
        });
        timeline.to(this.experience.camera.instance.position, {
          // duration: 7.5,
          duration: 0.5,
          x: -0.3,
          y: 0.33,
          z: 6.44,
          ease: "back.out",
          onComplete: () => {
            this.destroy();
            this.cursorElement.classList.add("big");
            this.btnNextElement.classList.add("active");
            this.btnMusic.style.display = "block";
          },
        });
        this.loadingBarElement.classList.add("ended");
        this.loadingBarElement.style.transform = "";
      });
    });
  }

  destroy() {
    this.overlayGeometry.dispose();
    this.overlayMaterial.dispose();
    this.scene.remove(this.overlayMesh);
  }
}
