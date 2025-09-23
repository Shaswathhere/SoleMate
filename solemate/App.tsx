// import HomeScreen from './src/pages/HomeScreen';
// import NewProductForm from './src/pages/NewProductForm';

// export default function App() {
//   // return <HomeScreen />;
//   return <NewProductForm />;

// }


import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import all screens
import HomeScreen from './src/pages/HomeScreen';
import { ProfileScreen, UpdateProfileScreen, ProductsScreen } from './src/pages/ProfileScreen';
import NewProductForm from './src/pages/NewProductForm';

export type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  UpdateProfile: undefined;
  Products: undefined;
  NewProduct: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
        />
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen}
        />
        <Stack.Screen 
          name="UpdateProfile" 
          component={UpdateProfileScreen}
        />
        <Stack.Screen 
          name="Products" 
          component={ProductsScreen}
        />
        <Stack.Screen 
          name="NewProduct" 
          component={NewProductForm}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}