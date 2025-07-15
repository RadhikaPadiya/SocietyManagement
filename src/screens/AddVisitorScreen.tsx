import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import globalStyles from '../../styles';
import {Dropdown} from 'react-native-element-dropdown';
import visitorheading from '../assets/VisitorHeadings.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ActivityIndicator, Snackbar} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import ErrorText from '../components/ErrorText';
import LinearGradient from 'react-native-linear-gradient';
import APIHelper from '../utils/APIHelper';
type User = {
  id: string;
  user_name: string;
};
const AddVisitorScreen = ({navigation}: any) => {
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const [nameError, setNameError] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [tempDate, setTempDate] = useState<Date | null>(null);
  const [dateError, setDateError] = useState('');
  const [userError, setUserError] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userType, setUserType] = useState('');

  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        if (!userToken) {
          setErrorMessage('Token not found.');
          setVisible(true);
          setLoading(false);
          return;
        }
        const storedUserType = await AsyncStorage.getItem('userType');
        setUserType(storedUserType || '');
        if (storedUserType === 'security') {
          const response = await APIHelper.post('get_user_list', {
            token: userToken,
          });
          if (response.code === '1') {
            setUsers(response.data);
          } else {
            console.error('Failed to fetch users:', response.message);
          }
        }
      } catch (error) {
        console.error('Error fetching user list:', error);
      }
    };

    fetchUserList();
  }, []);

  const handleAddVisitor = async () => {
    let isValid = true;
    setNameError('');
    setDateError('');
    setUserError('');
    if (!name) {
      setNameError('Name is required');
      isValid = false;
    }
    if (!date) {
      setDateError('Date is required');
      isValid = false;
    }
    if (userType === 'security' && !selectedUser) {
      setUserError('User is required');
      isValid = false;
    }
    if (!isValid) return;
    try {
      setLoading(true);
      const userToken = await AsyncStorage.getItem('userToken');
      if (!userToken) {
        setErrorMessage('Invalid token');
        setVisible(true);
        setLoading(false);
        return;
      }
      const requestBody = {
        visitor_name: name,
        date: date,
        image: image || 'default image',
        ...(userType === 'security' ? {user_id: selectedUser} : {}),
      };
      const response = await APIHelper.post(
        'add_visitor',
        {
          'Content-Type': 'application/json',
          token: userToken,
        },
        requestBody,
      );
      setLoading(false);
      if (response.code === '1') {
        Alert.alert('Success', 'Visitor added successfully!', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Profile', {refresh: true}),
          },
        ]);
      } else {
        setErrorMessage(response.message || 'Failed to add visitor');
        setVisible(true);
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage('Something went wrong');
      setVisible(true);
      console.error(error);
    }
  };
  return (
    <View style={{flex: 1}}>
      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        <View style={[globalStyles.container, {paddingHorizontal: 0}]}>
          <View>
            <Image source={visitorheading} style={globalStyles.headerImage} />
          </View>
          {/* Visitor List Card */}
          <View style={globalStyles.card}>
            {/* Card Header with Title and Add Icon */}
            <View style={globalStyles.cardHeader}>
              <Text style={globalStyles.cardTitle}>Visitor List</Text>
              <TouchableOpacity style={globalStyles.addIconContainer}>
                <Ionicons name="add" size={18} color="white" />
              </TouchableOpacity>
            </View>

            {/* Name & Date Input Fields inside Blue Box */}

            <View style={globalStyles.inputBox}>
              <View style={globalStyles.inputContainer}>
                <Text style={globalStyles.AddVisitorlabel}>Name :</Text>
                <TextInput
                  style={globalStyles.AddVisitorinput}
                  value={name}
                  placeholder="Enter visitor name"
                  placeholderTextColor="#0E2B43"
                  onChangeText={text => {
                    const filteredText = text.replace(/[^a-zA-Z\s]/g, '');
                    setName(filteredText);
                    if (filteredText.trim() !== '') setNameError('');
                  }}
                />
                <ErrorText message={nameError} />
              </View>
              <View style={globalStyles.inputContainer}>
                <Text style={globalStyles.AddVisitorlabel}>Date :</Text>
                <TouchableOpacity
                  style={globalStyles.dateInput}
                  onPress={() => {
                    setTempDate(date);
                    setShowPicker(true);
                  }}>
                  <Text
                    style={[
                      globalStyles.dateText,
                      {color: date ? '#0E2B43' : '#000000'},
                    ]}>
                    {date ? date.toLocaleDateString('en-GB') : 'Select a date'}
                  </Text>
                </TouchableOpacity>
                <ErrorText message={dateError} />
              </View>
              {showPicker && (
                <DateTimePicker
                  value={date ?? new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowPicker(false);
                    if (event.type === 'set' && selectedDate) {
                      setDate(selectedDate);
                      setDateError('');
                    }
                  }}
                />
              )}
              {userType === 'security' && (
                <View style={globalStyles.dropdownContainer}>
                  <Text style={globalStyles.dropdownLabel}>Select User :</Text>
                  <Dropdown
                    style={globalStyles.dropdown}
                    data={users.map(user => ({
                      label: user.user_name,
                      value: user.id,
                    }))}
                    labelField="label"
                    valueField="value"
                    placeholder="Select a user"
                    placeholderStyle={globalStyles.dropdownText}
                    value={selectedUser}
                    onChange={item => {
                      setSelectedUser(item.value);
                      if (item.value) setUserError('');
                    }}
                  />
                  <ErrorText message={userError} />
                </View>
              )}
            </View>

            <TouchableOpacity
              onPress={handleAddVisitor}
              disabled={loading}
              style={globalStyles.buttonWrapper}>
              <View style={globalStyles.addButton}>
                {loading ? (
                  <ActivityIndicator
                    animating={true}
                    size="large"
                    color="#F0F1C9"
                  />
                ) : (
                  <Text style={globalStyles.addButtonText}>Add Visitor</Text>
                )}
              </View>
            </TouchableOpacity>
            {/* Spacer to add moderate space */}
            <View style={{height: 30}} />

            {/* Visitor Card */}
            <View style={globalStyles.AddvisitorCard}>
              <Text style={globalStyles.AddvisitorName}>Harsh Trivedi</Text>
              <Text style={globalStyles.visitorDate}>Date: 21-02-2025</Text>
            </View>
          </View>
          <Snackbar
            visible={visible}
            onDismiss={() => setVisible(false)}
            action={{label: 'OK', onPress: () => setVisible(false)}}>
            {errorMessage}
          </Snackbar>
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
    </View>
  );
};

export default AddVisitorScreen;
