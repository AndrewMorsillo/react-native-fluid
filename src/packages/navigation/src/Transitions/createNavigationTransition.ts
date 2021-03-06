import Fluid, {
  // @ts-ignore
  ConfigWhenType,
  // @ts-ignore
  ConfigStateType,
} from "react-native-fluid-transitions";
import { NavigationState } from "../types";
import { safeGetState } from "../Functions";

export const createWhenConfiguration = (
  states: ConfigStateType[],
  styleKey: string,
  inputRange: Array<number>,
  outputRangeForwardFrom: Array<number | string>,
  outputRangeForwardTo: Array<number | string>,
  outputRangeBackFrom: Array<number | string>,
  outputRangeBackTo: Array<number | string>,
): ConfigWhenType[] => {
  const { forwardTo, forwardFrom, backTo, backFrom } = getNavigationStates(
    states,
  );

  const interpolationForState = (
    state: ConfigStateType,
    _isForward: boolean,
    outputRange: Array<number | string>,
  ) => ({
    state: state.name,
    animation: Fluid.Animations.Springs.Gentle,
    interpolation: [
      {
        styleKey,
        inputRange,
        outputRange,
      },
    ],
  });

  return [
    interpolationForState(forwardTo, true, outputRangeForwardTo),
    interpolationForState(forwardFrom, false, outputRangeForwardFrom),
    interpolationForState(backTo, true, outputRangeBackTo),
    interpolationForState(backFrom, false, outputRangeBackFrom),
  ];
};

const getNavigationStates = (states: ConfigStateType[]) => {
  const forwardTo = safeGetState(NavigationState.ForwardTo, states);
  const forwardFrom = safeGetState(NavigationState.ForwardFrom, states);
  const backTo = safeGetState(NavigationState.BackTo, states);
  const backFrom = safeGetState(NavigationState.BackFrom, states);
  return {
    forwardTo,
    forwardFrom,
    backTo,
    backFrom,
  };
};
