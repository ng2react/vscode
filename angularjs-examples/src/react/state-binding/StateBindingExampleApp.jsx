import React, { useState } from 'react';
import StateBindingExample from './StateBindingExample';
import StateBindingExampleReact from './StateBindingExampleReact';

const StateBindingExampleApp = () => {
  const [state, setState] = useState({
    twoWayBinding: true,
    oneWayBinding: true,
    stringBinding: 'Hello, World!',
    readOnlyOneWayBinding: true,
  });

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setState((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div>
      <div className="stateBox">
        The Current State is:
        <div>
          <label>
            2-Way Binding{' '}
            <input
              name="twoWayBinding"
              type="checkbox"
              checked={state.twoWayBinding}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label>
            1-Way Binding{' '}
            <input
              name="oneWayBinding"
              type="checkbox"
              checked={state.oneWayBinding}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label>
            String Binding{' '}
            <input
              name="stringBinding"
              value={state.stringBinding}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label>
            Readonly 1-Way Binding{' '}
            <input
              name="readOnlyOneWayBinding"
              type="checkbox"
              checked={state.readOnlyOneWayBinding}
              onChange={handleInputChange}
            />
          </label>
        </div>
      </div>
      <div className="ng2react__sideBySide">
        <StateBindingExample
          oneWayBinding={state.oneWayBinding}
          twoWayBinding={state.twoWayBinding}
          stringBinding={state.stringBinding}
          readOnlyOneWayBinding={state.readOnlyOneWayBinding}
        />
        <StateBindingExampleReact
          oneWayBinding={state.oneWayBinding}
          twoWayBinding={state.twoWayBinding}
          stringBinding={state.stringBinding}
          readOnlyOneWayBinding={state.readOnlyOneWayBinding}
        />
      </div>
    </div>
  );
};
