import React, { useEffect, useState } from "react";
import { View, Animated, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default function CategorySkeleton() {
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
    <View className="mb-8">
      <View className="flex-row justify-between items-end mb-4 px-2">
        <Animated.View
          style={{ opacity: pulseAnim }}
          className="w-32 h-6 bg-slate-200 dark:bg-slate-800 rounded-md"
        />
        <Animated.View
          style={{ opacity: pulseAnim }}
          className="w-16 h-4 bg-slate-200 dark:bg-slate-800 rounded-md"
        />
      </View>
      <View className="flex-row px-2">
        {[1, 2, 3].map((i) => (
          <View
            key={i}
            className="bg-white dark:bg-slate-900 p-5 rounded-3xl mr-4"
            style={{ width: width * 0.42 }}
          >
            <Animated.View
              style={{ opacity: pulseAnim }}
              className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-800 mb-4"
            />
            <Animated.View
              style={{ opacity: pulseAnim }}
              className="w-full h-4 bg-slate-200 dark:bg-slate-800 rounded-md mb-2"
            />
            <Animated.View
              style={{ opacity: pulseAnim }}
              className="w-16 h-4 bg-slate-200 dark:bg-slate-800 rounded-md"
            />
          </View>
        ))}
      </View>
    </View>
  );
}
