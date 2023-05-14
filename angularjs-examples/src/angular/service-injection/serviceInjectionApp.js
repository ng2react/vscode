import angular from 'angular';
import './serviceInjectionExample.component';
import './serviceInjectionExample.less';
import './myService';
import { angularize } from '@ng2react/support';

const app = angular
  .module('serviceInjectionExampleApp', [
    'serviceInjectionExample',
    'myService',
  ])
  .component('serviceInjectionExampleApp', {
    controller: function ($scope, myService) {
      $scope.message = () => myService.message;
    },
    templateUrl: 'templates/service-injection/serviceInjectionApp.tpl.html',
  });

angularize(() => <></>, {
  name: 'serviceInjectionExampleReact',
  module: app,
});
