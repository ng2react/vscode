import 'angular';
import angular, { route } from 'angular';
import 'angular-route';
import './app.less';
import './state-binding/stateBindingExample.app';
import './todo-list/todo-list.app';
import './toggle-button/toggleButton.app';

angular
  .module('app', [
    'ngRoute',
    'todoListApp',
    'toggleButtonApp',
    'stateBindingExampleApp',
  ])
  .config(($routeProvider: route.IRouteProvider) => {
    $routeProvider
      .when('/todo', {
        template: '<todo-list-app></todo-list-app>',
      })
      .when('/toggleBtn', {
        template: '<toggle-button-app></toggle-button-app>',
      })
      .when('/stateBinding', {
        template: '<state-binding-example-app></state-binding-example-app>',
      })
      .otherwise({
        redirectTo: '/todo',
      });
  });
