import * as THREE from "three";
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader.js";
export default class CutiVideos {
  constructor(experience) {
    this.experience = experience;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.debug = this.experience.experience.debug;
    this.setVideoElements();
    this.setTextures();
    this.setMaterials();
    this.setGeometry();
    this.setMesh();
  }

  setVideoElements() {
    this.video1 = document.getElementById("video1");
    this.video1.play();
    this.video2 = document.getElementById("video2");
    this.video2.play();
    this.video3 = document.getElementById("video3");
    this.video3.play();
    this.video4 = document.getElementById("video4");
    this.video4.play();
    this.video5 = document.getElementById("video5");
    this.video5.play();
    this.video6 = document.getElementById("video6");
    this.video6.play();
  }

  setTextures() {
    this.textures = {};
    this.textures.displacementTexture =
      this.resources.items.displacementTexture;
    this.textures.image1 = this.resources.items.cutiPlaneImageTitle1;

    this.videoTexture1 = new THREE.VideoTexture(this.video1);
    this.videoTexture1.minFilter = THREE.LinearFilter;
    this.videoTexture1.magFilter = THREE.LinearFilter;
    this.videoTexture1.crossOrigin = "anonymous";
    this.videoTexture2 = new THREE.VideoTexture(this.video2);
    this.videoTexture2.minFilter = THREE.LinearFilter;
    this.videoTexture2.magFilter = THREE.LinearFilter;
    this.videoTexture2.crossOrigin = "anonymous";
    this.videoTexture3 = new THREE.VideoTexture(this.video3);
    this.videoTexture3.minFilter = THREE.LinearFilter;
    this.videoTexture3.magFilter = THREE.LinearFilter;
    this.videoTexture3.crossOrigin = "anonymous";
    this.videoTexture4 = new THREE.VideoTexture(this.video4);

    this.videoTexture4.minFilter = THREE.LinearFilter;
    this.videoTexture4.magFilter = THREE.LinearFilter;
    this.videoTexture4.crossOrigin = "anonymous";
    this.videoTexture5 = new THREE.VideoTexture(this.video5);
    this.videoTexture5.minFilter = THREE.LinearFilter;
    this.videoTexture5.magFilter = THREE.LinearFilter;
    this.videoTexture5.crossOrigin = "anonymous";
    this.videoTexture6 = new THREE.VideoTexture(this.video6);
    this.videoTexture6.minFilter = THREE.LinearFilter;
    this.videoTexture6.magFilter = THREE.LinearFilter;
    this.videoTexture6.crossOrigin = "anonymous";
  }

  setMaterials() {
    this.videoMaterial1 = new THREE.MeshBasicMaterial({
      map: this.videoTexture1,
      side: THREE.DoubleSide,
    });

    this.videoMaterial2 = new THREE.MeshBasicMaterial({
      map: this.videoTexture2,
      side: THREE.DoubleSide,
    });

    this.videoMaterial3 = new THREE.MeshBasicMaterial({
      map: this.videoTexture3,
      side: THREE.DoubleSide,
    });

    this.videoMaterial4 = new THREE.MeshBasicMaterial({
      map: this.videoTexture4,
      side: THREE.DoubleSide,
    });

    this.videoMaterial5 = new THREE.MeshBasicMaterial({
      map: this.videoTexture5,
      side: THREE.DoubleSide,
    });

    this.videoMaterial6 = new THREE.MeshBasicMaterial({
      map: this.videoTexture6,
      side: THREE.DoubleSide,
    });
  }

  setGeometry() {
    this.videoGeometry = new THREE.PlaneGeometry(1, 1, 1, 1);
  }

  setMesh() {
    this.videoMesh1 = new THREE.Mesh(this.videoGeometry, this.videoMaterial1);
    this.videoMesh1.position.set(-4, 0.66, 0);
    this.videoMesh1.scale.set(3, 3, 3);

    this.videoMesh2 = new THREE.Mesh(this.videoGeometry, this.videoMaterial2);
    this.videoMesh2.position.set(0.33, 1.1, 0);
    this.videoMesh2.rotation.set(0, 0, 0.34);
    this.videoMesh2.scale.set(1, 1, 1);

    this.videoMesh3 = new THREE.Mesh(this.videoGeometry, this.videoMaterial3);
    this.videoMesh3.position.set(-0.69, -0.94, 0);
    this.videoMesh3.rotation.set(0, 3, -0.4);
    this.videoMesh3.scale.set(1, 1, 1);

    this.videoMesh4 = new THREE.Mesh(this.videoGeometry, this.videoMaterial4);
    this.videoMesh4.position.set(0.69, -0.94, 0);
    this.videoMesh4.rotation.set(0, 3, -0.4);
    this.videoMesh4.scale.set(1, 1, 1);

    this.videoMesh5 = new THREE.Mesh(this.videoGeometry, this.videoMaterial5);
    this.videoMesh5.position.set(0, 0.66, 0);
    this.videoMesh5.scale.set(3, 3, 3);

    this.videoMesh6 = new THREE.Mesh(this.videoGeometry, this.videoMaterial6);
    this.videoMesh6.position.set(0, 0.66, 0);
    this.videoMesh6.scale.set(3, 3, 3);

    // this.scene.add(
    //   this.videoMesh1,
    //   this.videoMesh2,
    //   this.videoMesh3,
    //   this.videoMesh4,
    //   this.videoMesh5,
    //   this.videoMesh6
    // );
  }

  update() {
    this.videoTexture1.needsUpdate = true;
    this.videoTexture2.needsUpdate = true;
    this.videoTexture3.needsUpdate = true;
    this.videoTexture4.needsUpdate = true;
    this.videoTexture5.needsUpdate = true;
    this.videoTexture6.needsUpdate = true;
  }
}
