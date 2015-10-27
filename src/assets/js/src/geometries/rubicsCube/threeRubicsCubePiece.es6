import ThreeGroup from '../../framework/threeGroup.es6';

export default class ThreeRubicsCubePiece extends ThreeGroup{
  constructor(piece, options = {}) {
    super();
    piece.children.forEach(child => {
      if(child.material.side !== THREE.DoubleSide) {
        child.material.side = THREE.DoubleSide;
      }
    });
    this.add(piece);
  }

  
}
