import { useService } from '@ng2react/support';
import React, { useEffect, useState } from 'react';

export interface MyService {
  readonly message: string;
  setMessage: (msg: string) => Promise<void>;
  getMessage: () => Promise<string>;
}

const ServiceInjectionExample = ({}) => {
  const myService = useService<MyService>('myService');
  const [message, setMessage] = useState('');

  const updateMessage = async () => {
    const msg = await myService.getMessage();
    setMessage(msg);
  };

  useEffect(() => {
    updateMessage();
  }, []);

  const handleUpdateMessage = () => {
    myService
      .setMessage(message)
      .then(updateMessage)
      .catch((e) => {
        setMessage('Error: ' + (e as Error).message);
      });
  };

  return (
    <div>
      <label>
        Message{' '}
        <input value={message} onChange={(e) => setMessage(e.target.value)} />
      </label>{' '}
      <button onClick={handleUpdateMessage}>Send</button>
    </div>
  );
};

export default ServiceInjectionExample;
