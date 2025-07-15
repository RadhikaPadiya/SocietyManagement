import React, {useEffect, useState, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import {ActivityIndicator, Snackbar} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import APIHelper from '../utils/APIHelper';
import {useDispatch} from 'react-redux';
import {logout} from '../redux/authSlice';
import {CommonActions} from '@react-navigation/native';

import TemImg from '../assets/soclogo2.png';
import globalStyles from '../../styles';

const EditProfile = ({navigation}: any) => {
  type SectionKey = 'flatDetails' | 'contact';

  const [expandedSections, setExpandedSections] = useState<
    Record<SectionKey, boolean>
  >({
    flatDetails: false,
    contact: false,
  });
  const dispatch = useDispatch();
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const [requestData, setRequestData] = useState({
    user_type: 'user',
    flat_details: '',
    country_code: '+91',
    mobile_number: '',
    eme_country_code: '+91',
    eme_mobile_number: '',
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        if (!userToken) throw new Error('Token not found');

        const responseData = await APIHelper.post('get_profile', {
          token: userToken,
        });
        if (responseData.code === '1' && responseData.data) {
          setRequestData(prevData => ({
            ...prevData,
            ...responseData.data,
            user_type: 'user',
          }));
        } else {
          throw new Error(responseData.message || 'Failed to fetch profile.');
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setErrorMessage('Failed to fetch profile.');
        setVisible(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleInputChange = useCallback((field: string, value: string) => {
    setRequestData(prev => ({...prev, [field]: value}));
  }, []);

  const handleSaveChanges = useCallback(async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (!userToken) throw new Error('Token not found');

      if (
        !requestData.flat_details.trim() ||
        !requestData.mobile_number.trim() ||
        !requestData.eme_mobile_number.trim()
      ) {
        Alert.alert('Validation Error', 'All fields are required.');
        return;
      }
      if (
        !/^\d{10}$/.test(requestData.mobile_number) ||
        !/^\d{10}$/.test(requestData.eme_mobile_number)
      ) {
        Alert.alert('Validation Error', 'Mobile numbers must be 10 digits.');
        return;
      }
      const responseData = await APIHelper.post(
        'edit_profile',
        {'Content-Type': 'application/json', token: userToken},
        requestData,
      );
      if (responseData.code === '1') {
        Alert.alert('Success', 'Profile updated successfully', [
          {text: 'OK', onPress: () => navigation.navigate('Home')},
        ]);
      } else {
        throw new Error(responseData.message || 'Failed to update profile.');
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      setErrorMessage('Failed to update profile.');
      setVisible(true);
    }
  }, [requestData, navigation]);

  const toggleSection = useCallback((section: SectionKey) => {
    setExpandedSections(prev => ({...prev, [section]: !prev[section]}));
  }, []);
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      dispatch(logout());
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        }),
      );
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}>
      <ScrollView
        style={{flex: 1}}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="handled">
        <View style={[globalStyles.container, {paddingHorizontal: 0}]}>
          {loading ? (
            <View style={globalStyles.loaderContainer}>
              <ActivityIndicator
                animating={true}
                size="large"
                color="#134E78"
              />
            </View>
          ) : (
            <>
              {/* Profile Section */}
              <View style={globalStyles.profileSection}>
                <Image source={TemImg} style={globalStyles.editprofileImage} />
                <TouchableOpacity onPress={handleSaveChanges}>
                  <Text style={globalStyles.editProfileText}>
                    ✎ Edit Profile
                  </Text>
                </TouchableOpacity>
              </View>

              {/* User Info Card */}
              <View style={globalStyles.infoCard}>
                <LinearGradient
                  colors={['#D9EBFA', '#EBF4FC']}
                  start={{x: 0, y: 0}}
                  end={{x: 0, y: 1}}
                  style={globalStyles.gradientBackground}>
                  <View style={globalStyles.infoRow}>
                    <Text style={globalStyles.label}>User ID</Text>
                    <Text style={globalStyles.value}>A0101</Text>
                  </View>

                  <View style={globalStyles.infoRow}>
                    <Text style={globalStyles.label}>Password</Text>
                    <View style={globalStyles.editpasswordContainer}>
                      <Text style={globalStyles.value}>arm***</Text>
                      <TouchableOpacity>
                        <Text style={globalStyles.changePasswordText}>
                          Change Password
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Flat Details Section */}
                  <TouchableOpacity
                    style={[
                      globalStyles.sectionHeader,
                      {backgroundColor: '#C0E1F7'},
                    ]}
                    onPress={() => toggleSection('flatDetails')}>
                    <View style={globalStyles.gradientHeader}>
                      <Text style={globalStyles.sectionTitle}>
                        Flat Details
                      </Text>

                      <AntDesign
                        name={expandedSections.flatDetails ? 'up' : 'down'}
                        size={17}
                        color="#134E78"
                      />
                    </View>
                  </TouchableOpacity>
                  {expandedSections.flatDetails && (
                    <View style={globalStyles.contactDetails}>
                      <View style={globalStyles.contactRow}>
                        <TextInput
                          style={[globalStyles.inputField]}
                          placeholder="Enter Flat Details"
                          placeholderTextColor="#ddd"
                          value={requestData.flat_details}
                          onChangeText={text =>
                            handleInputChange('flat_details', text)
                          }
                          multiline={true}
                          numberOfLines={4}
                          textAlignVertical="top"
                        />
                      </View>
                    </View>
                  )}
                  {/* Contact Information Section */}
                  <TouchableOpacity
                    style={[
                      globalStyles.sectionHeader,
                      {backgroundColor: '#C0E1F7'},
                    ]}
                    onPress={() => toggleSection('contact')}>
                    <View style={globalStyles.gradientHeader}>
                      <Text style={globalStyles.sectionTitle}>
                        Contact Information
                      </Text>
                      <AntDesign
                        name={expandedSections.contact ? 'up' : 'down'}
                        size={17}
                        color="#134E78"
                      />
                    </View>
                  </TouchableOpacity>

                  {expandedSections.contact && (
                    <View style={globalStyles.contactDetails}>
                      <View style={globalStyles.contactRow}>
                        <Text style={globalStyles.contactLabel}>
                          Phone Number
                        </Text>
                        <TextInput
                          style={globalStyles.contactValue}
                          keyboardType="phone-pad"
                          placeholder="Enter Mobile Number"
                          value={requestData.mobile_number}
                          onChangeText={text => {
                            const filteredText = text.replace(
                              /[^0-9+()-]/g,
                              '',
                            );
                            if (filteredText.length <= 10) {
                              handleInputChange('mobile_number', filteredText);
                            }
                          }}
                        />
                      </View>
                      <View style={globalStyles.contactRow}>
                        <Text style={globalStyles.contactLabel}>
                          Emergency Number
                        </Text>
                        <TextInput
                          style={globalStyles.contactValue}
                          keyboardType="phone-pad"
                          placeholder="Enter Emergency Number"
                          value={requestData.eme_mobile_number}
                          onChangeText={text => {
                            const filteredText = text.replace(
                              /[^0-9+()-]/g,
                              '',
                            );
                            if (filteredText.length <= 10) {
                              handleInputChange(
                                'eme_mobile_number',
                                filteredText,
                              );
                            }
                          }}
                        />
                      </View>
                    </View>
                  )}
                </LinearGradient>
              </View>
            </>
          )}
        </View>
        <View style={globalStyles.logoutButtonContainer}>
          <TouchableOpacity
            onPress={() => setShowLogoutAlert(true)}
            style={globalStyles.logoutButton}>
            <Text style={globalStyles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View style={globalStyles.snackbarContainer}>
        <Snackbar
          visible={visible}
          onDismiss={() => setVisible(false)}
          action={{label: 'OK', onPress: () => setVisible(false)}}>
          {errorMessage}
        </Snackbar>
      </View>

      {showLogoutAlert && (
        <View style={globalStyles.alertOverlay}>
          <View style={globalStyles.alertBox}>
            <AntDesign
              name="warning"
              size={40}
              color="red"
              style={{marginBottom: 10}}
            />
            <Text style={globalStyles.alertText}>Continue to Log Out ?</Text>
            <View style={globalStyles.alertActions}>
              <TouchableOpacity
                style={globalStyles.stayButton}
                onPress={() => setShowLogoutAlert(false)}>
                <Text style={globalStyles.stayButtonText}>Stay logged in</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={globalStyles.confirmLogoutButton}
                onPress={handleLogout}>
                <Text style={globalStyles.confirmLogoutText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};
export default EditProfile;
