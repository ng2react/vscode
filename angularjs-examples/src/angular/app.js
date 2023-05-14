import angular from 'angular';
import './todo-list/todo-list.app';
import './app.css';

angular
  .module('app', ['ngRoute', 'todoListApp', 'toggleButtonApp'])
  .controller('AppCtrl', function ($log, $scope) {})
  .config(function config($routeProvider) {
    $routeProvider
      .when('/todo', {
        template: '<todo-list-app></todo-list-app>',
      })
      .when('/toggleBtn', {
        template: '<toggle-button-app></toggle-button-app>',
      })
      .otherwise('/todo');
  });
