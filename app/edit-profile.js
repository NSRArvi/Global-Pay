import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

export default function EditProfileScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const { user, refetchUser } = useAuth(); // We'll need to add refetchUser to context if it doesn't exist, or just use session updates

  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || "");
  const [phone, setPhone] = useState(user?.user_metadata?.phone || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!fullName.trim() || !phone.trim()) {
      alert("Please enter both your name and phone number.");
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: fullName.trim(),
        phone: phone.trim(),
      }
    });
    setIsLoading(false);

    if (error) {
      alert(error.message);
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-950">
      <StatusBar style={isDark ? "light" : "dark"} />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        className="flex-1"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 p-6">
            
            {/* Header/Back Button */}
            <View className="mb-8 flex-row items-center">
              <TouchableOpacity 
                className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 items-center justify-center mr-4"
                onPress={() => router.back()}
              >
                <Ionicons name="arrow-back" size={20} color={isDark ? "#f8fafc" : "#0f172a"} />
              </TouchableOpacity>
              <Text className="text-2xl font-bold text-slate-900 dark:text-white">
                Edit Profile
              </Text>
            </View>

            <View className="flex-1">
              {/* Full Name Input */}
              <Text className="text-slate-700 dark:text-slate-300 font-bold mb-2 ml-1">
                Full Name
              </Text>
              <View className="flex-row items-center bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 px-4 py-4 mb-6">
                <Ionicons name="person-outline" size={20} color={isDark ? "#94a3b8" : "#64748b"} className="mr-3" />
                <TextInput
                  className="flex-1 text-base text-slate-900 dark:text-white ml-2"
                  placeholder="John Doe"
                  placeholderTextColor={isDark ? "#475569" : "#94a3b8"}
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>

              {/* Phone Input */}
              <Text className="text-slate-700 dark:text-slate-300 font-bold mb-2 ml-1">
                Phone Number
              </Text>
              <View className="flex-row items-center bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 px-4 py-4 mb-8">
                <Ionicons name="call-outline" size={20} color={isDark ? "#94a3b8" : "#64748b"} className="mr-3" />
                <TextInput
                  className="flex-1 text-base text-slate-900 dark:text-white ml-2"
                  placeholder="01712345678"
                  placeholderTextColor={isDark ? "#475569" : "#94a3b8"}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>

              {/* Save Button */}
              <TouchableOpacity 
                onPress={handleSave}
                className="bg-emerald-500 py-4 rounded-2xl items-center shadow-sm shadow-emerald-200 dark:shadow-emerald-900/20"
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text className="font-bold text-lg text-white">Save Changes</Text>
                )}
              </TouchableOpacity>
            </View>

          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
