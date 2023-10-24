import * as THREE from "three";
import cutisonVertexShader from "/shaders/cutison/vertex.glsl";
import cutisonFragmentShader from "/shaders/cutison/fragment.glsl";
export default class CutiSonImages {
  constructor(experience) {
    this.experience = experience;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.debug = this.experience.experience.debug;
    this.sizes = this.experience.experience.sizes;
    this.raycaster = new THREE.Raycaster();

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
    for (let i = 1; i < 5; i++) {
      this.textures[`cutiSonTexture${i}`] =
        this.resources.items[`cutiSonTexture${i}`];
    }
  }

  setMaterial() {
    this.cutiSonMaterials = [];

    for (let i = 0; i < 4; i++) {
      this.cutiSonMaterials[i] = new THREE.ShaderMaterial({
        // precision: "lowp",
        // use precision highp because otherwise the shader won't work on some low end mobile devices
        precision: "highp",
        uniforms: {
          imageTexture: { value: this.textures[`cutiSonTexture${i + 1}`] },
          time: { value: 0.0 },
          isHovered: { value: false },
          noiseFactor: { value: this.noiseFactor },
        },
        vertexShader: cutisonVertexShader,
        fragmentShader: cutisonFragmentShader,
      });
    }
  }

  setMesh() {
    this.cutiSon1 = new THREE.Mesh(this.geometry, this.cutiSonMaterials[0]);
    this.cutiSon1.position.set(1.15, 0, 0);
    this.cutiSon1.rotation.set(0, 0.6, 0);
    this.cutiSon2 = new THREE.Mesh(this.geometry, this.cutiSonMaterials[1]);
    this.cutiSon2.position.set(-0.51, 0, 0);
    this.cutiSon2.rotation.set(0, -0.62, 0);
    this.cutiSon3 = new THREE.Mesh(this.geometry, this.cutiSonMaterials[2]);
    this.cutiSon3.position.set(0.29, -0.53, 0.02);
    this.cutiSon3.rotation.set(0.04, 0, 0);
    this.cutiSon4 = new THREE.Mesh(this.geometry, this.cutiSonMaterials[3]);
    this.cutiSon4.position.set(0.29, 0.82, 0);
    this.cutiSon4.rotation.set(0, 0, 0);
    this.cutiSonGroup = new THREE.Group();

    this.cutiSonGroup.add(
      this.cutiSon1,
      this.cutiSon2,
      this.cutiSon3,
      this.cutiSon4
    );
    this.cutiSonGroup.position.set(-11.5, 0.51, 13);
    this.cutiSonGroup.rotation.set(0, 0, 0);
    this.scene.add(this.cutiSonGroup);
    this.objectsToTest = [
      this.cutiSonGroup.children[0],
      this.cutiSonGroup.children[1],
      this.cutiSonGroup.children[2],
      this.cutiSonGroup.children[3],
    ];

    /**
     * Mouse
     */
    this.mouse = new THREE.Vector2();
    window.addEventListener("mousemove", (event) => {
      this.mouse.x = (event.clientX / this.sizes.width) * 2 - 1;
      this.mouse.y = -(event.clientY / this.sizes.height) * 2 + 1;
    });

    this.noiseFactor = 0.0;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("CutiSon");
      this.debugFolder
        .add(this.cutiSon1.position, "x", -100, 100, 0.01)
        .name("cutiSon1 position x");
      this.debugFolder
        .add(this.cutiSon1.position, "y", -100, 100, 0.01)
        .name("cutiSon1 position y");
      this.debugFolder
        .add(this.cutiSon1.position, "z", -100, 100, 0.01)
        .name("cutiSon1 position z");
      this.debugFolder
        .add(this.cutiSon1.rotation, "x", -Math.PI, Math.PI, 0.01)
        .name("cutiSon1 rotation x");
      this.debugFolder
        .add(this.cutiSon1.rotation, "y", -Math.PI, Math.PI, 0.01)
        .name("cutiSon1 rotation y");
      this.debugFolder
        .add(this.cutiSon1.rotation, "z", -Math.PI, Math.PI, 0.01)
        .name("cutiSon1 rotation z");

      this.debugFolder
        .add(this.cutiSon2.position, "x", -100, 100, 0.01)
        .name("cutiSon2 position x");
      this.debugFolder
        .add(this.cutiSon2.position, "y", -100, 100, 0.01)
        .name("cutiSon2 position y");
      this.debugFolder
        .add(this.cutiSon2.position, "z", -100, 100, 0.01)
        .name("cutiSon2 position z");
      this.debugFolder
        .add(this.cutiSon2.rotation, "x", -Math.PI, Math.PI, 0.01)
        .name("cutiSon2 rotation x");
      this.debugFolder
        .add(this.cutiSon2.rotation, "y", -Math.PI, Math.PI, 0.01)
        .name("cutiSon2 rotation y");
      this.debugFolder
        .add(this.cutiSon2.rotation, "z", -Math.PI, Math.PI, 0.01)
        .name("cutiSon2 rotation z");

      this.debugFolder
        .add(this.cutiSon3.position, "x", -100, 100, 0.01)
        .name("cutiSon3 position x");
      this.debugFolder
        .add(this.cutiSon3.position, "y", -100, 100, 0.01)
        .name("cutiSon3 position y");
      this.debugFolder
        .add(this.cutiSon3.position, "z", -100, 100, 0.01)
        .name("cutiSon3 position z");
      this.debugFolder
        .add(this.cutiSon3.rotation, "x", -Math.PI, Math.PI, 0.01)
        .name("cutiSon3 rotation x");
      this.debugFolder
        .add(this.cutiSon3.rotation, "y", -Math.PI, Math.PI, 0.01)
        .name("cutiSon3 rotation y");
      this.debugFolder
        .add(this.cutiSon3.rotation, "z", -Math.PI, Math.PI, 0.01)
        .name("cutiSon3 rotation z");

      this.debugFolder
        .add(this.cutiSon4.position, "x", -100, 100, 0.01)
        .name("cutiSon4 position x");
      this.debugFolder
        .add(this.cutiSon4.position, "y", -100, 100, 0.01)
        .name("cutiSon4 position y");
      this.debugFolder
        .add(this.cutiSon4.position, "z", -100, 100, 0.01)
        .name("cutiSon4 position z");
      this.debugFolder
        .add(this.cutiSon4.rotation, "x", -Math.PI, Math.PI, 0.01)
        .name("cutiSon4 rotation x");
      this.debugFolder
        .add(this.cutiSon4.rotation, "y", -Math.PI, Math.PI, 0.01)
        .name("cutiSon4 rotation y");

      this.debugFolder
        .add(this.cutiSon4.rotation, "z", -Math.PI, Math.PI, 0.01)
        .name("cutiSon4 rotation z");

      this.debugFolder
        .add(this.cutiSonGroup.position, "x", -100, 100, 0.01)
        .name("Group position x");
      this.debugFolder
        .add(this.cutiSonGroup.position, "y", -100, 100, 0.01)
        .name("Group position y");
      this.debugFolder
        .add(this.cutiSonGroup.position, "z", -100, 100, 0.01)
        .name("Group position z");

      this.debugFolder
        .add(this.cutiSonGroup.rotation, "x", -10, 10, 0.01)
        .name("Group rotation x");
      this.debugFolder
        .add(this.cutiSonGroup.rotation, "y", -10, 10, 0.01)
        .name("Group rotation y");
      this.debugFolder
        .add(this.cutiSonGroup.rotation, "z", -10, 10, 0.01)
        .name("Group rotation z");
    }
  }

  update() {
    this.raycaster.setFromCamera(
      this.mouse,
      this.experience.experience.camera.instance
    );

    const intersects = this.raycaster.intersectObjects(this.objectsToTest);

    for (const intersect of intersects) {
      intersect.object.material.uniforms.isHovered.value = true;
      this.noiseFactor = 0.0;
    }

    for (const object of this.objectsToTest) {
      if (!intersects.find((intersect) => intersect.object === object)) {
        object.material.uniforms.time.value += 0.005;
        object.material.uniforms.isHovered.value = false;
        this.noiseFactor += 0.001;
        this.noiseFactor = Math.min(1, this.noiseFactor + 0.01);
      }
    }

    for (let i = 0; i < 4; i++) {
      this.cutiSonMaterials[i].uniforms.noiseFactor.value = this.noiseFactor;
    }
  }
}
