import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import {ActivityIndicator, Snackbar} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import visitorimage from '../assets/jethalal.png';
import globalStyles from '../../styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import APIHelper from '../utils/APIHelper';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

type Visitor = {
  id: string;
  visitor_name: string;
  date: string;
  insertdate: number;
  updatetime: number;
  status: string;
  readableTime?: string;
  formattedDate?: string;
};

const ProfileScreen = ({navigation}: any) => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [visitorPhoto, setVisitorPhoto] = useState(visitorimage);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchVisitors();
    }, []),
  );
  const fetchVisitors = async () => {
    try {
      setLoading(true);
      const userToken = await AsyncStorage.getItem('userToken');
      if (!userToken) {
        setErrorMessage('Token not found.');
        setVisible(true);
        setLoading(false);
        return;
      }

      const response = await APIHelper.post('get_visitor', {token: userToken});
      if (response.code === '1' && Array.isArray(response.data)) {
        const sortedVisitors = (response.data as Visitor[]).sort(
          (a, b) => b.insertdate - a.insertdate,
        );
        const formattedVisitors = sortedVisitors.map(visitor => {
          let formattedDate = visitor.date;
          if (visitor.date.includes('T')) {
            formattedDate = new Date(visitor.date).toLocaleDateString('en-US', {
              month: '2-digit',
              day: '2-digit',
              year: '2-digit',
            });
          }
          return {
            ...visitor,
            readableTime: new Date(
              visitor.updatetime * 1000,
            ).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            }),
            formattedDate,
          };
        });
        setVisitors(formattedVisitors);
      } else {
        setErrorMessage(response.message || 'Failed to fetch visitors.');
        setVisible(true);
      }
    } catch (error) {
      setErrorMessage('Error fetching visitors.');
      setVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleVisitorStatusChange = async (
    visitor_id: string,
    status: string,
  ) => {
    try {
      setLoading(true);
      const userToken = await AsyncStorage.getItem('userToken');
      if (!userToken) {
        setErrorMessage('Token not found.');
        setVisible(true);
        return;
      }
      const requestBody = {
        visitor_id,
        status,
      };
      const response = await APIHelper.post(
        'change_visitor_status',
        {
          'Content-Type': 'application/json',
          token: userToken,
        },
        requestBody,
      );
      if (response.code === '1') {
        fetchVisitors();
      } else {
        setErrorMessage(response.message || 'Failed to update status.');
        setVisible(true);
      }
    } catch (error) {
      setErrorMessage('Error updating visitor status.');
      setVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleScanPhoto = () => {
    Alert.alert(
      'Select Option',
      'Choose an option to scan visitor photo',
      [
        {
          text: 'Camera',
          onPress: () => {
            launchCamera(
              {
                mediaType: 'photo',
                quality: 0.8,
                saveToPhotos: true,
              },
              response => {
                if (response.didCancel || !response.assets) return;
                setVisitorPhoto({uri: response.assets[0].uri});
              },
            );
          },
        },
        {
          text: 'Gallery',
          onPress: () => {
            launchImageLibrary(
              {
                mediaType: 'photo',
                quality: 0.8,
              },
              response => {
                if (response.didCancel || !response.assets) return;
                setVisitorPhoto({uri: response.assets[0].uri});
              },
            );
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      {cancelable: true},
    );
  };

  return (
    <View style={{flex: 1}}>
      <View style={[globalStyles.container, {paddingHorizontal: 0, flex: 1}]}>
        {/* Your Visitors Section */}
        <View style={globalStyles.visitorCardWrapper}>
          <View style={globalStyles.header}>
            <Text style={globalStyles.headerText}>Your Visitors</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AddVisitor')}>
              <Ionicons name="add" size={35} color="#0E2B43" />
            </TouchableOpacity>
          </View>
          <View style={globalStyles.divider} />
          {visitors.length > 0 && (
            <View style={globalStyles.visitorCard}>
              <Text style={globalStyles.visitorName}>
                {visitors[0].visitor_name}
              </Text>

              <View style={globalStyles.iconContainer}>
                <TouchableOpacity
                  onPress={() =>
                    handleVisitorStatusChange(visitors[0].id, 'Rejected')
                  }
                  style={globalStyles.iconCircleOutline}>
                  <AntDesign name="close" size={16} color="#000000" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    handleVisitorStatusChange(visitors[0].id, 'Accepted')
                  }
                  style={globalStyles.iconCircleFilled}>
                  <Ionicons name="checkmark" size={16} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          <Text style={globalStyles.photoTitle}>Visitor Photo</Text>
          <Image source={visitorPhoto} style={globalStyles.visitorImage} />
          <TouchableOpacity onPress={handleScanPhoto}>
            <Text style={globalStyles.scanText}>Scan for new Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Visitor Logs Card */}
        <View style={[globalStyles.logsCard, {flex: 1}]}>
          <TouchableOpacity
            onPress={() => setExpanded(!expanded)}
            style={globalStyles.logsHeader}>
            <Text style={globalStyles.logsTitle}>Visitor Logs</Text>
            <View style={globalStyles.expandIcon}>
              <Ionicons
                name={expanded ? 'chevron-up-outline' : 'chevron-down-outline'}
                size={24}
                color="#0E2B43"
              />
            </View>
          </TouchableOpacity>
          <View style={globalStyles.divider1} />

          {loading ? (
            <View style={globalStyles.loaderContainer}>
              <ActivityIndicator
                animating={true}
                size="large"
                color="#134E78"
              />
            </View>
          ) : expanded && Array.isArray(visitors) && visitors.length > 0 ? (
            <FlatList
              contentContainerStyle={{paddingBottom: 20}}
              data={visitors}
              keyExtractor={item => item.id.toString()}
              renderItem={({item}) => (
                <View>
                  <View style={globalStyles.logItem}>
                    <Text style={globalStyles.logText}>
                      {item.visitor_name}
                    </Text>
                    <Text style={globalStyles.logText}>
                      {item.readableTime}
                    </Text>
                    <Text style={globalStyles.logText}>
                      {item.formattedDate}
                    </Text>
                    <Text style={globalStyles.logText}>{item.status}</Text>
                  </View>
                  <View style={globalStyles.rowDivider} />
                </View>
              )}
            />
          ) : (
            <Text style={globalStyles.noVisitorsText}>No visitors found.</Text>
          )}
        </View>
      </View>

      {/* Snackbar */}
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

export default ProfileScreen;
