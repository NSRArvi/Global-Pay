import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import SubscriptionCard from "./SubscriptionCard";

const { width } = Dimensions.get("window");

export default function CategoryRow({ category }) {
  const router = useRouter();
  const scrollViewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // SubscriptionCard width = width * 0.42 + 16 (for marginHorizontal: 8)
  const cardWidth = width * 0.42 + 16;

  useEffect(() => {
    // Add a slight stagger delay based on title length to prevent rows scrolling exactly simultaneously
    const staggerDelay = category.title.length * 150;
    const timer = setInterval(() => {
      if (category.items && category.items.length > 0) {
        const nextIndex = (currentIndex + 1) % category.items.length;
        setCurrentIndex(nextIndex);
        scrollViewRef.current?.scrollTo({
          x: nextIndex * cardWidth,
          animated: true,
        });
      }
    }, 4500 + staggerDelay);

    return () => clearInterval(timer);
  }, [currentIndex, category]);

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / cardWidth);
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
    }
  };

  return (
    <View className="mb-8">
      <View className="flex-row justify-between items-end mb-4">
        <Text className="text-xl font-bold text-slate-900 dark:text-white">
          {category.title}
        </Text>
        <TouchableOpacity
          onPress={() =>
            router.push(`/category/${encodeURIComponent(category.title)}`)
          }
        >
          <Text className="text-emerald-500 font-semibold text-sm">
            See All
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        className="-mx-2"
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
      >
        {category.items.map((sub) => (
          <SubscriptionCard key={sub.id} item={sub} isGrid={false} />
        ))}
      </ScrollView>
    </View>
  );
}
