import React, { useEffect, useState } from 'react';

interface StateBindingExampleProps {
  twoWayBinding: boolean;
  onTwoWayBindingChange: (value: boolean) => void;
  oneWayBinding: boolean;
  stringBinding: string;
  optionalOneWayBinding?: boolean;
  optionalTwoWayBinding?: boolean;
  onOptionalTwoWayBindingChange?: (value: boolean) => void;
  optionalStringBinding?: string;

  readonly readOnlyOneWayBinding: boolean;
}

const StateBindingExample: React.FC<StateBindingExampleProps> = ({
  twoWayBinding,
  onTwoWayBindingChange,
  oneWayBinding: initialOneWayBinding,
  stringBinding: initialStringBinding,
  optionalOneWayBinding: initialOptionalOneWayBinding,
  optionalTwoWayBinding,
  onOptionalTwoWayBindingChange,
  optionalStringBinding: initialOptionalStringBinding,
  readOnlyOneWayBinding,
}) => {
  const [oneWayBinding, setOneWayBinding] = useState(initialOneWayBinding);
  const [optionalOneWayBinding, setOptionalOneWayBinding] = useState(
    initialOptionalOneWayBinding
  );
  const [stringBinding, setStringBinding] = useState(initialStringBinding);
  const [optionalStringBinding, setOptionalStringBinding] = useState(
    initialOptionalStringBinding
  );

  const handleTwoWayBindingChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onTwoWayBindingChange(e.target.checked);
  };

  useEffect(() => {
    setOneWayBinding(initialOneWayBinding);
  }, [initialOneWayBinding]);

  useEffect(() => {
    setOptionalOneWayBinding(initialOptionalOneWayBinding);
  }, [initialOptionalOneWayBinding]);

  useEffect(() => {
    setStringBinding(initialStringBinding);
  }, [initialStringBinding]);

  useEffect(() => {
    setOptionalStringBinding(initialOptionalStringBinding);
  }, [initialOptionalStringBinding]);

  const handleOptionalTwoWayBindingChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onOptionalTwoWayBindingChange?.(e.target.checked);
  };

  return (
    <div className="stateBinding">
      <div>
        <label>
          2-Way Binding{' '}
          <input
            type="checkbox"
            checked={twoWayBinding}
            onChange={handleTwoWayBindingChange}
          />
        </label>
      </div>
      <div>
        <label>
          1-Way Binding{' '}
          <input
            type="checkbox"
            checked={oneWayBinding}
            onChange={(e) => setOneWayBinding(e.target.checked)}
          />
        </label>
      </div>
      <div>
        <label>
          String Binding{' '}
          <input
            value={stringBinding}
            onChange={(e) => setStringBinding(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          2-Way Binding (optional){' '}
          <input
            type="checkbox"
            checked={optionalTwoWayBinding}
            onChange={handleOptionalTwoWayBindingChange}
          />
        </label>
      </div>
      <div>
        <label>
          1-Way Binding (optional){' '}
          <input
            type="checkbox"
            checked={optionalOneWayBinding}
            onChange={(e) => setOptionalOneWayBinding(e.target.checked)}
          />
        </label>
      </div>
      <div>
        <label>
          String Binding (optional){' '}
          <input
            value={optionalStringBinding}
            onChange={(e) => setOptionalStringBinding(e.target.value)}
          />
        </label>
      </div>

      <div>
        <label>
          Readonly 1-Way Binding{' '}
          <input type="checkbox" checked={readOnlyOneWayBinding} readOnly />
        </label>
      </div>
    </div>
  );
};

export default StateBindingExample;
