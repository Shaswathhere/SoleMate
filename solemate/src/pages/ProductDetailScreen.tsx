import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Image,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    StatusBar,
} from 'react-native';
import { RouteProp, NavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { RootStackParamList } from '../../App';
import { ShoeData } from './ProductContext';

type ProductDetailScreenRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;
type ProductDetailScreenNavigationProp = NavigationProp<RootStackParamList, 'ProductDetail'>;

interface ProductDetailScreenProps {
    route: ProductDetailScreenRouteProp;
    navigation: ProductDetailScreenNavigationProp;
}

const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({ route, navigation }) => {
    const { productId } = route.params;
    const [product, setProduct] = useState<ShoeData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const docRef = doc(db, 'products', productId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setProduct({ ShoeId: docSnap.id, ...docSnap.data() } as ShoeData);
                } else {
                    setError('Product not found.');
                }
            } catch (e) {
                setError('Failed to fetch product details.');
                console.error('Error fetching document:', e);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    const formatPrice = (price: number): string => `₹ ${price.toLocaleString('en-IN')}`;

    if (loading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#4A90E2" />
            </View>
        );
    }

    if (error || !product) {
        return (
            <View style={[styles.container, styles.center]}>
                <Text style={styles.errorText}>{error || 'Product not found.'}</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>{product.ShoeName}</Text>
                <TouchableOpacity style={styles.headerButton}>
                    <Ionicons name="heart-outline" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            <ScrollView>
                <Image source={{ uri: product.imageUrl }} style={styles.productImage} />

                <View style={styles.detailsContainer}>
                    <Text style={styles.brandText}>{product.Brand}</Text>
                    <Text style={styles.nameText}>{product.ShoeName}</Text>
                    <Text style={styles.priceText}>{formatPrice(product.Price)}</Text>

                    <Text style={styles.descriptionTitle}>Description</Text>
                    <Text style={styles.descriptionText}>{product.Description}</Text>
                </View>
            </ScrollView>

            {/* Action Button */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
                    <Text style={styles.actionButtonText}>Add to Cart</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: StatusBar.currentHeight || 0,
        marginBottom: StatusBar.currentHeight || 0,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        flex: 1,
        textAlign: 'center',
        marginHorizontal: 10,
    },
    productImage: {
        width: '100%',
        height: 350,
        resizeMode: 'cover',
    },
    detailsContainer: {
        padding: 24,
    },
    brandText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    nameText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    priceText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#4A90E2',
        marginBottom: 24,
    },
    descriptionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    descriptionText: {
        fontSize: 16,
        lineHeight: 24,
        color: '#666',
    },
    footer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    actionButton: {
        backgroundColor: '#4A90E2',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    errorText: {
        fontSize: 16,
        color: '#666'
    }
});

export default ProductDetailScreen;