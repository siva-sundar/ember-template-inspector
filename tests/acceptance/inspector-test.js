import { module, test } from 'qunit';
import { visit, currentURL, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import getService from 'dummy/tests/helpers/get-service';
const locationAttribute = 'l';

module('Acceptance | inspector', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /', async function(assert) {
    await visit('/');
    let inspector = getService('template-inspector');
    currentURL('/');
    //application route
    assert.dom('[data-test-title="addon-title"]').hasAttribute(locationAttribute);

    let l = document.querySelector('[data-test-title="addon-title"]').getAttribute('l');
    let fileName = await inspector.getFileInfo(l);

    assert.equal(fileName, 'dummy/templates/application.hbs:1:0', 'file location is not equal');

    assert.dom('[data-test-title="application-route"]').hasAttribute(locationAttribute);

    await click('[href="/classic-route"]');

    //classic route
    assert.dom('[data-test-title="classic-route-title"]').hasAttribute(locationAttribute);
    assert.dom('[data-test-title="container"]').hasAttribute(locationAttribute);

    //classic component
    assert.dom('[data-test-title="classic-component"]').hasAttribute(locationAttribute)


    //pod route
    await click('[href="/pod-route"]');
    assert.dom('[data-test-title="pod-route-title"]').hasAttribute(locationAttribute);
    assert.dom('[data-test-title="container"]').hasAttribute(locationAttribute);

    //pod component
    assert.dom('[data-test-title="pod-component"]').hasAttribute(locationAttribute)
    assert.dom('[data-test-title="input-statement"]').hasAttribute(locationAttribute)
  });
});
