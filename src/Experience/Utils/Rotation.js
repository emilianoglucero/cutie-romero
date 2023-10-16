import EventEmitter from "./EventEmitter";

export default class Rotation extends EventEmitter {
  constructor() {
    super();
    this.warningMobile = document.querySelector(".warning-mobile");

    this.portrait = window.matchMedia("(orientation: portrait)");
    if (this.portrait.matches) {
      // Portrait mode
      this.setWarningMobile();
    }

    this.portrait.addEventListener("change", () => {
      if (this.portrait.matches) {
        // Portrait mode
        this.setWarningMobile();
      } else {
        // Landscape mode
        this.setDisableWarningMobile();
      }
    });
  }

  setWarningMobile() {
    this.warningMobile.style.display = "flex";
  }

  setDisableWarningMobile() {
    this.warningMobile.style.display = "none";
  }
}
