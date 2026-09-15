import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Animated,
  Vibration,
  ActivityIndicator
} from "react-native";

export default function HoldToConfirmButton({ onConfirm, isDark, disabled, isSubmitting }) {
  const [isHolding, setIsHolding] = useState(false);
  const fillAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    if (disabled || isSubmitting) return;

    setIsHolding(true);
    Animated.timing(fillAnim, {
      toValue: 100,
      duration: 1500, // 1.5 seconds to hold
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        Vibration.vibrate(100); // Small haptic feedback when confirmed
        onConfirm();
      }
    });
  };

  const handlePressOut = () => {
    if (disabled || isSubmitting) return;

    setIsHolding(false);
    Animated.timing(fillAnim, {
      toValue: 0,
      duration: 200, // Quick reset
      useNativeDriver: false,
    }).start();
  };

  const widthInterpolation = fillAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <View
        style={{
          height: 64,
          borderRadius: 16,
          overflow: "hidden",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          marginTop: 16,
          backgroundColor: (disabled || isSubmitting)
            ? isDark
              ? "#1e293b" // slate-800
              : "#e2e8f0" // slate-200
            : "#10b981", // emerald-500
          borderColor: (disabled || isSubmitting)
            ? isDark
              ? "#334155" // slate-700
              : "#cbd5e1" // slate-300
            : "transparent",
          borderWidth: (disabled || isSubmitting) ? 1 : 0,
          opacity: (disabled || isSubmitting) ? 0.6 : 1,
        }}
      >
        {/* Animated fill background */}
        <Animated.View
          style={[
            {
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              backgroundColor: "#047857", // emerald-700
            },
            { width: widthInterpolation },
          ]}
        />

        {isSubmitting ? (
          <ActivityIndicator color={isDark ? "#ffffff" : "#0f172a"} />
        ) : (
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 18,
              zIndex: 10,
              elevation: 10,
              color: disabled
                ? isDark
                  ? "#64748b" // slate-500
                  : "#94a3b8" // slate-400
                : "#ffffff",
            }}
          >
            {isHolding && !disabled ? "Holding..." : "Checkout"}
          </Text>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}
