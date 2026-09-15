import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { StatusBar } from 'expo-status-bar';
import SubscriptionCard from '../../components/SubscriptionCard';
import { supabase } from '../../lib/supabase';

// --- SKELETON COMPONENT ---
const GridSkeleton = () => {
  const [pulseAnim] = useState(new Animated.Value(0.3));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.7, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.3, duration: 800, useNativeDriver: true })
      ])
    ).start();
  }, [pulseAnim]);

  return (
    <View className="flex-row flex-wrap justify-between">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <View key={i} className="bg-white dark:bg-slate-900 p-5 rounded-3xl mb-4" style={{ width: '48%' }}>
          <Animated.View style={{ opacity: pulseAnim }} className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-800 mb-4" />
          <Animated.View style={{ opacity: pulseAnim }} className="w-full h-4 bg-slate-200 dark:bg-slate-800 rounded-md mb-2" />
          <Animated.View style={{ opacity: pulseAnim }} className="w-16 h-4 bg-slate-200 dark:bg-slate-800 rounded-md" />
        </View>
      ))}
    </View>
  );
};
// --------------------------

export default function CategoryScreen() {
  const { id, title } = useLocalSearchParams();
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, [id]);

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('category', id);
      
      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching category services:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
          {title || 'Category'}
        </Text>
      </View>

      {/* Grid of items */}
      <ScrollView className="flex-1 px-4 py-6" showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <GridSkeleton />
        ) : (
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
        )}
        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
