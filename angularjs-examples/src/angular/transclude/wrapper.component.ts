/*!
 * Copyright 2021-2022 Bosch Automotive Service Solutions Limited
 * All rights reserved.
 */

import * as angular from 'angular';

angular.module('wrapper', []).component('wrapper', {
  transclude: true,
  template: '<div><ng-transclude></ng-transclude></div>',
});
