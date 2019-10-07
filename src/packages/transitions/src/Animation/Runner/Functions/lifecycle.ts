import { createProc } from "../../Functions/createProc";
import {
  AnimationProvider,
  IAnimationNode,
  IAnimationValue,
} from "react-native-fluid-animations";
import { normalize } from "./normalize";
import { RunningFlags } from "../interpolations";

const {
  proc,
  debug,
  call,
  block,
  set,
  cond,
  eq,
  and,
  greaterOrEq,
  lessOrEq,
} = AnimationProvider.Animated;

export enum StopReason {
  DurationEnd = 0,
  Removed = 1,
}

const _beginListeners: { [key: number]: Array<(id: number) => void> } = {};
const _endListeners: {
  [key: number]: Array<(id: number, stopReason: number) => void>;
} = {};

const getAnimationKey = (ownerId: number, key: string) => `${key}(${ownerId})`;

/**
 * @description Creates a new lifecycle proc node for running an animation and
 * keeping track of the lifecycle of the animation
 * @param ownerId id of transitionitem owning the animation
 * @param key Key for animation value to be animated
 * @param animationId id of the animation
 * @param source Animated value driving the animation
 * @param offset offset in ms for starting point of animation
 * @param duration duration in ms for animation
 * @param onBegin optional callback that will be called when animation starts
 * @param onEnd optional callback that will be called when animation ends
 * @param updateValue Statement / proc node to call to update node
 */
export const getLifecycleFunc = (
  ownerId: number,
  key: string,
  animationId: number,
  source: IAnimationNode,
  offset: number,
  duration: number,
  onBegin: (id: number) => void,
  onEnd: (id: number, stopReason: StopReason) => void,
  isRunningFlag: IAnimationValue,
  updateValue: IAnimationNode,
) => {
  const animationKey = getAnimationKey(ownerId, key);

  // Register callbacks for start/stop
  registerBeginListener(animationId, (id: number) => {
    onBegin && onBegin(id);
  });

  registerEndListener(animationId, (id: number, stopReason: StopReason) => {
    onEnd && onEnd(id, stopReason);
  });

  const f = lifecycleFunc(
    animationId,
    ownerId,
    normalize(source, offset, duration),
    isRunningFlag,
    updateValue,
  );

  return () => f;
};

/**
 * @description Registers a listener to be called when animation starts
 */
const registerBeginListener = (id: number, callback: (id: number) => void) => {
  if (!_beginListeners[id]) {
    _beginListeners[id] = [];
  }
  _beginListeners[id].push(callback);
};

/**
 * @description Registers a listener to be called when animation ends
 */
const registerEndListener = (
  id: number,
  callback: (id: number, stopReason: StopReason) => void,
) => {
  if (!_endListeners[id]) {
    _endListeners[id] = [];
  }
  _endListeners[id].push(callback);
};

/**
 * @description Callback from native side when an animation starts
 */
const onAnimationBegin = (args: ReadonlyArray<number>) => {
  const animationId = args[0] as number;
  while (
    _beginListeners[animationId] &&
    _beginListeners[animationId].length > 0
  ) {
    const listener = _beginListeners[animationId].pop();
    if (_beginListeners[animationId].length === 0) {
      delete _beginListeners[animationId];
    }
    listener && listener(animationId);
  }
};

/**
 * @description Callback from native side when animation ends
 */
const onAnimationEnd = (args: ReadonlyArray<number>) => {
  const animationId = args[0];
  const stopReason = args[2];
  while (_endListeners[animationId] && _endListeners[animationId].length > 0) {
    const listener = _endListeners[animationId].pop();
    if (_endListeners[animationId].length === 0) {
      delete _endListeners[animationId];
    }
    listener && listener(animationId, stopReason);
  }
};

/**
 * @description Defines the lifecycle function for running an animation
 */
const lifecycleFunc = createProc("lifecycle", () =>
  proc("lifecycle", (animationId, ownerId, input, isRunning, updateValue) =>
    block([
      // Start animation
      cond(and(greaterOrEq(input, 0), eq(isRunning, RunningFlags.NotStarted)), [
        debug("Started", isRunning),
        set(isRunning as IAnimationValue, RunningFlags.Started),
        call([animationId, ownerId], onAnimationBegin),
      ]),
      // Check if running value has been changed from the outside
      cond(eq(isRunning, RunningFlags.Stopped), [
        // We are stopped from the outside
        debug("Stopped from the outside", isRunning),
        call([animationId, ownerId, isRunning], onAnimationEnd),
      ]),
      // Update
      cond(
        and(
          greaterOrEq(input, 0),
          lessOrEq(input, 1),
          eq(isRunning, RunningFlags.Started),
        ),
        updateValue,
      ),
      // Check too see if we should stop
      cond(greaterOrEq(input, 1), [
        // We have started but have now reached the end of the animation
        call([animationId, ownerId, isRunning], onAnimationEnd),
      ]),
    ]),
  ),
);
