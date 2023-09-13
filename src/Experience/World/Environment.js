import * as THREE from "three";
export default class Environment {
  constructor(experience) {
    this.experience = experience;
    this.scene = this.experience.scene;

    this.setSunLight();
  }

  setSunLight() {
    this.sunLight = new THREE.DirectionalLight(0xffffff, 4);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.camera.far = 15;
    this.sunLight.shadow.mapSize.set(1024, 1024);
    this.sunLight.shadow.normalBias = 0.05;
    this.sunLight.position.set(3, 3, -2.25);
    this.scene.add(this.sunLight);

    //my code
    // this.hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 5);
    // this.hemiLight.position.set(0, 200, 0);
    // this.scene.add(this.hemiLight);
    // //helper for hemi light
    // this.hemiLightHelper = new THREE.HemisphereLightHelper(this.hemiLight, 10);
    // console.log(this.hemiLightHelper);
    // this.scene.add(this.hemiLightHelper);
  }
}
