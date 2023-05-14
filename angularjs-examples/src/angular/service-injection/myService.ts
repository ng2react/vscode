import angular, { IQService, IRootScopeService } from 'angular';
import { resolve } from 'path';

export interface MyService {
  readonly message: string;
  setMessage: (msg: string) => Promise<void>;
  getMessage: () => Promise<string>;
}

angular.module('myService', []).factory('myService', ($q: IQService) => {
  // Simulates a service that can be injected into a component
  // with async methods.
  let message = 'Hello. world!';
  return {
    get message() {
      return message;
    },
    setMessage: async (msg: string) => {
      return $q((resolve) => {
        message = msg;
        resolve();
      });
    },
    getMessage: async () => $q.resolve(message),
  } satisfies MyService;
});
