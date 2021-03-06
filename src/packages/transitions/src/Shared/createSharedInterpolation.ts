import {
  SharedInterpolationType,
  SharedInterpolationStatus,
  TransitionItem,
  OnAnimationFunction,
} from "../Components/Types";
import { ConfigAnimationType, ChildAnimationDirection } from "../Configuration";

let TransitionId = 1000;
let SharedTransitionId = -1000;

export const createSharedInterpolation = (
  fromItem: TransitionItem,
  toItem: TransitionItem,
  direction?: ChildAnimationDirection,
  animation?: ConfigAnimationType,
  onBegin?: OnAnimationFunction,
  onEnd?: OnAnimationFunction,
): SharedInterpolationType => {
  const sharedTransitionId = TransitionId++;
  return {
    id: sharedTransitionId,
    orgFromId: fromItem.id,
    orgToId: toItem.id,
    status: SharedInterpolationStatus.Created,
    direction,
    animation,
    fromLabel: fromItem.label || "unknown",
    toLabel: toItem.label || "unknown",
    fromCloneLabel: `${fromItem.label || "unknown"}${sharedTransitionId}`,
    toCloneLabel: `${toItem.label || "unknown"}${sharedTransitionId}`,
    fromId: SharedTransitionId--,
    toId: SharedTransitionId--,
    fromItem,
    toItem,
    onAnimationBegin: onBegin,
    onAnimationDone: onEnd,
  };
};
