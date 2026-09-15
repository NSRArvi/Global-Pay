import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { StatusBar } from "expo-status-bar";
import { supabase } from "../../lib/supabase";
import ServiceDetailsSkeleton from "../../components/skeleton/ServiceDetailsSkeleton";
import RelatedSubscriptions from "../../components/RelatedSubscriptions";
import { LinearGradient } from "expo-linear-gradient";

const { height } = Dimensions.get("window");

const getFavicon = (domain) =>
  `https://www.google.com/s2/favicons?sz=256&domain=${domain}`;

export default function ServiceDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setItem(data);
    } catch (error) {
      console.error("Error fetching service details:", error);
      setItem(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <ServiceDetailsSkeleton />;
  }

  if (!item) {
    return (
      <SafeAreaView
        className="flex-1 bg-slate-50 dark:bg-slate-950 items-center justify-center"
        edges={["top"]}
      >
        <Text className="text-slate-900 dark:text-white">Service not found.</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4 p-2">
          <Text className="text-emerald-500 font-bold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const imageSource = item.image
    ? { uri: item.image }
    : item.domain
      ? { uri: getFavicon(item.domain) }
      : { uri: "https://via.placeholder.com/256" };

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950">
      <StatusBar style="light" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Hero Image Section */}
        <View style={{ height: height * 0.4 }} className="relative bg-slate-900 w-full">
          <Image
            source={imageSource}
            className="absolute w-full h-full opacity-60"
            resizeMode="cover"
            blurRadius={2} // Adds a nice blur effect to background
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.4)", isDark ? "#020617" : "#f8fafc"]}
            style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "100%" }}
          />

          {/* Floating Back Button */}
          <SafeAreaView edges={["top"]} className="absolute top-0 left-0 w-full px-4 py-4 z-10">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 bg-black/30 rounded-full flex items-center justify-center backdrop-blur-md"
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          </SafeAreaView>

          {/* Centered Large Icon */}
          <View className="absolute inset-0 items-center justify-center mt-10">
            <View className="w-28 h-28 bg-white dark:bg-slate-800 rounded-3xl shadow-xl flex items-center justify-center p-4">
              <Image
                source={imageSource}
                className="w-full h-full"
                resizeMode="contain"
              />
            </View>
          </View>
        </View>

        {/* Content Section */}
        <View className="px-6 py-2 -mt-4">
          <View className="flex-row justify-between items-start mb-4">
            <Text className="text-3xl font-bold text-slate-900 dark:text-white flex-1 pr-4">
              {item.name}
            </Text>
            <View className="bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-900/50">
              <Text className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">
                {item.price} USD
              </Text>
            </View>
          </View>

          <Text className="text-slate-600 dark:text-slate-400 text-base leading-6">
            {item.description || "No description provided for this service. Subscribe today to unlock all premium features and get the best experience possible."}
          </Text>
        </View>

        {/* Related Subscriptions */}
        <RelatedSubscriptions categoryId={item.category} currentServiceId={item.id} />
        
        <View className="h-32" />
      </ScrollView>

      {/* Sticky Bottom CTA */}
      <View className="absolute bottom-0 w-full bg-white dark:bg-slate-900 px-6 py-6 border-t border-slate-100 dark:border-slate-800 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
        <TouchableOpacity
          onPress={() => router.push(`/payment/${item.id}`)}
          className="w-full h-14 bg-emerald-500 rounded-2xl flex-row items-center justify-center shadow-lg shadow-emerald-500/30"
          activeOpacity={0.8}
        >
          <Text className="text-white font-bold text-lg mr-2">
            Subscribe Now
          </Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
