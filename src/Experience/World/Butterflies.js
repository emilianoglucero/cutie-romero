import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";
import { ImprovedNoise } from "three/examples/jsm/math/ImprovedNoise.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
export default class Butterflies {
  constructor(experience) {
    this.experience = experience;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.butterflies = [];

    this.setButterFlies();
  }

  setButterFlies() {
    // Butterflies particles with textures from https://codepen.io/jaydan/pen/ompzvj
    const nbButterflies = 15;
    let butterflies = this.butterflies;
    let bodyTexture, wingTexture, wingTexture1, wingTexture2, wingTexture3;
    let conf;
    let whv, whh;
    let destination = new THREE.Vector3();

    function shuffle() {
      for (var i = 0; i < butterflies.length; i++) {
        butterflies[i].shuffle();
      }
    }
    function Butterfly() {
      this.minWingRotation = -Math.PI / 6;
      this.maxWingRotation = Math.PI / 2 - 0.1;
      this.wingRotation = 0;
      this.velocity = new THREE.Vector3(
        rnd(1, true),
        rnd(1, true),
        rnd(1, true)
      );
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
      this.velocity = new THREE.Vector3(
        rnd(1, true),
        rnd(1, true),
        rnd(1, true)
      );
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
    conf = {
      attraction: 0.01,
      velocityLimit: 0.6,
      move: true,
      followMouse: false,
      shuffle: shuffle,
    };
    bodyTexture = this.resources.loaders.textureLoader.load(
      "textures/butterfly/bodyTexture.png"
    );
    wingTexture1 = this.resources.loaders.textureLoader.load(
      "textures/butterfly/wingTexture1.png"
    );
    wingTexture2 = this.resources.loaders.textureLoader.load(
      "textures/butterfly/wingTexture2.png"
    );
    wingTexture3 = this.resources.loaders.textureLoader.load(
      "textures/butterfly/wingTexture3.png"
    );
    for (var i = 0; i < nbButterflies; i++) {
      var b = new Butterfly();
      butterflies.push(b);
      this.scene.add(b.o3d);
    }
    shuffle();
    this.butterflies = butterflies;
  }

  update() {
    //Animate butterflies
    TWEEN.update();
    for (var i = 0; i < this.butterflies.length; i++) {
      this.butterflies[i].move();
    }
  }
}
