import React, {useEffect, useState, useCallback, memo} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
} from 'react-native';
import globalStyles from '../../styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ActivityIndicator} from 'react-native-paper';
import TheatreStage from '../assets/TheatreStagelast.png';
import Parkinglast from '../assets/Parkinglast.png';
import Coinslast from '../assets/Coinslast.png';
import Complaintlast from '../assets/Complaintlast.png';
import UserGroupslast from '../assets/UserGroupslast.png';
import MarketplaceIcon from '../assets/trendingup.png';

const {width} = Dimensions.get('window');

const reminders = [
  {id: '1', text: 'Parking Fine Due'},
  {id: '2', text: 'Water Bill Due'},
  {id: '3', text: 'Meeting at 9:30 PM near A-Wing'},
];

const menuItems = [
  {id: '1', title: 'Booking', icon: TheatreStage},
  {id: '2', title: 'Parking', icon: Parkinglast},
  {id: '3', title: 'Maintenance & Finance', icon: Coinslast},
  {id: '4', title: 'Complaint', icon: Complaintlast},
  {id: '5', title: 'Society', icon: UserGroupslast},
  {id: '6', title: 'Marketplace', icon: MarketplaceIcon},
];

// ✅ Memoized Component

const HomeScreenComponent = ({navigation}: any) => {
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('');

  // ✅ Optimized useEffect (Combined both logic)
  useEffect(() => {
    setGreeting(getGreeting());

    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // ✅ Memoized Navigation
  const handleProfilePress = useCallback(() => {
    navigation.navigate('EditProfile');
  }, [navigation]);

  if (loading) {
    return (
      <View style={globalStyles.loaderContainer}>
        <ActivityIndicator animating size="large" color="#134E78" />
      </View>
    );
  }

  return (
    <ScrollView style={globalStyles.scrollContainer}>
      <View style={globalStyles.innerContainer}>
        {/* ✅ Profile & Reminder Section */}
        <View style={globalStyles.headerRow}>
          <View>
            <Text style={globalStyles.flatHeaderText}>A - 501</Text>
            <Text style={globalStyles.greetingText}>{greeting}</Text>
            <View style={globalStyles.dividerLine} />
          </View>
          <TouchableOpacity
            onPress={handleProfilePress}
            style={globalStyles.profileContainer}>
            <Image
              source={require('../assets/soclogo2.png')}
              style={globalStyles.profileImage}
            />
            <Text style={globalStyles.profileLabel}>Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Reminder Box */}
        <View style={globalStyles.reminderBox}>
           <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled>
          {reminders.map((reminder, index) => (
            <View key={reminder.id}>
              <View style={globalStyles.reminderRow}>
                <Icon
                  name="information-outline"
                  size={16}
                  color="#758694"
                  style={globalStyles.reminderIcon}
                />
                <Text style={globalStyles.reminderText}>{reminder.text}</Text>
              </View>
              {index < reminders.length - 1 && (
                <View style={globalStyles.reminderDivider} />
              )}
            </View>
          ))}
          </ScrollView>
        </View>
        <View style={globalStyles.sosContainerWrapper}>
          <View style={{alignItems: 'flex-end'}}>
            <TouchableOpacity
              style={globalStyles.sosArrowButton}
              onPress={() => navigation.navigate('SosScreen')}>
              <View style={globalStyles.arrowCircle}>
                <Icon name="arrow-left" size={16} color="#000000" />
              </View>
              <View style={globalStyles.hexagon}>
                <View style={globalStyles.hexagonInner}>
                  <Text style={globalStyles.hexagonText}>SOS</Text>
                </View>
                <View style={globalStyles.hexagonBefore} />
                <View style={globalStyles.hexagonAfter} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Cards */}
        <FlatList
          data={menuItems}
          numColumns={3}
          keyExtractor={item => item.id}
          scrollEnabled={false}
          columnWrapperStyle={globalStyles.menuColumnWrapper}
          renderItem={({item}) => (
            <TouchableOpacity style={globalStyles.menuCard}>
              <Text style={globalStyles.menuId}>{item.id}</Text>
              <Image source={item.icon} style={globalStyles.menuIcon} />
              <Text style={globalStyles.menuTitle}>{item.title}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </ScrollView>
  );
};

export default memo(HomeScreenComponent);
