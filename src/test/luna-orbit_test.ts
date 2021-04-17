import {LunaOrbit} from '../luna-orbit.js';

const assert = chai.assert;

suite('luna-orbit', () => {
  test('is defined', () => {
    const el = document.createElement('luna-orbit');
    assert.instanceOf(el, LunaOrbit);
  });
});
