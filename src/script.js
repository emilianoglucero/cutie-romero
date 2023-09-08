import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import { Sky } from "three/addons/objects/Sky.js";
import { ImprovedNoise } from "three/addons/math/ImprovedNoise.js";
import * as TWEEN from "@tweenjs/tween.js";
import { TTFLoader } from "three/examples/jsm/loaders/TTFLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { Font } from "three/examples/jsm/loaders/FontLoader.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as CANNON from "cannon";
import gsap from "gsap";
import Stats from "stats-gl";

import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls.js";

/**
 * Base
 */
const gui = new GUI();
let mixer;
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  renderer.shadowMap.enabled = true;
});
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// import cloudsVertexShader from "./shaders/clouds/vertex.glsl";
// import cloudsFragmentShader from "./shaders/clouds/fragment.glsl";

// import rainbowVertexShader from "./shaders/rainbow/vertex.glsl";
// import rainbowFragmentShader from "./shaders/rainbow/fragment.glsl";

// renderer.setClearColor(0xa3a3a3);
//first person control camera
// const controls = new FirstPersonControls(camera, renderer.domElement);
// controls.movementSpeed = 8;
// controls.lookSpeed = 0.08;
// controls.lookVertical = true
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(0.81, 0.22, 3.95);
camera.lookAt(0.81, 0.22, 3.95);

/*
 ** Stats
 */
// create a new Stats object
const stats = new Stats({
  logsPerSecond: 20,
  samplesLog: 100,
  samplesGraph: 10,
  precision: 2,
  horizontal: true,
  minimal: false,
  mode: 0,
});

// append the stats container to the body of the document
document.body.appendChild(stats.container);

scene.onBeforeRender = function () {
  stats.begin();
};

scene.onAfterRender = function () {
  stats.end();
};
/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

/**
 * 3D Text
 */
const fontLoader = new TTFLoader();
const matcapTexture = textureLoader.load("/textures/matcaps/1.png");
fontLoader.load("/fonts/Playball-Regular.ttf", (fontData) => {
  // Convert the parsed fontData to the format Three.js understands
  const font = new Font(fontData);

  // Create the text geometry
  const textGeometry = new TextGeometry("Cutie Romero", {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });

  // Create a standard material with red color and 50% gloss
  const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });

  // Geometries are attached to meshes so that they get rendered
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);
  // Update positioning of the text
  textMesh.position.set(-2, 0, 0);
  scene.add(textMesh);
});

/**
 * Heart Title model
 */
const gltfLoader = new GLTFLoader();
gltfLoader.load("models/gltf/stylized_heart_model/scene.gltf", (gltf) => {
  const title = gltf.scene.children[0];
  title.scale.set(1, 1, 1);
  title.position.set(0.08, 0.33, -0.43);
  scene.add(title);

  //gui for title model
  const titleFolder = gui.addFolder("Title Model");
  titleFolder.add(title.position, "x", -10, 10, 0.01).name("title x");
  titleFolder.add(title.position, "y", -10, 10, 0.01).name("title y");
  titleFolder.add(title.position, "z", -10, 10, 0.01).name("title z");

  titleFolder.add(title.rotation, "x", -10, 10, 0.01).name("title rx");
  titleFolder.add(title.rotation, "y", -10, 10, 0.01).name("title ry");
  titleFolder.add(title.rotation, "z", -10, 10, 0.01).name("title rz");

  titleFolder.add(title.scale, "x", -10, 10, 0.01).name("title sx");
  titleFolder.add(title.scale, "y", -10, 10, 0.01).name("title sy");
  titleFolder.add(title.scale, "z", -10, 10, 0.01).name("title sz");
});

/*
 ** Cuti Model
 */
// model
const loader = new FBXLoader();
// loader.load("models/fbx/cutiDancingTwerk.fbx", function (object) {
loader.load("models/fbx/cutiDancingTwerk.fbx", function (object) {
  mixer = new THREE.AnimationMixer(object);

  const action = mixer.clipAction(object.animations[0]);
  action.play();

  object.traverse(function (child) {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  //scale object
  object.scale.set(0.005, 0.005, 0.005);
  //position object
  object.position.set(2.37, -0.18, -0.43);

  scene.add(object);

  //gui for cuti model
  const cutiFolder = gui.addFolder("Cuti Model");
  cutiFolder.add(object.position, "x", -10, 10, 0.01).name("cuti x");
  cutiFolder.add(object.position, "y", -10, 10, 0.01).name("cuti y");
  cutiFolder.add(object.position, "z", -10, 10, 0.01).name("cuti z");
  cutiFolder.add(object.rotation, "x", -10, 10, 0.01).name("cuti rx");
  cutiFolder.add(object.rotation, "y", -10, 10, 0.01).name("cuti ry");
  cutiFolder.add(object.rotation, "z", -10, 10, 0.01).name("cuti rz");
});

const dirLight = new THREE.DirectionalLight("#f7d777", 5);
dirLight.position.set(0, 200, 100);
dirLight.castShadow = true;
dirLight.shadow.camera.top = 180;
dirLight.shadow.camera.bottom = -100;
dirLight.shadow.camera.left = -120;
dirLight.shadow.camera.right = 120;
scene.add(dirLight);
//helper for dir light
const dirLightHelper = new THREE.DirectionalLightHelper(dirLight, 10);
scene.add(dirLightHelper);
// gui for dir light
const dirLightFolder = gui.addFolder("Dir Light");
dirLightFolder.add(dirLight.position, "x", -10, 10, 0.01).name("dl x");
dirLightFolder.add(dirLight.position, "y", -10, 10, 0.01).name("dl y");
dirLightFolder.add(dirLight.position, "z", -10, 10, 0.01).name("dl z");

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 5);
hemiLight.position.set(0, 200, 0);
scene.add(hemiLight);
//helper for hemi light
const hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 10);
scene.add(hemiLightHelper);
// gui for hemi light
const hemiLightFolder = gui.addFolder("Hemi Light");
hemiLightFolder.add(hemiLight.position, "x", -200, 200, 0.01).name("hl x");
hemiLightFolder.add(hemiLight.position, "y", -200, 200, 0.01).name("hl y");
hemiLightFolder.add(hemiLight.position, "z", -200, 200, 0.01).name("hl z");

/*
 * Sky
 */
let sky, sun;

function initSky() {
  // Add Sky
  sky = new Sky();
  sky.scale.setScalar(450000);
  scene.add(sky);

  sun = new THREE.Vector3();

  /// GUI

  const effectController = {
    turbidity: 1.6,
    rayleigh: 1.8,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.7,
    elevation: 2.6,
    azimuth: 180,
    exposure: renderer.toneMappingExposure,
  };

  function guiChanged() {
    const uniforms = sky.material.uniforms;
    uniforms["turbidity"].value = effectController.turbidity;
    uniforms["rayleigh"].value = effectController.rayleigh;
    uniforms["mieCoefficient"].value = effectController.mieCoefficient;
    uniforms["mieDirectionalG"].value = effectController.mieDirectionalG;

    const phi = THREE.MathUtils.degToRad(90 - effectController.elevation);
    const theta = THREE.MathUtils.degToRad(effectController.azimuth);

    sun.setFromSphericalCoords(1, phi, theta);

    uniforms["sunPosition"].value.copy(sun);

    renderer.toneMappingExposure = effectController.exposure;
    renderer.render(scene, camera);
  }
  const skyFolder = gui.addFolder("Sky");
  skyFolder
    .add(effectController, "turbidity", 0.0, 20.0, 0.1)
    .onChange(guiChanged);
  skyFolder
    .add(effectController, "rayleigh", 0.0, 4, 0.001)
    .onChange(guiChanged);
  skyFolder
    .add(effectController, "mieCoefficient", 0.0, 0.1, 0.001)
    .onChange(guiChanged);
  skyFolder
    .add(effectController, "mieDirectionalG", 0.0, 1, 0.001)
    .onChange(guiChanged);
  skyFolder.add(effectController, "elevation", 0, 90, 0.1).onChange(guiChanged);
  skyFolder
    .add(effectController, "azimuth", -180, 180, 0.1)
    .onChange(guiChanged);
  skyFolder
    .add(effectController, "exposure", 0, 1, 0.0001)
    .onChange(guiChanged);

  guiChanged();
}

/**
 * Camera
 */
// Base camera
// const camera = new THREE.PerspectiveCamera(
//   75,
//   sizes.width / sizes.height,
//   0.1,
//   100
// );
// camera.position.set(0.25, -0.25, 1);
// scene.add(camera);

// Controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

// Helper
const helper = new THREE.GridHelper(10000, 2, 0xffffff, 0xffffff);
scene.add(helper);

initSky();

/**
 * Clouds
 */
// Texture

const size = 128;
const data = new Uint8Array(size * size * size);

let i = 0;
const scale = 0.05;
const perlin = new ImprovedNoise();
const vector = new THREE.Vector3();

for (let z = 0; z < size; z++) {
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const d =
        1.0 -
        vector
          .set(x, y, z)
          .subScalar(size / 2)
          .divideScalar(size)
          .length();
      data[i] =
        (128 +
          128 * perlin.noise((x * scale) / 1.5, y * scale, (z * scale) / 1.5)) *
        d *
        d;
      i++;
    }
  }
}

const texture = new THREE.Data3DTexture(data, size, size, size);
texture.format = THREE.RedFormat;
texture.minFilter = THREE.LinearFilter;
texture.magFilter = THREE.LinearFilter;
texture.unpackAlignment = 1;
texture.needsUpdate = true;

// Material

const cloudsVertexShader = /* glsl */ `
					in vec3 position;

					uniform mat4 modelMatrix;
					uniform mat4 modelViewMatrix;
					uniform mat4 projectionMatrix;
					uniform vec3 cameraPos;

					out vec3 vOrigin;
					out vec3 vDirection;

					void main() {
						vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

						vOrigin = vec3( inverse( modelMatrix ) * vec4( cameraPos, 1.0 ) ).xyz;
						vDirection = position - vOrigin;

						gl_Position = projectionMatrix * mvPosition;
					}
				`;

const cloudsFragmentShader = /* glsl */ `
					precision highp float;
					precision highp sampler3D;

					uniform mat4 modelViewMatrix;
					uniform mat4 projectionMatrix;

					in vec3 vOrigin;
					in vec3 vDirection;

					out vec4 color;

					uniform vec3 base;
					uniform sampler3D map;

					uniform float threshold;
					uniform float range;
					uniform float opacity;
					uniform float steps;
					uniform float frame;

					uint wang_hash(uint seed)
					{
							seed = (seed ^ 61u) ^ (seed >> 16u);
							seed *= 9u;
							seed = seed ^ (seed >> 4u);
							seed *= 0x27d4eb2du;
							seed = seed ^ (seed >> 15u);
							return seed;
					}

					float randomFloat(inout uint seed)
					{
							return float(wang_hash(seed)) / 4294967296.;
					}

					vec2 hitBox( vec3 orig, vec3 dir ) {
						const vec3 box_min = vec3( - 0.5 );
						const vec3 box_max = vec3( 0.5 );
						vec3 inv_dir = 1.0 / dir;
						vec3 tmin_tmp = ( box_min - orig ) * inv_dir;
						vec3 tmax_tmp = ( box_max - orig ) * inv_dir;
						vec3 tmin = min( tmin_tmp, tmax_tmp );
						vec3 tmax = max( tmin_tmp, tmax_tmp );
						float t0 = max( tmin.x, max( tmin.y, tmin.z ) );
						float t1 = min( tmax.x, min( tmax.y, tmax.z ) );
						return vec2( t0, t1 );
					}

					float sample1( vec3 p ) {
						return texture( map, p ).r;
					}

					float shading( vec3 coord ) {
						float step = 0.01;
						return sample1( coord + vec3( - step ) ) - sample1( coord + vec3( step ) );
					}

					vec4 linearToSRGB( in vec4 value ) {
						return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
					}

					void main(){
						vec3 rayDir = normalize( vDirection );
						vec2 bounds = hitBox( vOrigin, rayDir );

						if ( bounds.x > bounds.y ) discard;

						bounds.x = max( bounds.x, 0.0 );

						vec3 p = vOrigin + bounds.x * rayDir;
						vec3 inc = 1.0 / abs( rayDir );
						float delta = min( inc.x, min( inc.y, inc.z ) );
						delta /= steps;

						// Jitter

						// Nice little seed from
						// https://blog.demofox.org/2020/05/25/casual-shadertoy-path-tracing-1-basic-camera-diffuse-emissive/
						uint seed = uint( gl_FragCoord.x ) * uint( 1973 ) + uint( gl_FragCoord.y ) * uint( 9277 ) + uint( frame ) * uint( 26699 );
						vec3 size = vec3( textureSize( map, 0 ) );
						float randNum = randomFloat( seed ) * 2.0 - 1.0;
						p += rayDir * randNum * ( 1.0 / size );

						//

						vec4 ac = vec4( base, 0.0 );

						for ( float t = bounds.x; t < bounds.y; t += delta ) {

							float d = sample1( p + 0.5 );

							d = smoothstep( threshold - range, threshold + range, d ) * opacity;

							float col = shading( p + 0.5 ) * 3.0 + ( ( p.x + p.y ) * 0.25 ) + 0.2;

							ac.rgb += ( 1.0 - ac.a ) * d * col;

							ac.a += ( 1.0 - ac.a ) * d;

							if ( ac.a >= 0.95 ) break;

							p += rayDir * delta;

						}

						color = linearToSRGB( ac );

						if ( color.a == 0.0 ) discard;

					}
				`;

const cloudGeometry = new THREE.BoxGeometry(1, 1, 1);
const cloudMaterial = new THREE.RawShaderMaterial({
  glslVersion: THREE.GLSL3,
  uniforms: {
    base: { value: new THREE.Color(0x798aa0) },
    map: { value: texture },
    cameraPos: { value: new THREE.Vector3() },
    threshold: { value: 0.25 },
    opacity: { value: 0.25 },
    range: { value: 0.1 },
    steps: { value: 100 },
    frame: { value: 0 },
  },
  vertexShader: cloudsVertexShader,
  fragmentShader: cloudsFragmentShader,
  side: THREE.BackSide,
  transparent: true,
});

const cloud1 = new THREE.Mesh(cloudGeometry, cloudMaterial);
cloud1.position.set(2, 0, -1);
const cloud2 = new THREE.Mesh(cloudGeometry, cloudMaterial);
cloud2.position.set(-2, 0, -1);
const cloud3 = new THREE.Mesh(cloudGeometry, cloudMaterial);
cloud3.position.set(0, 0, 3);
const cloud4 = new THREE.Mesh(cloudGeometry, cloudMaterial);
cloud4.position.set(0, 0, -3);
scene.add(cloud1, cloud2, cloud3, cloud4);

/**
 * Rainbow
 */

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
});
const rainbowGeometry = new THREE.TorusGeometry(60, 4, 40, 100);
const rainbow = new THREE.Mesh(rainbowGeometry, rainbowMaterial);
rainbow.opacity = 0.1;
rainbow.position.set(23, 3, -31);
scene.add(rainbow);

// add gui to position rainbow
const rainbowFolder = gui.addFolder("Rainbow");
rainbowFolder.add(rainbow.position, "x", -200, 200, 0.01);
rainbowFolder.add(rainbow.position, "y", -200, 200, 0.01);
rainbowFolder.add(rainbow.position, "z", -200, 200, 0.01);

// add gui to rotate rainbow
rainbowFolder.add(rainbow.rotation, "x", -10, 10, 0.01);
rainbowFolder.add(rainbow.rotation, "y", -10, 10, 0.01);
rainbowFolder.add(rainbow.rotation, "z", -10, 10, 0.01);

//

// GUI

const parameters = {
  threshold: 0.25,
  opacity: 0.25,
  range: 0.1,
  steps: 100,
};

function update() {
  cloudMaterial.uniforms.threshold.value = parameters.threshold;
  cloudMaterial.uniforms.opacity.value = parameters.opacity;
  cloudMaterial.uniforms.range.value = parameters.range;
  cloudMaterial.uniforms.steps.value = parameters.steps;
}

const cloudsFolder = gui.addFolder("Clouds");
cloudsFolder.add(parameters, "threshold", 0, 1, 0.01).onChange(update);
cloudsFolder.add(parameters, "opacity", 0, 1, 0.01).onChange(update);
cloudsFolder.add(parameters, "range", 0, 1, 0.01).onChange(update);
cloudsFolder.add(parameters, "steps", 0, 200, 1).onChange(update);

/**
 * Create a Physics-based 3D Cloth Plane with Cannon.js
 */

const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -1000, 0), // m/s²
  // gravity: new CANNON.Vec3(0, -9.82, 0), // m/s²
});
const Nx = 15;
const Ny = 15;
const mass = 1;
const clothSize = 1;
const dist = clothSize / Nx;

const shape = new CANNON.Particle();

const particles = [];

for (let i = 0; i < Nx + 1; i++) {
  particles.push([]);
  for (let j = 0; j < Ny + 1; j++) {
    const particle = new CANNON.Body({
      // mass: mass,
      mass: j === Ny ? 0 : mass,
      shape,
      position: new CANNON.Vec3(
        (i - Nx * 0.5) * dist,
        (j - Ny * 0.5) * dist,
        0
      ),
      velocity: new CANNON.Vec3(-0.9, 0, -0.08),
    });
    particles[i].push(particle);
    world.addBody(particle);
  }
}

function connect(i1, j1, i2, j2) {
  world.addConstraint(
    new CANNON.DistanceConstraint(particles[i1][j1], particles[i2][j2], dist)
  );
}

for (let i = 0; i < Nx + 1; i++) {
  for (let j = 0; j < Ny + 1; j++) {
    if (i < Nx) connect(i, j, i + 1, j);
    if (j < Ny) connect(i, j, i, j + 1);
  }
}

const clothGeometry = new THREE.PlaneGeometry(1, 1, Nx, Ny);

const clothMat = new THREE.MeshBasicMaterial({
  side: THREE.DoubleSide,
  // wireframe: true,
  map: new THREE.TextureLoader().load(
    "./textures/cuti-plane/title/cuti-title-1.jpeg"
  ),
});

const clothMesh1 = new THREE.Mesh(clothGeometry, clothMat);
const clothMesh2 = new THREE.Mesh(clothGeometry, clothMat);
const clothMesh3 = new THREE.Mesh(clothGeometry, clothMat);

clothMesh1.position.set(-2, 0, 0);
clothMesh2.position.set(-3, 0, 0);
clothMesh3.position.set(-4, 0, 0);
scene.add(clothMesh1, clothMesh2, clothMesh3);

function updateParticules() {
  for (let i = 0; i < Nx + 1; i++) {
    for (let j = 0; j < Ny + 1; j++) {
      const index = j * (Nx + 1) + i;

      const positionAttribute = clothGeometry.attributes.position;

      const position = particles[i][Ny - j].position;

      positionAttribute.setXYZ(index, position.x, position.y, position.z);

      positionAttribute.needsUpdate = true;
    }
  }
}
/**
 * Butterflies
 */
// Butterflies particles with textures from https://codepen.io/jaydan/pen/ompzvj
const nbButterflies = 15;
let butterflies;
let bodyTexture, wingTexture, wingTexture1, wingTexture2, wingTexture3;
let conf;
let whv, whh;
let destination = new THREE.Vector3();

// createButterflies();
function initButterflies() {
  conf = {
    attraction: 0.01,
    velocityLimit: 0.6,
    move: true,
    followMouse: false,
    shuffle: shuffle,
  };

  bodyTexture = new THREE.TextureLoader().load(
    "textures/butterfly/bodyTexture.png"
  );
  wingTexture1 = new THREE.TextureLoader().load(
    "textures/butterfly/wingTexture1.png"
  );
  wingTexture2 = new THREE.TextureLoader().load(
    "textures/butterfly/wingTexture2.png"
  );
  wingTexture3 = new THREE.TextureLoader().load(
    "textures/butterfly/wingTexture3.png"
  );

  butterflies = [];
  for (var i = 0; i < nbButterflies; i++) {
    var b = new Butterfly();
    butterflies.push(b);
    scene.add(b.o3d);
  }

  shuffle();
}

function shuffle() {
  for (var i = 0; i < butterflies.length; i++) {
    butterflies[i].shuffle();
  }
}

function Butterfly() {
  this.minWingRotation = -Math.PI / 6;
  this.maxWingRotation = Math.PI / 2 - 0.1;
  this.wingRotation = 0;

  this.velocity = new THREE.Vector3(rnd(1, true), rnd(1, true), rnd(1, true));
  this.destination = destination;

  const reduction = 0.4;

  var confs = [
    {
      bodyTexture: bodyTexture,
      bodyW: 10 * reduction,
      bodyH: 15 * reduction,
      wingTexture: wingTexture1,
      wingW: 10 * reduction,
      wingH: 15 * reduction,
      wingX: 5.5 * reduction,
    },
    {
      bodyTexture: bodyTexture,
      bodyW: 6 * reduction,
      bodyH: 9 * reduction,
      wingTexture: wingTexture2,
      wingW: 15 * reduction,
      wingH: 20 * reduction,
      wingX: 7.5 * reduction,
    },
    {
      bodyTexture: bodyTexture,
      bodyW: 8 * reduction,
      bodyH: 12 * reduction,
      wingTexture: wingTexture3,
      wingW: 10 * reduction,
      wingH: 15 * reduction,
      wingX: 5.5 * reduction,
    },
  ];

  this.init(confs[Math.floor(rnd(3))]);
}

Butterfly.prototype.init = function (bconf) {
  var geometry = new THREE.PlaneGeometry(bconf.wingW, bconf.wingH);
  var material = new THREE.MeshBasicMaterial({
    transparent: true,
    map: bconf.wingTexture,
    side: THREE.DoubleSide,
    depthTest: false,
  });
  var lwmesh = new THREE.Mesh(geometry, material);
  lwmesh.position.x = -bconf.wingX;
  this.lwing = new THREE.Object3D();
  this.lwing.add(lwmesh);

  var rwmesh = new THREE.Mesh(geometry, material);
  rwmesh.rotation.y = Math.PI;
  rwmesh.position.x = bconf.wingX;
  this.rwing = new THREE.Object3D();
  this.rwing.add(rwmesh);

  geometry = new THREE.PlaneGeometry(bconf.bodyW, bconf.bodyH);
  material = new THREE.MeshBasicMaterial({
    transparent: true,
    map: bconf.bodyTexture,
    side: THREE.DoubleSide,
    depthTest: false,
  });
  this.body = new THREE.Mesh(geometry, material);
  // this.body.position.z = -0.1;

  this.group = new THREE.Object3D();
  this.group.add(this.body);
  this.group.add(this.lwing);
  this.group.add(this.rwing);
  this.group.rotation.x = Math.PI / 2;
  this.group.rotation.y = Math.PI;

  this.setWingRotation(this.wingRotation);
  this.initTween();

  this.o3d = new THREE.Object3D();
  this.o3d.add(this.group);
};

Butterfly.prototype.initTween = function () {
  var duration =
    limit(conf.velocityLimit - this.velocity.length(), 0.1, 1.5) * 1000;
  this.wingRotation = this.minWingRotation;
  this.tweenWingRotation = new TWEEN.Tween(this)
    .to({ wingRotation: this.maxWingRotation }, duration)
    .repeat(1)
    .yoyo(true)
    // .easing(TWEEN.Easing.Cubic.InOut)
    .onComplete(function (object) {
      object.initTween();
    })
    .start();
};

Butterfly.prototype.move = function () {
  var destination;
  // if (mouseOver && conf.followMouse) {
  //   destination = mousePosition;
  // } else {
  destination = this.destination;
  // }

  var dv = destination.clone().sub(this.o3d.position).normalize();
  this.velocity.x += conf.attraction * dv.x;
  this.velocity.y += conf.attraction * dv.y;
  this.velocity.z += conf.attraction * dv.z;
  this.limitVelocity();

  // update position & rotation
  this.setWingRotation(this.wingRotation);
  this.o3d.lookAt(this.o3d.position.clone().add(this.velocity));
  this.o3d.position.add(this.velocity);
};

Butterfly.prototype.limitVelocity = function (y) {
  this.velocity.x = limit(
    this.velocity.x,
    -conf.velocityLimit,
    conf.velocityLimit
  );
  this.velocity.y = limit(
    this.velocity.y,
    -conf.velocityLimit,
    conf.velocityLimit
  );
  this.velocity.z = limit(
    this.velocity.z,
    -conf.velocityLimit,
    conf.velocityLimit
  );
};

Butterfly.prototype.setWingRotation = function (y) {
  this.lwing.rotation.y = y;
  this.rwing.rotation.y = -y;
};

Butterfly.prototype.shuffle = function () {
  this.velocity = new THREE.Vector3(rnd(1, true), rnd(1, true), rnd(1, true));
  var p = new THREE.Vector3(rnd(1, true), rnd(1, true), rnd(1, true))
    .normalize()
    .multiplyScalar(100);
  this.o3d.position.set(p.x, p.y, p.z);
  var scale = rnd(0.4) + 0.1;
  this.o3d.scale.set(scale, scale, scale);
};

function limit(number, min, max) {
  return Math.min(Math.max(number, min), max);
}

function rnd(max, negative) {
  return negative ? Math.random() * 2 * max - max : Math.random() * max;
}

initButterflies();

/**
 * Cuti Group of Images
 */
function cutiImagePlane() {
  const cutiImagePlaneGroup = new THREE.Group();
  const cutiImagePlane1 = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 1, 1),
    new THREE.MeshBasicMaterial({
      map: textureLoader.load("/textures/cuti-plane/cuti-1.webp"),
      side: THREE.DoubleSide,
    })
  );
  cutiImagePlane1.scale.set(1.5, 1.5, 1.5);
  cutiImagePlane1.position.set(-0.94, -0.84, -0.59);
  cutiImagePlane1.rotation.set(0.59, 0, 0);

  const cutiImagePlane2 = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 1, 1),
    new THREE.MeshBasicMaterial({
      map: textureLoader.load("/textures/cuti-plane/cuti-2.webp"),
      side: THREE.DoubleSide,
    })
  );
  cutiImagePlane2.scale.set(1.5, 1.5, 1.5);
  cutiImagePlane2.position.set(-0.18, 0.59, -0.69);
  cutiImagePlane2.rotation.set(0.59, 0, 0);

  const cutiImagePlane3 = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 1, 1),
    new THREE.MeshBasicMaterial({
      map: textureLoader.load("/textures/cuti-plane/cuti-3.webp"),
      side: THREE.DoubleSide,
    })
  );
  cutiImagePlane3.scale.set(1.5, 1.5, 1.5);
  cutiImagePlane3.position.set(0.46, -0.65, 0);
  cutiImagePlane3.rotation.set(5.88, 2.75, -0.34);

  const cutiImagePlane4 = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 1, 1),
    new THREE.MeshBasicMaterial({
      map: textureLoader.load("/textures/cuti-plane/cuti-4.webp"),
      side: THREE.DoubleSide,
    })
  );
  cutiImagePlane4.scale.set(1.5, 1.5, 1.5);
  cutiImagePlane4.position.set(1.48, 0, -0.16);
  cutiImagePlane4.rotation.set(0, -0.92, 0.13);

  const cutiImagePlane5 = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 1, 1),
    new THREE.MeshBasicMaterial({
      map: textureLoader.load("/textures/cuti-plane/cuti-5.webp"),
      side: THREE.DoubleSide,
    })
  );
  cutiImagePlane5.scale.set(1.5, 1.5, 1.5);
  cutiImagePlane5.position.set(-1.63, 0.44, -0.62);
  cutiImagePlane5.rotation.set(-2.84, 0.19, 0.72);

  const cutiImagePlane6 = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 1, 1),
    new THREE.MeshBasicMaterial({
      map: textureLoader.load("/textures/cuti-plane/cuti-6.webp"),
      side: THREE.DoubleSide,
    })
  );
  cutiImagePlane6.scale.set(1.5, 1.5, 1.5);
  cutiImagePlane6.position.set(0.44, 1.45, 0.93);
  cutiImagePlane6.rotation.set(0, 7.4, 0);

  const cutiImagePlane7 = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 1, 1),
    new THREE.MeshBasicMaterial({
      map: textureLoader.load("/textures/cuti-plane/cuti-7.webp"),
      side: THREE.DoubleSide,
    })
  );
  cutiImagePlane7.scale.set(1.5, 1.5, 1.5);
  cutiImagePlane7.position.set(0.67, -0.42, -0.93);
  cutiImagePlane7.rotation.set(0, 3.92, 0);

  const cutiImagePlane8 = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 1, 1),
    new THREE.MeshBasicMaterial({
      map: textureLoader.load("/textures/cuti-plane/cuti-8.webp"),
      side: THREE.DoubleSide,
    })
  );
  cutiImagePlane8.scale.set(1.5, 1.5, 1.5);
  cutiImagePlane8.position.set(-0.64, 1.98, -0.68);
  cutiImagePlane8.rotation.set(0, 0.65, 0.66);

  //add gui to all planes for position and rotation
  const cutiImagePlaneFolder = gui.addFolder("Cuti Image Plane");
  cutiImagePlaneFolder
    .add(cutiImagePlane1.position, "x", -10, 10, 0.01)
    .name("cutiImagePlane1 x position");
  cutiImagePlaneFolder
    .add(cutiImagePlane1.position, "y", -10, 10, 0.01)
    .name("cutiImagePlane1 y position");
  cutiImagePlaneFolder
    .add(cutiImagePlane1.position, "z", -10, 10, 0.01)
    .name("cutiImagePlane1 z position");
  cutiImagePlaneFolder
    .add(cutiImagePlane1.rotation, "x", -10, 10, 0.01)
    .name("cutiImagePlane1 x rotation");
  cutiImagePlaneFolder
    .add(cutiImagePlane1.rotation, "y", -10, 10, 0.01)
    .name("cutiImagePlane1 y rotation");
  cutiImagePlaneFolder
    .add(cutiImagePlane1.rotation, "z", -10, 10, 0.01)
    .name("cutiImagePlane1 z rotation");

  cutiImagePlaneFolder
    .add(cutiImagePlane2.position, "x", -10, 10, 0.01)
    .name("cutiImagePlane2 x position");
  cutiImagePlaneFolder
    .add(cutiImagePlane2.position, "y", -10, 10, 0.01)
    .name("cutiImagePlane2 y position");
  cutiImagePlaneFolder
    .add(cutiImagePlane2.position, "z", -10, 10, 0.01)
    .name("cutiImagePlane2 z position");
  cutiImagePlaneFolder
    .add(cutiImagePlane2.rotation, "x", -10, 10, 0.01)
    .name("cutiImagePlane2 x rotation");
  cutiImagePlaneFolder
    .add(cutiImagePlane2.rotation, "y", -10, 10, 0.01)
    .name("cutiImagePlane2 y rotation");
  cutiImagePlaneFolder
    .add(cutiImagePlane2.rotation, "z", -10, 10, 0.01)
    .name("cutiImagePlane2 z rotation");

  cutiImagePlaneFolder
    .add(cutiImagePlane3.position, "x", -10, 10, 0.01)
    .name("cutiImagePlane3 x position");
  cutiImagePlaneFolder
    .add(cutiImagePlane3.position, "y", -10, 10, 0.01)
    .name("cutiImagePlane3 y position");
  cutiImagePlaneFolder
    .add(cutiImagePlane3.position, "z", -10, 10, 0.01)
    .name("cutiImagePlane3 z position");
  cutiImagePlaneFolder
    .add(cutiImagePlane3.rotation, "x", -10, 10, 0.01)
    .name("cutiImagePlane3 x rotation");
  cutiImagePlaneFolder
    .add(cutiImagePlane3.rotation, "y", -10, 10, 0.01)
    .name("cutiImagePlane3 y rotation");
  cutiImagePlaneFolder
    .add(cutiImagePlane3.rotation, "z", -10, 10, 0.01)
    .name("cutiImagePlane3 z rotation");

  cutiImagePlaneFolder
    .add(cutiImagePlane4.position, "x", -10, 10, 0.01)
    .name("cutiImagePlane4 x position");
  cutiImagePlaneFolder
    .add(cutiImagePlane4.position, "y", -10, 10, 0.01)
    .name("cutiImagePlane4 y position");
  cutiImagePlaneFolder
    .add(cutiImagePlane4.position, "z", -10, 10, 0.01)
    .name("cutiImagePlane4 z position");
  cutiImagePlaneFolder
    .add(cutiImagePlane4.rotation, "x", -10, 10, 0.01)
    .name("cutiImagePlane4 x rotation");
  cutiImagePlaneFolder
    .add(cutiImagePlane4.rotation, "y", -10, 10, 0.01)
    .name("cutiImagePlane4 y rotation");
  cutiImagePlaneFolder
    .add(cutiImagePlane4.rotation, "z", -10, 10, 0.01)
    .name("cutiImagePlane4 z rotation");

  cutiImagePlaneFolder
    .add(cutiImagePlane5.position, "x", -10, 10, 0.01)
    .name("cutiImagePlane5 x position");
  cutiImagePlaneFolder
    .add(cutiImagePlane5.position, "y", -10, 10, 0.01)
    .name("cutiImagePlane5 y position");
  cutiImagePlaneFolder
    .add(cutiImagePlane5.position, "z", -10, 10, 0.01)
    .name("cutiImagePlane5 z position");
  cutiImagePlaneFolder
    .add(cutiImagePlane5.rotation, "x", -10, 10, 0.01)
    .name("cutiImagePlane5 x rotation");
  cutiImagePlaneFolder
    .add(cutiImagePlane5.rotation, "y", -10, 10, 0.01)
    .name("cutiImagePlane5 y rotation");
  cutiImagePlaneFolder
    .add(cutiImagePlane5.rotation, "z", -10, 10, 0.01)
    .name("cutiImagePlane5 z rotation");

  cutiImagePlaneFolder
    .add(cutiImagePlane6.position, "x", -10, 10, 0.01)
    .name("cutiImagePlane6 x position");
  cutiImagePlaneFolder
    .add(cutiImagePlane6.position, "y", -10, 10, 0.01)
    .name("cutiImagePlane6 y position");
  cutiImagePlaneFolder
    .add(cutiImagePlane6.position, "z", -10, 10, 0.01)
    .name("cutiImagePlane6 z position");
  cutiImagePlaneFolder
    .add(cutiImagePlane6.rotation, "x", -10, 10, 0.01)
    .name("cutiImagePlane6 x rotation");
  cutiImagePlaneFolder
    .add(cutiImagePlane6.rotation, "y", -10, 10, 0.01)
    .name("cutiImagePlane6 y rotation");
  cutiImagePlaneFolder
    .add(cutiImagePlane6.rotation, "z", -10, 10, 0.01)
    .name("cutiImagePlane6 z rotation");

  cutiImagePlaneFolder
    .add(cutiImagePlane7.position, "x", -10, 10, 0.01)
    .name("cutiImagePlane7 x position");
  cutiImagePlaneFolder
    .add(cutiImagePlane7.position, "y", -10, 10, 0.01)
    .name("cutiImagePlane7 y position");
  cutiImagePlaneFolder
    .add(cutiImagePlane7.position, "z", -10, 10, 0.01)
    .name("cutiImagePlane7 z position");
  cutiImagePlaneFolder
    .add(cutiImagePlane7.rotation, "x", -10, 10, 0.01)
    .name("cutiImagePlane7 x rotation");
  cutiImagePlaneFolder
    .add(cutiImagePlane7.rotation, "y", -10, 10, 0.01)
    .name("cutiImagePlane7 y rotation");
  cutiImagePlaneFolder
    .add(cutiImagePlane7.rotation, "z", -10, 10, 0.01)
    .name("cutiImagePlane7 z rotation");

  cutiImagePlaneFolder
    .add(cutiImagePlane8.position, "x", -10, 10, 0.01)
    .name("cutiImagePlane8 x position");
  cutiImagePlaneFolder
    .add(cutiImagePlane8.position, "y", -10, 10, 0.01)
    .name("cutiImagePlane8 y position");
  cutiImagePlaneFolder
    .add(cutiImagePlane8.position, "z", -10, 10, 0.01)
    .name("cutiImagePlane8 z position");
  cutiImagePlaneFolder
    .add(cutiImagePlane8.rotation, "x", -10, 10, 0.01)
    .name("cutiImagePlane8 x rotation");
  cutiImagePlaneFolder
    .add(cutiImagePlane8.rotation, "y", -10, 10, 0.01)
    .name("cutiImagePlane8 y rotation");
  cutiImagePlaneFolder
    .add(cutiImagePlane8.rotation, "z", -10, 10, 0.01)
    .name("cutiImagePlane8 z rotation");

  cutiImagePlaneGroup.add(
    cutiImagePlane1,
    cutiImagePlane2,
    cutiImagePlane3,
    cutiImagePlane4,
    cutiImagePlane5,
    cutiImagePlane6,
    cutiImagePlane7,
    cutiImagePlane8
  );
  cutiImagePlaneGroup.position.set(-1.7, 1, -10);
  gui
    .add(cutiImagePlaneGroup.position, "x", -10, 10, 0.01)
    .name("Group x position");
  gui
    .add(cutiImagePlaneGroup.position, "y", -10, 10, 0.01)
    .name("Group y position");
  gui
    .add(cutiImagePlaneGroup.position, "z", -10, 10, 0.01)
    .name("Group z position");

  scene.add(cutiImagePlaneGroup);

  //Cuti Image plane for title
  // const cutiImagePlaneTitle1 = new THREE.Mesh(
  //   new THREE.PlaneGeometry(1, 1, 1, 1),
  //   new THREE.MeshBasicMaterial({
  //     map: textureLoader.load("/textures/cuti-plane/title/cuti-title-1.jpeg"),
  //     side: THREE.DoubleSide,
  //   })
  // );
  // cutiImagePlaneTitle1.scale.set(1.5, 1.5, 1.5);
  // cutiImagePlaneTitle1.position.set(2.06, -1.47, -6);
  // cutiImagePlaneTitle1.rotation.set(0, 0, 0);

  // const cutiImagePlaneTitleFolder = gui.addFolder("Cuti Image Plane Title");
  // cutiImagePlaneTitleFolder
  //   .add(cutiImagePlaneTitle1.position, "x", -10, 10, 0.01)
  //   .name("cutiImagePlaneTitle1 x position");
  // cutiImagePlaneTitleFolder
  //   .add(cutiImagePlaneTitle1.position, "y", -10, 10, 0.01)
  //   .name("cutiImagePlaneTitle1 y position");
  // cutiImagePlaneTitleFolder
  //   .add(cutiImagePlaneTitle1.position, "z", -10, 10, 0.01)
  //   .name("cutiImagePlaneTitle1 z position");
  // cutiImagePlaneTitleFolder
  //   .add(cutiImagePlaneTitle1.scale, "x", -10, 10, 0.01)
  //   .name("cutiImagePlaneTitle1 x scale");
  // cutiImagePlaneTitleFolder
  //   .add(cutiImagePlaneTitle1.scale, "y", -10, 10, 0.01)
  //   .name("cutiImagePlaneTitle1 y scale");
  // cutiImagePlaneTitleFolder
  //   .add(cutiImagePlaneTitle1.scale, "z", -10, 10, 0.01)
  //   .name("cutiImagePlaneTitle1 z scale");
  // cutiImagePlaneTitleFolder
  //   .add(cutiImagePlaneTitle1.rotation, "x", -10, 10, 0.01)
  //   .name("cutiImagePlaneTitle1 x rotation");
  // cutiImagePlaneTitleFolder
  //   .add(cutiImagePlaneTitle1.rotation, "y", -10, 10, 0.01)
  //   .name("cutiImagePlaneTitle1 y rotation");
  // cutiImagePlaneTitleFolder
  //   .add(cutiImagePlaneTitle1.rotation, "z", -10, 10, 0.01)
  //   .name("cutiImagePlaneTitle1 z rotation");

  // const cutiImagePlaneTitle2 = new THREE.Mesh(
  //   new THREE.PlaneGeometry(1, 1, 1, 1),
  //   new THREE.MeshBasicMaterial({
  //     map: textureLoader.load("/textures/cuti-plane/title/cuti-title-2.jpeg"),
  //     side: THREE.DoubleSide,
  //   })
  // );
  // cutiImagePlaneTitle2.scale.set(3.4, 1.5, 1.5);
  // cutiImagePlaneTitle2.position.set(0, 1.2, -6.3);
  // cutiImagePlaneTitle2.rotation.set(0, 0, 0);

  // cutiImagePlaneTitleFolder
  //   .add(cutiImagePlaneTitle2.position, "x", -10, 10, 0.01)
  //   .name("cutiImagePlaneTitle2 x position");
  // cutiImagePlaneTitleFolder
  //   .add(cutiImagePlaneTitle2.position, "y", -10, 10, 0.01)
  //   .name("cutiImagePlaneTitle2 y position");
  // cutiImagePlaneTitleFolder
  //   .add(cutiImagePlaneTitle2.position, "z", -10, 10, 0.01)
  //   .name("cutiImagePlaneTitle2 z position");
  // cutiImagePlaneTitleFolder
  //   .add(cutiImagePlaneTitle2.scale, "x", -10, 10, 0.01)
  //   .name("cutiImagePlaneTitle2 x scale");
  // cutiImagePlaneTitleFolder
  //   .add(cutiImagePlaneTitle2.scale, "y", -10, 10, 0.01)
  //   .name("cutiImagePlaneTitle2 y scale");
  // cutiImagePlaneTitleFolder
  //   .add(cutiImagePlaneTitle2.scale, "z", -10, 10, 0.01)
  //   .name("cutiImagePlaneTitle2 z scale");
  // cutiImagePlaneTitleFolder
  //   .add(cutiImagePlaneTitle2.rotation, "x", -10, 10, 0.01)
  //   .name("cutiImagePlaneTitle2 x rotation");
  // cutiImagePlaneTitleFolder
  //   .add(cutiImagePlaneTitle2.rotation, "y", -10, 10, 0.01)
  //   .name("cutiImagePlaneTitle2 y rotation");
  // cutiImagePlaneTitleFolder
  //   .add(cutiImagePlaneTitle2.rotation, "z", -10, 10, 0.01)
  //   .name("cutiImagePlaneTitle2 z rotation");

  // const cutiImagePlaneTitle3 = new THREE.Mesh(
  //   new THREE.PlaneGeometry(1, 1, 1, 1),
  //   new THREE.MeshBasicMaterial({
  //     map: textureLoader.load("/textures/cuti-plane/title/cuti-title-3.jpeg"),
  //     side: THREE.DoubleSide,
  //   })
  // );
  // cutiImagePlaneTitle3.scale.set(1.5, -2.62, 1.5);
  // cutiImagePlaneTitle3.position.set(-2.62, -0.23, -5.3);
  // cutiImagePlaneTitle3.rotation.set(3, 0, 0);

  // cutiImagePlaneTitleFolder
  //   .add(cutiImagePlaneTitle3.position, "x", -10, 10, 0.01)
  //   .name("cutiImagePlaneTitle3 x position");
  // cutiImagePlaneTitleFolder
  //   .add(cutiImagePlaneTitle3.position, "y", -10, 10, 0.01)
  //   .name("cutiImagePlaneTitle3 y position");
  // cutiImagePlaneTitleFolder
  //   .add(cutiImagePlaneTitle3.position, "z", -10, 10, 0.01)
  //   .name("cutiImagePlaneTitle3 z position");
  // cutiImagePlaneTitleFolder
  //   .add(cutiImagePlaneTitle3.scale, "x", -10, 10, 0.01)
  //   .name("cutiImagePlaneTitle3 x scale");
  // cutiImagePlaneTitleFolder
  //   .add(cutiImagePlaneTitle3.scale, "y", -10, 10, 0.01)
  //   .name("cutiImagePlaneTitle3 y scale");
  // cutiImagePlaneTitleFolder
  //   .add(cutiImagePlaneTitle3.scale, "z", -10, 10, 0.01)
  //   .name("cutiImagePlaneTitle3 z scale");
  // cutiImagePlaneTitleFolder
  //   .add(cutiImagePlaneTitle3.rotation, "x", -10, 10, 0.01)
  //   .name("cutiImagePlaneTitle3 x rotation");
  // cutiImagePlaneTitleFolder
  //   .add(cutiImagePlaneTitle3.rotation, "y", -10, 10, 0.01)
  //   .name("cutiImagePlaneTitle3 y rotation");
  // cutiImagePlaneTitleFolder
  //   .add(cutiImagePlaneTitle3.rotation, "z", -10, 10, 0.01)
  //   .name("cutiImagePlaneTitle3 z rotation");

  // const cutiImagePlaneTitle4 = new THREE.Mesh(
  //   new THREE.PlaneGeometry(1, 1, 1, 1),
  //   new THREE.MeshBasicMaterial({
  //     map: textureLoader.load("/textures/cuti-plane/title/cuti-title-4.jpeg"),
  //     side: THREE.DoubleSide,
  //   })
  // );
  // cutiImagePlaneTitle4.scale.set(-1.29, -1.6, 1.5);
  // cutiImagePlaneTitle4.position.set(-0.21, -1.64, -5.3);
  // cutiImagePlaneTitle4.rotation.set(3, 0, 0);

  // cutiImagePlaneTitleFolder
  //   .add(cutiImagePlaneTitle4.position, "x", -10, 10, 0.01)
  //   .name("cutiImagePlaneTitle4 x position");
  // cutiImagePlaneTitleFolder
  //   .add(cutiImagePlaneTitle4.position, "y", -10, 10, 0.01)
  //   .name("cutiImagePlaneTitle4 y position");
  // cutiImagePlaneTitleFolder
  //   .add(cutiImagePlaneTitle4.position, "z", -10, 10, 0.01)
  //   .name("cutiImagePlaneTitle4 z position");
  // cutiImagePlaneTitleFolder
  //   .add(cutiImagePlaneTitle4.scale, "x", -10, 10, 0.01)
  //   .name("cutiImagePlaneTitle4 x scale");
  // cutiImagePlaneTitleFolder
  //   .add(cutiImagePlaneTitle4.scale, "y", -10, 10, 0.01)
  //   .name("cutiImagePlaneTitle4 y scale");
  // cutiImagePlaneTitleFolder
  //   .add(cutiImagePlaneTitle4.scale, "z", -10, 10, 0.01)
  //   .name("cutiImagePlaneTitle4 z scale");
  // cutiImagePlaneTitleFolder
  //   .add(cutiImagePlaneTitle4.rotation, "x", -10, 10, 0.01)
  //   .name("cutiImagePlaneTitle4 x rotation");
  // cutiImagePlaneTitleFolder
  //   .add(cutiImagePlaneTitle4.rotation, "y", -10, 10, 0.01)
  //   .name("cutiImagePlaneTitle4 y rotation");
  // cutiImagePlaneTitleFolder
  //   .add(cutiImagePlaneTitle4.rotation, "z", -10, 10, 0.01)
  //   .name("cutiImagePlaneTitle4 z rotation");

  // const cutiImagePlaneTitleGroup = new THREE.Group();
  // cutiImagePlaneTitleGroup.add(
  //   cutiImagePlaneTitle1,
  //   cutiImagePlaneTitle2,
  //   cutiImagePlaneTitle3,
  //   cutiImagePlaneTitle4
  // );
  // cutiImagePlaneTitleGroup.position.set(0, 0, 4);
  // scene.add(cutiImagePlaneTitleGroup);
}
cutiImagePlane();

const moveCamara = (x, y, z) => {
  gsap.to(camera.position, {
    duration: 3,
    x,
    y,
    z,
    ease: "power2.inOut",
  });
};

const rotateCamera = (x, y, z) => {
  gsap.to(camera.rotation, {
    duration: 3,
    x,
    y,
    z,
    ease: "power2.inOut",
  });
};

let position = 0;
window.addEventListener("mouseup", () => {
  console.log(camera.position);
  switch (position) {
    case 0:
      moveCamara(0.81, 0.22, 3.95);
      rotateCamera(0, 0.1, 0);
      position = 1;
      break;
    case 1:
      moveCamara(6.81, 0.22, 6.95);
      rotateCamera(0, 0.1, 0);
      position = 2;
      break;
    case 2:
      moveCamara(9.81, 0.22, 9.95);
      rotateCamera(0, 0.1, 0);
      position = 3;
      break;
    case 3:
      moveCamara(9.81, 1.22, 9.95);
      rotateCamera(0, 0.1, 0);
      position = 4;
      break;
    default:
      break;
  }
});

/**
 * Animate
 */
const clock = new THREE.Clock();

const timeStep = 1 / 60;
function animate(time) {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();

  if (mixer) mixer.update(delta);

  //Animate butterflies
  TWEEN.update();
  for (var i = 0; i < butterflies.length; i++) {
    butterflies[i].move();
  }

  //cannon cloth simulation
  updateParticules();
  world.step(timeStep);

  // Update controls
  // controls.update(delta);
  // controls.update();
  //Animate clouds
  cloud1.material.uniforms.cameraPos.value.copy(camera.position);
  cloud1.rotation.y = -performance.now() / 7500;

  cloud1.material.uniforms.frame.value++;

  cloud2.material.uniforms.cameraPos.value.copy(camera.position);
  cloud2.rotation.y = -performance.now() / 7500;

  cloud2.material.uniforms.frame.value++;

  cloud3.material.uniforms.cameraPos.value.copy(camera.position);
  cloud3.rotation.y = -performance.now() / 7500;

  cloud3.material.uniforms.frame.value++;

  cloud4.material.uniforms.cameraPos.value.copy(camera.position);
  cloud4.rotation.y = -performance.now() / 7500;

  cloud4.material.uniforms.frame.value++;

  renderer.render(scene, camera);
}
// renderer.setAnimationLoop(animate);
animate();
