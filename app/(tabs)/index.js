import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { useRouter } from "expo-router";
import { CAROUSEL_DATA, CATEGORIES } from "../../data/mockData";
import SubscriptionCard from "../../components/SubscriptionCard";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();

  return (
    <SafeAreaView
      className="flex-1 bg-slate-50 dark:bg-slate-950"
      edges={["top"]}
    >
      <StatusBar style={isDark ? "light" : "dark"} />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 py-4 flex-row justify-between items-center">
          <View>
            <Text className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              Welcome back,
            </Text>
            <Text className="text-2xl font-bold text-slate-900 dark:text-white">
              Global Pay
            </Text>
          </View>
        </View>

        {/* Carousel Placeholder / Native ScrollView */}
        <View className="mt-2 h-[200px]">
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
          >
            {CAROUSEL_DATA.map((item) => (
              <View
                key={item.id}
                style={{ width }}
                className="justify-center px-6"
              >
                <View className="flex-1 rounded-3xl overflow-hidden relative shadow-lg">
                  <Image
                    source={{ uri: item.image }}
                    className="absolute w-full h-full"
                    resizeMode="cover"
                  />
                  <View className="absolute w-full h-full bg-black/40" />
                  <View className="absolute bottom-0 left-0 p-6 w-full">
                    <Text className="text-white font-bold text-2xl mb-1">
                      {item.title}
                    </Text>
                    <Text className="text-slate-200 font-medium">
                      {item.subtitle}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Categories & Cards */}
        <View className="mt-8 px-6 pb-20">
          {CATEGORIES.map((category, idx) => (
            <View key={idx} className="mb-8">
              <View className="flex-row justify-between items-end mb-4">
                <Text className="text-xl font-bold text-slate-900 dark:text-white">
                  {category.title}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    router.push(
                      `/category/${encodeURIComponent(category.title)}`,
                    )
                  }
                >
                  <Text className="text-emerald-500 font-semibold text-sm">
                    See All
                  </Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="-mx-2"
              >
                {category.items.map((sub) => (
                  <SubscriptionCard key={sub.id} item={sub} isGrid={false} />
                ))}
              </ScrollView>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
