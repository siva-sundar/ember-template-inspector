import { module, test } from 'qunit';
import { visit, currentURL, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | inspector', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /', async function(assert) {
    await visit('/');
    currentURL('/');
    //application route
    assert.dom('[data-test-title="addon-title"]').hasAttribute('data-loc', 'dummy/templates/application.hbs:1:0');
    assert.dom('[data-test-title="application-route"]').hasAttribute('data-loc', 'dummy/templates/application.hbs:3:0');

    await click('[href="/parent"]');

    //Parent route
    assert.dom('[data-test-title="Route-title"]').hasAttribute('data-loc', 'dummy/templates/parent.hbs:2:2');
    assert.dom('[data-test-title="container"]').hasAttribute('data-loc', 'dummy/templates/parent.hbs:7:0');

    //my component
    assert.dom('[data-test-title="my-component"]').hasAttribute('data-loc', 'dummy/components/my-component.hbs:1:0')
  });
});
