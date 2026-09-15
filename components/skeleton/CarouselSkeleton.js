import React, { useEffect, useState } from "react";
import { View, Animated, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default function CarouselSkeleton() {
  const [pulseAnim] = useState(new Animated.Value(0.3));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  return (
    <View className="mt-2 mb-4 h-[220px]">
      <View style={{ width }} className="justify-center px-6 h-[200px]">
        <Animated.View
          style={{ opacity: pulseAnim }}
          className="flex-1 rounded-3xl bg-slate-200 dark:bg-slate-800 shadow-lg"
        />
      </View>
      <View className="flex-row justify-center mt-3">
        {[1, 2, 3].map((i) => (
          <Animated.View
            key={i}
            style={{ opacity: pulseAnim }}
            className="h-2 w-2 rounded-full mx-1 bg-slate-300 dark:bg-slate-700"
          />
        ))}
      </View>
    </View>
  );
}
