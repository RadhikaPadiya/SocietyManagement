import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import globalStyles from '../../styles';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

const notifications = [
  {
    id: '1',
    date: 'Today',
    count: '5',
    user: 'Abhishek Sharma',
    messageParts: [
      {text: ' has reminded of ', color: '#555151'},
      {text: 'Society General meeting ', color: '#0E2B43'},
      {text: 'at ', color: '#555151'},
      {text: '9:00PM', color: '#0E2B43'},
    ],
    icon: require('../assets/notification1.png'),
  },
  {
    id: '2',
    date: 'Yesterday',
    count: '3',
    user: 'Blood Donation Camp',
    messageParts: [
      {text: ' is organised on ', color: '#555151'},
      {text: '1st February ', color: '#0E2B43'},
      {text: 'from ', color: '#555151'},
      {text: '10:00 AM to 4:00 PM', color: '#0E2B43'},
    ],
    icon: require('../assets/notification2.png'),
  },
  {
    id: '3',
    date: 'Monday',
    count: '7',
    user: 'Underground Pump Water Bill',
    messageParts: [
      {
        text: ' has been generated, kindly finish the payment within duration',
        color: '#555151',
      },
    ],
    icon: require('../assets/notification3.png'),
  },
];
const amenities = [
  {id: '1', name: 'Gym', icon: require('../assets/Gym.png')},
  {id: '2', name: 'Swimming Pool', icon: require('../assets/LapPool.png')},
  {id: '3', name: 'ClubHouse', icon: require('../assets/CityHall.png')},
  {id: '4', name: 'Theatre', icon: require('../assets/theatestagee.png')},
  {id: '5', name: 'GameZone', icon: require('../assets/XboxController.png')},
];
const documents = [
  {id: '1', name: 'Budget 2025.pdf'},
  {id: '2', name: 'Tenant list Jan-Feb 2025.docx'},
  {id: '3', name: 'Water Bill March-2024.pdf'},
  {id: '4', name: 'Expense List 2023-2024.pdf'},
  {id: '5', name: 'Investments 2024-2025.xlsx'},
];
const NotificationScreen = ({navigation}: any) => {
  const [unreadNotifications, setUnreadNotifications] = useState(notifications);
  const [selectedTab, setSelectedTab] = useState('Unread');
  const renderMessage = (message: string) => {
    const match = message.match(/(.*) at (.*)/);
    if (!match) return <Text>{message}</Text>;

    return (
      <>
        <Text style={{color: '#0E2B43'}}>{match[1]}</Text>{' '}
        <Text style={{color: '#555151'}}>at</Text>{' '}
        <Text style={{color: '#0E2B43'}}>{match[2]}</Text>
      </>
    );
  };
  const handleRemoveNotification = (id: string | number) => {
    setUnreadNotifications(prev => prev.filter(item => item.id !== id));
  };
  const renderItem = ({item}: any) => (
    <View style={globalStyles.notificationContainer}>
      {/* Notification Count */}
      <View style={globalStyles.headerContainer}>
        <Text style={globalStyles.NotificationdateText}>{item.date}</Text>
        <LinearGradient
          colors={['#134E78', '#88C8F1']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={globalStyles.badge}>
          <Text style={globalStyles.badgeText}>{item.count}</Text>
        </LinearGradient>

        {/* "See All" Button */}
        <TouchableOpacity style={globalStyles.seeAllButton}>
          <Text style={globalStyles.seeAllText}>See all</Text>
        </TouchableOpacity>
      </View>
      <View style={globalStyles.Notificationcard}>
        <Image source={item.icon} style={globalStyles.icon} />
        <View style={globalStyles.textContainer}>
          <Text style={globalStyles.userText}>
            {item.user}
            {item.messageParts.map(
              (part: {text: string; color: string}, index: number) => (
                <Text key={index} style={{color: part.color}}>
                  {part.text}
                </Text>
              ),
            )}
          </Text>
          <View style={globalStyles.buttonRow}>
            <TouchableOpacity
              style={globalStyles.ignoreButton}
              onPress={() => handleRemoveNotification(item.id)}>
              <Text style={globalStyles.ignoreText}>Ignore</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={globalStyles.readButton}
              onPress={() => handleRemoveNotification(item.id)}>
              <Text style={globalStyles.readText}>Mark as Read</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
      <View
        style={[
          globalStyles.container,
          {paddingHorizontal: 0, backgroundColor: '#FFFFFF'},
        ]}>
        {/* Header */}
        <View style={globalStyles.card1}>
          <View style={globalStyles.headerContainer}>
            <Text style={globalStyles.Notificationheader}>Notices</Text>
            <TouchableOpacity>
              <Image
                source={require('../assets/Bell.png')}
                style={globalStyles.notificationIcon}
              />
            </TouchableOpacity>
          </View>

          <View style={globalStyles.tabContainer}>
            <TouchableOpacity
              style={[
                globalStyles.tabButton,
                selectedTab === 'Unread' && globalStyles.activeTab,
              ]}
              onPress={() => setSelectedTab('Unread')}>
              <Text
                style={[
                  globalStyles.tabText,
                  selectedTab === 'Unread' && globalStyles.activeTabText,
                ]}>
                Unread
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                globalStyles.tabButton,
                selectedTab === 'Read' && globalStyles.activeTab,
              ]}
              onPress={() => setSelectedTab('Read')}>
              <Text
                style={[
                  globalStyles.tabText,
                  selectedTab === 'Read' && globalStyles.activeTabText,
                ]}>
                Read
              </Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={unreadNotifications}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            style={globalStyles.list}
          />
        </View>
        {/* Amenities Section */}
        <Text style={globalStyles.amenitiesTitle}>Amenities</Text>
        <View style={globalStyles.amenitiesContainer}>
          <View style={globalStyles.amenitiesRow}>
            {amenities.slice(0, 3).map(amenity => (
              <TouchableOpacity
                key={amenity.id}
                style={globalStyles.amenityItem}
                onPress={() =>
                  navigation.navigate('Booking', {amenityName: amenity.name})
                }>
                <Image source={amenity.icon} style={globalStyles.amenityIcon} />
                <Text style={globalStyles.amenityText}>{amenity.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View
            style={[
              globalStyles.amenitiesRow,
              {justifyContent: 'space-evenly'},
            ]}>
            {amenities.slice(3).map(amenity => (
              <TouchableOpacity
                key={amenity.id}
                style={globalStyles.amenityItem}
                onPress={() =>
                  navigation.navigate('Booking', {amenityName: amenity.name})
                }>
                <Image source={amenity.icon} style={globalStyles.amenityIcon} />
                <Text style={globalStyles.amenityText}>{amenity.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Society Documents Section */}
        <View style={{position: 'relative', margin: 10}}>
          <Text style={globalStyles.documentsTitle}>
            Society{'\n'}Documents
          </Text>
          <View style={globalStyles.documentsContainer}>
            {documents.map(doc => (
              <View key={doc.id} style={globalStyles.documentItem}>
                <Text style={globalStyles.documentText}>{doc.name}</Text>
                <Image
                  source={require('../assets/download.png')}
                  style={globalStyles.downloadIcon}
                />
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default NotificationScreen;
