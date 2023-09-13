import * as THREE from "three";
export default class CutiImagePlane {
  constructor(experience) {
    this.experience = experience;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    // this.setCutiImagePlane();
    this.setGeometry();
    this.setTextures();
    this.setMaterial();
    this.setMesh();
  }

  setGeometry() {
    this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
  }

  setTextures() {
    this.textures = {};
    this.textures.cutiImagePlaneTexture =
      this.resources.items.cutiImagePlaneTexture;
  }

  setMaterial() {
    this.material = new THREE.MeshBasicMaterial({
      map: this.textures.cutiImagePlaneTexture,
      side: THREE.DoubleSide,
    });
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.scale.set(1.5, 1.5, 1.5);
    this.mesh.position.set(-0.94, -0.84, -0.59);
    this.mesh.rotation.set(0.59, 0, 0);
    this.scene.add(this.mesh);
  }

  //   setCutiImagePlane() {
  //     const cutiImagePlane1 = new THREE.Mesh(
  //       new THREE.PlaneGeometry(1, 1, 1, 1),
  //       new THREE.MeshBasicMaterial({
  //         map: this.resources.items.cutiImagePlaneTexture,
  //         side: THREE.DoubleSide,
  //       })
  //     );
  //     cutiImagePlane1.scale.set(1.5, 1.5, 1.5);
  //     cutiImagePlane1.position.set(-0.94, -0.84, -0.59);
  //     cutiImagePlane1.rotation.set(0.59, 0, 0);
  //     this.scene.add(cutiImagePlane1);
  //   }
}
