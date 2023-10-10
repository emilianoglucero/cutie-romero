import * as THREE from "three";
import gsap from "gsap";
export default class CutiPlaneImages {
  constructor(experience) {
    this.experience = experience;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.debug = this.experience.experience.debug;

    this.amoutOfCutiImages = 10 + 1;

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
    for (let i = 1; i < this.amoutOfCutiImages; i++) {
      this.textures[`cutiImagePlaneTexture${i}`] =
        this.resources.items[`cutiImagePlaneTexture${i}`];
    }
  }

  setMaterial() {
    this.cutiMaterials = [];

    for (let i = 1; i < this.amoutOfCutiImages; i++) {
      this.cutiMaterials[i] = new THREE.MeshBasicMaterial({
        map: this.textures[`cutiImagePlaneTexture${i}`],
        side: THREE.DoubleSide,
      });
    }
  }

  setMesh() {
    this.cutiPlaneImages = [];

    for (let i = 1; i < this.amoutOfCutiImages; i++) {
      this.cutiPlaneImages[i] = new THREE.Mesh(
        this.geometry,
        this.cutiMaterials[i]
      );
    }
    console.log(this.cutiPlaneImages);
    // this.cuti1 = new THREE.Mesh(this.geometry, this.cutiMaterials[0]);
    this.cutiPlaneImages[1].scale.set(1.5, 1.5, 1.5);
    this.cutiPlaneImages[1].position.set(-0.94, -0.84, -0.59);
    this.cutiPlaneImages[1].rotation.set(0.59, 0, 0);

    // this.cutiPlaneImages[2] = new THREE.Mesh(this.geometry, this.cutiMaterials[1]);
    this.cutiPlaneImages[2].scale.set(1.5, 1.5, 1.5);
    this.cutiPlaneImages[2].position.set(-0.18, 0.59, -0.69);
    this.cutiPlaneImages[2].rotation.set(0.59, 0, 0);

    // this.cutiPlaneImages[2] = new THREE.Mesh(this.geometry, this.cutiMaterials[2]);
    this.cutiPlaneImages[3].scale.set(1.5, 1.5, 1.5);
    this.cutiPlaneImages[3].position.set(0.46, -0.65, 0);
    this.cutiPlaneImages[3].rotation.set(5.88, 2.75, -0.34);

    this.cutiPlaneImages[4].scale.set(1.5, 1.5, 1.5);
    this.cutiPlaneImages[4].position.set(1.48, 0, -0.16);
    this.cutiPlaneImages[4].rotation.set(0, -0.92, 0.13);

    // this.cutiPlaneImages[5] = new THREE.Mesh(this.geometry, this.cutiMaterial5);
    this.cutiPlaneImages[5].scale.set(1.5, 1.5, 1.5);
    this.cutiPlaneImages[5].position.set(-1.63, 0.44, -0.62);
    this.cutiPlaneImages[5].rotation.set(-2.84, 0.19, 0.72);

    // this.cutiPlaneImages[6] = new THREE.Mesh(this.geometry, this.cutiMaterial6);
    this.cutiPlaneImages[6].scale.set(1.5, 1.5, 1.5);
    this.cutiPlaneImages[6].position.set(0.44, 1.45, 0.93);
    this.cutiPlaneImages[6].rotation.set(0, 7.4, 0);

    // this.cutiPlaneImages[7] = new THREE.Mesh(this.geometry, this.cutiMaterial7);
    this.cutiPlaneImages[7].scale.set(1.5, 1.5, 1.5);
    this.cutiPlaneImages[7].position.set(0.67, -0.42, -0.93);
    this.cutiPlaneImages[7].rotation.set(0, 3.92, 0);

    // this.cutiPlaneImages[8] = new THREE.Mesh(this.geometry, this.cutiMaterial8);
    this.cutiPlaneImages[8].scale.set(1.5, 1.5, 1.5);
    this.cutiPlaneImages[8].position.set(-0.64, 1.98, -0.68);
    this.cutiPlaneImages[8].rotation.set(0, 0.65, 0.66);

    // this.cutiPlaneImages[9] = new THREE.Mesh(this.geometry, this.cutiMaterial9);
    this.cutiPlaneImages[9].scale.set(1.5, 1.5, 1.5);
    this.cutiPlaneImages[9].position.set(0.78, 1.35, -0.38);
    this.cutiPlaneImages[9].rotation.set(-0.36, -0.89, 0.68);

    this.cutiPlaneImages[10].scale.set(1.5, 1.5, 1.5);
    this.cutiPlaneImages[10].position.set(1.64, 1.98, -0.68);
    this.cutiPlaneImages[10].rotation.set(0, 0.65, 0.66);

    this.cutiGroup = new THREE.Group();
    this.cutiGroup.add(
      this.cutiPlaneImages[1],
      this.cutiPlaneImages[2],
      this.cutiPlaneImages[2],
      this.cutiPlaneImages[4],
      this.cutiPlaneImages[5],
      this.cutiPlaneImages[6],
      this.cutiPlaneImages[7],
      this.cutiPlaneImages[8],
      this.cutiPlaneImages[9],
      this.cutiPlaneImages[10]
    );
    this.cutiGroup.position.set(10.95, 3.32, 13.5);

    gsap.to(this.cutiGroup.rotation, {
      duration: 12,
      y: Math.PI * 2,
      repeat: -1,
      ease: "none",
    });

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("Cuti Plane Images");

      this.debugFolder
        .add(this.cutiPlaneImages[10].position, "x", -100, 100, 0.01)
        .name("cutiPlaneImages[9] x position");

      this.debugFolder
        .add(this.cutiPlaneImages[10].position, "y", -100, 100, 0.01)
        .name("cutiPlaneImages[9] y position");

      this.debugFolder
        .add(this.cutiPlaneImages[10].position, "z", -100, 100, 0.01)
        .name("cutiPlaneImages[9] z position");

      this.debugFolder
        .add(this.cutiPlaneImages[10].rotation, "x", -100, 100, 0.01)
        .name("cutiPlaneImages[9] x rotation");

      this.debugFolder
        .add(this.cutiPlaneImages[10].rotation, "y", -100, 100, 0.01)
        .name("cutiPlaneImages[9] y rotation");

      this.debugFolder
        .add(this.cutiPlaneImages[10].rotation, "z", -100, 100, 0.01)
        .name("cutiPlaneImages[9] z rotation");

      this.debugFolder
        .add(this.cutiGroup.position, "x", -100, 100, 0.01)
        .name("Group x position");
      this.debugFolder
        .add(this.cutiGroup.position, "y", -100, 100, 0.01)
        .name("Group y position");
      this.debugFolder
        .add(this.cutiGroup.position, "z", -100, 100, 0.01)
        .name("Group z position");
    }
    this.scene.add(this.cutiGroup);
  }
}
