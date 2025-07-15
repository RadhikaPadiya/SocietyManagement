import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import globalStyles from '../../styles';
import {TextInput} from 'react-native-paper';

const SosScreen = ({navigation}: any) => {
  return (
    <View style={globalStyles.Soscontainer}>
      {/* 🔙 Back Arrow */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={globalStyles.SosbackButton}>
        <View style={globalStyles.iconCircle}>
          <Icon name="arrow-left" size={16} color="#000000" />
        </View>
      </TouchableOpacity>

      {/* 🔻 Hexagon SOS Text */}
      <View style={globalStyles.Soshexagon}>
        <View style={globalStyles.SoshexagonInner}>
          <Text style={globalStyles.sosText}>SOS</Text>
        </View>
        <View style={globalStyles.SoshexagonBefore} />
        <View style={globalStyles.SoshexagonAfter} />
      </View>

      <View style={globalStyles.SosinputContainer}>
        <TextInput
          placeholder="Send a specific message ..."
          placeholderTextColor="#7a7a7a"
          mode="outlined"
          outlineColor="transparent"
          activeOutlineColor="transparent"
          style={globalStyles.paperInput}
          theme={{colors: {background: '#FFDDDD'}}}
          right={
            <TextInput.Icon
              icon="send"
              color="#555151"
              style={globalStyles.sendIconWrapper}
            />
          }
        />
      </View>
      <View style={globalStyles.infoContainer}>
        <Text style={globalStyles.subText}>Sending current location</Text>
        <Text style={globalStyles.subText}>to Emergency Contacts...</Text>
        <View style={{height: 10}} /> {/* Spacing between messages */}
        <Text style={globalStyles.subText}>Do not panic ...</Text>
      </View>
    </View>
  );
};
export default SosScreen;
