import angular from 'angular';
import './toggleButton';
import './toggleButton.less';

const app = angular
  .module('toggleButtonApp', ['todoList', 'todoListService'])
  .component('toggleButtonApp', {
    controller: function ($log, $scope, todoListService) {},
    templateUrl: 'templates/toggleButton/toggleButton.app.tpl.html',
  });
