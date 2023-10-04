import * as THREE from "three";
export default class Rainbow {
  constructor(experience) {
    this.experience = experience;
    this.scene = this.experience.scene;

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
  vec4 c = vec4(abs(vNormal) + vec3(vUV, 0.0), 0.1); // 设置透明度为0.1
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
    const rainbowGeometry = new THREE.TorusGeometry(60, 4, 40, 100);
    const rainbow = new THREE.Mesh(rainbowGeometry, rainbowMaterial);
    rainbow.opacity = 0.1;
    rainbow.position.set(23, 3, -31);
    this.scene.add(rainbow);

    // add gui to position rainbow
    // const rainbowFolder = gui.addFolder("Rainbow");
    // rainbowFolder.add(rainbow.position, "x", -200, 200, 0.01);
    // rainbowFolder.add(rainbow.position, "y", -200, 200, 0.01);
    // rainbowFolder.add(rainbow.position, "z", -200, 200, 0.01);

    // // add gui to rotate rainbow
    // rainbowFolder.add(rainbow.rotation, "x", -10, 10, 0.01);
    // rainbowFolder.add(rainbow.rotation, "y", -10, 10, 0.01);
    // rainbowFolder.add(rainbow.rotation, "z", -10, 10, 0.01);

    // //
  }
}
