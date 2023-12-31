import * as THREE from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { Font } from "three/examples/jsm/loaders/FontLoader.js";
export default class Title3D {
  constructor(experience) {
    this.experience = experience;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.debug = this.experience.experience.debug;

    this.setTitle3D();
  }

  setTitle3D() {
    const fontLoader = this.resources.loaders.TTFLoader;
    const textureLoader = this.resources.loaders.textureLoader;
    const matcapTexture = textureLoader.load("/textures/matcaps/1.png");
    fontLoader.load("/fonts/Playball-Regular.ttf", (fontData) => {
      // Convert the parsed fontData to the format Three.js understands
      const font = new Font(fontData);

      // Create the text geometry
      const textGeometry = new TextGeometry("Cutie Romero", {
        font: font,
        size: 0.5,
        height: 0.2,
        curveSegments: 6,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 3,
      });

      // Create a standard material with red color and 50% gloss
      const textMaterial = new THREE.MeshMatcapMaterial({
        matcap: matcapTexture,
      });

      // Geometries are attached to meshes so that they get rendered
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      // Update positioning of the text
      //set matrixAutoUpdate to false so we can update the matrix manually
      textMesh.matrixAutoUpdate = false;
      textMesh.position.set(-2, 0, 0);
      textMesh.updateMatrix();
      this.scene.add(textMesh);

      // Debug
      if (this.debug.active) {
        this.debugFolder = this.debug.ui.addFolder("Title3D");
        this.debugFolder
          .add(textMesh.position, "x", -10, 10, 0.01)
          .name("Title3D position x");
      }
    });
  }
}
