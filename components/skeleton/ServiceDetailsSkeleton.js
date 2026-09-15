import React, { useEffect, useState } from "react";
import { View, Animated, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { height } = Dimensions.get("window");

export default function ServiceDetailsSkeleton() {
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
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950" edges={["top"]}>
      {/* Header Skeleton */}
      <View className="px-4 py-4 flex-row items-center border-b border-slate-200 dark:border-slate-800">
        <Animated.View style={{ opacity: pulseAnim }} className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800" />
      </View>

      {/* Hero Image Skeleton */}
      <Animated.View 
        style={{ opacity: pulseAnim, height: height * 0.3 }} 
        className="w-full bg-slate-200 dark:bg-slate-800"
      />

      {/* Content Skeleton */}
      <View className="px-6 py-6">
        <Animated.View style={{ opacity: pulseAnim }} className="w-3/4 h-8 bg-slate-200 dark:bg-slate-800 rounded-md mb-4" />
        <Animated.View style={{ opacity: pulseAnim }} className="w-1/3 h-6 bg-slate-200 dark:bg-slate-800 rounded-md mb-8" />
        
        <Animated.View style={{ opacity: pulseAnim }} className="w-full h-4 bg-slate-200 dark:bg-slate-800 rounded-md mb-3" />
        <Animated.View style={{ opacity: pulseAnim }} className="w-full h-4 bg-slate-200 dark:bg-slate-800 rounded-md mb-3" />
        <Animated.View style={{ opacity: pulseAnim }} className="w-5/6 h-4 bg-slate-200 dark:bg-slate-800 rounded-md mb-8" />

        {/* CTA Skeleton */}
        <Animated.View style={{ opacity: pulseAnim }} className="w-full h-14 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      </View>
    </SafeAreaView>
  );
}
