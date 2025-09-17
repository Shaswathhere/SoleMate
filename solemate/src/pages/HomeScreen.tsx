import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  SafeAreaView,
  StatusBar,
  ListRenderItem,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// TypeScript interfaces
interface ShoeData {
  ShoeId: string;
  ShoeName: string;
  Description: string;
  Price: number;
  imageUrl: string;
  category: string;
  createdAt: string;
  Brand: string;
  SellerName: string;
  SellerID: string;
}

interface Category {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
}

// Sample JSON data structure
const shoesData: ShoeData[] = [
  {
    ShoeId: "1",
    ShoeName: "adidas Multix Originals Shoes Sep...",
    Description: "Comfortable running shoes with modern design",
    Price: 235000,
    imageUrl: "https://placeholder.co/150x150/cccccc/666666?text=Shoe+1",
    category: "running",
    createdAt: "2024-01-15T08:30:00Z",
    Brand: "Adidas",
    SellerName: "SportZone",
    SellerID: "seller_001"
  },
  {
    ShoeId: "2",
    ShoeName: "Mizuno Original Thunder Blade 2 Mi...",
    Description: "Professional volleyball shoes with excellent grip",
    Price: 235000,
    imageUrl: "https://placeholder.co/150x150/cccccc/666666?text=Shoe+2",
    category: "volleyball",
    createdAt: "2024-01-14T10:15:00Z",
    Brand: "Mizuno",
    SellerName: "Athletic Pro",
    SellerID: "seller_002"
  },
  {
    ShoeId: "3",
    ShoeName: "Lining Ranger IV Drive AYTO 053 / AYTO0...",
    Description: "Badminton shoes with superior court performance",
    Price: 235000,
    imageUrl: "https://placeholder.co/150x150/cccccc/666666?text=Shoe+3",
    category: "badminton",
    createdAt: "2024-01-13T14:22:00Z",
    Brand: "Li-Ning",
    SellerName: "Racquet World",
    SellerID: "seller_003"
  },
  {
    ShoeId: "4",
    ShoeName: "Ardmore Flat Shoes Grey - Sepatu Wanita",
    Description: "Elegant flat shoes for everyday comfort",
    Price: 235000,
    imageUrl: "https://placeholder.co/150x150/cccccc/666666?text=Shoe+4",
    category: "lifestyle",
    createdAt: "2024-01-12T09:45:00Z",
    Brand: "Ardmore",
    SellerName: "Fashion Steps",
    SellerID: "seller_004"
  },
  {
    ShoeId: "5",
    ShoeName: "Ortuseight Iemario da silva",
    Description: "Football boots with professional grade quality",
    Price: 235000,
    imageUrl: "https://placeholder.co/150x150/cccccc/666666?text=Shoe+5",
    category: "football",
    createdAt: "2024-01-11T16:30:00Z",
    Brand: "Ortuseight",
    SellerName: "Goal Keeper",
    SellerID: "seller_005"
  },
  {
    ShoeId: "6",
    ShoeName: "Nike Renew Elevate III DD9304-003 BNIB",
    Description: "Basketball shoes with Renew foam technology",
    Price: 235000,
    imageUrl: "https://placeholder.co/150x150/cccccc/666666?text=Shoe+6",
    category: "lifestyle",
    createdAt: "2024-01-10T11:20:00Z",
    Brand: "Nike",
    SellerName: "Swoosh Store",
    SellerID: "seller_006"
  },
  {
    ShoeId: "7",
    ShoeName: "910 Nineten Geist Ekiden Hitam Premium",
    Description: "Premium running shoes for marathon performance",
    Price: 235000,
    imageUrl: "https://placeholder.co/150x150/cccccc/666666?text=Shoe+7",
    category: "running",
    createdAt: "2024-01-09T13:55:00Z",
    Brand: "910 Nineten",
    SellerName: "Runner's Paradise",
    SellerID: "seller_007"
  },
  {
    ShoeId: "8",
    ShoeName: "Mizuno Original Thunder Blade 2 Mi...",
    Description: "High-performance badminton shoes",
    Price: 235000,
    imageUrl: "https://placeholder.co/150x150/cccccc/666666?text=Shoe+8",
    category: "badminton",
    createdAt: "2024-01-08T12:10:00Z",
    Brand: "Mizuno",
    SellerName: "Court Masters",
    SellerID: "seller_008"
  }
];

const categories: Category[] = [
  { id: 'running', name: 'Running', icon: 'walk' },
  { id: 'lifestyle', name: 'Lifestyle', icon: 'shirt' },
  { id: 'football', name: 'Football', icon: 'football' },
  { id: 'volleyball', name: 'Volleyball', icon: 'basketball' },
  { id: 'tennis', name: 'Tennis', icon: 'tennisball' },
  { id: 'badminton', name: 'Badminton', icon: 'baseball' },
];

const ShoeShoppingApp: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (shoeId: string): void => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(shoeId)) {
      newFavorites.delete(shoeId);
    } else {
      newFavorites.add(shoeId);
    }
    setFavorites(newFavorites);
  };

  const formatPrice = (price: number): string => {
    return `Rp. ${price.toLocaleString('id-ID')}`;
  };

  const renderStars = (rating: number = 4.5): React.ReactElement[] => {
    const stars: React.ReactElement[] = [];
    const fullStars: number = Math.floor(rating);
    const hasHalfStar: boolean = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons key={i} name="star" size={12} color="#FFD700" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={12} color="#FFD700" />
      );
    }

    const remainingStars: number = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Ionicons key={`empty-${i}`} name="star-outline" size={12} color="#FFD700" />
      );
    }

    return stars;
  };

  const renderShoeCard: ListRenderItem<ShoeData> = ({ item }) => (
    <TouchableOpacity style={styles.shoeCard} activeOpacity={0.8}>
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => toggleFavorite(item.ShoeId)}
        activeOpacity={0.7}
      >
        <Ionicons
          name={favorites.has(item.ShoeId) ? "heart" : "heart-outline"}
          size={20}
          color={favorites.has(item.ShoeId) ? "#FF6B6B" : "#999"}
        />
      </TouchableOpacity>
      
      <View style={styles.imageContainer}>
        <View style={styles.placeholderImage}>
          <Ionicons name="footsteps" size={40} color="#ccc" />
        </View>
      </View>
      
      <View style={styles.shoeInfo}>
        <Text style={styles.shoeName} numberOfLines={2}>
          {item.ShoeName}
        </Text>
        
        <View style={styles.ratingContainer}>
          {renderStars()}
          <Text style={styles.ratingText}>4.5</Text>
        </View>
        
        <Text style={styles.shoePrice}>
          {formatPrice(item.Price)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryButton = (category: Category): React.ReactElement => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryButton,
        selectedCategory === category.id && styles.categoryButtonActive
      ]}
      onPress={() => setSelectedCategory(category.id)}
    >
      <Ionicons
        name={category.icon}
        size={20}
        color={selectedCategory === category.id ? '#fff' : '#666'}
      />
      <Text style={[
        styles.categoryText,
        selectedCategory === category.id && styles.categoryTextActive
      ]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Puma, Running, Training..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.content}>
          <View style={styles.banner}>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>New Collections!</Text>
            <Text style={styles.bannerSubtitle}>
              50% Discount on the first collection
            </Text>
            <TouchableOpacity style={styles.shopNowButton}>
              <Text style={styles.shopNowText}>SHOP NOW</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bannerImage}>
            <Ionicons name="footsteps" size={60} color="rgba(255,255,255,0.8)" />
          </View>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.categoriesContainer}>
            {categories.map(renderCategoryButton)}
          </View>
        </View>

        {/* For You Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>For you</Text>
          
          <FlatList
            data={shoesData}
            renderItem={renderShoeCard}
            keyExtractor={(item) => item.ShoeId}
            numColumns={2}
            columnWrapperStyle={styles.row}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={false}
          />
        </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={24} color="#4A90E2" />
          <Text style={[styles.navText, { color: '#4A90E2' }]}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="grid-outline" size={24} color="#999" />
          <Text style={styles.navText}>Categories</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="heart-outline" size={24} color="#999" />
          <Text style={styles.navText}>Wishlist</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person-outline" size={24} color="#999" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    // borderColor: '#4A90E2',
    // borderStyle: 'dashed',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  content: {
    paddingHorizontal: 16,
  },
  banner: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bannerSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    marginBottom: 12,
  },
  shopNowButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  shopNowText: {
    color: '#4A90E2',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bannerImage: {
    marginLeft: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    color: '#4A90E2',
    fontSize: 14,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 0,
    justifyContent: 'space-around',
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#4A90E2',
  },
  categoryText: {
    marginLeft: 6,
    fontSize: 12,
    color: '#666',
  },
  categoryTextActive: {
    color: '#fff',
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 0,
  },
  shoeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    width: '48%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shoeInfo: {
    alignItems: 'flex-start',
  },
  shoeName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
    lineHeight: 18,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  shoePrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingBottom: 20, // Extra padding for bottom safe area
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  navText: {
    fontSize: 10,
    marginTop: 2,
    color: '#999',
  },
});

export default ShoeShoppingApp;