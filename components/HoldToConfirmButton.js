import React, { useRef, useState } from 'react';
import { View, Text, TouchableWithoutFeedback, Animated, Vibration } from 'react-native';

export default function HoldToConfirmButton({ onConfirm, isDark, disabled }) {
  const [isHolding, setIsHolding] = useState(false);
  const fillAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    if (disabled) return;
    
    setIsHolding(true);
    Animated.timing(fillAnim, {
      toValue: 100,
      duration: 1500, // 1.5 seconds to hold
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        Vibration.vibrate(100); // Small haptic feedback when confirmed
        onConfirm();
      }
    });
  };

  const handlePressOut = () => {
    if (disabled) return;
    
    setIsHolding(false);
    Animated.timing(fillAnim, {
      toValue: 0,
      duration: 200, // Quick reset
      useNativeDriver: false,
    }).start();
  };

  const widthInterpolation = fillAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <TouchableWithoutFeedback onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <View className={`h-16 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 relative flex-row justify-center items-center w-full shadow-sm mt-4 ${disabled ? 'opacity-50' : 'opacity-100'}`}>
        
        {/* Animated fill background */}
        <Animated.View 
          className="absolute left-0 top-0 bottom-0 bg-emerald-500" 
          style={{ width: widthInterpolation }} 
        />
        
        <Text className={`font-bold text-lg z-10 ${isHolding ? 'text-white' : 'text-slate-600 dark:text-slate-300'}`}>
          {disabled ? 'Complete Fields to Confirm' : 'Tap and Hold to Confirm'}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
}
