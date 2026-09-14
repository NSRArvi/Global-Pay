import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { CAROUSEL_DATA, CATEGORIES } from "../../data/mockData";
import CategoryRow from "../../components/CategoryRow";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();

  const scrollViewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (CAROUSEL_DATA.length > 0) {
        const nextIndex = (currentIndex + 1) % CAROUSEL_DATA.length;
        setCurrentIndex(nextIndex);
        scrollViewRef.current?.scrollTo({
          x: nextIndex * width,
          animated: true,
        });
      }
    }, 4000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / width);
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
    }
  };

  return (
    <SafeAreaView
      className="flex-1 bg-slate-50 dark:bg-slate-950"
      edges={["top"]}
    >
      <StatusBar style={isDark ? "light" : "dark"} />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 py-4 flex-row justify-between items-center">
          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800 mr-3 border-2 border-white dark:border-slate-900 shadow-sm">
              <Image
                source={{ uri: "https://i.pravatar.cc/150?img=11" }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
            <View>
              <Text className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-0.5">
                Good morning,
              </Text>
              <Text className="text-xl font-bold text-slate-900 dark:text-white leading-none">
                Nashed
              </Text>
            </View>
          </View>

          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center relative shadow-sm border border-slate-100 dark:border-slate-800"
            activeOpacity={0.7}
          >
            <Ionicons
              name="notifications-outline"
              size={20}
              color={isDark ? "#f8fafc" : "#0f172a"}
            />
            <View className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-900" />
          </TouchableOpacity>
        </View>

        {/* Carousel Placeholder / Native ScrollView */}
        <View className="mt-2 h-[200px]">
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleScroll}
            scrollEventThrottle={16}
          >
            {CAROUSEL_DATA.map((item) => (
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
                    <Text className="text-slate-200 font-medium">
                      {item.subtitle}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Categories & Cards */}
        <View className="mt-8 px-6 pb-20">
          {CATEGORIES.map((category, idx) => (
            <CategoryRow key={idx} category={category} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
