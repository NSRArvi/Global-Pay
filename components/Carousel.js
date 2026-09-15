import React, { useEffect, useRef, useState } from "react";
import { View, Text, ScrollView, Image, Dimensions } from "react-native";
import { supabase } from "../lib/supabase";
import CarouselSkeleton from "./skeleton/CarouselSkeleton";

const { width } = Dimensions.get("window");

export default function Carousel() {
  const scrollViewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sliders, setSliders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.from("sliders").select("*");
      if (error) throw error;
      setSliders(data || []);
    } catch (error) {
      console.error("Error fetching sliders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (sliders.length > 0) {
        const nextIndex = (currentIndex + 1) % sliders.length;
        setCurrentIndex(nextIndex);
        scrollViewRef.current?.scrollTo({
          x: nextIndex * width,
          animated: true,
        });
      }
    }, 4000);

    return () => clearInterval(timer);
  }, [currentIndex, sliders]);

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / width);
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
    }
  };

  if (isLoading) {
    return <CarouselSkeleton />;
  }

  if (sliders.length === 0) {
    return null;
  }

  return (
    <View className="mt-2 mb-4">
      <View className="h-[200px]">
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          scrollEventThrottle={16}
        >
          {sliders.map((item) => (
            <View
              key={item.id}
              style={{ width }}
              className="justify-center px-6"
            >
              <View className="flex-1 rounded-3xl overflow-hidden relative shadow-lg">
                <Image
                  source={{ uri: item.image }}
                  className="absolute w-full h-full"
                  resizeMode="cover"
                />
                <View className="absolute w-full h-full bg-black/40" />
                <View className="absolute bottom-0 left-0 p-6 w-full">
                  <Text className="text-white font-bold text-2xl mb-1">
                    {item.title}
                  </Text>
                  {item.subtitle && (
                    <Text className="text-slate-200 font-medium">
                      {item.subtitle}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
      
      {/* Pagination Dots */}
      <View className="flex-row justify-center mt-3">
        {sliders.map((_, index) => (
          <View
            key={index}
            className={`h-2 rounded-full mx-1 ${
              currentIndex === index
                ? "w-4 bg-emerald-500"
                : "w-2 bg-slate-300 dark:bg-slate-700"
            }`}
          />
        ))}
      </View>
    </View>
  );
}
