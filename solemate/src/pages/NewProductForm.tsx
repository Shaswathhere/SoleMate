"use client"

import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  Modal,
  Platform,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Formik } from "formik"
import * as Yup from "yup"
import { Ionicons } from "@expo/vector-icons"
import type { NavigationProp } from "@react-navigation/native"
import type { ProfileStackParamList } from "../../App"
import { useProducts, type ShoeData } from "./ProductContext"
import * as ImagePicker from "expo-image-picker"
import { storage } from "../../firebaseConfig"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"

interface NewProductFormProps {
  navigation: NavigationProp<ProfileStackParamList, "NewProduct">
}

interface FormValues {
  productName: string
  productDescription: string
  productPrice: string
  category: string
  brand: string
}

// Validation schema
const ProductSchema = Yup.object().shape({
  productName: Yup.string()
    .min(2, "Product name must be at least 2 characters")
    .max(100, "Product name cannot exceed 100 characters")
    .required("Product name is required"),
  productDescription: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description cannot exceed 500 characters")
    .required("Product description is required"),
  productPrice: Yup.number()
    .positive("Price must be a positive number")
    .max(1000000, "Price cannot exceed 1,000,000")
    .required("Product price is required"),
  category: Yup.string().required("Please select a category"),
  brand: Yup.string().min(2, "Brand name must be at least 2 characters").required("Brand is required"),
})

// Categories and brands
const categories = ["running", "lifestyle", "football", "basketball", "tennis", "badminton", "training", "casual"]

const brands = ["Nike", "Adidas", "Puma", "Reebok", "New Balance", "Asics", "Under Armour", "Vans", "Converse", "Other"]

const NewProductForm: React.FC<NewProductFormProps> = ({ navigation }) => {
  const { addProduct } = useProducts()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [addedProduct, setAddedProduct] = useState<ShoeData | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  useEffect(() => {
    ;(async () => {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!")
        }
      }
    })()
  }, [])

  const currentUser = {
    id: "user_001",
    name: "John Doe",
  }

  const generateId = (): string => {
    return `shoe_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  const handleImageUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri)
    }
  }

  const uploadImage = async (uri: string) => {
    const response = await fetch(uri)
    const blob = await response.blob()
    const storageRef = ref(storage, "product_images/" + new Date().getTime())
    const uploadTask = uploadBytesResumable(storageRef, blob)

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          setUploadProgress(progress)
        },
        (error) => {
          reject(error)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL)
          })
        },
      )
    })
  }

  const handleSubmit = async (values: FormValues, { setSubmitting, resetForm }: any) => {
    if (!selectedImage) {
      Alert.alert("Please select an image")
      return
    }

    setIsSubmitting(true)
    setSubmitting(true)
    try {
      const imageUrl = await uploadImage(selectedImage)
      const shoeData: ShoeData = {
        ShoeId: generateId(),
        ShoeName: values.productName.trim(),
        Description: values.productDescription.trim(),
        Price: Number.parseFloat(values.productPrice),
        imageUrl: imageUrl as string,
        category: values.category,
        createdAt: new Date().toISOString(),
        Brand: values.brand,
        SellerName: currentUser.name,
        SellerID: currentUser.id,
      }

      addProduct(shoeData)
      setAddedProduct(shoeData)
      setShowSuccessModal(true)
      resetForm()
      setSelectedImage(null)
    } catch (error) {
      console.error("Form submission error:", error)
      Alert.alert("Submission Failed", "An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
      setSubmitting(false)
      setUploadProgress(0)
    }
  }

  const SuccessModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showSuccessModal}
      onRequestClose={() => setShowSuccessModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={60} color="#4CAF50" />
          </View>

          <Text style={styles.successTitle}>Product Added Successfully!</Text>
          <Text style={styles.successMessage}>"{addedProduct?.ShoeName}" has been added to your products.</Text>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.viewProductsButton]}
              onPress={() => {
                setShowSuccessModal(false)
                navigation.navigate("Products")
              }}
            >
              <Text style={styles.viewProductsButtonText}>View Products</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.addProductButton]}
              onPress={() => {
                setShowSuccessModal(false)
              }}
            >
              <Text style={styles.addProductButtonText}>Add Another Product</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Product</Text>
          <View style={{ width: 24 }} />
        </View>

        <Formik
          initialValues={{
            productName: "",
            productDescription: "",
            productPrice: "",
            category: "",
            brand: "",
          }}
          validationSchema={ProductSchema}
          onSubmit={handleSubmit}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            isSubmitting: formikSubmitting,
            setFieldValue,
          }) => (
            <View style={styles.formContainer}>
              <View style={styles.imageSection}>
                <Text style={styles.label}>Product Image</Text>

                {selectedImage ? (
                  <View style={styles.selectedImageContainer}>
                    <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
                    <TouchableOpacity style={styles.removeImageButton} onPress={() => setSelectedImage(null)}>
                      <Ionicons name="close-circle" size={24} color="#ff4444" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity style={styles.imageUploadContainer} onPress={handleImageUpload}>
                    <View style={styles.uploadIcon}>
                      <Ionicons name="cloud-upload" size={40} color="#4285F4" />
                    </View>
                    <Text style={styles.uploadText}>Tap to upload an image</Text>
                    <Text style={styles.orText}>OR</Text>
                    <View style={styles.browseButton}>
                      <Text style={styles.browseButtonText}>Browse files</Text>
                    </View>
                  </TouchableOpacity>
                )}
                {isSubmitting && uploadProgress > 0 && (
                  <Text style={styles.uploadProgressText}>{`Uploading: ${uploadProgress.toFixed(0)}%`}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Product Name</Text>
                <TextInput
                  style={[styles.input, touched.productName && errors.productName && styles.inputError]}
                  placeholder="Enter Product Name here"
                  value={values.productName}
                  onChangeText={handleChange("productName")}
                  onBlur={handleBlur("productName")}
                  maxLength={100}
                />
                <Text style={styles.characterCount}>{values.productName.length}/100 characters</Text>
                {touched.productName && errors.productName && (
                  <Text style={styles.errorText}>{String(errors.productName)}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Brand</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScrollView}>
                  {brands.map((brand) => (
                    <TouchableOpacity
                      key={brand}
                      style={[styles.categoryButton, values.brand === brand && styles.categoryButtonSelected]}
                      onPress={() => setFieldValue("brand", brand)}
                    >
                      <Text
                        style={[styles.categoryButtonText, values.brand === brand && styles.categoryButtonTextSelected]}
                      >
                        {brand}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                {touched.brand && errors.brand && <Text style={styles.errorText}>{String(errors.brand)}</Text>}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScrollView}>
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[styles.categoryButton, values.category === category && styles.categoryButtonSelected]}
                      onPress={() => setFieldValue("category", category)}
                    >
                      <Text
                        style={[
                          styles.categoryButtonText,
                          values.category === category && styles.categoryButtonTextSelected,
                        ]}
                      >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                {touched.category && errors.category && <Text style={styles.errorText}>{String(errors.category)}</Text>}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Product Description</Text>
                <TextInput
                  style={[
                    styles.textArea,
                    touched.productDescription && errors.productDescription && styles.inputError,
                  ]}
                  placeholder="Enter Product Description here..."
                  value={values.productDescription}
                  onChangeText={handleChange("productDescription")}
                  onBlur={handleBlur("productDescription")}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  maxLength={500}
                />
                <Text style={styles.characterCount}>{values.productDescription.length}/500 characters</Text>
                {touched.productDescription && errors.productDescription && (
                  <Text style={styles.errorText}>{String(errors.productDescription)}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Product Price</Text>
                <View style={styles.priceInputContainer}>
                  <View style={styles.currencyContainer}>
                    <View style={styles.flagContainer}>
                      <Text style={styles.flagEmoji}>🇮🇳</Text>
                    </View>
                    <Text style={styles.currencySymbol}>₹</Text>
                  </View>
                  <TextInput
                    style={[styles.priceInput, touched.productPrice && errors.productPrice && styles.inputError]}
                    placeholder="Enter your Product Price here"
                    value={values.productPrice}
                    onChangeText={handleChange("productPrice")}
                    onBlur={handleBlur("productPrice")}
                    keyboardType="numeric"
                  />
                </View>
                {touched.productPrice && errors.productPrice && (
                  <Text style={styles.errorText}>{String(errors.productPrice)}</Text>
                )}
              </View>

              <TouchableOpacity
                style={[styles.submitButton, (isSubmitting || formikSubmitting) && styles.submitButtonDisabled]}
                onPress={() => handleSubmit()}
                disabled={isSubmitting || formikSubmitting}
              >
                <Text style={styles.submitButtonText}>
                  {isSubmitting || formikSubmitting ? `Uploading... ${uploadProgress.toFixed(0)}%` : "Add Product"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>

      <SuccessModal />
    </SafeAreaView>
  )
}

const ProductsScreenWithContext: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { getUserProducts } = useProducts()
  const currentUser = { id: "user_001", name: "John Doe" }
  const userProducts = getUserProducts(currentUser.id)

  const formatPrice = (price: number): string => `₹ ${price.toLocaleString("en-IN")}`

  return (
    <SafeAreaView style={styles.container}>
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
        {userProducts.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="bag-outline" size={60} color="#ccc" />
            <Text style={styles.emptyStateTitle}>No Products Yet</Text>
            <Text style={styles.emptyStateText}>Add your first product to get started</Text>
            <TouchableOpacity style={styles.emptyStateButton} onPress={() => navigation.navigate("NewProduct")}>
              <Text style={styles.emptyStateButtonText}>Add Product</Text>
            </TouchableOpacity>
          </View>
        ) : (
          userProducts.map((product) => (
            <View key={product.ShoeId} style={styles.productCard}>
              <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productCategory}>{product.category}</Text>
                <Text style={styles.productName}>{product.ShoeName}</Text>
                <Text style={styles.productBrand}>{product.Brand}</Text>
                <Text style={styles.productPrice}>{formatPrice(product.Price)}</Text>
              </View>
              <TouchableOpacity style={styles.editProductButton}>
                <Ionicons name="pencil" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home-outline" size={24} color="#999" />
          <Text style={styles.navText}>Home</Text>
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
          <Ionicons name="person" size={24} color="#4A90E2" />
          <View style={styles.activeIndicator} />
          <Text style={[styles.navText, { color: "#4A90E2" }]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  addProductText: {
    color: "#4A90E2",
    fontSize: 14,
    fontWeight: "500",
  },
  formContainer: {
    padding: 16,
  },
  imageSection: {
    marginBottom: 24,
  },
  selectedImageContainer: {
    position: "relative",
    alignSelf: "center",
  },
  selectedImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
  },
  removeImageButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  imageUploadContainer: {
    borderWidth: 2,
    borderColor: "#4285F4",
    borderStyle: "dashed",
    borderRadius: 12,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  uploadIcon: {
    marginBottom: 16,
  },
  uploadText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 12,
    textAlign: "center",
  },
  orText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  browseButton: {
    borderWidth: 1,
    borderColor: "#4285F4",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  browseButtonText: {
    color: "#4285F4",
    fontSize: 16,
    fontWeight: "500",
  },
  uploadProgressText: {
    textAlign: "center",
    marginTop: 10,
    color: "#4285F4",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    height: 100,
  },
  inputError: {
    borderColor: "#ff4444",
  },
  errorText: {
    color: "#ff4444",
    fontSize: 14,
    marginTop: 4,
  },
  characterCount: {
    fontSize: 12,
    color: "#666",
    textAlign: "right",
    marginTop: 4,
  },
  categoryScrollView: {
    marginBottom: 8,
  },
  categoryButton: {
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  categoryButtonSelected: {
    backgroundColor: "#4285F4",
    borderColor: "#4285F4",
  },
  categoryButtonText: {
    fontSize: 14,
    color: "#666",
  },
  categoryButtonTextSelected: {
    color: "#fff",
    fontWeight: "500",
  },
  priceInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  currencyContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRightWidth: 1,
    borderRightColor: "#ddd",
  },
  flagContainer: {
    width: 24,
    height: 18,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  flagEmoji: {
    fontSize: 16,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  priceInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#2E4CE6",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: "#ccc",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    margin: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  successIcon: {
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  successMessage: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
    lineHeight: 22,
  },
  modalButtons: {
    width: "100%",
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  viewProductsButton: {
    backgroundColor: "#4285F4",
  },
  viewProductsButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  addProductButton: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#4285F4",
  },
  addProductButtonText: {
    color: "#4285F4",
    fontSize: 16,
    fontWeight: "600",
  },
  productsContainer: {
    flex: 1,
    padding: 16,
  },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
    backgroundColor: "#f0f0f0",
  },
  productInfo: {
    flex: 1,
  },
  productCategory: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
    textTransform: "capitalize",
  },
  productName: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
    marginBottom: 4,
  },
  productBrand: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 16,
    color: "#4285F4",
    fontWeight: "bold",
  },
  editProductButton: {
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 24,
    textAlign: "center",
  },
  emptyStateButton: {
    backgroundColor: "#4285F4",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
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
  activeIndicator: {
    position: "absolute",
    bottom: -8,
    width: 20,
    height: 3,
    backgroundColor: "#4A90E2",
    borderRadius: 2,
  },
})

export default NewProductForm
export { ProductsScreenWithContext }
