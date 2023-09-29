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
    // this.videoGeometry = new THREE.PlaneGeometry(1, 1, 4, 8);
    this.videoGeometry2 = new THREE.BoxGeometry(1, 1, 1, 1);
    this.videoGeometry3 = new THREE.CylinderGeometry(5, 5, 20, 32);
  }

  setMesh() {
    this.videoMesh1 = new THREE.Mesh(this.videoGeometry3, this.videoMaterial1);
    this.videoMesh1.position.set(10, 6.4, 10);
    this.videoMesh1.scale.set(1.8, 0.8, 1.5);

    this.videoMesh2 = new THREE.Mesh(this.videoGeometry2, this.videoMaterial2);
    this.videoMesh2.position.set(10.95, 8.41, 13.5);
    this.videoMesh2.rotation.set(0, 0, 0.34);
    this.videoMesh2.scale.set(2, 2, 2);

    this.videoMesh3 = new THREE.Mesh(this.videoGeometry2, this.videoMaterial3);
    this.videoMesh3.position.set(12.2, 4.7, 10);
    this.videoMesh3.rotation.set(0, 3, -0.4);
    this.videoMesh3.scale.set(2, 2, 2);

    this.videoMesh4 = new THREE.Mesh(this.videoGeometry2, this.videoMaterial4);
    this.videoMesh4.position.set(11, 5, 4.1);
    this.videoMesh4.rotation.set(0, 3, -0.4);
    this.videoMesh4.scale.set(2, 2, 2);

    this.videoMesh5 = new THREE.Mesh(this.videoGeometry2, this.videoMaterial5);
    this.videoMesh5.position.set(12, 5, 14);
    this.videoMesh5.scale.set(2, 2, 2);

    this.videoMesh6 = new THREE.Mesh(this.videoGeometry2, this.videoMaterial6);
    this.videoMesh6.position.set(13.3, 0, 5.3);
    this.videoMesh6.scale.set(2, 2, 2);

    this.videoGroup = new THREE.Group();
    this.videoGroup.add(
      this.videoMesh1,
      this.videoMesh2,
      this.videoMesh3,
      this.videoMesh4,
      this.videoMesh5,
      this.videoMesh6
    );

    this.scene.add(this.videoGroup);

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("Cuti Videos");
      this.debugFolder
        .add(this.videoMesh1.position, "x", -100, 100, 0.1)
        .name("Video 1 x position");
      this.debugFolder
        .add(this.videoMesh1.position, "y", -100, 100, 0.1)
        .name("Video 1 y position");
      this.debugFolder
        .add(this.videoMesh1.position, "z", -100, 100, 0.1)
        .name("Video 1 z position");

      this.debugFolder
        .add(this.videoMesh1.scale, "x", -100, 100, 0.1)
        .name("Video 1 x scale");
      this.debugFolder
        .add(this.videoMesh1.scale, "y", -100, 100, 0.1)
        .name("Video 1 y scale");
      this.debugFolder
        .add(this.videoMesh1.scale, "z", -100, 100, 0.1)
        .name("Video 1 z scale");

      this.debugFolder
        .add(this.videoMesh1.rotation, "x", -Math.PI, Math.PI, 0.1)
        .name("Video 1 x rotation");
      this.debugFolder
        .add(this.videoMesh1.rotation, "y", -Math.PI, Math.PI, 0.1)
        .name("Video 1 y rotation");
      this.debugFolder
        .add(this.videoMesh1.rotation, "z", -Math.PI, Math.PI, 0.1)
        .name("Video 1 z rotation");

      this.debugFolder
        .add(this.videoMesh2.position, "x", -100, 100, 0.1)
        .name("Video 2 x position");
      this.debugFolder
        .add(this.videoMesh2.position, "y", -100, 100, 0.1)
        .name("Video 2 y position");
      this.debugFolder
        .add(this.videoMesh2.position, "z", -100, 100, 0.1)
        .name("Video 2 z position");

      this.debugFolder
        .add(this.videoMesh2.scale, "x", -100, 100, 0.1)
        .name("Video 2 x scale");
      this.debugFolder
        .add(this.videoMesh2.scale, "y", -100, 100, 0.1)
        .name("Video 2 y scale");
      this.debugFolder
        .add(this.videoMesh2.scale, "z", -100, 100, 0.1)
        .name("Video 2 z scale");

      this.debugFolder
        .add(this.videoMesh2.rotation, "x", -Math.PI, Math.PI, 0.1)
        .name("Video 2 x rotation");
      this.debugFolder
        .add(this.videoMesh2.rotation, "y", -Math.PI, Math.PI, 0.1)
        .name("Video 2 y rotation");
      this.debugFolder
        .add(this.videoMesh2.rotation, "z", -Math.PI, Math.PI, 0.1)
        .name("Video 2 z rotation");

      this.debugFolder
        .add(this.videoMesh3.position, "x", -100, 100, 0.1)
        .name("Video 3 x position");
      this.debugFolder
        .add(this.videoMesh3.position, "y", -100, 100, 0.1)
        .name("Video 3 y position");
      this.debugFolder
        .add(this.videoMesh3.position, "z", -100, 100, 0.1)
        .name("Video 3 z position");

      this.debugFolder
        .add(this.videoMesh3.scale, "x", -100, 100, 0.1)
        .name("Video 3 x scale");
      this.debugFolder
        .add(this.videoMesh3.scale, "y", -100, 100, 0.1)
        .name("Video 3 y scale");
      this.debugFolder
        .add(this.videoMesh3.scale, "z", -100, 100, 0.1)
        .name("Video 3 z scale");

      this.debugFolder
        .add(this.videoMesh3.rotation, "x", -Math.PI, Math.PI, 0.1)
        .name("Video 3 x rotation");
      this.debugFolder
        .add(this.videoMesh3.rotation, "y", -Math.PI, Math.PI, 0.1)
        .name("Video 3 y rotation");
      this.debugFolder
        .add(this.videoMesh3.rotation, "z", -Math.PI, Math.PI, 0.1)
        .name("Video 3 z rotation");

      this.debugFolder
        .add(this.videoMesh4.position, "x", -100, 100, 0.1)
        .name("Video 4 x position");
      this.debugFolder
        .add(this.videoMesh4.position, "y", -100, 100, 0.1)
        .name("Video 4 y position");
      this.debugFolder
        .add(this.videoMesh4.position, "z", -100, 100, 0.1)
        .name("Video 4 z position");

      this.debugFolder
        .add(this.videoMesh4.scale, "x", -100, 100, 0.1)
        .name("Video 4 x scale");
      this.debugFolder
        .add(this.videoMesh4.scale, "y", -100, 100, 0.1)
        .name("Video 4 y scale");
      this.debugFolder
        .add(this.videoMesh4.scale, "z", -100, 100, 0.1)
        .name("Video 4 z scale");

      this.debugFolder
        .add(this.videoMesh4.rotation, "x", -Math.PI, Math.PI, 0.1)
        .name("Video 4 x rotation");
      this.debugFolder
        .add(this.videoMesh4.rotation, "y", -Math.PI, Math.PI, 0.1)
        .name("Video 4 y rotation");
      this.debugFolder
        .add(this.videoMesh4.rotation, "z", -Math.PI, Math.PI, 0.1)
        .name("Video 4 z rotation");

      this.debugFolder
        .add(this.videoMesh5.position, "x", -100, 100, 0.1)
        .name("Video 5 x position");
      this.debugFolder
        .add(this.videoMesh5.position, "y", -100, 100, 0.1)
        .name("Video 5 y position");
      this.debugFolder
        .add(this.videoMesh5.position, "z", -100, 100, 0.1)
        .name("Video 5 z position");
      this.debugFolder

        .add(this.videoMesh4.scale, "x", -100, 100, 0.1)
        .name("Video 5 x scale");
      this.debugFolder
        .add(this.videoMesh5.scale, "y", -100, 100, 0.1)
        .name("Video 5 y scale");
      this.debugFolder
        .add(this.videoMesh5.scale, "z", -100, 100, 0.1)
        .name("Video 5 z scale");

      this.debugFolder
        .add(this.videoMesh5.rotation, "x", -Math.PI, Math.PI, 0.1)
        .name("Video 5 x rotation");
      this.debugFolder
        .add(this.videoMesh5.rotation, "y", -Math.PI, Math.PI, 0.1)
        .name("Video 5 y rotation");
      this.debugFolder
        .add(this.videoMesh5.rotation, "z", -Math.PI, Math.PI, 0.1)
        .name("Video 5 z rotation");

      this.debugFolder
        .add(this.videoMesh6.position, "x", -100, 100, 0.1)
        .name("Video 6 x position");
      this.debugFolder
        .add(this.videoMesh6.position, "y", -100, 100, 0.1)
        .name("Video 6 y position");
      this.debugFolder
        .add(this.videoMesh6.position, "z", -100, 100, 0.1)
        .name("Video 6 z position");

      this.debugFolder
        .add(this.videoMesh6.scale, "x", -100, 100, 0.1)
        .name("Video 6 x scale");
      this.debugFolder
        .add(this.videoMesh6.scale, "y", -100, 100, 0.1)
        .name("Video 6 y scale");
      this.debugFolder
        .add(this.videoMesh6.scale, "z", -100, 100, 0.1)
        .name("Video 6 z scale");

      this.debugFolder
        .add(this.videoMesh6.rotation, "x", -Math.PI, Math.PI, 0.1)
        .name("Video 6 x rotation");
      this.debugFolder
        .add(this.videoMesh6.rotation, "y", -Math.PI, Math.PI, 0.1)
        .name("Video 6 y rotation");
      this.debugFolder
        .add(this.videoMesh6.rotation, "z", -Math.PI, Math.PI, 0.1)
        .name("Video 6 z rotation");

      this.debugFolder
        //add videogroup
        .add(this.videoGroup.position, "x", -300, 300, 1)
        .name("Video Group x position");
      this.debugFolder
        .add(this.videoGroup.position, "y", -300, 300, 1)
        .name("Video Group y position");
      this.debugFolder
        .add(this.videoGroup.position, "z", -300, 300, 1)
        .name("Video Group z position");

      this.debugFolder
        .add(this.videoGroup.scale, "x", -100, 100, 0.1)
        .name("Video Group x scale");
      this.debugFolder
        .add(this.videoGroup.scale, "y", -100, 100, 0.1)
        .name("Video Group y scale");
      this.debugFolder
        .add(this.videoGroup.scale, "z", -100, 100, 0.1)
        .name("Video Group z scale");

      this.debugFolder
        .add(this.videoGroup.rotation, "x", -Math.PI, Math.PI, 0.1)
        .name("Video Group x rotation");
      this.debugFolder
        .add(this.videoGroup.rotation, "y", -Math.PI, Math.PI, 0.1)
        .name("Video Group y rotation");
      this.debugFolder
        .add(this.videoGroup.rotation, "z", -Math.PI, Math.PI, 0.1)
        .name("Video Group z rotation");
    }
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
