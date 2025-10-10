import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import all screens
import HomeScreen from "./src/pages/HomeScreen";
import { ProfileScreen, UpdateProfileScreen } from "./src/pages/ProfileScreen";
import NewProductForm, { ProductsScreenWithContext } from "./src/pages/NewProductForm";
import ProductDetailScreen from "./src/pages/ProductDetailScreen";
import { ProductProvider } from "./src/pages/ProductContext";

// Define param lists for each stack
export type HomeStackParamList = {
  Home: undefined;
  ProductDetail: { productId: string };
};

export type ProfileStackParamList = {
  Profile: undefined;
  UpdateProfile: undefined;
  Products: undefined;
  NewProduct: undefined;
};

export type RootTabParamList = {
  HomeTab: undefined;
  ProfileTab: undefined;
};

// Create navigators
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator<RootTabParamList>();

// Home Stack Navigator
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
    </Stack.Navigator>
  );
}

// Profile Stack Navigator
function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="UpdateProfile" component={UpdateProfileScreen} />
      <Stack.Screen name="Products" component={ProductsScreenWithContext} />
      <Stack.Screen name="NewProduct" component={NewProductForm} />
    </Stack.Navigator>
  );
}

// Main App Component with Tab Navigator
export default function App() {
  return (
    <ProductProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: '#4A90E2',
            tabBarInactiveTintColor: '#999',
            tabBarStyle: {
              paddingBottom: 5,
              paddingTop: 5,
              height: 60,
            },
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'HomeTab') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'ProfileTab') {
                iconName = focused ? 'person' : 'person-outline';
              }

              return <Ionicons name={iconName as any} size={size} color={color} />;
            },
          })}
        >
          <Tab.Screen
            name="HomeTab"
            component={HomeStack}
            options={{ title: 'Home' }}
          />
          <Tab.Screen
            name="ProfileTab"
            component={ProfileStack}
            options={{ title: 'Profile' }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </ProductProvider>
  );
}