import Stats from "stats-gl";
export default class ExperienceStats {
  constructor(experience) {
    this.experience = experience;
    this.scene = this.experience.scene;
    this.stats = new Stats({
      logsPerSecond: 20,
      samplesLog: 100,
      samplesGraph: 10,
      precision: 2,
      horizontal: true,
      minimal: false,
      mode: 0,
    });
    document.body.appendChild(this.stats.container);

    this.scene.onBeforeRender = () => {
      this.stats.begin();
    };

    this.scene.onAfterRender = () => {
      this.stats.end();
    };
  }
}
