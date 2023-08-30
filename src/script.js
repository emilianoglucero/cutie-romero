import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import { Sky } from "three/addons/objects/Sky.js";
import { ImprovedNoise } from "three/addons/math/ImprovedNoise.js";

import { GUI } from "three/addons/libs/lil-gui.module.min.js";

let sky, sun;

const gui = new GUI();

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

  gui.add(effectController, "turbidity", 0.0, 20.0, 0.1).onChange(guiChanged);
  gui.add(effectController, "rayleigh", 0.0, 4, 0.001).onChange(guiChanged);
  gui
    .add(effectController, "mieCoefficient", 0.0, 0.1, 0.001)
    .onChange(guiChanged);
  gui
    .add(effectController, "mieDirectionalG", 0.0, 1, 0.001)
    .onChange(guiChanged);
  gui.add(effectController, "elevation", 0, 90, 0.1).onChange(guiChanged);
  gui.add(effectController, "azimuth", -180, 180, 0.1).onChange(guiChanged);
  gui.add(effectController, "exposure", 0, 1, 0.0001).onChange(guiChanged);

  guiChanged();
}

/**
 * Base
 */

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

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
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0.25, -0.25, 1);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Helper
const helper = new THREE.GridHelper(10000, 2, 0xffffff, 0xffffff);
scene.add(helper);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

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

const vertexShader = /* glsl */ `
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

const fragmentShader = /* glsl */ `
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
  vertexShader,
  fragmentShader,
  side: THREE.BackSide,
  transparent: true,
});

const cloud1 = new THREE.Mesh(cloudGeometry, cloudMaterial);
cloud1.position.set(2, 0, -1);
const cloud2 = new THREE.Mesh(cloudGeometry, cloudMaterial);
cloud2.position.set(-2, 0, -1);
const cloud3 = new THREE.Mesh(cloudGeometry, cloudMaterial);
cloud3.position.set(0, 0, 1);
const cloud4 = new THREE.Mesh(cloudGeometry, cloudMaterial);
cloud4.position.set(0, 0, -3);
scene.add(cloud1, cloud2, cloud3, cloud4);

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

// const gui = new GUI();
gui.add(parameters, "threshold", 0, 1, 0.01).onChange(update);
gui.add(parameters, "opacity", 0, 1, 0.01).onChange(update);
gui.add(parameters, "range", 0, 1, 0.01).onChange(update);
gui.add(parameters, "steps", 0, 200, 1).onChange(update);

//

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

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

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
