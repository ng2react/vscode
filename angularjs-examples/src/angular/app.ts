import 'angular';
import angular, { route } from 'angular';
import 'angular-route';
import './app.less';
import './state-binding/stateBindingExample.app';
import './todo-list/todo-list.app';
import './toggle-button/toggleButton.app';
import './service-injection/serviceInjectionApp';
import './require-controller/requireControllerExample.app';
import './transclude/app';

angular
  .module('app', [
    'ngRoute',
    'todoListApp',
    'toggleButtonApp',
    'stateBindingExampleApp',
    'serviceInjectionExampleApp',
    'requireControllerExampleApp',
    'transcludeExampleApp',
  ])
  .config(($routeProvider: route.IRouteProvider) => {
    $routeProvider
      .when('/todo-list', {
        template: '<todo-list-app></todo-list-app>',
      })
      .when('/toggle-btn', {
        template: '<toggle-button-app></toggle-button-app>',
      })
      .when('/state-binding', {
        template: '<state-binding-example-app></state-binding-example-app>',
      })
      .when('/service-injection', {
        template:
          '<service-injection-example-app></service-injection-example-app>',
      })
      .when('/require-controller', {
        template:
          '<require-controller-example-app></require-controller-example-app>',
      })
      .when('/transclude', {
        template: '<transclude-example-app></transclude-example-app>',
      })
      .otherwise({
        redirectTo: '/todo',
      });
  });
