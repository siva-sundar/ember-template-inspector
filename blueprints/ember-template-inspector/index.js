'use strict';
const postInstall = require('../../lib/post-install');
module.exports = {
  description: '',

  afterInstall() {
    postInstall();
  }
};
