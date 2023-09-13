import * as THREE from "three";
import { TextureLoader } from "three";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";

import EventEmitter from "./EventEmitter";
import { TTFLoader } from "three/examples/jsm/loaders/TTFLoader";

export default class Resources extends EventEmitter {
  constructor(sources) {
    super();
    //Options
    this.sources = sources;

    //Setup
    this.items = {};
    this.toLoad = this.sources.length;
    this.loaded = 0;

    this.setLoaders();
    this.startLoading();
  }

  setLoaders() {
    this.loaders = {};
    this.loaders.textureLoader = new TextureLoader();
    this.loaders.FBXLoader = new FBXLoader();
    this.loaders.TTFLoader = new TTFLoader();
  }

  startLoading() {
    // Load each source
    for (const source of this.sources) {
      if (source.type === "planeTexture") {
        this.loaders.textureLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === "fbx") {
        this.loaders.FBXLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === "3DText") {
        this.loaders.textureLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      }
    }
  }
  sourceLoaded(source, file) {
    this.items[source.name] = file;
    this.loaded++;

    if (this.loaded === this.toLoad) {
      this.trigger("ready");
    }
  }
}
