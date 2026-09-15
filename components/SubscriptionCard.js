import React from "react";
import { View, Text, TouchableOpacity, Dimensions, Image } from "react-native";
import { Link } from "expo-router";

const { width } = Dimensions.get("window");

const getFavicon = (domain) =>
  `https://www.google.com/s2/favicons?sz=128&domain=${domain}`;

export default function SubscriptionCard({ item, isGrid = false }) {
  // If in grid view (category screen), width is 48% with bottom margin.
  // If in horizontal scroll (home screen), width is fixed with horizontal margin.
  const cardStyle = isGrid
    ? { width: "48%", marginBottom: 16 }
    : { width: width * 0.42, marginHorizontal: 8 };

  const imageSource = item.image
    ? { uri: item.image }
    : item.domain
      ? { uri: getFavicon(item.domain) }
      : { uri: "https://via.placeholder.com/150" };

  return (
    <Link href={`/service/${item.id}`} asChild>
      <TouchableOpacity
        className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800"
        style={cardStyle}
        activeOpacity={0.7}
      >
        <View className="w-12 h-12 rounded-2xl overflow-hidden mb-4 bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
          <Image
            source={imageSource}
            style={{ width: 64, height: 64 }}
            resizeMode="cover"
          />
        </View>
        <Text
          className="font-bold text-lg text-slate-900 dark:text-white mb-1"
          numberOfLines={1}
        >
          {item.name}
        </Text>
        <Text className="text-slate-500 dark:text-slate-400 font-medium">
          {item.price} USD
        </Text>
      </TouchableOpacity>
    </Link>
  );
}
