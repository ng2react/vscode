import 'angular';
import 'angular-route';
import angular, { route } from 'angular';
import './todo-list/todo-list.app';
import './toggle-button/toggleButton.app';
import './app.less';

angular
  .module('app', ['ngRoute', 'todoListApp', 'toggleButtonApp'])
  .config(($routeProvider: route.IRouteProvider) => {
    $routeProvider
      .when('/todo', {
        template: '<todo-list-app></todo-list-app>',
      })
      .when('/toggleBtn', {
        template: '<toggle-button-app></toggle-button-app>',
      })
      .otherwise({
        redirectTo: '/todo',
      });
  });
