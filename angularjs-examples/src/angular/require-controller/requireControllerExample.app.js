import angular from 'angular';
import './requireControllerExample.component';
import './parentCtrl';
import { angularize } from '@ng2react/support';
import RequireControllerExample from '../../react/require-controller/RequireControllerExample';
const app = angular
  .module('requireControllerExampleApp', [
    'requireControllerExample',
    'parentCtrl',
  ])
  .component('requireControllerExampleApp', {
    template: '<parent-ctrl></parent-ctrl>',
  });

angularize(RequireControllerExample, {
  name: 'requireControllerExampleReact',
  require: {
    parent: '^parentCtrl',
  },
  module: app,
});
