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
    });
    this.Nx = 33;
    this.Ny = 33;
    const mass = 1;
    const clothSize = 1.9;
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
          velocity: new CANNON.Vec3(1, 3, 1),
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
    }

    for (let i = 0; i < this.Nx + 1; i++) {
      for (let j = 0; j < this.Ny + 1; j++) {
        if (i < this.Nx) connect(i, j, i + 1, j);
        if (j < this.Ny) connect(i, j, i, j + 1);
      }
    }

    this.clothGeometry = new THREE.PlaneGeometry(1, 1, this.Nx, this.Ny);

    this.clothMaterials = [];
    for (let i = 0; i < 8; i++) {
      this.clothMaterials[i] = new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        // wireframe: true,
        map: this.resources.loaders.textureLoader.load(
          "./textures/cloth/cuti-cloth-" + i + ".jpg"
        ),
      });
    }

    this.clothMeshes = [];
    for (let i = 0; i < 8; i++) {
      this.clothMeshes[i] = new THREE.Mesh(
        this.clothGeometry,
        this.clothMaterials[i]
      );
    }

    this.clothMeshes[0].position.set(-2, 0, 0);
    this.clothMeshes[1].position.set(-3, 0, 0);
    this.clothMeshes[2].position.set(-4, 0, 0);
    this.clothMeshes[3].position.set(-5, 0, 0);
    this.clothMeshes[4].position.set(-2, -1, 0);
    this.clothMeshes[5].position.set(-3, -1, 0);
    this.clothMeshes[6].position.set(-4, -1, 0);
    this.clothMeshes[7].position.set(-5, -1, 0);

    this.clothGroup = new THREE.Group();
    this.clothGroup.add(
      this.clothMeshes[0],
      this.clothMeshes[1],
      this.clothMeshes[2],
      this.clothMeshes[3],
      this.clothMeshes[4],
      this.clothMeshes[5],
      this.clothMeshes[6],
      this.clothMeshes[7]
    );
    this.clothGroup.position.set(3.42, 9, 9);

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

        //make particle velocity increase over time
        this.particles[i][j].velocity.z += 0.003;

        const position = this.particles[i][this.Ny - j].position;

        positionAttribute.setXYZ(index, position.x, position.y, position.z);

        positionAttribute.needsUpdate = true;
      }
    }
    this.world.step(this.timeStep);
  }
}
