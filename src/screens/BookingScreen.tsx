import {useRoute} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import globalStyles from '../../styles';

const BookingScreen = ({navigation, route}: any) => {
  const {amenityName} = route.params || {};
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reminder, setReminder] = useState('');

  return (
    <View style={{flex: 1}}>
      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        <View style={globalStyles.bookingheaderContainer}>
          <Image
            source={require('../assets/BookingHead.png')}
            style={globalStyles.bookingheaderImage}
          />
          <TouchableOpacity
            style={globalStyles.backButton}
            onPress={() => navigation.goBack()}></TouchableOpacity>
        </View>
        <View style={[globalStyles.container, {paddingHorizontal: 16}]}>
          {/* Title Field and Description */}
          <View style={globalStyles.labelRow}>
            <Text style={globalStyles.bookinglabel}>Title</Text>
          </View>
          <View style={globalStyles.inputWithButton}>
            <TextInput
              placeholder="Event Title"
              value={title}
              onChangeText={setTitle}
              placeholderTextColor="#0E2B43"
              style={globalStyles.inputInside}
            />
            <TouchableOpacity style={globalStyles.addDescriptionBtnInline}>
              <Icon name="plus-circle-outline" size={16} color="#0E2B43" />
              <Text style={globalStyles.addDescriptionText}>
                Add Description
              </Text>
            </TouchableOpacity>
          </View>
          {amenityName && (
            <Text style={globalStyles.amenityInfo}>
              Booking for: {amenityName}
            </Text>
          )}

          {/* Date & Time */}
          <View style={globalStyles.bookingrow}>
            <View style={globalStyles.timeDateBox}>
              <Text style={globalStyles.bookinglabel}>Date</Text>
              <TouchableOpacity style={globalStyles.iconInput}>
                <Icon name="calendar" size={20} color="#134E78" />
              </TouchableOpacity>
            </View>
            <View style={globalStyles.timeDateBox}>
              <Text style={globalStyles.bookinglabel}>Time</Text>
              <TouchableOpacity style={globalStyles.iconInput}>
                <Icon name="clock-outline" size={20} color="#134E78" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Reminder Dropdown */}
          <Text style={globalStyles.bookinglabel}>Set Reminder</Text>
          <TouchableOpacity style={globalStyles.bookingdropdown}>
            <Text style={globalStyles.bookindropdownText}>
              {reminder || 'Select reminder...'}
            </Text>
            <Icon name="chevron-down" size={20} color="#000" />
          </TouchableOpacity>

          {/* Buttons */}
          <View style={globalStyles.bookingbuttonRow}>
            <TouchableOpacity style={globalStyles.bookBtn}>
              <Text style={globalStyles.bookBtnText}>Book</Text>
            </TouchableOpacity>
            <TouchableOpacity style={globalStyles.resetBtn}>
              <Icon name="delete-outline" size={18} color="#0E2B43" />
              <Text style={globalStyles.resetBtnText}>Reset</Text>
            </TouchableOpacity>
          </View>

          {/* Add Another Event */}
          <TouchableOpacity style={globalStyles.addEventBtn}>
            <Icon name="plus-circle-outline" size={18} color="#0E2B43" />
            <Text style={globalStyles.addEventText}>Add Another Event</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default BookingScreen;
