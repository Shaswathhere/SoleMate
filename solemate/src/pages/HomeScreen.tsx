"use client"

import React, { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  StatusBar,
  ActivityIndicator,
  Image,
  type ListRenderItem,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { type NavigationProp, useFocusEffect } from "@react-navigation/native"
import type { RootStackParamList } from "../../App"
import { useProducts, ShoeData } from './ProductContext';

interface Category {
  id: string
  name: string
  icon: keyof typeof Ionicons.glyphMap
}

interface HomeScreenProps {
  navigation: NavigationProp<RootStackParamList, "Home">
}

const categories: Category[] = [
  { id: "all", name: "All", icon: "grid" },
  { id: "running", name: "Running", icon: "walk" },
  { id: "lifestyle", name: "Lifestyle", icon: "shirt" },
  { id: "football", name: "Football", icon: "football" },
  { id: "basketball", name: "Basketball", icon: "basketball" },
  { id: "tennis", name: "Tennis", icon: "tennisball" },
  { id: "badminton", name: "Badminton", icon: "baseball" },
]

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { products, loading, error } = useProducts();
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [currentRoute, setCurrentRoute] = useState<string>("Home")

  useFocusEffect(
    React.useCallback(() => {
      const state = navigation.getState()
      const route = state?.routes?.[state.index]?.name || "Home"
      setCurrentRoute(route)
    }, [navigation]),
  )

  const toggleFavorite = (shoeId: string): void => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(shoeId)) {
      newFavorites.delete(shoeId)
    } else {
      newFavorites.add(shoeId)
    }
    setFavorites(newFavorites)
  }

  const formatPrice = (price: number): string => `₹ ${price.toLocaleString("en-IN")}`

  const renderShoeCard: ListRenderItem<ShoeData> = ({ item }) => (
    <TouchableOpacity style={styles.shoeCard} activeOpacity={0.8}>
      <TouchableOpacity style={styles.favoriteButton} onPress={() => toggleFavorite(item.ShoeId)} activeOpacity={0.7}>
        <Ionicons
          name={favorites.has(item.ShoeId) ? "heart" : "heart-outline"}
          size={20}
          color={favorites.has(item.ShoeId) ? "#FF6B6B" : "#999"}
        />
      </TouchableOpacity>

      <Image source={{ uri: item.imageUrl }} style={styles.shoeImage} />

      <View style={styles.shoeInfo}>
        <Text style={styles.shoeBrand}>{item.Brand}</Text>
        <Text style={styles.shoeName} numberOfLines={2}>
          {item.ShoeName}
        </Text>
        <Text style={styles.shoePrice}>{formatPrice(item.Price)}</Text>
      </View>
    </TouchableOpacity>
  )

  const renderCategoryButton = (category: Category): React.ReactElement => (
    <TouchableOpacity
      key={category.id}
      style={[styles.categoryButton, selectedCategory === category.id && styles.categoryButtonActive]}
      onPress={() => setSelectedCategory(category.id)}
    >
      <Ionicons name={category.icon} size={20} color={selectedCategory === category.id ? "#fff" : "#666"} />
      <Text style={[styles.categoryText, selectedCategory === category.id && styles.categoryTextActive]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  )

  const filteredProducts = products.filter(shoe => {
    const matchesCategory = selectedCategory === 'all' || shoe.category.toLowerCase() === selectedCategory;
    const matchesSearch = shoe.ShoeName.toLowerCase().includes(searchQuery.toLowerCase()) || shoe.Brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for shoes..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.banner}>
            <View style={styles.bannerContent}>
              <Text style={styles.bannerTitle}>SoleMate Collections</Text>
              <Text style={styles.bannerSubtitle}>Find your perfect pair today.</Text>
              <TouchableOpacity style={styles.shopNowButton}>
                <Text style={styles.shopNowText}>EXPLORE</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.bannerImage}>
              <Ionicons name="footsteps" size={60} color="rgba(255,255,255,0.8)" />
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Categories</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContainer}>
              {categories.map(renderCategoryButton)}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>For You</Text>
            {loading ? (
              <ActivityIndicator size="large" color="#4A90E2" style={{ marginTop: 50 }} />
            ) : error ? (
              <Text style={styles.errorText}>Failed to load products. Please try again later.</Text>
            ) : (
              <FlatList
                data={filteredProducts}
                renderItem={renderShoeCard}
                keyExtractor={(item) => item.ShoeId}
                numColumns={2}
                columnWrapperStyle={styles.row}
                scrollEnabled={false}
              />
            )}
          </View>
        </View>
      </ScrollView>


      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Home")}>
          <Ionicons name="home" size={24} color={currentRoute === "Home" ? "#4A90E2" : "#999"} />
          <Text style={[styles.navText, { color: currentRoute === "Home" ? "#4A90E2" : "#999" }]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="grid-outline" size={24} color="#999" />
          <Text style={styles.navText}>Categories</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="heart-outline" size={24} color="#999" />
          <Text style={styles.navText}>Wishlist</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Profile")}>
          <Ionicons name="person-outline" size={24} color={currentRoute === "Profile" ? "#4A90E2" : "#999"} />
          <Text style={[styles.navText, { color: currentRoute === "Profile" ? "#4A90E2" : "#999" }]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: {
    paddingHorizontal: 16,
    paddingTop: StatusBar.currentHeight || 20,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f2f5",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, color: "#333" },
  content: { paddingHorizontal: 16, paddingTop: 16 },
  banner: {
    backgroundColor: "#4A90E2",
    borderRadius: 16,
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  bannerContent: { flex: 1 },
  bannerTitle: { color: "#fff", fontSize: 20, fontWeight: "bold", marginBottom: 6 },
  bannerSubtitle: { color: "rgba(255,255,255,0.9)", fontSize: 14, marginBottom: 16 },
  shopNowButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  shopNowText: { color: "#4A90E2", fontSize: 14, fontWeight: "bold" },
  bannerImage: { marginLeft: 16 },
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", color: "#333" },
  seeAllText: { color: "#4A90E2", fontSize: 14, fontWeight: '500' },
  categoriesContainer: { paddingBottom: 10, paddingRight: 16 },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0'
  },
  categoryButtonActive: { backgroundColor: "#4A90E2", borderColor: '#4A90E2' },
  categoryText: { marginLeft: 8, fontSize: 14, color: "#666" },
  categoryTextActive: { color: "#fff", fontWeight: '500' },
  row: { justifyContent: "space-between" },
  shoeCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    width: "48%",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  favoriteButton: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 1,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  shoeImage: {
    width: '100%',
    height: 140,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  shoeInfo: { padding: 12 },
  shoeBrand: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  shoeName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    height: 34,
  },
  shoePrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4A90E2",
  },
  errorText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666'
  },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
  },
  navItem: { flex: 1, alignItems: "center", paddingVertical: 4 },
  navText: { fontSize: 10, marginTop: 2, color: "#999" },
});

export default HomeScreen;