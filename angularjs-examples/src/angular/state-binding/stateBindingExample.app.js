import angular from 'angular';
import './stateBindingExample.component';
import './stateBindingExample.less';
import { angularize } from '@ng2react/support';
import StateBindingExample from '../../react/state-binding/StateBindingExample';

const app = angular
  .module('stateBindingExampleApp', ['stateBindingExample'])
  .component('stateBindingExampleApp', {
    controller: function ($scope) {
      $scope.state = {
        twoWayBinding: true,
        oneWayBinding: true,
        stringBinding: 'Hello, World!',
        readOnlyOneWayBinding: true,
      };

      $scope.onTwoWayBindingChange = (value) => {
        $scope.$evalAsync(() => {
          $scope.state.twoWayBinding = value;
        });
      };

      $scope.onOptionalTwoWayBindingChange = (value) => {
        $scope.$evalAsync(() => {
          $scope.state.optionalTwoWayBinding = value;
        });
      };
    },
    templateUrl: 'templates/state-binding/stateBindingExample.app.tpl.html',
  });

angularize(StateBindingExample, {
  module: app,
  name: 'stateBindingExampleReact',
  bindings: {
    twoWayBinding: '=',
    oneWayBinding: '<',
    stringBinding: '@',
    optionalOneWayBinding: '<?',
    optionalTwoWayBinding: '=?',
    optionalStringBinding: '@?',
    readOnlyOneWayBinding: '<',

    onTwoWayBindingChange: '<',
    onOptionalTwoWayBindingChange: '<?',
  },
});
