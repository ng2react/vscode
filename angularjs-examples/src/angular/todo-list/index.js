import angular from "angular";
import './todo-list.component.js'
import './todo-list-service.js'
import TodoList from "../../react/todo-list/todo-list.jsx";
import { angularize } from "@ng2react/support";

const app = angular.module('todoListApp', ['todoList', 'todoListService'])
    .component('todoListApp', {
        controller: function ($log, $scope, todoListService) {
            $scope.items = []

            todoListService.getItems().then((items) => {
                $scope.items = items;
                $scope.$watch('items.length', () => {
                    todoListService.saveList($scope.items).catch($log.error);
                    $scope.items = [...$scope.items]; // Force update
                });
            });

            // REACT STUFF:

            // DIFF: Replace watchers with onChange callbacks
            $scope.setItems = (items) => {
                $scope.$evalAsync(() => {
                    $scope.items = items;
                });
            };
        },
        template: '<todo-list items="items"></todo-list>\n' +
            '<todo-list-react items="items" set-items="setItems(items)"></todo-list-react>'
    });

angularize(TodoList, {
    module: app,
    name: 'todoListReact',
    bindings: {
        items: '<',
        setItems: '&'
    }
});