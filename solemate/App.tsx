import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

// Import all screens
import HomeScreen from "./src/pages/HomeScreen"
import { ProfileScreen, UpdateProfileScreen } from "./src/pages/ProfileScreen"
import NewProductForm, { ProductsScreenWithContext } from "./src/pages/NewProductForm"
import { ProductProvider } from "./src/pages/ProductContext"

export type RootStackParamList = {
  Home: undefined
  Profile: undefined
  UpdateProfile: undefined
  Products: undefined
  NewProduct: undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function App() {
  return (
    <ProductProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: "Home Screen",
            }}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              title: "Profile Screen",
            }}
          />
          <Stack.Screen
            name="UpdateProfile"
            component={UpdateProfileScreen}
            options={{
              title: "Update Profile Screen",
            }}
          />
          <Stack.Screen
            name="Products"
            component={ProductsScreenWithContext}
            options={{
              title: "Products Screen",
            }}
          />
          <Stack.Screen
            name="NewProduct"
            component={NewProductForm}
            options={{
              title: "New Product Screen",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ProductProvider>
  )
}