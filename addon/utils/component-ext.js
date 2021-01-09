import Component from '@ember/component';

export default function() {
  Component.reopen({
    init() {
      this._super(...arguments);
      if (this.tagName !== '') {
        this.attributeBindings = [...this.attributeBindings || [], 'l']; // to avoid mutating the parent definition.
      }
    }
  });
}
