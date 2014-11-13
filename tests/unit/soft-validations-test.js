import Ember from 'ember';
import Mixin from 'ember-validations/mixin';
import EmberValidations from 'ember-validations';
import { buildContainer } from '../helpers/container';

var user, User;
var get = Ember.get;
var set = Ember.set;

module('Soft validations', {
  setup: function() {
    User = Ember.Object.extend(EmberValidations.Mixin, {
      container: buildContainer(),
      validations: {
        firstName: {
          presence: true,
          length: {is: 5, soft: true}
        },
        lastName: {
          presence: {soft: true}
        }
      }
    });
    Ember.run(function() {
      user = User.create();
    });
  }
});

test('"soft" option marks validation as soft', function() {
  var validators = get(user, 'validators');
  equal(validators[0].get('soft'), false);
  equal(validators[1].get('soft'), true);
  equal(validators[2].get('soft'), true);
});

test('isValid ignores soft validation errors', function() {
  equal(get(user, 'isValid'), false, 'should be invalid');
  Ember.run(function() {
    user.setProperties({firstName: 'Anna'});
  });
  equal(get(user, 'isValid'), true, 'should be valid');
  equal(get(user, 'hasWarnings'), true, 'should have warnings');
  equal(get(user, 'hasNoWarnings'), false, 'hasNoWarnings should be set to false');
});

test('soft validation errors are stored as warnings', function() {
  Ember.run(function() {
    user = User.create();
  });
  deepEqual(get(user, 'errors.firstName'), ["can't be blank"]);
  ok(Ember.isEmpty(get(user, 'errors.lastName')));
  deepEqual(get(user, 'warnings.firstName'), ["is the wrong length (should be 5 characters)"]);
  deepEqual(get(user, 'warnings.lastName'), ["can't be blank"]);
  Ember.run(function() {
    user = User.create({firstName: 'Brian', lastName: "Bambini"});
  });
  ok(get(user, 'isValid'));
  ok(Ember.isEmpty(get(user, 'errors.firstName')));
  ok(Ember.isEmpty(get(user, 'errors.lastName')));
  ok(Ember.isEmpty(get(user, 'warnings.firstName')));
  ok(Ember.isEmpty(get(user, 'warnings.lastName')));
});