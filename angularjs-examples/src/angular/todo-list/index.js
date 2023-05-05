import angular from "angular";
import './todo-list.component.js'
import './todo-list-service.js'
import { angularize } from "../../support/angularise.cjs";
import TodoList from "../../react/todo-list/todo-list.jsx";

const app = angular.module('todoListApp', ['todoList', 'todoListService'])
    .component('todoListApp', {
        controller: function ($log, $scope, todoListService) {
            $scope.items = []
    
            todoListService.getItems().then((items) => {
                $scope.items = items;
                $scope.$watch('items.length', () => {
                    todoListService.saveList($scope.items).catch($log.error)
                })
            });

            $scope.setItems = (items) => {
                $scope.items = items;
            }
        },
        template: '<todo-list items="items"></todo-list>\n'+
        '<todo-list-react items="items" set-items="setItems"></todo-list-react>'
    });

angularize(TodoList, 'todoListReact', app, {
    items: '<',
    setItems: '&'
});