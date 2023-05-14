/*!
 * Copyright 2021-2022 Bosch Automotive Service Solutions Limited
 * All rights reserved.
 */

import * as angular from 'angular';
import { isNil } from 'lodash';

export enum TooltipPosition {
  Left = 'left',
  BottomLeft = 'bottom-left',
  BottomRight = 'bottom-right',
}

class ToggleButtonCtrl implements angular.IController {
  public readonly firstState!: string;
  public readonly firstStateLabel!: string;
  public readonly secondState!: string;
  public readonly secondStateLabel!: string;
  public readonly firstStateTooltip!: string;
  public readonly secondStateTooltip!: string;
  public readonly tooltipPosition!: TooltipPosition;
  public currentState!: string;

  public $onInit() {
    if (isNil(this.currentState)) {
      this.currentState = this.firstState;
    }
  }

  public getTooltipPositionClass() {
    switch (this.tooltipPosition) {
      case TooltipPosition.Left:
        return 'gxmUiTooltip__left';
      case TooltipPosition.BottomLeft:
        return 'gxmUiTooltip__bottomLeft';
      case TooltipPosition.BottomRight:
        return 'gxmUiTooltip__bottomRight';
      default:
        return 'gxmUiTooltip__right';
    }
  }

  public toggle() {
    this.currentState =
      this.currentState === this.firstState
        ? this.secondState
        : this.firstState;
  }
}

angular.module('toggleButton', []).component('toggleButton', {
  require: {},
  bindings: {
    firstState: '@',
    firstStateLabel: '@',
    secondState: '@',
    secondStateLabel: '@',
    currentState: '=',
    firstStateTooltip: '@',
    secondStateTooltip: '@',
    tooltipPosition: '@?',
  },
  controller: ToggleButtonCtrl,
  templateUrl: 'templates/toggle-button/toggleButton.tpl.html',
});
