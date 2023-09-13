import * as THREE from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { Font } from "three/examples/jsm/loaders/FontLoader.js";
export default class Title3D {
  constructor(experience) {
    this.experience = experience;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    console.log(this.resources);

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
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5,
      });

      // Create a standard material with red color and 50% gloss
      const textMaterial = new THREE.MeshMatcapMaterial({
        matcap: matcapTexture,
      });

      // Geometries are attached to meshes so that they get rendered
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      // Update positioning of the text
      textMesh.position.set(-2, 0, 0);
      this.scene.add(textMesh);
    });
  }
}
