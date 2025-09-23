import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';

interface NewProductFormProps {
  navigation: NavigationProp<RootStackParamList, 'NewProduct'>;
}

// Validation schema
const ProductSchema = Yup.object().shape({
  productName: Yup.string()
    .min(2, 'Product name must be at least 2 characters')
    .required('Product name is required'),
  productDescription: Yup.string()
    .min(10, 'Description must be at least 10 characters')
    .required('Product description is required'),
  productPrice: Yup.number()
    .positive('Price must be a positive number')
    .required('Product price is required'),
});

const NewProductForm: React.FC<NewProductFormProps> = ({ navigation }) => {
  const handleSubmit = (values: any, { setSubmitting, resetForm }: any) => {
    // Simulate form submission
    setTimeout(() => {
      Alert.alert(
        'Success!',
        'Product submitted successfully',
        [
          {
            text: 'OK',
            onPress: () => {
              resetForm();
              navigation.goBack(); // Navigate back to Products screen
            },
          },
        ]
      );
      setSubmitting(false);
    }, 1000);
  };

  const handleImageUpload = () => {
    Alert.alert('Image Upload', 'Image upload functionality will be implemented later');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Product</Text>
        </View>

        <Formik
          initialValues={{
            productName: '',
            productDescription: '',
            productPrice: '',
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
            isSubmitting,
          }) => (
            <View style={styles.formContainer}>
              {/* Image Upload Section */}
              <TouchableOpacity 
                style={styles.imageUploadContainer}
                onPress={handleImageUpload}
              >
                <View style={styles.uploadIcon}>
                  <Ionicons name="cloud-upload" size={40} color="#4285F4" />
                </View>
                <Text style={styles.uploadText}>Drop your Image(s) to start uploading</Text>
                <Text style={styles.orText}>OR</Text>
                <View style={styles.browseButton}>
                  <Text style={styles.browseButtonText}>Browse files</Text>
                </View>
              </TouchableOpacity>

              {/* Product Name */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Product Name</Text>
                <TextInput
                  style={[
                    styles.input,
                    touched.productName && errors.productName && styles.inputError
                  ]}
                  placeholder="Enter Product Name here"
                  value={values.productName}
                  onChangeText={handleChange('productName')}
                  onBlur={handleBlur('productName')}
                />
                {touched.productName && errors.productName && (
                  <Text style={styles.errorText}>{String(errors.productName)}</Text>
                )}
              </View>

              {/* Product Description */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Product Description</Text>
                <TextInput
                  style={[
                    styles.textArea,
                    touched.productDescription && errors.productDescription && styles.inputError
                  ]}
                  placeholder="Enter Product Description here..."
                  value={values.productDescription}
                  onChangeText={handleChange('productDescription')}
                  onBlur={handleBlur('productDescription')}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
                {touched.productDescription && errors.productDescription && (
                  <Text style={styles.errorText}>{String(errors.productDescription)}</Text>
                )}
              </View>

              {/* Product Price */}
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
                    style={[
                      styles.priceInput,
                      touched.productPrice && errors.productPrice && styles.inputError
                    ]}
                    placeholder="Enter your Product Price here"
                    value={values.productPrice}
                    onChangeText={handleChange('productPrice')}
                    onBlur={handleBlur('productPrice')}
                    keyboardType="numeric"
                  />
                </View>
                {touched.productPrice && errors.productPrice && (
                  <Text style={styles.errorText}>{String(errors.productPrice)}</Text>
                )}
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  isSubmitting && styles.submitButtonDisabled
                ]}
                onPress={() => handleSubmit()}
                disabled={isSubmitting}
              >
                <Text style={styles.submitButtonText}>
                  {isSubmitting ? 'Adding Product...' : 'Add Product'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4285F4',
  },
  formContainer: {
    padding: 16,
  },
  imageUploadContainer: {
    borderWidth: 2,
    borderColor: '#4285F4',
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#fff',
  },
  uploadIcon: {
    marginBottom: 16,
  },
  uploadText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  orText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  browseButton: {
    borderWidth: 1,
    borderColor: '#4285F4',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  browseButtonText: {
    color: '#4285F4',
    fontSize: 16,
    fontWeight: '500',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    height: 100,
  },
  inputError: {
    borderColor: '#ff4444',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    marginTop: 4,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  currencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  flagContainer: {
    width: 24,
    height: 18,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flagEmoji: {
    fontSize: 16,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  priceInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#2E4CE6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default NewProductForm;