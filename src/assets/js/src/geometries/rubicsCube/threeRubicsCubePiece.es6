import ThreeGroup from '../../framework/threeGroup.es6';

export default class ThreeRubicsCubePiece extends ThreeGroup{
  constructor(piece, options = {}) {
    super();
    this.add(piece);
  }
}
