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
    for (let i = 0; i < 5; i++) {
      this.rainbows[i] = new THREE.Mesh(rainbowGeometry, rainbowMaterial);
    }
    this.rainbows[0].position.set(-46, -51.84, 1.48);
    this.rainbows[1].position.set(-27, -65.92, -19.6);
    this.rainbows[1].rotation.set(3.32, -0.18, -0.45);
    this.rainbows[2].position.set(67.7, -36.9, 31);
    this.rainbows[2].rotation.set(0, -0.1, 0.5);
    this.rainbows[3].position.set(-60.6, -67.1, -11.7);
    this.rainbows[3].rotation.set(0, 0, 5.8);
    this.rainbows[4].position.set(-47, -62.8, 51.4);
    this.rainbows[4].rotation.set(-0.7, 0, 0.1);
    // this.rainbows[5].position.set(-45, -52.84, 1.68);

    this.rainbows.forEach((rainbow) => {
      this.rainbowGroup.add(rainbow);
    });

    this.scene.add(this.rainbowGroup);

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("Rainbow");
      this.debugFolder
        .add(this.rainbows[0].position, "x", -100, 100, 0.1)
        .name("rainbow 1 position x");
      this.debugFolder
        .add(this.rainbows[0].position, "y", -100, 100, 0.1)
        .name("rainbow 1 position y");
      this.debugFolder
        .add(this.rainbows[0].position, "z", -100, 100, 0.1)
        .name("rainbow 1 position z");

      this.debugFolder
        .add(this.rainbows[0].scale, "x", -10, 10, 0.1)
        .name("rainbow 1 scale x");
      this.debugFolder
        .add(this.rainbows[0].scale, "y", -10, 10, 0.1)
        .name("rainbow 1 scale y");
      this.debugFolder
        .add(this.rainbows[0].scale, "z", -10, 10, 0.1)
        .name("rainbow 1 scale z");

      this.debugFolder
        .add(this.rainbows[0].rotation, "x", -100, 100, 0.1)
        .name("rainbow 1 rotation x");
      this.debugFolder
        .add(this.rainbows[0].rotation, "y", -100, 100, 0.1)
        .name("rainbow 1 rotation y");
      this.debugFolder
        .add(this.rainbows[0].rotation, "z", -100, 100, 0.1)
        .name("rainbow 1 rotation z");

      this.debugFolder
        .add(this.rainbows[1].position, "x", -100, 1000, 0.1)
        .name("rainbow 2 position x");
      this.debugFolder
        .add(this.rainbows[1].position, "y", -1000, 1000, 0.1)
        .name("rainbow 2 position y");
      this.debugFolder
        .add(this.rainbows[1].position, "z", -1000, 1000, 0.1)
        .name("rainbow 2 position z");

      this.debugFolder
        .add(this.rainbows[1].scale, "x", -100, 100, 0.1)
        .name("rainbow 2 scale x");
      this.debugFolder
        .add(this.rainbows[1].scale, "y", -100, 100, 0.1)
        .name("rainbow 2 scale y");
      this.debugFolder
        .add(this.rainbows[1].scale, "z", -100, 100, 0.1)
        .name("rainbow 2 scale z");

      this.debugFolder
        .add(this.rainbows[1].rotation, "x", -100, 100, 0.1)
        .name("rainbow 2 rotation x");
      this.debugFolder
        .add(this.rainbows[1].rotation, "y", -100, 100, 0.1)
        .name("rainbow 2 rotation y");
      this.debugFolder
        .add(this.rainbows[1].rotation, "z", -100, 100, 0.1)
        .name("rainbow 2 rotation z");

      //complete the rest of the rainbow debug
      this.debugFolder
        .add(this.rainbows[2].position, "x", -1000, 1000, 0.1)
        .name("rainbow 3 position x");
      this.debugFolder
        .add(this.rainbows[2].position, "y", -1000, 1000, 0.1)
        .name("rainbow 3 position y");
      this.debugFolder
        .add(this.rainbows[2].position, "z", -1000, 1000, 0.1)
        .name("rainbow 3 position z");

      this.debugFolder
        .add(this.rainbows[2].scale, "x", -100, 100, 0.1)
        .name("rainbow 3 scale x");
      this.debugFolder
        .add(this.rainbows[2].scale, "y", -100, 100, 0.1)
        .name("rainbow 3 scale y");
      this.debugFolder
        .add(this.rainbows[2].scale, "z", -100, 100, 0.1)
        .name("rainbow 3 scale z");

      this.debugFolder
        .add(this.rainbows[2].rotation, "x", -100, 100, 0.1)
        .name("rainbow 3 rotation x");
      this.debugFolder
        .add(this.rainbows[2].rotation, "y", -100, 100, 0.1)
        .name("rainbow 3 rotation y");
      this.debugFolder
        .add(this.rainbows[2].rotation, "z", -100, 100, 0.1)
        .name("rainbow 3 rotation z");

      this.debugFolder
        .add(this.rainbows[3].position, "x", -1000, 1000, 0.1)
        .name("rainbow 4 position x");
      this.debugFolder

        .add(this.rainbows[3].position, "y", -1000, 1000, 0.1)
        .name("rainbow 4 position y");
      this.debugFolder
        .add(this.rainbows[3].position, "z", -1000, 1000, 0.1)
        .name("rainbow 4 position z");

      this.debugFolder
        .add(this.rainbows[3].scale, "x", -100, 100, 0.1)
        .name("rainbow 4 scale x");
      this.debugFolder
        .add(this.rainbows[3].scale, "y", -100, 100, 0.1)
        .name("rainbow 4 scale y");
      this.debugFolder
        .add(this.rainbows[3].scale, "z", -100, 100, 0.1)
        .name("rainbow 4 scale z");

      this.debugFolder
        .add(this.rainbows[3].rotation, "x", -100, 100, 0.1)
        .name("rainbow 4 rotation x");
      this.debugFolder
        .add(this.rainbows[3].rotation, "y", -100, 100, 0.1)
        .name("rainbow 4 rotation y");
      this.debugFolder
        .add(this.rainbows[3].rotation, "z", -100, 100, 0.1)
        .name("rainbow 4 rotation z");

      this.debugFolder
        .add(this.rainbows[4].position, "x", -1000, 1000, 0.1)
        .name("rainbow 5 position x");
      this.debugFolder
        .add(this.rainbows[4].position, "y", -1000, 1000, 0.1)
        .name("rainbow 5 position y");
      this.debugFolder
        .add(this.rainbows[4].position, "z", -1000, 1000, 0.1)
        .name("rainbow 5 position z");

      this.debugFolder
        .add(this.rainbows[4].scale, "x", -100, 100, 0.1)
        .name("rainbow 5 scale x");
      this.debugFolder
        .add(this.rainbows[4].scale, "y", -100, 100, 0.1)
        .name("rainbow 5 scale y");
      this.debugFolder
        .add(this.rainbows[4].scale, "z", -100, 100, 0.1)
        .name("rainbow 5 scale z");

      this.debugFolder
        .add(this.rainbows[4].rotation, "x", -100, 100, 0.1)
        .name("rainbow 5 rotation x");
      this.debugFolder
        .add(this.rainbows[4].rotation, "y", -100, 100, 0.1)
        .name("rainbow 5 rotation y");
      this.debugFolder
        .add(this.rainbows[4].rotation, "z", -100, 100, 0.1)
        .name("rainbow 5 rotation z");
    }
  }
}
