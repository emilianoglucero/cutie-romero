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

    const clothMat1 = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      // wireframe: true,
      map: this.resources.loaders.textureLoader.load(
        "./textures/cloth/cuti-cloth-1.jpeg"
      ),
    });
    const clothMat2 = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      // wireframe: true,
      map: this.resources.loaders.textureLoader.load(
        "./textures/cloth/cuti-cloth-2.jpeg"
      ),
    });
    const clothMat3 = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      // wireframe: true,
      map: this.resources.loaders.textureLoader.load(
        "./textures/cloth/cuti-cloth-3.jpeg"
      ),
    });
    const clothMat4 = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      // wireframe: true,
      map: this.resources.loaders.textureLoader.load(
        "./textures/cloth/cuti-cloth-4.jpg"
      ),
    });
    const clothMat5 = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      // wireframe: true,
      map: this.resources.loaders.textureLoader.load(
        "./textures/cloth/cuti-cloth-5.jpeg"
      ),
    });
    const clothMat6 = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      // wireframe: true,
      map: this.resources.loaders.textureLoader.load(
        "./textures/cloth/cuti-cloth-6.jpeg"
      ),
    });
    const clothMat7 = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      // wireframe: true,
      map: this.resources.loaders.textureLoader.load(
        "./textures/cloth/cuti-cloth-7.jpeg"
      ),
    });
    const clothMat8 = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      // wireframe: true,
      map: this.resources.loaders.textureLoader.load(
        "./textures/cloth/cuti-cloth-8.jpeg"
      ),
    });

    const clothMesh1 = new THREE.Mesh(this.clothGeometry, clothMat1);
    const clothMesh2 = new THREE.Mesh(this.clothGeometry, clothMat2);
    const clothMesh3 = new THREE.Mesh(this.clothGeometry, clothMat3);
    const clothMesh4 = new THREE.Mesh(this.clothGeometry, clothMat4);
    const clothMesh5 = new THREE.Mesh(this.clothGeometry, clothMat5);
    const clothMesh6 = new THREE.Mesh(this.clothGeometry, clothMat6);
    const clothMesh7 = new THREE.Mesh(this.clothGeometry, clothMat7);
    const clothMesh8 = new THREE.Mesh(this.clothGeometry, clothMat8);

    clothMesh1.position.set(-2, 0, 0);
    clothMesh2.position.set(-3, 0, 0);
    clothMesh3.position.set(-4, 0, 0);
    clothMesh4.position.set(-5, 0, 0);
    clothMesh5.position.set(-2, -1, 0);
    clothMesh6.position.set(-3, -1, 0);
    clothMesh7.position.set(-4, -1, 0);
    clothMesh8.position.set(-5, -1, 0);

    this.clothGroup = new THREE.Group();
    this.clothGroup.add(
      clothMesh1,
      clothMesh2,
      clothMesh3,
      clothMesh4,
      clothMesh5,
      clothMesh6,
      clothMesh7,
      clothMesh8
    );
    this.clothGroup.position.set(-9.4, 1.7, 10.95);
    // this.clothGroup.position.set(4, 1.7, 1.67);

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
