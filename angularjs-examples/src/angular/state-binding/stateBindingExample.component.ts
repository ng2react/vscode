/*!
 * Copyright 2021-2022 Bosch Automotive Service Solutions Limited
 * All rights reserved.
 */

import * as angular from 'angular';

class MyCtrl implements angular.IController {
  changeCounter = {
    oneWayBinding: 0,
    stringBinding: 0,
    optionalOneWayBinding: 0,
    optionalStringBinding: 0,
    readOnlyOneWayBinding: 0,
    toString() {
      return JSON.stringify(this, null, 2);
    },
  };

  $onChanges(onChangesObj: angular.IOnChangesObject): void {
    if (onChangesObj.oneWayBinding) {
      this.changeCounter.oneWayBinding++;
    }
    if (onChangesObj.stringBinding) {
      this.changeCounter.stringBinding++;
    }
    if (onChangesObj.optionalOneWayBinding) {
      this.changeCounter.optionalOneWayBinding++;
    }
    if (onChangesObj.optionalStringBinding) {
      this.changeCounter.optionalStringBinding++;
    }
    if (onChangesObj.readOnlyOneWayBinding) {
      this.changeCounter.readOnlyOneWayBinding++;
    }
  }
}
angular.module('stateBindingExample', []).component('stateBindingExample', {
  controller: MyCtrl,
  bindings: {
    twoWayBinding: '=',
    oneWayBinding: '<',
    stringBinding: '@',
    optionalOneWayBinding: '<?',
    optionalTwoWayBinding: '=?',
    optionalStringBinding: '@?',
    readOnlyOneWayBinding: '<',
  },
  template: require('./stateBindingExample.tpl.html'),
});
