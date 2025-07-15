import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {login} from '../redux/authSlice';
import Icon from 'react-native-vector-icons/Ionicons';
import APIHelper from '../utils/APIHelper';
import LinearGradient from 'react-native-linear-gradient';
import globalStyles from '../../styles';

const SignInScreen = ({navigation}: any) => {
  const [credentials, setCredentials] = useState({username: '', password: ''});
  const [errors, setErrors] = useState({username: '', password: ''});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (field: 'username' | 'password', value: string) => {
    setCredentials(prev => ({...prev, [field]: value}));
    if (value.trim() !== '') {
      setErrors(prev => ({...prev, [field]: ''}));
    }
  };

  const validateInputs = () => {
    let isValid = true;
    let newErrors = {username: '', password: ''};

    if (!credentials.username.trim()) {
      newErrors.username = 'Username is required';
      isValid = false;
    }
    if (!credentials.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (credentials.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };
  const handleLogin = useCallback(async () => {
    if (!validateInputs()) return;
    const requestBody = {
      user_name: credentials.username,
      password: credentials.password,
      device_token: 'darsh123456',
      device_type: 'fdfdfd545454',
      device_model: 'fdfdfd5434343',
      uuid: 'fdfd54343',
      ip: 'dsdsds4434343',
      voip_token: 'fdfdfd4343',
    };
    try {
      const responseData = await APIHelper.post(
        'signin',
        {'Content-Type': 'application/json'},
        requestBody,
      );
      if (responseData.code === '1') {
        const {token, user_type, ...userData} = responseData.data;
        await AsyncStorage.multiRemove(['userToken', 'userType']);
        console.log('Cleared AsyncStorage before setting new userType');
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userType', user_type);
        console.log('usertype', user_type);
        dispatch(login({...userData, user_type}));
        console.log(
          `Navigating to ${
            user_type === 'security' ? 'Profile' : 'Home'
          }, UserType: ${user_type}`,
        );
        navigation.replace(user_type === 'security' ? 'Profile' : 'Home');
      } else {
        Alert.alert('Error', responseData.message || 'Login failed');
      }
    } catch (error) {
      console.error('API Error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  }, [credentials]);

  return (
    <View style={globalStyles.gradientBackgroundd}>
      <View style={globalStyles.signinInnerContainer}>
        {/* Logo */}
        <Image
          source={require('../assets/Syncicon.png')}
          style={globalStyles.logo}
        />

        <Text style={globalStyles.title}>
          Get Started
          <Text style={{color: '#88C8F1', fontWeight: 'bold'}}>.</Text>
        </Text>

        {/* Username */}
        <TextInput
          style={globalStyles.input}
          placeholder="Enter Username ..."
          placeholderTextColor="#A09696"
          value={credentials.username}
          onChangeText={text => handleChange('username', text)}
        />
        {errors.username ? (
          <Text style={globalStyles.errorText}>{errors.username}</Text>
        ) : null}

        {/* Password */}
        <View style={globalStyles.passwordContainer}>
          <TextInput
            style={globalStyles.passwordInput}
            placeholder="Enter Password ..."
            placeholderTextColor="#A09696"
            secureTextEntry={!passwordVisible}
            value={credentials.password}
            onChangeText={text => handleChange('password', text)}
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
            style={globalStyles.eyeIconContainer}>
            <Icon
              name={passwordVisible ? 'eye-off' : 'eye'}
              size={22}
              color="#00000"
            />
          </TouchableOpacity>
        </View>
        {errors.password ? (
          <Text style={globalStyles.errorText}>{errors.password}</Text>
        ) : null}

        <View style={{width: '100%', alignItems: 'flex-end'}}>
          <TouchableOpacity>
            <Text style={globalStyles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={globalStyles.button} onPress={handleLogin}>
          <Text style={globalStyles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      </View>

      {/* Gradient Bottom Overlay */}
      <LinearGradient
        colors={['transparent', '#88C8F1']}
        style={globalStyles.bottomGradient}
      />
    </View>
  );
};

export default SignInScreen;
