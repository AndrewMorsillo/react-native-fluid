import React from "react";
import Fluid, {
  useFluidConfig,
  useFluidState,
} from "react-native-fluid-transitions";
import { GestureContainer } from "react-native-fluid-gestures";
import { StyleSheet, View } from "react-native";
import * as Colors from "../colors";
import { useMergedConfigs } from "react-native-fluid-transitions";
import { useOnEnterState } from "react-native-fluid-transitions";
import { useOnExitState } from "react-native-fluid-transitions";
import { useWhenState } from "react-native-fluid-transitions";
import { useInterpolationValue } from "react-native-fluid-transitions";

const DraggingExampleScreen = () => {
  const [isSnappingState, setIsSnapping] = useFluidState(false);

  const valueDragX = useInterpolationValue("gestureContainer", "translateX");

  const valueDragY = useInterpolationValue("gestureContainer", "translateY");

  const config = useMergedConfigs(
    useOnEnterState(
      "dragging",
      {
        inputRange: [0, 1],
        outputRange: [Colors.ColorA, Colors.ColorB],
        styleKey: "backgroundColor",
      },
      { onBegin: () => setIsSnapping(false) },
    ),
    useOnExitState(
      "dragging",
      {
        inputRange: [0, 1],
        outputRange: [Colors.ColorB, Colors.ColorA],
        styleKey: "backgroundColor",
      },
      { onBegin: () => setIsSnapping(true) },
    ),
    useWhenState("dragging", {
      styleKey: "transform.translateX",
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: "extend",
      value: valueDragX,
    }),
    useWhenState("dragging", {
      styleKey: "transform.translateY",
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: "extend",
      value: valueDragY,
    }),
    useWhenState(
      isSnappingState,
      {
        opacity: 1,
        transform: [{ translateX: 0 }, { translateY: 0 }],
      },
      {
        animation: Fluid.Animations.Springs.spring(1, 100, 4),
        onEnd: () => setIsSnapping(false),
      },
    ),
  );

  return (
    <View style={styles.container}>
      <GestureContainer label="gestureContainer" style={styles.box}>
        <Fluid.View
          config={config}
          states={isSnappingState}
          style={styles.staticBox}
          staticStyle={styles.box}
        />
      </GestureContainer>
    </View>
  );
};

DraggingExampleScreen.navigationOptions = {
  title: "Dragging",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  staticBox: {
    backgroundColor: Colors.ColorA,
  },
});

export default DraggingExampleScreen;
