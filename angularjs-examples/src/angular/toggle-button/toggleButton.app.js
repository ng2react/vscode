import angular from 'angular';
import './toggleButton.component';
import './toggleButton.less';
import ToggleButton from '../../react/toggle-button/ToggleButton';
import { angularize } from '@ng2react/support';

const app = angular
  .module('toggleButtonApp', ['toggleButton'])
  .component('toggleButtonApp', {
    controller: function ($scope) {
      $scope.state = {
        firstState: 'A',
        firstStateLabel: 'A',
        secondState: 'B',
        secondStateLabel: 'B',
        currentState: 'A',
        firstStateTooltip: 'First state',
        secondStateTooltip: 'Second state',
      };
    },
    templateUrl: 'templates/toggle-button/toggleButton.app.tpl.html',
  });

angularize(ToggleButton, {
  module: app,
  name: 'toggleButtonReact',
  bindings: {
    firstState: '@',
    firstStateLabel: '@',
    secondState: '@',
    secondStateLabel: '@',
    currentState: ['=', 'onCurrentStateChange'],
    firstStateTooltip: '@',
    secondStateTooltip: '@',
    tooltipPosition: '@?',
  },
});
