import * as THREE from "three";
export default class CutiPlaneImages {
  constructor(experience) {
    this.experience = experience;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.debug = this.experience.experience.debug;

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
    this.textures.cutiImagePlaneTexture1 =
      this.resources.items.cutiImagePlaneTexture1;
    this.textures.cutiImagePlaneTexture2 =
      this.resources.items.cutiImagePlaneTexture2;
    this.textures.cutiImagePlaneTexture3 =
      this.resources.items.cutiImagePlaneTexture3;
    this.textures.cutiImagePlaneTexture4 =
      this.resources.items.cutiImagePlaneTexture4;
    this.textures.cutiImagePlaneTexture5 =
      this.resources.items.cutiImagePlaneTexture5;
    this.textures.cutiImagePlaneTexture6 =
      this.resources.items.cutiImagePlaneTexture6;
    this.textures.cutiImagePlaneTexture7 =
      this.resources.items.cutiImagePlaneTexture7;
    this.textures.cutiImagePlaneTexture8 =
      this.resources.items.cutiImagePlaneTexture8;
  }

  setMaterial() {
    this.cutiMaterial1 = new THREE.MeshBasicMaterial({
      map: this.textures.cutiImagePlaneTexture1,
      side: THREE.DoubleSide,
    });
    this.cutiMaterial2 = new THREE.MeshBasicMaterial({
      map: this.textures.cutiImagePlaneTexture2,
      side: THREE.DoubleSide,
    });
    this.cutiMateria3 = new THREE.MeshBasicMaterial({
      map: this.textures.cutiImagePlaneTexture3,
      side: THREE.DoubleSide,
    });
    this.cutiMaterial4 = new THREE.MeshBasicMaterial({
      map: this.textures.cutiImagePlaneTexture4,
      side: THREE.DoubleSide,
    });
    this.cutiMaterial5 = new THREE.MeshBasicMaterial({
      map: this.textures.cutiImagePlaneTexture5,
      side: THREE.DoubleSide,
    });
    this.cutiMaterial6 = new THREE.MeshBasicMaterial({
      map: this.textures.cutiImagePlaneTexture6,
      side: THREE.DoubleSide,
    });
    this.cutiMaterial7 = new THREE.MeshBasicMaterial({
      map: this.textures.cutiImagePlaneTexture7,
      side: THREE.DoubleSide,
    });
    this.cutiMaterial8 = new THREE.MeshBasicMaterial({
      map: this.textures.cutiImagePlaneTexture8,
      side: THREE.DoubleSide,
    });
  }

  setMesh() {
    this.cuti1 = new THREE.Mesh(this.geometry, this.cutiMaterial1);
    this.cuti1.scale.set(1.5, 1.5, 1.5);
    this.cuti1.position.set(-0.94, -0.84, -0.59);
    this.cuti1.rotation.set(0.59, 0, 0);

    this.cuti2 = new THREE.Mesh(this.geometry, this.cutiMaterial2);
    this.cuti2.scale.set(1.5, 1.5, 1.5);
    this.cuti2.position.set(-0.18, 0.59, -0.69);
    this.cuti2.rotation.set(0.59, 0, 0);

    this.cuti3 = new THREE.Mesh(this.geometry, this.cutiMateria3);
    this.cuti3.scale.set(1.5, 1.5, 1.5);
    this.cuti3.position.set(0.46, -0.65, 0);
    this.cuti3.rotation.set(5.88, 2.75, -0.34);

    this.cuti4 = new THREE.Mesh(this.geometry, this.cutiMaterial4);
    this.cuti4.scale.set(1.5, 1.5, 1.5);
    this.cuti4.position.set(1.48, 0, -0.16);
    this.cuti4.rotation.set(0, -0.92, 0.13);

    this.cuti5 = new THREE.Mesh(this.geometry, this.cutiMaterial5);
    this.cuti5.scale.set(1.5, 1.5, 1.5);
    this.cuti5.position.set(-1.63, 0.44, -0.62);
    this.cuti5.rotation.set(-2.84, 0.19, 0.72);

    this.cuti6 = new THREE.Mesh(this.geometry, this.cutiMaterial6);
    this.cuti6.scale.set(1.5, 1.5, 1.5);
    this.cuti6.position.set(0.44, 1.45, 0.93);
    this.cuti6.rotation.set(0, 7.4, 0);

    this.cuti7 = new THREE.Mesh(this.geometry, this.cutiMaterial7);
    this.cuti7.scale.set(1.5, 1.5, 1.5);
    this.cuti7.position.set(0.67, -0.42, -0.93);
    this.cuti7.rotation.set(0, 3.92, 0);

    this.cuti8 = new THREE.Mesh(this.geometry, this.cutiMaterial8);
    this.cuti8.scale.set(1.5, 1.5, 1.5);
    this.cuti8.position.set(-0.64, 1.98, -0.68);
    this.cuti8.rotation.set(0, 0.65, 0.66);

    this.cutiGroup = new THREE.Group();
    this.cutiGroup.add(
      this.cuti1,
      this.cuti2,
      this.cuti3,
      this.cuti4,
      this.cuti5,
      this.cuti6,
      this.cuti7,
      this.cuti8
    );
    this.cutiGroup.position.set(10.95, 3.32, 13.5);

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("Cuti Plane Images");

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
