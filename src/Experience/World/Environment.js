import * as THREE from "three";
export default class Environment {
  constructor(experience) {
    this.experience = experience;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.debug = this.experience.experience.debug;

    this.ambientLight();
  }

  ambientLight() {
    this.ambientLight = new THREE.AmbientLight(0xffebad, 2);
    this.scene.add(this.ambientLight);
    //Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("Ambient light");
      this.debugFolder
        .add(this.ambientLight, "intensity")
        .min(0)
        .max(5)
        .step(0.001)
        .name("Intensity");
      //debug color
      this.debugFolder
        .addColor(this.ambientLight, "color")
        .name("Color")
        .onFinishChange(() => {
          this.ambientLight.color.set(this.ambientLight.color);
        });
    }
  }
}
