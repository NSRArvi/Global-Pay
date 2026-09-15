import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Carousel from "../../components/Carousel";
import DynamicCategories from "../../components/DynamicCategories";
import { useAuth } from "../../context/AuthContext";

export default function HomeScreen() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const { user } = useAuth();

  const handleToggleTheme = async () => {
    toggleColorScheme();
    await AsyncStorage.setItem("theme", colorScheme === "dark" ? "light" : "dark");
  };

  // Get name from metadata, fallback to email prefix, fallback to Guest
  const rawName = user?.user_metadata?.full_name || (user ? user.email.split('@')[0] : "Guest");
  const displayName = rawName.length > 15 ? rawName.substring(0, 15) + "..." : rawName;

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
            <View className="w-12 h-12 rounded-full overflow-hidden bg-emerald-100 dark:bg-emerald-900/30 mr-3 border-2 border-white dark:border-slate-900 shadow-sm items-center justify-center">
              <Ionicons name="person" size={24} color="#10b981" />
            </View>
            <View>
              <Text className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-0.5">
                Good {new Date().getHours() < 12 ? "morning" : "evening"},
              </Text>
              <Text className="text-xl font-bold text-slate-900 dark:text-white leading-none">
                {displayName}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleToggleTheme}
            className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-800"
            activeOpacity={0.7}
          >
            <Ionicons
              name={isDark ? "sunny" : "moon"}
              size={20}
              color={isDark ? "#fbbf24" : "#4f46e5"}
            />
          </TouchableOpacity>
        </View>

        {/* Dynamic Carousel */}
        <Carousel />

        {/* Dynamic Categories */}
        <DynamicCategories />
      </ScrollView>
    </SafeAreaView>
  );
}
