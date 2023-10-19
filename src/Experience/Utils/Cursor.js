import gsap from "gsap";
export default class Cursor {
  constructor() {
    const cursor = document.querySelector(".small");

    let posS = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let posB = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let mouse = { x: posS.x, y: posS.y };
    const speed = 0.1;
    let fpms = 60 / 1000;

    window.addEventListener("mousemove", (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
    });

    const xSetBallBig = gsap.quickSetter(cursor, "x", "px");
    const ySetBallBig = gsap.quickSetter(cursor, "y", "px");

    gsap.ticker.add((time, deltaTime) => {
      let delta = deltaTime * fpms;
      let dt = 1.0 - Math.pow(1.0 - speed, delta);

      posS.x += mouse.x - posS.x;
      posS.y += mouse.y - posS.y;
      posB.x += (mouse.x - posB.x) * dt;
      posB.y += (mouse.y - posB.y) * dt;
      xSetBallBig(posB.x);
      ySetBallBig(posB.y);
    });

    const btnMusic = document.querySelector(".btn-music");
    btnMusic.addEventListener("mouseenter", () => {
      cursor.classList.remove("big");
    });
    btnMusic.addEventListener("mouseleave", () => {
      cursor.classList.add("big");
    });
  }
}
