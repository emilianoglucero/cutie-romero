import * as THREE from "three";
import * as CANNON from "cannon";
export default class ClothPlane {
  constructor(experience) {
    this.experience = experience;
    this.resources = this.experience.resources;
    this.scene = this.experience.scene;
    this.debug = this.experience.experience.debug;

    this.particles = [];
    this.timeStep = 1 / 60;
    this.world = [];

    this.setClothPlane();
  }

  setClothPlane() {
    let world = this.world;
    world = new CANNON.World({
      gravity: new CANNON.Vec3(0, -1000, 0), // m/s²
      // gravity: new CANNON.Vec3(0, -9.82, 0), // m/s²
    });
    this.Nx = 15;
    this.Ny = 15;
    const mass = 1;
    const clothSize = 1;
    const dist = clothSize / this.Nx;

    const shape = new CANNON.Particle();

    let particles = this.particles;

    for (let i = 0; i < this.Nx + 1; i++) {
      this.particles.push([]);
      for (let j = 0; j < this.Ny + 1; j++) {
        const particle = new CANNON.Body({
          // mass: mass,
          mass: j === this.Ny ? 0 : mass,
          shape,
          position: new CANNON.Vec3(
            (i - this.Nx * 0.5) * dist,
            (j - this.Ny * 0.5) * dist,
            0
          ),
          velocity: new CANNON.Vec3(-0.9, 0, -0.08),
        });
        this.particles[i].push(particle);
        world.addBody(particle);
      }
    }

    function connect(i1, j1, i2, j2) {
      world.addConstraint(
        new CANNON.DistanceConstraint(
          particles[i1][j1],
          particles[i2][j2],
          dist
        )
      );
      // console.log(world);
      // console.log(typeof world);
      //   this.world = world;
    }

    for (let i = 0; i < this.Nx + 1; i++) {
      for (let j = 0; j < this.Ny + 1; j++) {
        if (i < this.Nx) connect(i, j, i + 1, j);
        if (j < this.Ny) connect(i, j, i, j + 1);
      }
    }

    this.clothGeometry = new THREE.PlaneGeometry(1, 1, this.Nx, this.Ny);

    const clothMat = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      // wireframe: true,
      map: this.resources.loaders.textureLoader.load(
        "./textures/cuti-plane/title/cuti-title-1.jpeg"
      ),
    });

    const clothMesh1 = new THREE.Mesh(this.clothGeometry, clothMat);
    const clothMesh2 = new THREE.Mesh(this.clothGeometry, clothMat);
    const clothMesh3 = new THREE.Mesh(this.clothGeometry, clothMat);

    clothMesh1.position.set(-2, 0, 0);
    clothMesh2.position.set(-3, 0, 0);
    clothMesh3.position.set(-4, 0, 0);
    // add to group
    this.clothGroup = new THREE.Group();
    this.clothGroup.add(clothMesh1, clothMesh2, clothMesh3);
    this.clothGroup.position.set(-4, 1.7, -27);
    this.scene.add(this.clothGroup);

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("Cuti Cloth Images");

      this.debugFolder
        .add(this.clothGroup.position, "x", -100, 100, 0.01)
        .name("Group x position");
      this.debugFolder
        .add(this.clothGroup.position, "y", -100, 100, 0.01)
        .name("Group y position");
      this.debugFolder
        .add(this.clothGroup.position, "z", -100, 100, 0.01)
        .name("Group z position");
    }

    function updateParticules() {
      for (let i = 0; i < this.Nx + 1; i++) {
        for (let j = 0; j < this.Ny + 1; j++) {
          const index = j * (this.Nx + 1) + i;

          const positionAttribute = this.clothGeometry.attributes.position;

          const position = this.particles[i][this.Ny - j].position;

          positionAttribute.setXYZ(index, position.x, position.y, position.z);

          positionAttribute.needsUpdate = true;
        }
      }
    }
    this.world = world;
  }

  update() {
    for (let i = 0; i < this.Nx + 1; i++) {
      for (let j = 0; j < this.Ny + 1; j++) {
        const index = j * (this.Nx + 1) + i;

        const positionAttribute = this.clothGeometry.attributes.position;

        const position = this.particles[i][this.Ny - j].position;

        positionAttribute.setXYZ(index, position.x, position.y, position.z);

        positionAttribute.needsUpdate = true;
      }
    }
    this.world.step(this.timeStep);
  }
}
