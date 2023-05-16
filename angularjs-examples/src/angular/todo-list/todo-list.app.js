import angular from 'angular';
import './todo-list.component.js';
import './todo-list.service.js';
import TodoList from '../../react/todo-list/TodoList.jsx';
import { angularize } from '@ng2react/support';
const app = angular
  .module('todoListApp', ['todoList', 'todoListService', 'todoListReact'])
  .component('todoListApp', {
    controller: function ($log, $scope, todoListService) {
      $scope.items = [];

      todoListService.getItems().then((items) => {
        $scope.items = items;
        $scope.$watch('items.length', () => {
          todoListService.saveList($scope.items).catch($log.error);
          $scope.items = [...$scope.items]; // Forces Angular to update the list
        });
      });
    },
    templateUrl: 'templates/todo-list/todo-list.app.tpl.html',
  });

angularize(TodoList, {
  name: 'todoListReact',
  bindings: {
    items: ['=', 'setItems'],
  },
});
