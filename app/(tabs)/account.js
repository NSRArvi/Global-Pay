import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { USER_SUBSCRIPTIONS } from "../../data/mockData";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";

export default function AccountScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const [activeTab, setActiveTab] = useState("current"); // 'current' | 'expired'

  const subscriptions = USER_SUBSCRIPTIONS[activeTab];

  const renderSubscriptionCard = (item) => (
    <View 
      key={item.id} 
      className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 mb-4 flex-row items-center"
    >
      <View className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 items-center justify-center mr-4">
        <Image source={{ uri: item.image }} className="w-8 h-8 rounded-lg" resizeMode="contain" />
      </View>
      <View className="flex-1">
        <Text className="text-lg font-bold text-slate-900 dark:text-white mb-1">
          {item.name}
        </Text>
        <Text className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          {item.price}
        </Text>
      </View>
      <View className="items-end">
        <View className={`px-2 py-1 rounded-md mb-1 ${activeTab === 'current' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-slate-100 dark:bg-slate-800'}`}>
          <Text className={`text-xs font-bold ${activeTab === 'current' ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
            {item.status}
          </Text>
        </View>
        <Text className="text-xs text-slate-400 dark:text-slate-500">
          {activeTab === 'current' ? `Next: ${item.nextBilling}` : `Expired: ${item.expiredOn}`}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950" edges={["top"]}>
      <StatusBar style={isDark ? "light" : "dark"} />
      
      {/* Header Profile Section */}
      <View className="px-6 py-6 items-center border-b border-slate-200 dark:border-slate-800/50 bg-white dark:bg-slate-900">
        <View className="relative mb-4">
          <View className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-50 dark:border-slate-800">
            <Image 
              source={{ uri: "https://i.pravatar.cc/150?img=11" }} 
              className="w-full h-full" 
              resizeMode="cover" 
            />
          </View>
          <TouchableOpacity className="absolute bottom-0 right-0 bg-slate-900 dark:bg-emerald-500 w-8 h-8 rounded-full items-center justify-center border-2 border-white dark:border-slate-900">
            <Ionicons name="pencil" size={14} color="#fff" />
          </TouchableOpacity>
        </View>
        
        <Text className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
          Nashed Shahroni
        </Text>
        <Text className="text-slate-500 dark:text-slate-400 font-medium text-sm">
          +880 1318214398
        </Text>
      </View>

      {/* Tabs */}
      <View className="px-6 py-4 flex-row">
        <TouchableOpacity 
          className={`flex-1 py-3 items-center rounded-xl mr-2 ${activeTab === 'current' ? 'bg-slate-900 dark:bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'}`}
          onPress={() => setActiveTab("current")}
        >
          <Text className={`font-bold ${activeTab === 'current' ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}>
            Current
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className={`flex-1 py-3 items-center rounded-xl ml-2 ${activeTab === 'expired' ? 'bg-slate-900 dark:bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'}`}
          onPress={() => setActiveTab("expired")}
        >
          <Text className={`font-bold ${activeTab === 'expired' ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}>
            Expired
          </Text>
        </TouchableOpacity>
      </View>

      {/* Subscriptions List */}
      <ScrollView className="flex-1 px-6 pt-2" showsVerticalScrollIndicator={false}>
        {subscriptions.length > 0 ? (
          subscriptions.map(renderSubscriptionCard)
        ) : (
          <View className="py-10 items-center justify-center">
            <Text className="text-slate-400 dark:text-slate-500">No subscriptions found.</Text>
          </View>
        )}
        <View className="h-6" />
      </ScrollView>

      {/* Logout Button */}
      <View className="px-6 py-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <TouchableOpacity 
          onPress={() => router.push("/login")}
          className="bg-red-50 dark:bg-red-900/20 py-4 rounded-xl border border-red-200 dark:border-red-900/30 flex-row items-center justify-center"
        >
          <Ionicons name="log-out-outline" size={20} color={isDark ? "#f87171" : "#ef4444"} className="mr-2" />
          <Text className="text-red-500 dark:text-red-400 font-bold text-lg ml-2">
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
