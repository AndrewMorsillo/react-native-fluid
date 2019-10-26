import { useNavigationTransition } from "./useNavigationTransition";

export const useTopTransition = (height: number) => {
  return useNavigationTransition(
    "transform.translateY",
    [0, 0.5, 1],
    [0, -height, 0], // Forward from
    [-height, -height, 0], // Forward to
    [0, -height, -height], // Back from
    [-height, -height, 0], // Back to
  );
};

export const useBottomTransition = (height: number) => {
  return useNavigationTransition(
    "transform.translateY",
    [0, 0.5, 1],
    [0, height, 0], // Forward from
    [height, height, 0], // Forward to
    [0, height, height], // Back from
    [height, height, 0], // Back to
  );
};
