import {
  BoxGeometry,
  Group,
  Material,
  Mesh,
  MeshBasicMaterial,
  Vector3,
} from 'three';

interface IFence {
  position: Vector3;
  material: Material;
}

export class Fence {
  public group: Group;

  constructor({position}: IFence) {
    const geometry = new BoxGeometry(0.01, 2, 0.3);
    const material = new MeshBasicMaterial({
      color: 0xaaaaaa,
      transparent: true,
      opacity: 0.7,
    });

    const cube = new Mesh(geometry, material);
    cube.position.copy(position);

    this.group = new Group();
    for (let i = 0; i <= 2; i += 2 / 5) {
      const clonedPicket = cube.clone();
      clonedPicket.translateZ(i);
      this.group.add(clonedPicket);
    }

    return this;
  }
}
