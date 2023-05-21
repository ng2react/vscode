**Assumptions:**
- I am assuming that the `my-tooltip` directive can be replaced with a custom React component called `MyTooltip`.
- I am assuming that the `TooltipPosition` enum is available and can be imported.
- I am assuming that the `isNil` function is available and can be imported.

**Potential Issues:**
- The AngularJS component uses a custom directive `my-tooltip`. This will need to be replaced with a React component.

```tsx


import React, { useState, useEffect } from 'react'
import { TooltipPosition, isNil } from 'path/to/utils' // Assumption: TooltipPosition and isNil can be imported
import MyTooltip from 'path/to/MyTooltip' // Assumption: MyTooltip is a React component

interface ToggleButtonProps {
  firstState: string
  firstStateLabel: string
  secondState: string
  secondStateLabel: string
  currentState: string
  firstStateTooltip: string
  secondStateTooltip: string
  tooltipPosition?: TooltipPosition
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  firstState,
  firstStateLabel,
  secondState,
  secondStateLabel,
  currentState: initialCurrentState,
  firstStateTooltip,
  secondStateTooltip,
  tooltipPosition = TooltipPosition.right,
}) => {
  const [currentState, setCurrentState] = useState(initialCurrentState)

  useEffect(() => {
    if (isNil(currentState)) {
      setCurrentState(firstState)
    }
  }, [currentState, firstState])

  const getTooltipPositionClass = () => {
    switch (tooltipPosition) {
      case TooltipPosition.left:
        return 'gxmUiTooltip__left'
      case TooltipPosition.bottomLeft:
        return 'gxmUiTooltip__bottomLeft'
      case TooltipPosition.bottomRight:
        return 'gxmUiTooltip__bottomRight'
      default:
        return 'gxmUiTooltip__right'
    }
  }

  const toggle = () => {
    setCurrentState(currentState === firstState ? secondState : firstState)
  }

  return (
    <div className="toggle-button" onClick={toggle}>
      <p
        id="toggle-button__firstState"
        className={`toggle-button__label ${
          currentState === secondState ? 'toggle-button__label--fade' : ''
        }`}
      >
        {firstStateLabel}
      </p>
      <div
        className={`toggle-button__switch ${getTooltipPositionClass()}`}
        my-tooltip={
          currentState === firstState ? firstStateTooltip : secondStateTooltip
        }
      >
        <MyTooltip
          content={
            currentState === firstState ? firstStateTooltip : secondStateTooltip
          }
        >
          <span
            className={`fa fa-plus-circle ${
              currentState === secondState ? 'toggle-button__switch--toggleState' : ''
            }`}
          ></span>
        </MyTooltip>
      </div>
      <p
        id="toggle-button__secondState"
        className={`toggle-button__label ${
          currentState === firstState ? 'toggle-button__label--fade' : ''
        }`}
      >
        {secondStateLabel}
      </p>
    </div>
  )
}


```