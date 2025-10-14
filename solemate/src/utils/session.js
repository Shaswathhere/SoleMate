import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Stores user data in AsyncStorage.
 * @param {object} userData - The user data to store.
 */
export const storeUserSession = async (userData) => {
  try {
    await AsyncStorage.setItem('user', JSON.stringify(userData));
    console.log('User session stored successfully.');
  } catch (error) {
    console.error('Error storing user session:', error);
  }
};

/**
 * Retrieves user data from AsyncStorage.
 * @returns {Promise<object|null>} The user data or null if not found.
 */
export const getUserSession = async () => {
  try {
    const userData = await AsyncStorage.getItem('user');
    console.log('User session retrieved:', userData);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error retrieving user session:', error);
    return null;
  }
};

/**
 * Removes user data from AsyncStorage.
 */
export const clearUserSession = async () => {
  try {
    await AsyncStorage.removeItem('user');
    console.log('User session cleared.');
  } catch (error) {
    console.error('Error clearing user session:', error);
  }
};