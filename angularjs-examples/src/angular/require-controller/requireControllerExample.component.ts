/*!
 * Copyright 2021-2022 Bosch Automotive Service Solutions Limited
 * All rights reserved.
 */

import * as angular from 'angular';
import { ParentCtrl } from './parentCtrl';

class MyCtrl {
  readonly parent!: ParentCtrl;
  status = '';
  constructor(readonly $scope: angular.IScope) {}
  public $onInit(): void {
    this.status = this.parent.getStatus();
    this.$scope.$watch(
      () => this.parent.getStatus(),
      (newVal) => {
        this.status = newVal;
      }
    );
  }
}

angular
  .module('requireControllerExample', [])
  .component('requireControllerExample', {
    controller: MyCtrl,
    require: {
      parent: '^parentCtrl',
    },
    template: require('./requireControllerExample.tpl.html'),
  });
