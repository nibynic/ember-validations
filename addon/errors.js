import Ember from 'ember';

const {
  A: emberArray,
  Object: EmberObject,
  defineProperty
} = Ember;

export default EmberObject.extend({
  unknownProperty(property) {
    let value = emberArray();
    defineProperty(this, property, function() { return value });
    return this.get(property);
  }
});
