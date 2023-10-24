import * as THREE from "three";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";
import rainbowVertexShader from "/shaders/rainbow/vertex.glsl";
import rainbowFragmentShader from "/shaders/rainbow/fragment.glsl";
export default class Rainbow {
  constructor(experience) {
    this.experience = experience;
    this.scene = this.experience.scene;
    this.debug = this.experience.experience.debug;

    this.setRainbow();
  }

  setRainbow() {
    const rainbowMaterial = new THREE.ShaderMaterial({
      vertexShader: rainbowVertexShader,
      fragmentShader: rainbowFragmentShader,
      uniforms: {},
      side: THREE.DoubleSide,
      transparent: true,
      precision: "lowp",
    });

    // Create a single rainbow geometry and calculate its center
    const rainbowGeometry = new THREE.TorusGeometry(80, 2, 30, 60);
    rainbowGeometry.computeBoundingBox();
    const center = new THREE.Vector3();
    rainbowGeometry.boundingBox.getCenter(center);

    // Function to apply rotations and translation for each rainbow
    function createRainbow(
      rotationX,
      rotationY,
      rotationZ,
      translationX,
      translationY,
      translationZ
    ) {
      const rainbow = rainbowGeometry.clone();

      const rotationMatrixX = new THREE.Matrix4().makeRotationX(rotationX);
      const rotationMatrixY = new THREE.Matrix4().makeRotationY(rotationY);
      const rotationMatrixZ = new THREE.Matrix4().makeRotationZ(rotationZ);

      const combinedRotation = new THREE.Matrix4()
        .multiplyMatrices(rotationMatrixX, rotationMatrixY)
        .multiply(rotationMatrixZ);

      rainbow.applyMatrix4(combinedRotation);

      const translationBack = new THREE.Matrix4().makeTranslation(
        center.x,
        center.y,
        center.z
      );
      rainbow.applyMatrix4(translationBack);

      rainbow.translate(translationX, translationY, translationZ);

      return rainbow;
    }

    this.rainbows = [];

    // Define the rotation and translation parameters for each rainbow
    const rainbowParams = [
      {
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
        translationX: -46,
        translationY: -51.84,
        translationZ: 1.48,
      },
      {
        rotationX: 3.32,
        rotationY: -0.18,
        rotationZ: -0.45,
        translationX: -27,
        translationY: -65.92,
        translationZ: -19.6,
      },
      {
        rotationX: 0,
        rotationY: -0.1,
        rotationZ: 0.5,
        translationX: 67.7,
        translationY: -36.9,
        translationZ: 31,
      },
      {
        rotationX: 0,
        rotationY: 0,
        rotationZ: 5.8,
        translationX: -60.6,
        translationY: -67.1,
        translationZ: -11.7,
      },
      {
        rotationX: -0.7,
        rotationY: 0,
        rotationZ: 0.1,
        translationX: -47,
        translationY: -62.8,
        translationZ: 51.4,
      },
    ];

    for (let i = 0; i < rainbowParams.length; i++) {
      const params = rainbowParams[i];
      const rainbow = createRainbow(
        params.rotationX,
        params.rotationY,
        params.rotationZ,
        params.translationX,
        params.translationY,
        params.translationZ
      );
      this.rainbows.push(rainbow);
    }

    const geometriesRainbows = BufferGeometryUtils.mergeGeometries(
      this.rainbows
    );
    this.rainbowMesh = new THREE.Mesh(geometriesRainbows, rainbowMaterial);
    this.scene.add(this.rainbowMesh);

    // Debug
    // if (this.debug.active) {
    //   this.debugFolder = this.debug.ui.addFolder("Rainbow");
    //   this.debugFolder
    //     .add(this.rainbows[0].position, "x", -100, 100, 0.1)
    //     .name("rainbow 1 position x");
    //   this.debugFolder
    //     .add(this.rainbows[0].position, "y", -100, 100, 0.1)
    //     .name("rainbow 1 position y");
    //   this.debugFolder
    //     .add(this.rainbows[0].position, "z", -100, 100, 0.1)
    //     .name("rainbow 1 position z");

    //   this.debugFolder
    //     .add(this.rainbows[0].scale, "x", -10, 10, 0.1)
    //     .name("rainbow 1 scale x");
    //   this.debugFolder
    //     .add(this.rainbows[0].scale, "y", -10, 10, 0.1)
    //     .name("rainbow 1 scale y");
    //   this.debugFolder
    //     .add(this.rainbows[0].scale, "z", -10, 10, 0.1)
    //     .name("rainbow 1 scale z");

    //   this.debugFolder
    //     .add(this.rainbows[0].rotation, "x", -100, 100, 0.1)
    //     .name("rainbow 1 rotation x");
    //   this.debugFolder
    //     .add(this.rainbows[0].rotation, "y", -100, 100, 0.1)
    //     .name("rainbow 1 rotation y");
    //   this.debugFolder
    //     .add(this.rainbows[0].rotation, "z", -100, 100, 0.1)
    //     .name("rainbow 1 rotation z");

    //   this.debugFolder
    //     .add(this.rainbows[1].position, "x", -100, 1000, 0.1)
    //     .name("rainbow 2 position x");
    //   this.debugFolder
    //     .add(this.rainbows[1].position, "y", -1000, 1000, 0.1)
    //     .name("rainbow 2 position y");
    //   this.debugFolder
    //     .add(this.rainbows[1].position, "z", -1000, 1000, 0.1)
    //     .name("rainbow 2 position z");

    //   this.debugFolder
    //     .add(this.rainbows[1].scale, "x", -100, 100, 0.1)
    //     .name("rainbow 2 scale x");
    //   this.debugFolder
    //     .add(this.rainbows[1].scale, "y", -100, 100, 0.1)
    //     .name("rainbow 2 scale y");
    //   this.debugFolder
    //     .add(this.rainbows[1].scale, "z", -100, 100, 0.1)
    //     .name("rainbow 2 scale z");

    //   this.debugFolder
    //     .add(this.rainbows[1].rotation, "x", -100, 100, 0.1)
    //     .name("rainbow 2 rotation x");
    //   this.debugFolder
    //     .add(this.rainbows[1].rotation, "y", -100, 100, 0.1)
    //     .name("rainbow 2 rotation y");
    //   this.debugFolder
    //     .add(this.rainbows[1].rotation, "z", -100, 100, 0.1)
    //     .name("rainbow 2 rotation z");

    //   //complete the rest of the rainbow debug
    //   this.debugFolder
    //     .add(this.rainbows[2].position, "x", -1000, 1000, 0.1)
    //     .name("rainbow 3 position x");
    //   this.debugFolder
    //     .add(this.rainbows[2].position, "y", -1000, 1000, 0.1)
    //     .name("rainbow 3 position y");
    //   this.debugFolder
    //     .add(this.rainbows[2].position, "z", -1000, 1000, 0.1)
    //     .name("rainbow 3 position z");

    //   this.debugFolder
    //     .add(this.rainbows[2].scale, "x", -100, 100, 0.1)
    //     .name("rainbow 3 scale x");
    //   this.debugFolder
    //     .add(this.rainbows[2].scale, "y", -100, 100, 0.1)
    //     .name("rainbow 3 scale y");
    //   this.debugFolder
    //     .add(this.rainbows[2].scale, "z", -100, 100, 0.1)
    //     .name("rainbow 3 scale z");

    //   this.debugFolder
    //     .add(this.rainbows[2].rotation, "x", -100, 100, 0.1)
    //     .name("rainbow 3 rotation x");
    //   this.debugFolder
    //     .add(this.rainbows[2].rotation, "y", -100, 100, 0.1)
    //     .name("rainbow 3 rotation y");
    //   this.debugFolder
    //     .add(this.rainbows[2].rotation, "z", -100, 100, 0.1)
    //     .name("rainbow 3 rotation z");

    //   this.debugFolder
    //     .add(this.rainbows[3].position, "x", -1000, 1000, 0.1)
    //     .name("rainbow 4 position x");
    //   this.debugFolder

    //     .add(this.rainbows[3].position, "y", -1000, 1000, 0.1)
    //     .name("rainbow 4 position y");
    //   this.debugFolder
    //     .add(this.rainbows[3].position, "z", -1000, 1000, 0.1)
    //     .name("rainbow 4 position z");

    //   this.debugFolder
    //     .add(this.rainbows[3].scale, "x", -100, 100, 0.1)
    //     .name("rainbow 4 scale x");
    //   this.debugFolder
    //     .add(this.rainbows[3].scale, "y", -100, 100, 0.1)
    //     .name("rainbow 4 scale y");
    //   this.debugFolder
    //     .add(this.rainbows[3].scale, "z", -100, 100, 0.1)
    //     .name("rainbow 4 scale z");

    //   this.debugFolder
    //     .add(this.rainbows[3].rotation, "x", -100, 100, 0.1)
    //     .name("rainbow 4 rotation x");
    //   this.debugFolder
    //     .add(this.rainbows[3].rotation, "y", -100, 100, 0.1)
    //     .name("rainbow 4 rotation y");
    //   this.debugFolder
    //     .add(this.rainbows[3].rotation, "z", -100, 100, 0.1)
    //     .name("rainbow 4 rotation z");

    //   this.debugFolder
    //     .add(this.rainbows[4].position, "x", -1000, 1000, 0.1)
    //     .name("rainbow 5 position x");
    //   this.debugFolder
    //     .add(this.rainbows[4].position, "y", -1000, 1000, 0.1)
    //     .name("rainbow 5 position y");
    //   this.debugFolder
    //     .add(this.rainbows[4].position, "z", -1000, 1000, 0.1)
    //     .name("rainbow 5 position z");

    //   this.debugFolder
    //     .add(this.rainbows[4].scale, "x", -100, 100, 0.1)
    //     .name("rainbow 5 scale x");
    //   this.debugFolder
    //     .add(this.rainbows[4].scale, "y", -100, 100, 0.1)
    //     .name("rainbow 5 scale y");
    //   this.debugFolder
    //     .add(this.rainbows[4].scale, "z", -100, 100, 0.1)
    //     .name("rainbow 5 scale z");

    //   this.debugFolder
    //     .add(this.rainbows[4].rotation, "x", -100, 100, 0.1)
    //     .name("rainbow 5 rotation x");
    //   this.debugFolder
    //     .add(this.rainbows[4].rotation, "y", -100, 100, 0.1)
    //     .name("rainbow 5 rotation y");
    //   this.debugFolder
    //     .add(this.rainbows[4].rotation, "z", -100, 100, 0.1)
    //     .name("rainbow 5 rotation z");
    // }
  }
}
