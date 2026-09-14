import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { CATEGORIES } from '../../data/mockData';
import { StatusBar } from 'expo-status-bar';
import SubscriptionCard from '../../components/SubscriptionCard';

export default function CategoryScreen() {
  const { title } = useLocalSearchParams();
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Find category data based on the dynamic route parameter
  const categoryData = CATEGORIES.find(c => c.title === title);
  const items = categoryData ? categoryData.items : [];

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950" edges={['top']}>
      <StatusBar style={isDark ? "light" : "dark"} />
      
      {/* Header */}
      <View className="px-4 py-4 flex-row items-center border-b border-slate-200 dark:border-slate-800">
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="p-2 -ml-2 rounded-full active:bg-slate-200 dark:active:bg-slate-800"
        >
          <Ionicons name="arrow-back" size={24} color={isDark ? "#fff" : "#0f172a"} />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-slate-900 dark:text-white ml-2 flex-1">
          {title}
        </Text>
      </View>

      {/* Grid of items */}
      <ScrollView className="flex-1 px-4 py-6" showsVerticalScrollIndicator={false}>
        <View className="flex-row flex-wrap justify-between">
          {items.map((sub) => (
            <SubscriptionCard key={sub.id} item={sub} isGrid={true} />
          ))}
          {items.length === 0 && (
            <Text className="text-slate-500 dark:text-slate-400 mt-10 text-center w-full">
              No subscriptions found in this category.
            </Text>
          )}
        </View>
        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
