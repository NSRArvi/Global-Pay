import React from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { StatusBar } from "expo-status-bar";

const { width } = Dimensions.get("window");

export default function PaymentStatusScreen() {
  const { status, itemName } = useLocalSearchParams();
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const isSuccess = status === "success";

  return (
    <SafeAreaView
      className="flex-1 bg-slate-50 dark:bg-slate-950 items-center justify-center px-6"
      edges={["top", "bottom"]}
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      <View className="items-center max-w-sm w-full">
        {/* Animated-like Icon Container */}
        <View 
          className={`w-28 h-28 rounded-full items-center justify-center mb-8 shadow-sm ${
            isSuccess ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-red-100 dark:bg-red-900/30"
          }`}
        >
          <View 
            className={`w-20 h-20 rounded-full items-center justify-center ${
              isSuccess ? "bg-emerald-500" : "bg-red-500"
            }`}
          >
            <Ionicons
              name={isSuccess ? "checkmark" : "close"}
              size={48}
              color="#fff"
            />
          </View>
        </View>

        {/* Text Content */}
        <Text className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4 text-center">
          {isSuccess ? "Order Placed!" : "Order Failed"}
        </Text>
        
        <Text className="text-base text-slate-500 dark:text-slate-400 text-center mb-8 leading-6">
          {isSuccess
            ? `Your order for ${itemName ? `"${itemName}"` : "the subscription"} has been successfully received.\n\nOur agent will verify your transaction and reach out within 30 to 60 minutes.`
            : "We couldn't process your order right now. Please check your internet connection or try again later."}
        </Text>

        {/* Return Button */}
        <TouchableOpacity
          onPress={() => router.navigate("/(tabs)")}
          className={`w-full py-4 rounded-2xl items-center shadow-sm ${
            isSuccess ? "bg-emerald-500" : "bg-slate-900 dark:bg-white"
          }`}
          activeOpacity={0.8}
        >
          <Text className={`font-bold text-lg ${isSuccess ? "text-white" : "text-white dark:text-slate-900"}`}>
            Return to Home
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
