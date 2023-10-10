import * as THREE from "three";
import { ImprovedNoise } from "three/examples/jsm/math/ImprovedNoise.js";

export default class Clouds {
  constructor(experience) {
    this.experience = experience;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.debug = this.experience.experience.debug;
    this.setClouds();
    //try to use BufferGeometryUtils.mergeBufferGeometries
  }

  setClouds() {
    // Texture
    this.size = 128;
    this.data = new Uint8Array(this.size * this.size * this.size);

    let i = 0;
    this.scale = 0.05;
    this.perlin = new ImprovedNoise();
    this.vector = new THREE.Vector3();

    for (let z = 0; z < this.size; z++) {
      for (let y = 0; y < this.size; y++) {
        for (let x = 0; x < this.size; x++) {
          const d =
            1.0 -
            this.vector
              .set(x, y, z)
              .subScalar(this.size / 2)
              .divideScalar(this.size)
              .length();
          this.data[i] =
            (128 +
              128 *
                this.perlin.noise(
                  (x * this.scale) / 1.5,
                  y * this.scale,
                  (z * this.scale) / 1.5
                )) *
            d *
            d;
          i++;
        }
      }
    }

    this.texture = new THREE.Data3DTexture(
      this.data,
      this.size,
      this.size,
      this.size
    );
    this.texture.format = THREE.RedFormat;
    this.texture.minFilter = THREE.LinearFilter;
    this.texture.magFilter = THREE.LinearFilter;
    this.texture.unpackAlignment = 1;
    this.texture.needsUpdate = true;

    // Material

    this.cloudsVertexShader = /* glsl */ `
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

    this.cloudsFragmentShader = /* glsl */ `
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

    this.cloudGeometry = new THREE.BoxGeometry(1, 1, 1);
    this.cloudMaterial = new THREE.RawShaderMaterial({
      glslVersion: THREE.GLSL3,
      uniforms: {
        base: { value: new THREE.Color(0xe6dae4) },
        map: { value: this.texture },
        cameraPos: { value: new THREE.Vector3() },
        threshold: { value: 0.25 },
        opacity: { value: 0.25 },
        range: { value: 0.1 },
        steps: { value: 100 },
        frame: { value: 0 },
      },
      vertexShader: this.cloudsVertexShader,
      fragmentShader: this.cloudsFragmentShader,
      side: THREE.BackSide,
      transparent: true,
      precision: "lowp",
    });

    this.cloud1 = new THREE.Mesh(this.cloudGeometry, this.cloudMaterial);
    this.cloud1.position.set(-5, 3, -9);
    this.cloud1.scale.set(-9, -5, -9);
    this.cloud2 = new THREE.Mesh(this.cloudGeometry, this.cloudMaterial);
    this.cloud2.position.set(18.58, 8.32, 10.04);
    this.cloud2.scale.set(-7, -5, -7);
    this.cloud3 = new THREE.Mesh(this.cloudGeometry, this.cloudMaterial);
    this.cloud3.position.set(0, 0, 11);
    this.cloud3.scale.set(-7, -5, -7);
    this.cloud4 = new THREE.Mesh(this.cloudGeometry, this.cloudMaterial);
    this.cloud4.position.set(2.78, -0.3, 0);
    this.cloud4.scale.set(2.6, 1.5, 1.5);
    this.cloud5 = new THREE.Mesh(this.cloudGeometry, this.cloudMaterial);
    this.cloud5.position.set(-15, -4, 0);
    this.cloud5.scale.set(-7, -5, -7);
    this.scene.add(
      this.cloud1,
      this.cloud2,
      this.cloud3,
      this.cloud4,
      this.cloud5
    );

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("Clouds");
      this.debugFolder
        .add(this.cloud1.position, "x", -100, 100, 0.01)
        .name("cloud1 x position");
      this.debugFolder
        .add(this.cloud1.position, "y", -100, 100, 0.01)
        .name("cloud1 y position");
      this.debugFolder
        .add(this.cloud1.position, "z", -100, 100, 0.01)
        .name("cloud1 z position");
      this.debugFolder
        .add(this.cloud1.scale, "x", -100, 100, 0.01)
        .name("cloud1 x scale");
      this.debugFolder
        .add(this.cloud1.scale, "y", -100, 100, 0.01)
        .name("cloud1 y scale");
      this.debugFolder
        .add(this.cloud1.scale, "z", -100, 100, 0.01)
        .name("cloud1 z scale");
      this.debugFolder
        .add(this.cloud1.rotation, "x", -100, 100, 0.01)
        .name("cloud1 x rotation");
      this.debugFolder
        .add(this.cloud1.rotation, "y", -100, 100, 0.01)
        .name("cloud1 y rotation");
      this.debugFolder
        .add(this.cloud1.rotation, "z", -100, 100, 0.01)
        .name("cloud1 z rotation");
      this.debugFolder
        .add(this.cloudMaterial.uniforms.threshold, "value", -100, 100, 0.01)
        .name("cloudMaterial threshold");
      this.debugFolder
        .add(this.cloudMaterial.uniforms.opacity, "value", -100, 100, 0.01)
        .name("cloudMaterial opacity");
      this.debugFolder
        .add(this.cloudMaterial.uniforms.range, "value", -100, 100, 0.01)
        .name("cloudMaterial range");
      this.debugFolder
        .add(this.cloudMaterial.uniforms.steps, "value", -100, 100, 0.01)
        .name("cloudMaterial steps");
      this.debugFolder
        .add(this.cloudMaterial.uniforms.frame, "value", -100, 100, 0.01)
        .name("cloudMaterial frame");

      this.debugFolder
        .add(this.cloud2.position, "x", -100, 100, 0.01)
        .name("cloud2 x position");
      this.debugFolder
        .add(this.cloud2.position, "y", -100, 100, 0.01)
        .name("cloud2 y position");
      this.debugFolder
        .add(this.cloud2.position, "z", -100, 100, 0.01)
        .name("cloud2 z position");
      this.debugFolder
        .add(this.cloud2.scale, "x", -100, 100, 0.01)
        .name("cloud2 x scale");
      this.debugFolder
        .add(this.cloud2.scale, "y", -100, 100, 0.01)
        .name("cloud2 y scale");
      this.debugFolder
        .add(this.cloud2.scale, "z", -100, 100, 0.01)
        .name("cloud2 z scale");
      this.debugFolder
        .add(this.cloud2.rotation, "x", -100, 100, 0.01)
        .name("cloud2 x rotation");
      this.debugFolder
        .add(this.cloud2.rotation, "y", -100, 100, 0.01)
        .name("cloud2 y rotation");
      this.debugFolder
        .add(this.cloud2.rotation, "z", -100, 100, 0.01)
        .name("cloud2 z rotation");

      this.debugFolder
        .add(this.cloud3.position, "x", -100, 100, 0.01)
        .name("cloud3 x position");
      this.debugFolder
        .add(this.cloud3.position, "y", -100, 100, 0.01)
        .name("cloud3 y position");
      this.debugFolder
        .add(this.cloud3.position, "z", -100, 100, 0.01)
        .name("cloud3 z position");
      this.debugFolder
        .add(this.cloud3.scale, "x", -100, 100, 0.01)
        .name("cloud3 x scale");
      this.debugFolder
        .add(this.cloud3.scale, "y", -100, 100, 0.01)
        .name("cloud3 y scale");
      this.debugFolder
        .add(this.cloud3.scale, "z", -100, 100, 0.01)
        .name("cloud3 z scale");
      this.debugFolder
        .add(this.cloud3.rotation, "x", -100, 100, 0.01)
        .name("cloud3 x rotation");
      this.debugFolder
        .add(this.cloud3.rotation, "y", -100, 100, 0.01)
        .name("cloud3 y rotation");
      this.debugFolder
        .add(this.cloud3.rotation, "z", -100, 100, 0.01)
        .name("cloud3 z rotation");

      this.debugFolder
        .add(this.cloud4.position, "x", -100, 100, 0.01)
        .name("cloud4 x position");
      this.debugFolder
        .add(this.cloud4.position, "y", -100, 100, 0.01)
        .name("cloud4 y position");
      this.debugFolder
        .add(this.cloud4.position, "z", -100, 100, 0.01)
        .name("cloud4 z position");
      this.debugFolder
        .add(this.cloud4.scale, "x", -100, 100, 0.01)
        .name("cloud4 x scale");
      this.debugFolder
        .add(this.cloud4.scale, "y", -100, 100, 0.01)
        .name("cloud4 y scale");
      this.debugFolder
        .add(this.cloud4.scale, "z", -100, 100, 0.01)
        .name("cloud4 z scale");
      this.debugFolder
        .add(this.cloud4.rotation, "x", -100, 100, 0.01)
        .name("cloud4 x rotation");
      this.debugFolder
        .add(this.cloud4.rotation, "y", -100, 100, 0.01)
        .name("cloud4 y rotation");
      this.debugFolder
        .add(this.cloud4.rotation, "z", -100, 100, 0.01)
        .name("cloud4 z rotation");

      this.debugFolder
        .add(this.cloud5.position, "x", -100, 100, 0.01)
        .name("cloud5 x position");
      this.debugFolder
        .add(this.cloud5.position, "y", -100, 100, 0.01)
        .name("cloud5 y position");
      this.debugFolder
        .add(this.cloud5.position, "z", -100, 100, 0.01)
        .name("cloud5 z position");
    }
  }

  update() {
    this.cloud1.material.uniforms.cameraPos.value.copy(
      this.experience.experience.camera.instance.position
    );
    this.cloud1.rotation.y = -performance.now() / 7500;
    this.cloud1.material.uniforms.frame.value += 1;

    this.cloud2.material.uniforms.cameraPos.value.copy(
      this.experience.experience.camera.instance.position
    );
    this.cloud2.rotation.y = -performance.now() / 7500;
    this.cloud2.material.uniforms.frame.value += 1;

    this.cloud3.material.uniforms.cameraPos.value.copy(
      this.experience.experience.camera.instance.position
    );
    this.cloud3.rotation.y = -performance.now() / 7500;
    this.cloud3.material.uniforms.frame.value += 1;

    this.cloud4.material.uniforms.cameraPos.value.copy(
      this.experience.experience.camera.instance.position
    );
    this.cloud4.rotation.y = -performance.now() / 7500;
    this.cloud4.material.uniforms.frame.value += 1;
  }
}
