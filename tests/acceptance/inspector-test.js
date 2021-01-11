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
    assert.dom('[data-test-title="addon-title"]').hasAttribute(locationAttribute, '1:3:1:0');

    let l = document.querySelector('[data-test-title="addon-title"]').getAttribute('l');
    let fileName = await inspector.getFileInfo(l);

    assert.equal(fileName, 'dummy/templates/application.hbs:1:0', 'file location is not equal');

    assert.dom('[data-test-title="application-route"]').hasAttribute(locationAttribute, '1:3:3:0');

    await click('[href="/classic-route"]');

    //classic route
    assert.dom('[data-test-title="classic-route-title"]').hasAttribute(locationAttribute, '1:4:2:2');
    assert.dom('[data-test-title="container"]').hasAttribute(locationAttribute, '1:4:7:0');

    //classic component
    assert.dom('[data-test-title="classic-component"]').hasAttribute(locationAttribute, '1:5:1:0')


    //pod route
    await click('[href="/pod-route"]');
    assert.dom('[data-test-title="pod-route-title"]').hasAttribute(locationAttribute, '1:2:2:2');
    assert.dom('[data-test-title="container"]').hasAttribute(locationAttribute, '1:2:6:0');

    //pod component
    assert.dom('[data-test-title="pod-component"]').hasAttribute(locationAttribute, '1:1:1:0')
  });
});
