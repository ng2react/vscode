import angular from 'angular';
import './requireControllerExample.component';
import './parentCtrl';
import { angularize } from '@ng2react/support';

const app = angular
  .module('requireControllerExampleApp', [
    'requireControllerExample',
    'parentCtrl',
  ])
  .component('requireControllerExampleApp', {
    template: '<parent-ctrl></parent-ctrl>',
  });

angularize(() => <></>, {
  name: 'requireControllerExampleReact',
  module: app,
});
