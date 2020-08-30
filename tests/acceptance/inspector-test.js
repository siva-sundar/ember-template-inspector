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

    await click('[href="/classic-route"]');

    //classic route
    assert.dom('[data-test-title="classic-route-title"]').hasAttribute('data-loc', 'dummy/templates/classic-route.hbs:2:2');
    assert.dom('[data-test-title="container"]').hasAttribute('data-loc', 'dummy/templates/classic-route.hbs:7:0');

    //classic component
    assert.dom('[data-test-title="classic-component"]').hasAttribute('data-loc', 'dummy/components/classic-component.hbs:1:0')


    //pod route
    await click('[href="/pod-route"]');
    assert.dom('[data-test-title="pod-route-title"]').hasAttribute('data-loc', 'dummy/pod-route/template.hbs:2:2');
    assert.dom('[data-test-title="container"]').hasAttribute('data-loc', 'dummy/pod-route/template.hbs:6:0');

    //pod component
    assert.dom('[data-test-title="pod-component"]').hasAttribute('data-loc', 'dummy/components/pod-component/template.hbs:1:0')
  });
});
