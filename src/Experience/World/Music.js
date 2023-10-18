export default class Music {
  constructor(experience) {
    this.experience = experience;
    this.scene = this.experience.scene;

    this.setMusic();
  }

  setMusic() {
    this.music = new Audio("/music/music.mp3");
    this.music.loop = true;
    this.music.volume = 0.8;

    this.btnPlay = document.querySelector(".play");
    this.btnStop = document.querySelector(".stop");
    this.btnMusic = document.querySelector(".btn-music");
    let isPlaying = false;

    this.btnMusic.addEventListener("click", () => {
      if (!isPlaying) {
        this.music.play();
        this.btnStop.style.display = "none";
        this.btnPlay.style.display = "block";
        isPlaying = true;
      } else {
        this.music.pause();
        this.btnPlay.style.display = "none";
        this.btnStop.style.display = "block";
        isPlaying = false;
      }
    });
  }
}
