import React, { useEffect, useState } from 'react';

interface ParentProps {
  name: string;
  getStatus(): string;
  setName: (name: string) => void;
  updateStatus: (status: string) => void;
  onStatusChange(listener: (status: string) => void): () => void;
  onNameChange(listener: (name: string) => void): () => void;
}

interface RequireControllerExampleProps {
  parent: ParentProps;
}

const RequireControllerExample: React.FC<RequireControllerExampleProps> = ({
  parent,
}) => {
  const [status, setStatus] = useState(parent.getStatus());
  const [name, setName] = useState(parent.name);

  useEffect(
    () =>
      parent.onStatusChange((newStatus) => {
        setStatus(newStatus);
      }),
    []
  );

  useEffect(
    () =>
      parent.onNameChange((newName) => {
        setName(newName);
      }),
    []
  );
  const handleUpdateStatus = () => {
    parent.updateStatus(status);
  };

  return (
    <div>
      <div>
        <label>
          Name{' '}
          <input
            value={name}
            onChange={(e) => parent.setName(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Status{' '}
          <input value={status} onChange={(e) => setStatus(e.target.value)} />
        </label>
        <button onClick={handleUpdateStatus}>Update</button>
      </div>
    </div>
  );
};

export default RequireControllerExample;
