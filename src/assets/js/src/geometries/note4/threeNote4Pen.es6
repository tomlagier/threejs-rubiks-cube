/**
 * Contains group-specific properties, esp animations, for the Note 4 Pen
 */

/* globals TweenMax */
import ThreeGroup from '../../framework/threeGroup.es6';

export default class ThreeNote4Pen extends ThreeGroup {
  constructor() {
    super();
    this.createSlideDownAnimation();
  }

  createSlideDownAnimation() {
    const slideTween = TweenMax.to(this.position, 1, {
      y: '-=10'
    });

    this.createAnimation('slideDown').add(slideTween);
  }
}
