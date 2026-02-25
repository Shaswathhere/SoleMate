"use client"

import React from "react"
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, StatusBar } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { TextInput } from "react-native"
import { useFocusEffect } from "@react-navigation/native"
import { useAuth } from "../auth/AuthContext"
import { SafeAreaView } from "react-native-safe-area-context"

interface ProfileScreenProps {
  navigation: any
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const [currentRouteName, setCurrentRouteName] = React.useState<string>("Profile")
  const [activeTab, setActiveTab] = React.useState<"Home" | "Profile">("Profile")
  const { logout } = useAuth()

  useFocusEffect(
    React.useCallback(() => {
      const state = navigation.getState?.()
      const routeName = state?.routes?.[state.index]?.name ?? "Profile"

      setCurrentRouteName(routeName)
      setActiveTab(routeName === "Home" ? "Home" : "Profile")
    }, [navigation]),
  )

  const navigateTo = (route: "Home" | "Profile") => {
    if (route === "Home" && activeTab === "Home") {
      return
    }

    if (route === "Profile" && currentRouteName === "Profile") {
      return
    }

    navigation.navigate(route)
  }

  const userProfile = {
    name: "John Doe",
    username: "@johndoe",
    profileImage: "https://i.pravatar.cc/150?img=1",
    email: "johndoe@kavium.com",
  }

  const menuItems = [
    {
      id: "account",
      title: "My Account",
      subtitle: "Make changes to your account",
      icon: "person-outline",
      hasAlert: true,
      onPress: () => navigation.navigate("UpdateProfile"),
    },
    {
      id: "products",
      title: "Your Products",
      subtitle: "Manage your Products",
      icon: "bag-outline",
      hasAlert: false,
      onPress: () => navigation.navigate("Products"),
    },
    {
      id: "auth",
      title: "Two-Factor Authentication",
      subtitle: "Further secure your account for safety",
      icon: "shield-outline",
      hasAlert: false,
      onPress: () => {},
    },
    {
      id: "logout",
      title: "Log out",
      subtitle: "Further secure your account for safety",
      icon: "log-out-outline",
      hasAlert: false,
      onPress: async () => {
        try {
          await logout()
        } catch (e) {
          // no-op, AuthContext handles errors
        }
      },
    },
  ]

  const moreItems = [
    {
      id: "help",
      title: "Help & Support",
      icon: "help-circle-outline",
      onPress: () => {},
    },
    {
      id: "about",
      title: "About App",
      icon: "heart-outline",
      onPress: () => {},
    },
  ]

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileImageContainer}>
            <Image source={{ uri: userProfile.profileImage }} style={styles.profileImage} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userProfile.name}</Text>
            <Text style={styles.profileUsername}>{userProfile.username}</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="pencil" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuItem} onPress={item.onPress} activeOpacity={0.7}>
              <View style={styles.menuItemLeft}>
                <View style={styles.iconContainer}>
                  <Ionicons name={item.icon as any} size={20} color="#666" />
                </View>
                <View style={styles.menuItemContent}>
                  <View style={styles.menuItemHeader}>
                    <Text style={styles.menuItemTitle}>{item.title}</Text>
                    {item.hasAlert && <View style={styles.alertDot} />}
                  </View>
                  <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>

        {/* More Section */}
        <View style={styles.moreSection}>
          <Text style={styles.sectionTitle}>More</Text>
          {moreItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuItem} onPress={item.onPress} activeOpacity={0.7}>
              <View style={styles.menuItemLeft}>
                <View style={styles.iconContainer}>
                  <Ionicons name={item.icon as any} size={20} color="#666" />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemTitle}>{item.title}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigateTo("Home")} activeOpacity={0.8}>
          <Ionicons name="home-outline" size={24} color={activeTab === "Home" ? "#4A90E2" : "#999"} />
          {activeTab === "Home" && <View style={styles.activeIndicator} />}
          <Text style={[styles.navText, activeTab === "Home" ? styles.navTextActive : null]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="grid-outline" size={24} color="#999" />
          <Text style={styles.navText}>Categories</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="heart-outline" size={24} color="#999" />
          <Text style={styles.navText}>Wishlist</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigateTo("Profile")} activeOpacity={0.8}>
          <Ionicons name="person" size={24} color={activeTab === "Profile" ? "#4A90E2" : "#999"} />
          {activeTab === "Profile" && <View style={styles.activeIndicator} />}
          <Text style={[styles.navText, activeTab === "Profile" ? styles.navTextActive : null]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

// UpdateProfileScreen.tsx
const UpdateProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [formData, setFormData] = React.useState({
    firstName: "John",
    lastName: "Doe",
    mobileNumber: "99699-56784",
    password: "••••••••••",
  })

  const userProfile = {
    name: "John Doe",
    email: "john.doe@kavium.com",
    profileImage: "https://i.pravatar.cc/150?img=1",
  }

  const handleUpdateProfile = () => {
    // Handle profile update logic
    console.log("Profile updated:", formData)
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        <View style={styles.formContainer}>
          {/* Profile Image */}
          <View style={styles.profileImageSection}>
            <Image source={{ uri: userProfile.profileImage }} style={styles.updateProfileImage} />
          </View>

          {/* User Info */}
          <View style={styles.userInfoSection}>
            <Text style={styles.userName}>{userProfile.name}</Text>
            <Text style={styles.userEmail}>{userProfile.email}</Text>
          </View>

          {/* Form Fields */}
          <View style={styles.formFields}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>First Name</Text>
              <TextInput
                style={styles.textInput}
                value={formData.firstName}
                onChangeText={(text) => setFormData({ ...formData, firstName: text })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Last Name</Text>
              <TextInput
                style={styles.textInput}
                value={formData.lastName}
                onChangeText={(text) => setFormData({ ...formData, lastName: text })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Mobile Number</Text>
              <View style={styles.phoneInputContainer}>
                <View style={styles.countryCode}>
                  <Text style={styles.flagEmoji}>🇮🇳</Text>
                  <Text style={styles.countryCodeText}>+91</Text>
                </View>
                <TextInput
                  style={styles.phoneInput}
                  value={formData.mobileNumber}
                  onChangeText={(text) => setFormData({ ...formData, mobileNumber: text })}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.textInput}
                value={formData.password}
                onChangeText={(text) => setFormData({ ...formData, password: text })}
                secureTextEntry
              />
            </View>
          </View>

          {/* Update Button */}
          <TouchableOpacity style={styles.updateButton} onPress={handleUpdateProfile}>
            <Text style={styles.updateButtonText}>Update Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

// ProductsScreen.tsx
const ProductsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [currentRouteName, setCurrentRouteName] = React.useState<string>("Products")
  const [activeTab, setActiveTab] = React.useState<"Home" | "Profile">("Profile")

  useFocusEffect(
    React.useCallback(() => {
      const state = navigation.getState?.()
      const routeName = state?.routes?.[state.index]?.name ?? "Products"

      setCurrentRouteName(routeName)
      setActiveTab(routeName === "Home" ? "Home" : "Profile")
    }, [navigation]),
  )

  const navigateTo = (route: "Home" | "Profile") => {
    if (route === "Home" && activeTab === "Home") {
      return
    }

    if (route === "Profile" && currentRouteName === "Profile") {
      return
    }

    navigation.navigate(route)
  }

  const userProducts = [
    {
      id: "1",
      name: "adidas Multix Originals Shoes Sep...",
      category: "Running",
      price: 350,
      image: "https://placeholder.co/150x150/cccccc/666666?text=Shoe+1",
    },
    {
      id: "2",
      name: "adidas Multix Originals Shoes Sep...",
      category: "Running",
      price: 300,
      image: "https://placeholder.co/150x150/cccccc/666666?text=Shoe+2",
    },
    {
      id: "3",
      name: "adidas Multix Originals Shoes Sep...",
      category: "Running",
      price: 450,
      image: "https://placeholder.co/150x150/cccccc/666666?text=Shoe+3",
    },
  ]

  const formatPrice = (price: number): string => `$ ${price.toLocaleString("id-ID")}`

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Products</Text>
        <TouchableOpacity onPress={() => navigation.navigate("NewProduct")}>
          <Text style={styles.addProductText}>+Add Products</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.productsContainer} showsVerticalScrollIndicator={false}>
        {userProducts.map((product) => (
          <View key={product.id} style={styles.productCard}>
            <View style={styles.productImageContainer}>
              <View style={styles.productImagePlaceholder}>
                <Ionicons name="footsteps" size={40} color="#ccc" />
              </View>
            </View>
            <View style={styles.productInfo}>
              <Text style={styles.productCategory}>{product.category}</Text>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productPrice}>{formatPrice(product.price)}</Text>
            </View>
            <TouchableOpacity style={styles.editProductButton}>
              <Ionicons name="pencil" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigateTo("Home")} activeOpacity={0.8}>
          <Ionicons name="home-outline" size={24} color={activeTab === "Home" ? "#4A90E2" : "#999"} />
          {activeTab === "Home" && <View style={styles.activeIndicator} />}
          <Text style={[styles.navText, activeTab === "Home" ? styles.navTextActive : null]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="grid-outline" size={24} color="#999" />
          <Text style={styles.navText}>Categories</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="heart-outline" size={24} color="#999" />
          <Text style={styles.navText}>Wishlist</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigateTo("Profile")} activeOpacity={0.8}>
          <Ionicons name="person" size={24} color={activeTab === "Profile" ? "#4A90E2" : "#999"} />
          {activeTab === "Profile" && <View style={styles.activeIndicator} />}
          <Text style={[styles.navText, activeTab === "Profile" ? styles.navTextActive : null]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    marginTop: StatusBar.currentHeight || 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#fff",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    textAlign: "center",
  },
  addProductText: {
    color: "#4A90E2",
    fontSize: 14,
    fontWeight: "500",
  },
  profileCard: {
    backgroundColor: "#4A90E2",
    margin: 16,
    borderRadius: 12,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  profileImageContainer: {
    marginRight: 16,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: "#fff",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  profileUsername: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },
  editButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  menuSection: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 12,
    color: "#666",
  },
  alertDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ff4444",
    marginLeft: 8,
  },
  moreSection: {
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  // Update Profile Styles
  formContainer: {
    padding: 16,
  },
  profileImageSection: {
    alignItems: "center",
    marginBottom: 16,
  },
  updateProfileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  userInfoSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
  },
  formFields: {
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
    fontWeight: "500",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  countryCode: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRightWidth: 1,
    borderRightColor: "#ddd",
  },
  flagEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  countryCodeText: {
    fontSize: 16,
    color: "#333",
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  updateButton: {
    backgroundColor: "#2E4CE6",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  updateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  // Products Screen Styles
  productsContainer: {
    flex: 1,
    padding: 16,
  },
  productCard: {
    backgroundColor: "#4A90E2",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  productImageContainer: {
    marginRight: 16,
  },
  productImagePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  productInfo: {
    flex: 1,
  },
  productCategory: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 4,
  },
  productName: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "500",
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  editProductButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  // Bottom Navigation
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 4,
    position: "relative",
  },
  navText: {
    fontSize: 10,
    marginTop: 2,
    color: "#999",
  },
  navTextActive: {
    color: "#4A90E2",
  },
  activeIndicator: {
    position: "absolute",
    bottom: -8,
    width: 20,
    height: 3,
    backgroundColor: "#4A90E2",
    borderRadius: 2,
  },
})

export { ProfileScreen, UpdateProfileScreen, ProductsScreen }
