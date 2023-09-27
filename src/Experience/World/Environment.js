import * as THREE from "three";
export default class Environment {
  constructor(experience) {
    console.log(experience);

    this.experience = experience;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.debug = this.experience.experience.debug;

    // this.setSunLight();
    this.ambientLight();
  }

  setSunLight() {
    this.sunLight = new THREE.DirectionalLight(0xffffff, 4);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.camera.far = 15;
    this.sunLight.shadow.mapSize.set(1024, 1024);
    this.sunLight.shadow.normalBias = 0.05;
    this.sunLight.position.set(3, 3, -2.25);
    this.scene.add(this.sunLight);

    //helper for sun light
    this.sunLightHelper = new THREE.DirectionalLightHelper(this.sunLight, 1);
    console.log(this.sunLightHelper);
    this.scene.add(this.sunLightHelper);

    //my code
    // this.hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 5);
    // this.hemiLight.position.set(0, 200, 0);
    // this.scene.add(this.hemiLight);
    // //helper for hemi light
    // this.hemiLightHelper = new THREE.HemisphereLightHelper(this.hemiLight, 10);
    // console.log(this.hemiLightHelper);
    // this.scene.add(this.hemiLightHelper);
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
