import EventEmitter from "./EventEmitter";
import * as THREE from "three";
export default class Time extends EventEmitter {
  constructor() {
    super();

    // Setup
    this.start = Date.now();
    this.current = this.start;
    this.elapsed = 0;
    this.delta = 16;
    this.clock = new THREE.Clock();

    // Tick
    window.requestAnimationFrame(() => {
      this.tick();
    });
  }

  tick() {
    const currentTime = Date.now();
    this.delta = currentTime - this.current;
    this.current = currentTime;
    this.elapsed = this.current - this.start;
    this.getDeltaClock = this.clock.getDelta();

    this.trigger("tick");
    window.requestAnimationFrame(() => {
      this.tick();
    });
  }
}
