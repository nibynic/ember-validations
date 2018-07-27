import Ember from 'ember';
import Base from 'ember-validations/validators/base';

const { get, isEmpty, set } = Ember;

export default Base.extend({
  init() {
    this._super(...arguments);
    if (this.options.constructor === RegExp) {
      set(this, 'options', { 'with': this.options });
    }

    if (this.options.message === undefined) {
      set(this, 'options.message',  this.get("messages").render('invalid', this.options));
    }
  },

  call() {
    if (isEmpty(get(this.model, this.property))) {
      if (this.options.allowBlank === undefined) {
        this.errors.pushObject(this.options.message);
      }
    } else if (this.options['with'] && !this.options['with'].test(get(this.model, this.property))) {
      this.errors.pushObject(this.options.message);
    } else if (this.options.without && this.options.without.test(get(this.model, this.property))) {
      this.errors.pushObject(this.options.message);
    }
  }
});
