import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function AccountScreen() {
  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950" edges={["top"]}>
      <View className="flex-1 justify-center items-center px-6">
        <View className="w-24 h-24 bg-slate-200 dark:bg-slate-800 rounded-full items-center justify-center mb-6">
          <Ionicons name="person" size={48} color="#94a3b8" />
        </View>
        <Text className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-center">
          Access Your Account
        </Text>
        <Text className="text-slate-500 dark:text-slate-400 text-center mb-8 px-4">
          Sign in to manage your active subscriptions, track orders, and update billing info.
        </Text>
        
        <TouchableOpacity className="bg-emerald-500 py-4 px-8 rounded-2xl w-full items-center mb-4 shadow-sm">
          <Text className="text-white font-bold text-lg">Sign In</Text>
        </TouchableOpacity>
        
        <TouchableOpacity className="bg-white dark:bg-slate-900 py-4 px-8 rounded-2xl w-full items-center border border-slate-200 dark:border-slate-800">
          <Text className="text-slate-900 dark:text-white font-bold text-lg">Register Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
