import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { supabase } from "../lib/supabase";
import SubscriptionCard from "./SubscriptionCard";
import CategorySkeleton from "./skeleton/CategorySkeleton";

export default function RelatedSubscriptions({ categoryId, currentServiceId }) {
  const [related, setRelated] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (categoryId) {
      fetchRelated();
    }
  }, [categoryId, currentServiceId]);

  const fetchRelated = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("category", categoryId)
        .neq("id", currentServiceId)
        .limit(5); // Show up to 5 related

      if (error) throw error;
      setRelated(data || []);
    } catch (error) {
      console.error("Error fetching related subscriptions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View className="mt-8 px-6">
        <Text className="text-xl font-bold text-slate-900 dark:text-white mb-4">
          Related Subscriptions
        </Text>
        <CategorySkeleton />
      </View>
    );
  }

  if (related.length === 0) {
    return null; // Don't show anything if no related subscriptions
  }

  return (
    <View className="mt-8 px-6 mb-8">
      <Text className="text-xl font-bold text-slate-900 dark:text-white mb-4">
        Related Subscriptions
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="-mx-2 pb-4"
      >
        {related.map((sub) => (
          <SubscriptionCard key={sub.id} item={sub} isGrid={false} />
        ))}
      </ScrollView>
    </View>
  );
}
