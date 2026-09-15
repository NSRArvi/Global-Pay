import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, Redirect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";

const getFavicon = (domain) => `https://www.google.com/s2/favicons?sz=128&domain=${domain}`;

export default function AccountScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState("current"); // 'current' | 'expired'
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      if (!refreshing) setIsLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("customer_email", user.email)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchOrders();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  // If not logged in, gracefully redirect to login page
  if (!isLoading && !user) {
    return <Redirect href="/login" />;
  }

  // Filter subscriptions based on status
  const currentSubscriptions = orders.filter(o => o.status === 'active' || o.status === 'pending' || o.status === 'current');
  const expiredSubscriptions = orders.filter(o => o.status === 'expired');

  const displayedSubscriptions = activeTab === "current" ? currentSubscriptions : expiredSubscriptions;

  const renderSubscriptionCard = (item) => {
    // Since we removed the join for safety, we'll use a generic icon based on the service name
    const imageSource = { uri: getFavicon("google.com") };

    return (
      <View 
        key={item.id} 
        className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 mb-4 flex-row items-center"
      >
        <View className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 items-center justify-center mr-4">
          <Image source={imageSource} className="w-8 h-8 rounded-lg" resizeMode="contain" />
        </View>
        <View className="flex-1">
          <Text className="text-lg font-bold text-slate-900 dark:text-white mb-1">
            {item.service_name}
          </Text>
          <Text className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            {item.total_paid_bdt} BDT
          </Text>
        </View>
        <View className="items-end">
          <View className={`px-2 py-1 rounded-md mb-1 ${item.status === 'active' ? 'bg-emerald-100 dark:bg-emerald-900/30' : item.status === 'pending' ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-slate-100 dark:bg-slate-800'}`}>
            <Text className={`text-xs font-bold ${item.status === 'active' ? 'text-emerald-700 dark:text-emerald-400' : item.status === 'pending' ? 'text-amber-700 dark:text-amber-400' : 'text-slate-500 dark:text-slate-400'}`}>
              {item.status.toUpperCase()}
            </Text>
          </View>
          <Text className="text-xs text-slate-400 dark:text-slate-500">
            {item.expiry_date ? `Exp: ${new Date(item.expiry_date).toLocaleDateString()}` : `Start: pending`}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950" edges={["top"]}>
      <StatusBar style={isDark ? "light" : "dark"} />
      
      {/* Header Profile Section */}
      <View className="px-6 py-6 items-center border-b border-slate-200 dark:border-slate-800/50 bg-white dark:bg-slate-900">
        <View className="relative mb-4">
          <View className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-50 dark:border-slate-800 bg-slate-200 dark:bg-slate-800 items-center justify-center">
            <Ionicons name="person" size={48} color={isDark ? "#475569" : "#94a3b8"} />
          </View>
          <TouchableOpacity 
            onPress={() => router.push("/edit-profile")}
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 items-center justify-center shadow-sm"
          >
            <Ionicons name="pencil" size={14} color="#ffffff" />
          </TouchableOpacity>
        </View>
        
        <Text className="text-xl font-bold text-slate-900 dark:text-white mb-1">
          {user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Loading..."}
        </Text>
        <Text className="text-slate-500 dark:text-slate-400 font-medium text-sm mb-2">
          {user?.user_metadata?.phone || user?.email}
        </Text>
        <View className="flex-row items-center bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-900/50 mt-1">
          <Ionicons name="checkmark-circle" size={14} color={isDark ? "#60a5fa" : "#3b82f6"} className="mr-1" />
          <Text className="text-blue-600 dark:text-blue-400 font-bold text-xs ml-1">
            VERIFIED USER
          </Text>
        </View>
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
      <ScrollView 
        className="flex-1 px-6 pt-2" 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10b981" />
        }
      >
        {isLoading ? (
          <ActivityIndicator size="large" color="#10b981" className="mt-10" />
        ) : displayedSubscriptions.length > 0 ? (
          displayedSubscriptions.map(renderSubscriptionCard)
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
          onPress={handleLogout}
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
