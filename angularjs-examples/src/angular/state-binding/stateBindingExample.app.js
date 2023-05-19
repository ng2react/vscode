import angular from 'angular';
import './stateBindingExample.component';
import './stateBindingExample.less';
import { angularize } from '@ng2react/support';
import StateBindingExample from '../../react/state-binding/StateBindingExample';

angular
  .module('stateBindingExampleApp', [
    'stateBindingExample',
    'stateBindingExampleReact',
  ])
  .component('stateBindingExampleApp', {
    controller: function ($scope) {
      $scope.state = {
        twoWayBinding: true,
        oneWayBinding: true,
        stringBinding: 'Hello, World!',
        readOnlyOneWayBinding: true,
      };
    },
    templateUrl: 'templates/state-binding/stateBindingExample.app.tpl.html',
  });

angularize(StateBindingExample, {
  name: 'stateBindingExampleReact',
  bindings: {
    twoWayBinding: ['=', 'onTwoWayBindingChange'],
    oneWayBinding: '<',
    stringBinding: '@',
    optionalOneWayBinding: '<?',
    optionalTwoWayBinding: ['=?', 'onOptionalTwoWayBindingChange'],
    optionalStringBinding: '@?',
    readOnlyOneWayBinding: '<',
  },
});
