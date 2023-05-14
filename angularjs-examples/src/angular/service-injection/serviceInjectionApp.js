import { angularize } from '@ng2react/support';
import angular from 'angular';
import ServiceInjectionExample from '../../react/service-injection/ServiceInjectionExample';
import './myService';
import './serviceInjectionExample.component';
import './serviceInjectionExample.less';
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

angularize(ServiceInjectionExample, {
  name: 'serviceInjectionExampleReact',
  module: app,
});
