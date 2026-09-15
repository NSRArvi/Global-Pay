import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, Stack, useLocalSearchParams } from "expo-router";
import { supabase } from "../lib/supabase";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";

export default function LoginScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const { defaultEmail } = useLocalSearchParams();

  const [step, setStep] = useState(defaultEmail ? "otp" : "email"); // "email" | "otp"
  const [email, setEmail] = useState(defaultEmail || "");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);

  const otpRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  // Automatically trigger OTP if defaultEmail is passed (e.g. from checkout)
  useEffect(() => {
    if (defaultEmail && step === "otp") {
      triggerOtp(defaultEmail);
    }
  }, [defaultEmail]);

  const triggerOtp = async (targetEmail) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email: targetEmail });
    console.log(error);
    setIsLoading(false);
    if (error) {
      alert(error.message);
      setStep("email");
    } else {
      setStep("otp");
    }
  };

  const handleContinue = () => {
    if (email.trim() && email.includes("@")) {
      triggerOtp(email);
    } else {
      alert("Please enter a valid email address.");
    }
  };

  const handleOtpChange = (text, index) => {
    // If text is empty (user deleted)
    if (text === "") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    const cleanText = text.replace(/[^0-9]/g, "");
    if (!cleanText) return;

    // Handle paste or fast multi-digit typing
    if (cleanText.length > 1) {
      const newOtp = [...otp];
      let charIndex = 0;
      // Distribute the pasted digits starting from the current box
      for (let i = index; i < 6 && charIndex < cleanText.length; i++) {
        newOtp[i] = cleanText[charIndex];
        charIndex++;
      }
      setOtp(newOtp);
      const nextFocus = Math.min(index + cleanText.length, 5);
      otpRefs[nextFocus].current?.focus();
      return;
    }

    // Handle single digit typing
    const newOtp = [...otp];
    // Always take the last typed character in case of weird fast typing
    newOtp[index] = cleanText.slice(-1);
    setOtp(newOtp);

    // Auto-advance
    if (index < 5) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyPress = ({ nativeEvent }, index) => {
    if (nativeEvent.key === "Backspace" && otp[index] === "" && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length === 6) {
      setIsLoading(true);
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: "email",
      });
      setIsLoading(false);

      if (error) {
        alert(error.message);
      } else {
        // Navigate back to the account tab
        router.replace("/(tabs)/account");
      }
    } else {
      alert("Please enter a valid 6-digit code.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-950">
      <Stack.Screen
        options={{ headerShown: false, animation: "slide_from_right" }}
      />
      <StatusBar style={isDark ? "light" : "dark"} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 px-6 pt-10 pb-6">
            {/* Header/Back Button */}
            <View className="mb-10">
              <TouchableOpacity
                className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 items-center justify-center"
                onPress={() =>
                  step === "otp" && !defaultEmail ? setStep("email") : router.replace("/(tabs)")
                }
              >
                <Ionicons
                  name="arrow-back"
                  size={20}
                  color={isDark ? "#f8fafc" : "#0f172a"}
                />
              </TouchableOpacity>
            </View>

            {step === "email" ? (
              // STEP 1: EMAIL
              <View className="flex-1 justify-center pb-20">
                {/* Top Image / Icon */}
                <View className="items-center mb-8">
                  <View className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full items-center justify-center shadow-sm border-4 border-white dark:border-slate-950">
                    <Ionicons
                      name="shield-checkmark"
                      size={48}
                      color="#10b981"
                    />
                  </View>
                </View>

                <Text className="text-3xl font-bold text-slate-900 dark:text-white mb-2 text-center">
                  Welcome Back
                </Text>
                <Text className="text-slate-500 dark:text-slate-400 mb-8 text-base text-center px-4">
                  Enter your email address to securely access your account.
                </Text>

                <View className="flex-row items-center bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 px-4 py-4 mb-6">
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color={isDark ? "#94a3b8" : "#64748b"}
                    className="mr-3"
                  />
                  <TextInput
                    className="flex-1 text-base text-slate-900 dark:text-white ml-2"
                    placeholder="name@example.com"
                    placeholderTextColor={isDark ? "#475569" : "#94a3b8"}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>

                <TouchableOpacity
                  onPress={handleContinue}
                  className={`py-4 rounded-2xl items-center mb-4 ${email.includes("@") && !isLoading ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-800"}`}
                  disabled={!email.includes("@") || isLoading}
                >
                  <Text
                    className={`font-bold text-lg ${email.includes("@") && !isLoading ? "text-white" : "text-slate-400 dark:text-slate-600"}`}
                  >
                    {isLoading ? "Sending Code..." : "Continue with Email"}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              // STEP 2: OTP
              <View className="flex-1 justify-center pb-20">
                {/* Top Image / Icon */}
                <View className="items-center mb-8">
                  <View className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full items-center justify-center shadow-sm border-4 border-white dark:border-slate-950">
                    <Ionicons name="mail-open" size={48} color="#10b981" />
                  </View>
                </View>

                <Text className="text-3xl font-bold text-slate-900 dark:text-white mb-2 text-center">
                  Verify Email
                </Text>
                <Text className="text-slate-500 dark:text-slate-400 mb-8 text-base text-center px-4">
                  Enter the 6-digit code sent to{"\n"}
                  <Text className="font-bold text-slate-900 dark:text-white">
                    {email}
                  </Text>
                </Text>

                <View className="flex-row justify-center mb-8 px-1">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <TextInput
                      key={index}
                      ref={otpRefs[index]}
                      className="w-12 h-14 mx-1 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-center text-xl font-bold text-slate-900 dark:text-white"
                      keyboardType="number-pad"
                      maxLength={6}
                      textContentType="oneTimeCode"
                      autoComplete="one-time-code"
                      value={otp[index]}
                      onChangeText={(text) => handleOtpChange(text, index)}
                      onKeyPress={(e) => handleOtpKeyPress(e, index)}
                    />
                  ))}
                </View>

                <TouchableOpacity
                  onPress={handleVerify}
                  className={`py-4 rounded-2xl items-center mb-6 ${otp.join("").length === 6 && !isLoading ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-800"}`}
                  disabled={otp.join("").length !== 6 || isLoading}
                >
                  <Text
                    className={`font-bold text-lg ${otp.join("").length === 6 && !isLoading ? "text-white" : "text-slate-400 dark:text-slate-600"}`}
                  >
                    {isLoading ? "Verifying..." : "Verify & Login"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="items-center"
                  onPress={() => triggerOtp(email)}
                >
                  <Text className="text-emerald-500 font-semibold text-base">
                    Resend Code
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
