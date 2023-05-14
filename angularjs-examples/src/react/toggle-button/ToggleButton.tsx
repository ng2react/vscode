import React, { useEffect, useState } from 'react';

type Props = {
  firstState: string;
  firstStateLabel: string;
  secondState: string;
  secondStateLabel: string;
  currentState: string;
  firstStateTooltip: string;
  secondStateTooltip: string;
  tooltipPosition?: string;
  onCurrentStateChange(state: { currentState: string }): void;
};

const ToggleButton = ({
  firstState,
  firstStateLabel,
  secondState,
  secondStateLabel,
  currentState,
  firstStateTooltip,
  secondStateTooltip,
  onCurrentStateChange,
  tooltipPosition = '',
}: Props) => {
  const toggle = () => {
    onCurrentStateChange({
      currentState: currentState === firstState ? secondState : firstState,
    });
  };

  const getTooltipPositionClass = () => {
    return tooltipPosition ? `toggle-button__switch--${tooltipPosition}` : '';
  };

  const currentTooltip =
    currentState === firstState ? firstStateTooltip : secondStateTooltip;

  return (
    <div className="toggle-button" onClick={toggle}>
      <p
        id="toggle-button__firstState"
        className={`toggle-button__label${
          currentState === secondState ? ' toggle-button__label--fade' : ''
        }`}
      >
        {firstStateLabel}
      </p>
      <div
        className={`toggle-button__switch ${getTooltipPositionClass()}`}
        data-tooltip={currentTooltip}
      >
        <span
          className={`fa fa-plus-circle${
            currentState === secondState
              ? ' toggle-button__switch--toggleState'
              : ''
          }`}
        ></span>
      </div>
      <p
        id="toggle-button__secondState"
        className={`toggle-button__label${
          currentState === firstState ? ' toggle-button__label--fade' : ''
        }`}
      >
        {secondStateLabel}
      </p>
    </div>
  );
};

export default ToggleButton;

/*
Assumptions and potential issues:

I assumed that the my-tooltip attribute in the AngularJS template is a custom directive for showing tooltips. In the React component, I replaced it with a data-tooltip attribute, which can be used by a tooltip library or custom CSS to display the tooltip. You may need to adjust this based on your tooltip implementation.
The tooltipPosition prop has a default value of an empty string, which means that if it's not provided, the getTooltipPositionClass function will return an empty string. This is consistent with the AngularJS component's behavior.
I used the useState hook to manage the currentState value, which is initialized with the initialCurrentState prop. This assumes that the component is being used in a React environment that supports hooks (React 16.8 or later).
The AngularJS component uses the fa fa-plus-circle classes for the switch icon. This assumes that you have the Font Awesome library included in your project. If you're using a different icon library or custom icons, you may need to adjust the class names accordingly.
*/
