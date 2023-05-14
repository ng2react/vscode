import angular from 'angular';

export interface MyService {
  readonly message: string;
  setMessage: (msg: string) => Promise<void>;
  getMessage: () => Promise<string>;
}

angular.module('myService', []).factory('myService', () => {
  // Simulates a service that can be injected into a component
  // with async methods.
  let message = 'Hello. world!';
  return {
    get message() {
      return message;
    },
    setMessage: async (msg: string) => {
      message = msg;
    },
    getMessage: async () => message,
  } satisfies MyService;
});
