import * as THREE from "three";
export default class CutiPlaneImagesTitle {
  constructor(experience) {
    this.experience = experience;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.debug = this.experience.experience.debug;

    this.setGeometry();
    this.setTextures();
    this.setMaterial();
    this.setMesh();
  }

  setGeometry() {
    this.geometry1 = new THREE.PlaneGeometry(1, 1, 1, 1);
    this.geometry2 = new THREE.PlaneGeometry(2, 2, 100, 100);
  }

  setTextures() {
    this.textures = {};

    this.textures.cutiPlaneImageTitle2 = this.resources.items.flower1;

    this.textures.cutiPlaneImageTitle3 = this.resources.items.flower2;

    this.textures.cutiPlaneImageTitle1 =
      this.resources.items.cutiPlaneImageTitle1;

    this.textures.displacementTexture =
      this.resources.items.displacementTexture;

    this.textures.normalTexture = this.resources.items.normalTexture;
  }

  setMaterial() {
    this.cutiMaterial1 = new THREE.MeshPhongMaterial({
      transparent: true,
      normalMap: this.textures.normalTexture,
      displacementMap: this.textures.displacementTexture,
      map: this.textures.cutiPlaneImageTitle1,
      displacementScale: 0.5,
      displacementBias: 0.5,
      side: THREE.DoubleSide,
      wireframe: true,
    });

    this.cutiMaterial2 = new THREE.MeshBasicMaterial({
      map: this.textures.cutiPlaneImageTitle2,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
    });

    this.cutiMaterial3 = new THREE.MeshBasicMaterial({
      map: this.textures.cutiPlaneImageTitle3,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
    });
  }

  setMesh() {
    this.mesh1 = new THREE.Mesh(this.geometry2, this.cutiMaterial1);
    this.mesh1.position.set(-0.43, 0.66, 2.88);
    this.mesh1.scale.set(1.35, 1.35, -7.3);
    this.mesh1.rotation.set(0, 0.66, 0.1);

    this.flower1 = new THREE.Mesh(this.geometry1, this.cutiMaterial2);
    this.flower1.position.set(0.33, 1.1, 0);
    this.flower1.rotation.set(0, 0, 0.34);
    this.flower1.scale.set(1, 1, 1);

    this.flower2 = new THREE.Mesh(this.geometry1, this.cutiMaterial3);
    this.flower2.position.set(0.59, -0.94, 0);
    this.flower2.rotation.set(0, 3, -0.4);
    this.flower2.scale.set(1, 1, 1);

    // add to a group
    this.cutiPlaneImagesTitleGroup = new THREE.Group();
    this.cutiPlaneImagesTitleGroup.add(this.mesh1, this.flower1, this.flower2);
    this.scene.add(this.cutiPlaneImagesTitleGroup);

    //Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("Cuti Plane Images Title");
      this.debugFolder
        .add(this.mesh1.position, "x", -10, 10, 0.01)
        .name("position x");
      this.debugFolder
        .add(this.mesh1.position, "y", -10, 10, 0.01)
        .name("position y");
      this.debugFolder
        .add(this.mesh1.position, "z", -10, 10, 0.01)
        .name("position z");

      this.debugFolder
        .add(this.mesh1.scale, "x", -10, 10, 0.01)
        .name("scale x");
      this.debugFolder
        .add(this.mesh1.scale, "y", -10, 10, 0.01)
        .name("scale y");
      this.debugFolder
        .add(this.mesh1.scale, "z", -10, 10, 0.01)
        .name("scale z");

      this.debugFolder
        .add(this.mesh1.rotation, "x", -Math.PI, Math.PI, 0.01)
        .name("rotation x");
      this.debugFolder
        .add(this.mesh1.rotation, "y", -Math.PI, Math.PI, 0.01)
        .name("rotation y");
      this.debugFolder
        .add(this.mesh1.rotation, "z", -Math.PI, Math.PI, 0.01)
        .name("rotation z");

      this.debugFolder
        .add(this.flower1.position, "x", -10, 10, 0.01)
        .name("flower1 position x");
      this.debugFolder
        .add(this.flower1.position, "y", -10, 10, 0.01)
        .name("flower1 position y");
      this.debugFolder
        .add(this.flower1.position, "z", -10, 10, 0.01)
        .name("flower1 position z");

      this.debugFolder
        .add(this.flower1.rotation, "x", -Math.PI, Math.PI, 0.01)
        .name("rotation x");
      this.debugFolder
        .add(this.flower1.rotation, "y", -Math.PI, Math.PI, 0.01)
        .name("rotation y");
      this.debugFolder
        .add(this.flower1.rotation, "z", -Math.PI, Math.PI, 0.01)
        .name("rotation z");

      this.debugFolder
        .add(this.flower2.position, "x", -10, 10, 0.01)
        .name("flower2 position x");
      this.debugFolder
        .add(this.flower2.position, "y", -10, 10, 0.01)
        .name("flower2 position y");
      this.debugFolder
        .add(this.flower2.position, "z", -10, 10, 0.01)
        .name("flower2 position z");

      this.debugFolder
        .add(this.flower2.rotation, "x", -10, 10, 0.01)
        .name("flower2 rotation x");
      this.debugFolder
        .add(this.flower2.rotation, "y", -10, 10, 0.01)
        .name("flower2 rotation y");
      this.debugFolder
        .add(this.flower2.rotation, "z", -10, 10, 0.01)
        .name("flower2 rotation z");
    }
  }
}
