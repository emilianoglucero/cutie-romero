import * as THREE from "three";
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

    // Create a custom shader material
    const vertexShader = `
    varying vec2 vUv;

    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    
`;

    const fragmentShader = `
    uniform sampler2D imageTexture;
uniform float time; // Time for animation
uniform bool isHovered; // Hovered state
uniform float noiseFactor; // New uniform for noise intensity
// uniform float dissolveFactor; // Dissolve factor
varying vec2 vUv;

// Simplex Noise function by Stefan Gustavson
// (https://github.com/ashima/webgl-noise)
vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
    return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    // First corner
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    // x0 = x - 0.0 + 0.0 * C
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1. + 3.0 * C.xxx;

    // Permutations
    i = mod289(i);
    vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    // Gradients
    // ( N*N points uniformly over a square, mapped onto an octahedron.)
    float n_ = 1.0/7.0; // N=7
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,N*N)

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);

    // Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    // Mix final noise value
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
    dot(p2,x2), dot(p3,x3) ) );
}

void main() {
  vec4 color;

      // Apply bubble effect using noise
      float noiseValue = snoise(vec3(vUv * 10.0, time)) * noiseFactor;
      vec2 distortedUV = vUv + vec2(noiseValue, noiseValue);
      color = texture2D(imageTexture, distortedUV);
      if (isHovered) {
        // If hovered, use the original image
        color = texture2D(imageTexture, vUv);
      }

  gl_FragColor = color;

}

`;

    for (let i = 0; i < 4; i++) {
      this.cutiSonMaterials[i] = new THREE.ShaderMaterial({
        precision: "lowp",
        uniforms: {
          imageTexture: { value: this.textures[`cutiSonTexture${i + 1}`] },
          time: { value: 0.0 },
          isHovered: { value: false },
          noiseFactor: { value: this.noiseFactor },
        },
        vertexShader,
        fragmentShader,
      });
    }
  }

  setMesh() {
    this.cutiSon1 = new THREE.Mesh(this.geometry, this.cutiSonMaterials[0]);
    this.cutiSon1.position.set(1.21, 0, 0);
    this.cutiSon1.rotation.set(0, 0.6, 0);
    this.cutiSon2 = new THREE.Mesh(this.geometry, this.cutiSonMaterials[1]);
    this.cutiSon2.position.set(-0.51, 0, 0);
    this.cutiSon2.rotation.set(0, -0.62, 0);
    this.cutiSon3 = new THREE.Mesh(this.geometry, this.cutiSonMaterials[2]);
    this.cutiSon3.position.set(0.29, -0.53, 0.02);
    this.cutiSon3.rotation.set(0.04, 0, 0);
    this.cutiSon4 = new THREE.Mesh(this.geometry, this.cutiSonMaterials[3]);
    this.cutiSon4.position.set(0.35, 0.82, 0);
    this.cutiSon4.rotation.set(0, 0, 0);
    this.cutiSonGroup = new THREE.Group();

    this.cutiSonGroup.add(
      this.cutiSon1,
      this.cutiSon2,
      this.cutiSon3,
      this.cutiSon4
    );
    // this.cutiSonGroup.position.set(0, -4, 10);
    // this.cutiSonGroup.rotation.set(3.11, 0, 0);
    // this.cutiSonGroup.matrixAutoUpdate = false;

    // x
    // :
    // -10.82506897603845
    // y
    // :
    // 0.5490905289693344
    // z
    // :
    // 13.235146167754374
    this.cutiSonGroup.position.set(-11, 0.51, 13);
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

      // console.log(this.mouse);
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
