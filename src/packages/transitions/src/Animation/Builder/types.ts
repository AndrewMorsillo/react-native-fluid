import { Metrics } from "../../Types";
import {
  ChildAnimationDirection,
  ConfigAnimationType,
  ConfigStaggerFunction,
} from "../../Configuration";

export type AnimationNode = {
  id: number;
  interpolationId: number;
  childAnimation: "staggered" | "parallel" | "sequential";
  childDirection: ChildAnimationDirection;
  children: Array<AnimationNode>;
  metrics: Metrics;
  parent?: AnimationNode;
  offset: number;
  duration: number;
  subtreeDuration?: number;
  delay: number;
  stagger: number;
  staggerMax: number;
  staggerFunction?: ConfigStaggerFunction;
  waitForMetrics?: () => Promise<void>;
  animation?: ConfigAnimationType;
  label?: string;
};

export type Animations = { [key: string]: boolean };
