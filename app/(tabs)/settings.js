import React from "react";
import { View, Text, Switch, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function SettingsScreen() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const toggleTheme = async () => {
    const newTheme = isDark ? "light" : "dark";
    setColorScheme(newTheme);
    await AsyncStorage.setItem("theme", newTheme);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950" edges={["top"]}>
      <View className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 mb-4">
        <Text className="text-2xl font-bold text-slate-900 dark:text-white">Settings</Text>
      </View>

      <View className="px-6">
        <Text className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase mb-4 tracking-wider">
          Preferences
        </Text>
        
        <View className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className={`w-10 h-10 rounded-xl items-center justify-center mr-4 ${isDark ? 'bg-indigo-500/20' : 'bg-amber-500/20'}`}>
              <Ionicons name={isDark ? "moon" : "sunny"} size={20} color={isDark ? "#818cf8" : "#f59e0b"} />
            </View>
            <View>
              <Text className="text-lg font-bold text-slate-900 dark:text-white">Dark Mode</Text>
              <Text className="text-slate-500 dark:text-slate-400 text-sm">Switch app theme</Text>
            </View>
          </View>
          <Switch 
            value={isDark} 
            onValueChange={toggleTheme} 
            trackColor={{ false: "#e2e8f0", true: "#10b981" }}
            thumbColor={"#ffffff"}
          />
        </View>

        <Text className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase mt-8 mb-4 tracking-wider">
          Support
        </Text>

        <TouchableOpacity className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-xl bg-blue-500/10 items-center justify-center mr-4">
              <Ionicons name="chatbubbles" size={20} color="#3b82f6" />
            </View>
            <Text className="text-lg font-bold text-slate-900 dark:text-white">Contact Us</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}
