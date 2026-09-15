import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { supabase } from "../lib/supabase";
import CategoryRow from "./CategoryRow";
import CategorySkeleton from "./skeleton/CategorySkeleton";

export default function DynamicCategories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.from("categories").select(`
          id,
          title,
          services (
            id,
            name,
            price,
            domain,
            image
          )
        `);

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="mt-8 px-6 pb-20">
      {isLoading ? (
        <>
          <CategorySkeleton />
          <CategorySkeleton />
        </>
      ) : (
        categories.map((category) => (
          <CategoryRow key={category.id} category={category} />
        ))
      )}
    </View>
  );
}
