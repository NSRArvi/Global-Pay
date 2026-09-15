import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
  Animated,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Clipboard from "expo-clipboard";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { StatusBar } from "expo-status-bar";
import HoldToConfirmButton from "../../components/HoldToConfirmButton";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";

const getFavicon = (domain) =>
  `https://www.google.com/s2/favicons?sz=128&domain=${domain}`;

// --- SKELETON COMPONENT ---
const PaymentSkeleton = () => {
  const [pulseAnim] = useState(new Animated.Value(0.3));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [pulseAnim]);

  return (
    <View className="px-6 py-6">
      <View className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 mb-6 flex-row items-center">
        <Animated.View
          style={{ opacity: pulseAnim }}
          className="w-14 h-14 rounded-2xl bg-slate-200 dark:bg-slate-800 mr-4"
        />
        <View className="flex-1">
          <Animated.View
            style={{ opacity: pulseAnim }}
            className="w-3/4 h-5 bg-slate-200 dark:bg-slate-800 rounded-md mb-2"
          />
          <Animated.View
            style={{ opacity: pulseAnim }}
            className="w-1/2 h-4 bg-slate-200 dark:bg-slate-800 rounded-md"
          />
        </View>
      </View>
      <Animated.View
        style={{ opacity: pulseAnim }}
        className="w-1/3 h-6 bg-slate-200 dark:bg-slate-800 rounded-md mb-4"
      />
      <Animated.View
        style={{ opacity: pulseAnim }}
        className="w-full h-14 bg-slate-200 dark:bg-slate-800 rounded-xl mb-4"
      />
      <Animated.View
        style={{ opacity: pulseAnim }}
        className="w-full h-14 bg-slate-200 dark:bg-slate-800 rounded-xl mb-4"
      />
    </View>
  );
};
// --------------------------

export default function PaymentScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const { user } = useAuth();

  // Form State
  const [name, setName] = useState(user?.user_metadata?.full_name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.user_metadata?.phone || "");

  // New Subscription Fields
  const [accountEmail, setAccountEmail] = useState("");
  const [orderType, setOrderType] = useState("New");
  const [duration, setDuration] = useState("1 Month");
  const [senderNumber, setSenderNumber] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("bkash");
  const [transactionId, setTransactionId] = useState("");
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false,
    transactionId: false,
    senderNumber: false,
  });

  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      console.error("Error fetching service:", error);
      setItem(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  if (isLoading) {
    return (
      <SafeAreaView
        className="flex-1 bg-slate-50 dark:bg-slate-950"
        edges={["top"]}
      >
        <StatusBar style={isDark ? "light" : "dark"} />
        <View className="px-4 py-4 flex-row items-center border-b border-slate-200 dark:border-slate-800">
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-2 -ml-2 rounded-full"
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
        <PaymentSkeleton />
      </SafeAreaView>
    );
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

  // Parse price logic: $15/mo -> 15 or numeric price
  const rawPriceStr = String(item.price || 0).replace(/[^0-9.]/g, "");
  const usdPrice = parseFloat(rawPriceStr) || 0;

  // Math logic
  const BDT_RATE = 120;
  const baseBdt = usdPrice * BDT_RATE;
  const platformFee = baseBdt * 0.1; // 10% fee
  const totalBdt = baseBdt + platformFee;

  const isValidEmail = (emailStr) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  };

  const isValid =
    name.trim() !== "" &&
    isValidEmail(email) &&
    phone.length === 10 &&
    senderNumber.length === 10 &&
    transactionId.trim() !== "";

  const handleConfirmPurchase = async () => {
    setIsSubmitting(true);
    const orderData = {
      customer_name: name,
      customer_email: email,
      customer_phone: `+880${phone}`,
      account_email: accountEmail || email, // fallback to customer email
      order_type: orderType,
      subscription_duration: duration,
      sender_number: `+880${senderNumber}`,
      additional_notes: additionalNotes,
      service_id: item.id,
      service_name: item.name,
      base_price_usd: usdPrice,
      total_paid_bdt: totalBdt,
      payment_method: paymentMethod.toUpperCase(),
      transaction_id: transactionId,
      status: "pending",
    };

    try {
      const { error } = await supabase.from("orders").insert([orderData]);

      if (error) {
        console.error("Supabase Insert Error:", error);
        throw new Error(error.message);
      }

      setIsSubmitting(false);
      
      if (!user) {
        // Auto-account creation flow for guests
        router.push({
          pathname: "/login",
          params: { defaultEmail: email }
        });
      } else {
        // Already authenticated
        router.push({
          pathname: "/payment-status",
          params: { status: "success", itemName: item.name },
        });
      }
    } catch (e) {
      setIsSubmitting(false);
      router.push({
        pathname: "/payment-status",
        params: { status: "error" },
      });
    }
  };

  const getPaymentImage = (method) => {
    switch (method) {
      case "bkash":
        return "https://logo.clearbit.com/bkash.com";
      case "nagad":
        return "https://logo.clearbit.com/nagad.com.bd";
      case "rocket":
        return "https://logo.clearbit.com/dutchbanglabank.com";
      default:
        return "https://logo.clearbit.com/google.com";
    }
  };

  const PaymentChip = ({ method, label }) => {
    const isSelected = paymentMethod === method;
    return (
      <TouchableOpacity
        onPress={() => setPaymentMethod(method)}
        className={`px-4 py-3 rounded-xl border flex-row items-center ${isSelected ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20" : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"} mr-2`}
      >
        <Image
          source={{ uri: getPaymentImage(method) }}
          style={{ width: 24, height: 24, marginRight: 8, borderRadius: 4 }}
          resizeMode="contain"
        />
        <Text
          className={`font-bold ${isSelected ? "text-emerald-600 dark:text-emerald-400" : "text-slate-700 dark:text-slate-300"}`}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const imageSource = item.image
    ? { uri: item.image }
    : item.domain
      ? { uri: getFavicon(item.domain) }
      : { uri: "https://via.placeholder.com/150" };

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
                source={imageSource}
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
              onBlur={() => handleBlur("name")}
              placeholder="e.g. John Doe"
              placeholderTextColor={isDark ? "#475569" : "#94a3b8"}
              className={`bg-white dark:bg-slate-900 px-4 py-4 rounded-xl border ${
                touched.name && name.trim() === ""
                  ? "border-red-500"
                  : "border-slate-200 dark:border-slate-700"
              } text-slate-900 dark:text-white font-medium`}
            />
            {touched.name && name.trim() === "" && (
              <Text className="text-red-500 text-xs mt-1 ml-1">
                Full name is required.
              </Text>
            )}
          </View>

          <View className="mb-4">
            <Text className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">
              Email Address
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              onBlur={() => handleBlur("email")}
              placeholder="e.g. name@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={isDark ? "#475569" : "#94a3b8"}
              className={`bg-white dark:bg-slate-900 px-4 py-4 rounded-xl border ${
                touched.email && !isValidEmail(email)
                  ? "border-red-500"
                  : "border-slate-200 dark:border-slate-700"
              } text-slate-900 dark:text-white font-medium`}
            />
            {touched.email && email.trim() === "" ? (
              <Text className="text-red-500 text-xs mt-1 ml-1">
                Email address is required.
              </Text>
            ) : touched.email && !isValidEmail(email) ? (
              <Text className="text-red-500 text-xs mt-1 ml-1">
                Please enter a valid email format.
              </Text>
            ) : null}
          </View>

          <View className="mb-8">
            <Text className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">
              Phone Number
            </Text>
            <View className="flex-row items-center">
              <View
                className={`bg-slate-200 dark:bg-slate-800 px-4 py-4 rounded-l-xl border border-r-0 ${
                  touched.phone && phone.length !== 10
                    ? "border-red-500"
                    : "border-slate-200 dark:border-slate-700"
                }`}
              >
                <Text className="font-bold text-slate-700 dark:text-slate-300">
                  +880
                </Text>
              </View>
              <TextInput
                value={phone}
                onChangeText={(text) =>
                  setPhone(text.replace(/[^0-9]/g, "").slice(0, 10))
                }
                onBlur={() => handleBlur("phone")}
                placeholder="1XXXXXXXXX"
                keyboardType="numeric"
                maxLength={10}
                placeholderTextColor={isDark ? "#475569" : "#94a3b8"}
                className={`flex-1 bg-white dark:bg-slate-900 px-4 py-4 rounded-r-xl border ${
                  touched.phone && phone.length !== 10
                    ? "border-red-500"
                    : "border-slate-200 dark:border-slate-700"
                } text-slate-900 dark:text-white font-medium`}
              />
            </View>
            {touched.phone && phone.length !== 10 ? (
              <Text className="text-red-500 text-xs mt-1 ml-1">
                Phone number must be exactly 10 digits.
              </Text>
            ) : phone.length !== 10 ? (
              <Text className="text-xs text-slate-400 mt-1 ml-1">
                Enter remaining 10 digits
              </Text>
            ) : null}
          </View>

          {/* Subscription Details */}
          <Text className="text-lg font-bold text-slate-900 dark:text-white mb-4 mt-2">
            Subscription Details
          </Text>

          <View className="mb-4">
            <Text className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">
              Order Type
            </Text>
            <View className="flex-row">
              <TouchableOpacity
                onPress={() => setOrderType("New")}
                className={`flex-1 py-3 items-center rounded-l-xl border ${orderType === "New" ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"}`}
              >
                <Text
                  className={`font-bold ${orderType === "New" ? "text-emerald-600 dark:text-emerald-400" : "text-slate-600 dark:text-slate-400"}`}
                >
                  New Account
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setOrderType("Renew")}
                className={`flex-1 py-3 items-center rounded-r-xl border border-l-0 ${orderType === "Renew" ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 border-l" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"}`}
              >
                <Text
                  className={`font-bold ${orderType === "Renew" ? "text-emerald-600 dark:text-emerald-400" : "text-slate-600 dark:text-slate-400"}`}
                >
                  Renew Existing
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">
              Service Account Email
            </Text>
            <TextInput
              value={accountEmail}
              onChangeText={setAccountEmail}
              placeholder="Email to use for this subscription"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={isDark ? "#475569" : "#94a3b8"}
              className="bg-white dark:bg-slate-900 px-4 py-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
            />
            <Text className="text-xs text-slate-400 mt-1 ml-1">
              Leave blank to use your contact email above.
            </Text>
          </View>

          {/* <View className="mb-8">
            <Text className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">
              Duration
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
              {['1 Month', '3 Months', '6 Months', '1 Year'].map(dur => (
                <TouchableOpacity 
                  key={dur}
                  onPress={() => setDuration(dur)}
                  className={`px-4 py-3 rounded-xl border mr-2 ${duration === dur ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'}`}
                >
                  <Text className={`font-bold ${duration === dur ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'}`}>{dur}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View> */}

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
              Send Money To
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={async () => {
                await Clipboard.setStringAsync("+880 1318214398");
                Alert.alert("Copied", "Payment number copied to clipboard!");
              }}
              className="bg-emerald-50 dark:bg-emerald-900/20 px-4 py-4 rounded-xl border border-emerald-100 dark:border-emerald-900/50 mb-4 flex-row items-center justify-between"
            >
              <View>
                <Text className="text-emerald-800 dark:text-emerald-300 font-bold text-lg tracking-wider">
                  +880 1318214398
                </Text>
                <Text className="text-emerald-600 dark:text-emerald-400 text-xs mt-1 font-medium">
                  Personal Account (Send Money)
                </Text>
              </View>
              <Ionicons name="copy-outline" size={20} color="#059669" />
            </TouchableOpacity>

            <Text className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">
              Sender{" "}
              {paymentMethod === "bkash"
                ? "bKash"
                : paymentMethod === "nagad"
                  ? "Nagad"
                  : "Rocket"}{" "}
              Number
            </Text>
            <View className="flex-row items-center mb-4">
              <View
                className={`bg-slate-200 dark:bg-slate-800 px-4 py-4 rounded-l-xl border border-r-0 ${
                  touched.senderNumber && senderNumber.length !== 10
                    ? "border-red-500"
                    : "border-slate-200 dark:border-slate-700"
                }`}
              >
                <Text className="font-bold text-slate-700 dark:text-slate-300">
                  +880
                </Text>
              </View>
              <TextInput
                value={senderNumber}
                onChangeText={(text) =>
                  setSenderNumber(text.replace(/[^0-9]/g, "").slice(0, 10))
                }
                onBlur={() => handleBlur("senderNumber")}
                placeholder="1XXXXXXXXX"
                keyboardType="numeric"
                maxLength={10}
                placeholderTextColor={isDark ? "#475569" : "#94a3b8"}
                className={`flex-1 bg-white dark:bg-slate-900 px-4 py-4 rounded-r-xl border ${
                  touched.senderNumber && senderNumber.length !== 10
                    ? "border-red-500"
                    : "border-slate-200 dark:border-slate-700"
                } text-slate-900 dark:text-white font-medium`}
              />
            </View>

            <Text className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">
              Transaction ID
            </Text>
            <TextInput
              value={transactionId}
              onChangeText={setTransactionId}
              onBlur={() => handleBlur("transactionId")}
              placeholder="e.g. TRX123456789"
              placeholderTextColor={isDark ? "#475569" : "#94a3b8"}
              className={`bg-white dark:bg-slate-900 px-4 py-4 rounded-xl border ${
                touched.transactionId && transactionId.trim() === ""
                  ? "border-red-500"
                  : "border-slate-200 dark:border-slate-700"
              } text-slate-900 dark:text-white font-medium`}
            />
            {touched.transactionId && transactionId.trim() === "" ? (
              <Text className="text-red-500 text-xs mt-1 ml-1">
                Transaction ID is required to verify payment.
              </Text>
            ) : (
              <Text className="text-xs text-slate-400 mt-1 ml-1">
                Enter the transaction ID after sending money.
              </Text>
            )}
          </View>

          <View className="mb-8">
            <Text className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">
              Additional Notes (Optional)
            </Text>
            <TextInput
              value={additionalNotes}
              onChangeText={setAdditionalNotes}
              placeholder="Any special requests or instructions..."
              placeholderTextColor={isDark ? "#475569" : "#94a3b8"}
              multiline
              numberOfLines={3}
              className="bg-white dark:bg-slate-900 px-4 py-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
              style={{ textAlignVertical: "top" }}
            />
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
            isSubmitting={isSubmitting}
          />

          <View className="h-20" />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
