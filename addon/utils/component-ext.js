import Component from '@ember/component'; // eslint-disable-line ember/no-classic-components

export default function () {
  Component.reopen({
    init() {
      this._super(...arguments);
      if (this.tagName !== '') {
        this.attributeBindings = ['l', ...(this.attributeBindings || [])]; // to avoid mutating the parent definition.
      }
    },
  });
}
