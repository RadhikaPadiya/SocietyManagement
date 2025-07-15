import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity, ActivityIndicator, View } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

import SignInScreen from '../screens/SignInScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import AddVisitorScreen from '../screens/AddVisitorScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SosScreen from '../screens/SosScreen';
import BookingScreen from '../screens/BookingScreen';
import BottomTabNavigator from './BottomTabNavigator';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [userType, setUserType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserType = async () => {
      try {
        const storedUserType = await AsyncStorage.getItem('userType');
        console.log('AppNavigator Loaded, userType:', storedUserType);
        setUserType(storedUserType);
      } catch (error) {
        console.error('Error fetching user type:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUserType();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#134E78" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SignIn" component={SignInScreen} />

        {userType === 'security' ? (
            <>
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="AddVisitor" component={AddVisitorScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Home" component={BottomTabNavigator} />
            <Stack.Screen
              name="EditProfile"
              component={EditProfileScreen}
              options={({ navigation }) => ({
                headerShown: true,
                headerStyle: { backgroundColor: '#C0E1F7' },
                headerLeft: () => (
                  <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 15 }}>
                    <AntDesign name="arrowleft" size={24} color="#0E2B43" />
                  </TouchableOpacity>
                ),
              })}
            />
            <Stack.Screen name="AddVisitor" component={AddVisitorScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="SosScreen" component={SosScreen} />
            <Stack.Screen name="Booking" component={BookingScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
