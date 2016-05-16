Package.describe({
  name: 'misrab:generic-helpers',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3.2.4');
  api.use('ecmascript');
  api.use('templating', 'client');
  // api.mainModule('generic-helpers.js', 'client');
  api.addFiles('generic-helpers.js', 'client');
  api.export('ErrorMsg', 'client');
  api.export('SuccessMsg', 'client');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('misrab:generic-helpers');
  api.mainModule('generic-helpers-tests.js');
});
