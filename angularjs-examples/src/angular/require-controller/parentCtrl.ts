import angular from 'angular';

export class ParentCtrl {
  name = 'Bob';
  private status = 'Waiting for input...';

  getStatus() {
    return this.status;
  }

  updateStatus(status: string) {
    this.status = status;
  }
}

angular.module('parentCtrl', []).component('parentCtrl', {
  controller: ParentCtrl,
  template: require('./parentCtrl.tpl.html'),
});
