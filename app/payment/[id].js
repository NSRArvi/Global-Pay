import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  Linking,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { CATEGORIES } from "../../data/mockData";
import { StatusBar } from "expo-status-bar";
import HoldToConfirmButton from "../../components/HoldToConfirmButton";

export default function PaymentScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("bkash");
  const [transactionId, setTransactionId] = useState("");

  // Find item by ID across all categories
  let item = null;
  for (const cat of CATEGORIES) {
    const found = cat.items.find((i) => i.id === id);
    if (found) {
      item = found;
      break;
    }
  }

  if (!item) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950 items-center justify-center">
        <Text className="text-slate-900 dark:text-white">Item not found.</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4 p-2">
          <Text className="text-emerald-500 font-bold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Parse price logic: $15/mo -> 15
  const rawPriceStr = item.price.replace(/[^0-9.]/g, "");
  const usdPrice = parseFloat(rawPriceStr) || 0;

  // Math logic
  const BDT_RATE = 120;
  const baseBdt = usdPrice * BDT_RATE;
  const platformFee = baseBdt * 0.1; // 10% fee
  const totalBdt = baseBdt + platformFee;

  const isValid =
    name.trim() !== "" &&
    email.trim() !== "" &&
    phone.length === 10 &&
    transactionId.trim() !== "";

  const handleConfirmPurchase = async () => {
    const FORMSPREE_ENDPOINT = "https://formspree.io/f/mdeorqvn";

    const orderData = {
      subject: `New Order: ${item.name} from ${name}`,
      item: item.name,
      basePriceUSD: usdPrice,
      totalPaidBDT: totalBdt.toFixed(2),
      paymentMethod: paymentMethod.toUpperCase(),
      transactionId: transactionId,
      customerName: name,
      customerEmail: email,
      customerPhone: `+880${phone}`,
    };

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) throw new Error("Network response was not ok");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      Alert.alert(
        "Order Placed!",
        `Your order for ${item.name} has been received. Our agent will reach you within 30 minutes to 1 hour.`,
        [{ text: "OK", onPress: () => router.navigate("/(tabs)") }],
      );
    } catch (e) {
      Alert.alert(
        "Error",
        "Could not submit your order. Please check your internet connection and try again.",
      );
    }
  };

  const PaymentChip = ({ method, label }) => {
    const isSelected = paymentMethod === method;
    return (
      <TouchableOpacity
        onPress={() => setPaymentMethod(method)}
        className={`px-4 py-3 rounded-xl border ${isSelected ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20" : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"} mr-2`}
      >
        <Text
          className={`font-bold ${isSelected ? "text-emerald-600 dark:text-emerald-400" : "text-slate-700 dark:text-slate-300"}`}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      className="flex-1 bg-slate-50 dark:bg-slate-950"
      edges={["top"]}
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Header */}
      <View className="px-4 py-4 flex-row items-center border-b border-slate-200 dark:border-slate-800">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 -ml-2 rounded-full active:bg-slate-200 dark:active:bg-slate-800"
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={isDark ? "#fff" : "#0f172a"}
          />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-slate-900 dark:text-white flex-1">
          Checkout
        </Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-6 py-6"
          showsVerticalScrollIndicator={false}
        >
          {/* Item Summary */}
          <View className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 mb-6 flex-row items-center">
            <View className="w-14 h-14 rounded-2xl overflow-hidden mr-4 bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700">
              <Image
                source={{ uri: item.image }}
                style={{ width: 36, height: 36 }}
                resizeMode="contain"
              />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-xl text-slate-900 dark:text-white mb-1">
                {item.name}
              </Text>
              <Text className="text-slate-500 dark:text-slate-400 font-medium">
                {item.price} ({usdPrice} USD)
              </Text>
            </View>
          </View>

          {/* Form */}
          <Text className="text-lg font-bold text-slate-900 dark:text-white mb-4">
            Customer Details
          </Text>

          <View className="mb-4">
            <Text className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">
              Full Name
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g. John Doe"
              placeholderTextColor={isDark ? "#475569" : "#94a3b8"}
              className="bg-white dark:bg-slate-900 px-4 py-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
            />
          </View>

          <View className="mb-4">
            <Text className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">
              Email Address
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="e.g. name@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={isDark ? "#475569" : "#94a3b8"}
              className="bg-white dark:bg-slate-900 px-4 py-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
            />
          </View>

          <View className="mb-8">
            <Text className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">
              Phone Number
            </Text>
            <View className="flex-row items-center">
              <View className="bg-slate-200 dark:bg-slate-800 px-4 py-4 rounded-l-xl border border-r-0 border-slate-200 dark:border-slate-700">
                <Text className="font-bold text-slate-700 dark:text-slate-300">
                  +880
                </Text>
              </View>
              <TextInput
                value={phone}
                onChangeText={(text) =>
                  setPhone(text.replace(/[^0-9]/g, "").slice(0, 10))
                }
                placeholder="1XXXXXXXXX"
                keyboardType="numeric"
                maxLength={10}
                placeholderTextColor={isDark ? "#475569" : "#94a3b8"}
                className="flex-1 bg-white dark:bg-slate-900 px-4 py-4 rounded-r-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
              />
            </View>
            <Text className="text-xs text-slate-400 mt-1">
              Enter remaining 10 digits
            </Text>
          </View>

          {/* Payment Method */}
          <Text className="text-lg font-bold text-slate-900 dark:text-white mb-4">
            Payment Method
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-6 flex-row"
          >
            <PaymentChip method="bkash" label="bKash" />
            <PaymentChip method="nagad" label="Nagad" />
            <PaymentChip method="rocket" label="Rocket" />
          </ScrollView>

          <View className="mb-8">
            <Text className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">
              Transaction ID
            </Text>
            <TextInput
              value={transactionId}
              onChangeText={setTransactionId}
              placeholder="e.g. TRX123456789"
              placeholderTextColor={isDark ? "#475569" : "#94a3b8"}
              className="bg-white dark:bg-slate-900 px-4 py-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
            />
            <Text className="text-xs text-slate-400 mt-1">
              Enter the transaction ID after sending money.
            </Text>
          </View>

          {/* Pricing Summary */}
          <View className="bg-slate-100 dark:bg-slate-800/50 p-5 rounded-2xl mb-6">
            <View className="flex-row justify-between mb-2">
              <Text className="text-slate-600 dark:text-slate-400">
                Base Price (USD {usdPrice})
              </Text>
              <Text className="font-medium text-slate-900 dark:text-white">
                ৳ {baseBdt.toFixed(2)}
              </Text>
            </View>
            <View className="flex-row justify-between mb-2 border-b border-slate-200 dark:border-slate-700 pb-4">
              <Text className="text-slate-600 dark:text-slate-400">
                Platform Fee (10%)
              </Text>
              <Text className="font-medium text-slate-900 dark:text-white">
                ৳ {platformFee.toFixed(2)}
              </Text>
            </View>
            <View className="flex-row justify-between mt-2">
              <Text className="font-bold text-lg text-slate-900 dark:text-white">
                Total
              </Text>
              <Text className="font-bold text-xl text-emerald-600 dark:text-emerald-400">
                ৳ {totalBdt.toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Confirm Instructions */}
          <View className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl mb-8 flex-row items-center border border-blue-100 dark:border-blue-900/50">
            <Ionicons
              name="information-circle"
              size={24}
              color="#3b82f6"
              className="mr-3"
            />
            <Text className="flex-1 ml-3 text-blue-800 dark:text-blue-300 text-sm font-medium leading-5">
              Confirm within 30 minutes to 1 hour purchase will be done and our
              agent will reach customer.
            </Text>
          </View>

          {/* Hold to Confirm Button */}
          <HoldToConfirmButton
            onConfirm={handleConfirmPurchase}
            isDark={isDark}
            disabled={!isValid}
          />

          <View className="h-20" />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
