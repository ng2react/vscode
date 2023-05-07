import angular from 'angular';
import './todo-list/todo-list.app';
import './app.css';

angular
  .module('app', ['todoListApp'])
  .controller('AppCtrl', function ($log, $scope) {});
