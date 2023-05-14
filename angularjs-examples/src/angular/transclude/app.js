import angular from 'angular';
import './wrapper.component';
import './app.less';
import { angularize } from '@ng2react/support';
import Wrapper from '../../react/transclude/Wrapper';

const app = angular
  .module('transcludeExampleApp', ['wrapper'])
  .component('transcludeExampleApp', {
    controller: function ($scope) {},
    template: require('./app.tpl.html'),
  })
  .component('wrappedComponent', {
    template: 'How will GPT cope with this?',
  });

angularize(Wrapper, {
  name: 'wrapperReact',
  module: app,
  transclude: true,
});
