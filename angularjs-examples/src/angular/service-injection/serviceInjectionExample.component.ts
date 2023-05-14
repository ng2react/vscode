/*!
 * Copyright 2021-2022 Bosch Automotive Service Solutions Limited
 * All rights reserved.
 */

import * as angular from 'angular';
import { MyService } from './myService';

class MyCtrl implements angular.IController {
  static $inject = ['myService'];
  message = '';

  constructor(private readonly myService: MyService) {}

  async $onInit() {
    try {
      this.message = await this.myService.getMessage();
    } catch (e) {
      this.message = 'Error: ' + (e as Error).message;
    }
  }

  async updateMessage() {
    try {
      await this.myService.setMessage(this.message);
    } catch (e) {
      this.message = 'Error: ' + (e as Error).message;
    } finally {
      this.message = await this.myService.getMessage();
    }
  }
}

angular
  .module('serviceInjectionExample', [])
  .component('serviceInjectionExample', {
    controller: MyCtrl,
    template: require('./serviceInjectionExample.tpl.html'),
  });
