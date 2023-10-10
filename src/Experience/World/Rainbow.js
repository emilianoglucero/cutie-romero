import * as THREE from "three";
export default class Rainbow {
  constructor(experience) {
    this.experience = experience;
    this.scene = this.experience.scene;
    this.debug = this.experience.experience.debug;

    this.setRainbow();
  }

  setRainbow() {
    // /**
    //  * Rainbow
    //  */
    //dont forget to use BufferGeometryUtils.mergeBufferGeometries and InstancedMesh
    //Rainbow shgaders
    const rainbowVertexShader = /* glsl */ `
varying vec2 vUV;
varying vec3 vNormal;
void main () {
  vUV = uv;
  vNormal = vec3(normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
				`;

    const rainbowFragmentShader = /* glsl */ `
varying vec2 vUV;
varying vec3 vNormal;
void main () {
  vec4 c = vec4(abs(vNormal) + vec3(vUV, 0.0), 0.12); // 设置透明度为0.1
  gl_FragColor = c;
}
`;

    //Create a torus rainbow
    const rainbowMaterial = new THREE.ShaderMaterial({
      vertexShader: rainbowVertexShader,
      fragmentShader: rainbowFragmentShader,
      uniforms: {},
      side: THREE.DoubleSide,
      transparent: true,
      precision: "lowp",
    });
    const rainbowGeometry = new THREE.TorusGeometry(80, 2, 30, 60);
    this.rainbows = [];
    this.rainbowGroup = new THREE.Group();
    for (let i = 0; i < 6; i++) {
      this.rainbows[i] = new THREE.Mesh(rainbowGeometry, rainbowMaterial);
    }
    this.rainbows[0].position.set(-78, -4.9, -7.35);
    this.rainbows[1].position.set(-75, -4.9, -7.35);
    this.rainbows[2].position.set(-70, -4.9, -7.35);
    this.rainbows[3].position.set(-84, -4.9, -7.35);
    this.rainbows[4].position.set(-17, 3, -31);
    this.rainbows[5].position.set(-27, 3, -31);

    this.rainbows.forEach((rainbow) => {
      this.rainbowGroup.add(rainbow);
    });

    this.scene.add(this.rainbowGroup);

    // const rainbow1 = new THREE.Mesh(rainbowGeometry, rainbowMaterial);
    // rainbow1.position.set(52, -4.9, -7.35);
    // //set matrixAutoUpdate to false so we can update the matrix manually
    // // rainbow1.matrixAutoUpdate = false;
    // this.scene.add(rainbow1);

    // const rainbow2 = new THREE.Mesh(rainbowGeometry, rainbowMaterial);
    // // rainbow2.opacity = 0.1;
    // rainbow2.position.set(13, 3, -31);
    // //set matrixAutoUpdate to false so we can update the matrix manually
    // // rainbow2.matrixAutoUpdate = false;
    // this.scene.add(rainbow2);

    // const rainbow3 = new THREE.Mesh(rainbowGeometry, rainbowMaterial);
    // // rainbow3.opacity = 0.1;
    // rainbow3.position.set(3, 3, -31);
    // //set matrixAutoUpdate to false so we can update the matrix manually
    // // rainbow3.matrixAutoUpdate = false;
    // this.scene.add(rainbow3);

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("Rainbow");
      this.debugFolder
        .add(this.rainbows[0].position, "x", -100, 100, 0.01)
        .name("rainbow 1 position x");
      this.debugFolder
        .add(this.rainbows[0].position, "y", -100, 100, 0.01)
        .name("rainbow 1 position y");
      this.debugFolder
        .add(this.rainbows[0].position, "z", -100, 100, 0.01)
        .name("rainbow 1 position z");

      this.debugFolder
        .add(this.rainbows[0].scale, "x", -10, 10, 0.01)
        .name("rainbow 1 scale x");
      this.debugFolder
        .add(this.rainbows[0].scale, "y", -10, 10, 0.01)
        .name("rainbow 1 scale y");
      this.debugFolder
        .add(this.rainbows[0].scale, "z", -10, 10, 0.01)
        .name("rainbow 1 scale z");

      this.debugFolder
        .add(this.rainbows[0].rotation, "x", -10, 10, 0.01)
        .name("rainbow 1 rotation x");
      this.debugFolder
        .add(this.rainbows[0].rotation, "y", -10, 10, 0.01)
        .name("rainbow 1 rotation y");
      this.debugFolder
        .add(this.rainbows[0].rotation, "z", -10, 10, 0.01)
        .name("rainbow 1 rotation z");

      this.debugFolder
        .add(this.rainbows[1].position, "x", -100, 100, 0.01)
        .name("rainbow 2 position x");
      this.debugFolder
        .add(this.rainbows[1].position, "y", -100, 100, 0.01)
        .name("rainbow 2 position y");
      this.debugFolder
        .add(this.rainbows[1].position, "z", -100, 100, 0.01)
        .name("rainbow 2 position z");

      this.debugFolder
        .add(this.rainbows[1].scale, "x", -10, 10, 0.01)
        .name("rainbow 2 scale x");
      this.debugFolder
        .add(this.rainbows[1].scale, "y", -10, 10, 0.01)
        .name("rainbow 2 scale y");
      this.debugFolder
        .add(this.rainbows[1].scale, "z", -10, 10, 0.01)
        .name("rainbow 2 scale z");

      this.debugFolder
        .add(this.rainbows[1].rotation, "x", -10, 10, 0.01)
        .name("rainbow 2 rotation x");
      this.debugFolder
        .add(this.rainbows[1].rotation, "y", -10, 10, 0.01)
        .name("rainbow 2 rotation y");
      this.debugFolder
        .add(this.rainbows[1].rotation, "z", -10, 10, 0.01)
        .name("rainbow 2 rotation z");

      //complete the rest of the rainbow debug
      this.debugFolder
        .add(this.rainbows[2].position, "x", -100, 100, 0.01)
        .name("rainbow 3 position x");
      this.debugFolder
        .add(this.rainbows[2].position, "y", -100, 100, 0.01)
        .name("rainbow 3 position y");
      this.debugFolder
        .add(this.rainbows[2].position, "z", -100, 100, 0.01)
        .name("rainbow 3 position z");

      this.debugFolder
        .add(this.rainbows[2].scale, "x", -10, 10, 0.01)
        .name("rainbow 3 scale x");
      this.debugFolder
        .add(this.rainbows[2].scale, "y", -10, 10, 0.01)
        .name("rainbow 3 scale y");
      this.debugFolder
        .add(this.rainbows[2].scale, "z", -10, 10, 0.01)
        .name("rainbow 3 scale z");

      this.debugFolder
        .add(this.rainbows[2].rotation, "x", -10, 10, 0.01)
        .name("rainbow 3 rotation x");
      this.debugFolder
        .add(this.rainbows[2].rotation, "y", -10, 10, 0.01)
        .name("rainbow 3 rotation y");
      this.debugFolder
        .add(this.rainbows[2].rotation, "z", -10, 10, 0.01)
        .name("rainbow 3 rotation z");

      this.debugFolder
        .add(this.rainbows[3].position, "x", -100, 100, 0.01)
        .name("rainbow 4 position x");
      this.debugFolder

        .add(this.rainbows[3].position, "y", -100, 100, 0.01)
        .name("rainbow 4 position y");
      this.debugFolder
        .add(this.rainbows[3].position, "z", -100, 100, 0.01)
        .name("rainbow 4 position z");

      this.debugFolder
        .add(this.rainbows[3].scale, "x", -10, 10, 0.01)
        .name("rainbow 4 scale x");
      this.debugFolder
        .add(this.rainbows[3].scale, "y", -10, 10, 0.01)
        .name("rainbow 4 scale y");
      this.debugFolder
        .add(this.rainbows[3].scale, "z", -10, 10, 0.01)
        .name("rainbow 4 scale z");

      this.debugFolder
        .add(this.rainbows[3].rotation, "x", -10, 10, 0.01)
        .name("rainbow 4 rotation x");
      this.debugFolder
        .add(this.rainbows[3].rotation, "y", -10, 10, 0.01)
        .name("rainbow 4 rotation y");
      this.debugFolder
        .add(this.rainbows[3].rotation, "z", -10, 10, 0.01)
        .name("rainbow 4 rotation z");

      this.debugFolder
        .add(this.rainbows[4].position, "x", -100, 100, 0.01)
        .name("rainbow 5 position x");
      this.debugFolder
        .add(this.rainbows[4].position, "y", -100, 100, 0.01)
        .name("rainbow 5 position y");
      this.debugFolder
        .add(this.rainbows[4].position, "z", -100, 100, 0.01)
        .name("rainbow 5 position z");

      this.debugFolder
        .add(this.rainbows[4].scale, "x", -10, 10, 0.01)
        .name("rainbow 5 scale x");
      this.debugFolder
        .add(this.rainbows[4].scale, "y", -10, 10, 0.01)
        .name("rainbow 5 scale y");
      this.debugFolder
        .add(this.rainbows[4].scale, "z", -10, 10, 0.01)
        .name("rainbow 5 scale z");

      this.debugFolder
        .add(this.rainbows[4].rotation, "x", -10, 10, 0.01)
        .name("rainbow 5 rotation x");
      this.debugFolder
        .add(this.rainbows[4].rotation, "y", -10, 10, 0.01)
        .name("rainbow 5 rotation y");
      this.debugFolder
        .add(this.rainbows[4].rotation, "z", -10, 10, 0.01)
        .name("rainbow 5 rotation z");

      this.debugFolder
        .add(this.rainbows[5].position, "x", -100, 100, 0.01)
        .name("rainbow 6 position x");
      this.debugFolder
        .add(this.rainbows[5].position, "y", -100, 100, 0.01)
        .name("rainbow 6 position y");
      this.debugFolder
        .add(this.rainbows[5].position, "z", -100, 100, 0.01)
        .name("rainbow 6 position z");

      this.debugFolder
        .add(this.rainbows[5].scale, "x", -10, 10, 0.01)
        .name("rainbow 6 scale x");
      this.debugFolder
        .add(this.rainbows[5].scale, "y", -10, 10, 0.01)
        .name("rainbow 6 scale y");
      this.debugFolder
        .add(this.rainbows[5].scale, "z", -10, 10, 0.01)
        .name("rainbow 6 scale z");

      this.debugFolder
        .add(this.rainbows[5].rotation, "x", -10, 10, 0.01)
        .name("rainbow 6 rotation x");
      this.debugFolder
        .add(this.rainbows[5].rotation, "y", -10, 10, 0.01)
        .name("rainbow 6 rotation y");
      this.debugFolder
        .add(this.rainbows[5].rotation, "z", -10, 10, 0.01)
        .name("rainbow 6 rotation z");
    }
  }
}
