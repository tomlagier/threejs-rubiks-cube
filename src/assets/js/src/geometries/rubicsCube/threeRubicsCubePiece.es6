import ThreeGroup from '../../framework/threeGroup.es6';

export default class ThreeRubicsCubePiece extends ThreeGroup{
  constructor(piece, options = {}) {
    super();
    piece.traverse(child => {
      if(child.material && (child.material.side !== THREE.DoubleSide)) {
        child.material.side = THREE.DoubleSide;
      }
    });
    this.add(piece);
  }


}
