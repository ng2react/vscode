Here is the functional React element converted from the AngularJS component:

```tsx
import React, { useState, useEffect } from 'react';

interface StateBindingExampleProps {
  twoWayBinding: boolean;
  onTwoWayBindingChange: (value: boolean) => void;
  oneWayBinding: boolean;
  stringBinding: string;
  optionalOneWayBinding?: boolean;
  optionalTwoWayBinding?: boolean;
  onOptionalTwoWayBindingChange?: (value: boolean) => void;
  optionalStringBinding?: string;
  readOnlyOneWayBinding: boolean;
}

const StateBindingExample: React.FC<StateBindingExampleProps> = ({
  twoWayBinding,
  onTwoWayBindingChange,
  oneWayBinding,
  stringBinding,
  optionalOneWayBinding,
  optionalTwoWayBinding,
  onOptionalTwoWayBindingChange,
  optionalStringBinding,
  readOnlyOneWayBinding,
}) => {
  const [changeCounter, setChangeCounter] = useState(0);

  useEffect(() => {
    setChangeCounter((prevCounter) => prevCounter + 1);
  }, [
    twoWayBinding,
    oneWayBinding,
    stringBinding,
    optionalOneWayBinding,
    optionalTwoWayBinding,
    optionalStringBinding,
    readOnlyOneWayBinding,
  ]);

  return (
    <div className="stateBinding">
      <div>
        <label>
          2-Way Binding{' '}
          <input
            type="checkbox"
            checked={twoWayBinding}
            onChange={(e) => onTwoWayBindingChange(e.target.checked)}
          />
        </label>
      </div>
      <div>
        <label>
          1-Way Binding{' '}
          <input type="checkbox" checked={oneWayBinding} readOnly />
        </label>
      </div>
      <div>
        <label>
          String Binding <input type="text" value={stringBinding} readOnly />
        </label>
      </div>

      <div>
        <label>
          2-Way Binding (optional){' '}
          <input
            type="checkbox"
            checked={optionalTwoWayBinding || false}
            onChange={(e) =>
              onOptionalTwoWayBindingChange &&
              onOptionalTwoWayBindingChange(e.target.checked)
            }
          />
        </label>
      </div>
      <div>
        <label>
          1-Way Binding (optional){' '}
          <input
            type="checkbox"
            checked={optionalOneWayBinding || false}
            readOnly
          />
        </label>
      </div>
      <div>
        <label>
          String Binding (optional){' '}
          <input type="text" value={optionalStringBinding || ''} readOnly />
        </label>
      </div>

      <div>
        <label>
          Readonly 1-Way Binding{' '}
          <input type="checkbox" checked={readOnlyOneWayBinding} disabled />
        </label>
      </div>

      <div>
        <label>
          onChanges Counter <pre>{changeCounter}</pre>
        </label>
      </div>
    </div>
  );
};

export default StateBindingExample;
```

Assumptions and potential issues:

1. I assumed that the `require('./stateBindingExample.tpl.html')` statement imports the HTML template as a string. In React, we don't need to import the template separately, so I combined the template and component into a single file.

2. AngularJS uses two-way data binding, while React uses one-way data binding. To handle two-way data binding in React, I added `onChange` event handlers and corresponding callback functions as props (e.g., `onTwoWayBindingChange` and `onOptionalTwoWayBindingChange`). The parent component should handle these callback functions to update the state.

3. I assumed that the `changeCounter` variable is used to count the number of times any of the bindings change. In React, I used the `useEffect` hook to update the `changeCounter` state whenever any of the props change.

4. I used TypeScript for the React component and added an interface for the component's props. This helps with type checking and code completion in editors that support TypeScript.

5. For optional props, I used the `||` operator to provide default values when rendering the input elements. This ensures that the input elements always have a valid value, even if the optional props are not provided.

6. For the one-way binding and string binding input elements, I added the `readOnly` attribute to make them read-only, as they should not be editable by the user.
