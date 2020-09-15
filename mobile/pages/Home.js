import React, { useState, useEffect } from 'react';
import Feed from './Feed';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styled from 'styled-components/native';
import Account from './Account';
import Appointment from './Appointment';
import AsyncStorage from '@react-native-community/async-storage';
import DoctorFeed from './DoctorFeed';
import Notifications from './Notifications';

const CustomLabel = styled.Text`
  font-size: 11px;
  color: ${({ color }) => color || 'black'};
`;

const Tab = createBottomTabNavigator();

const Home = ({ navigation }) => {
  const [loading, setLoading] = useState([]);
  const [user, setUser] = useState([]);

  useEffect(() => {
    (async () => {
      const auth = await AsyncStorage.getItem('auth');
      const user = JSON.parse(auth);
      setUser(user);
      setLoading(false);
    })();
  }, []);

  return (
    <>
      {
        !loading &&
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Feed') {
                iconName = focused ?
                  'home'
                  : 'home-outline';
              } else if (route.name === 'Appointment') {
                iconName = focused ?
                  'ios-information-circle'
                  : 'ios-information-circle-outline';
              } else if (route.name === 'Account') {
                iconName = focused ?
                  'ios-information-circle'
                  : 'ios-information-circle-outline';
              } else if (route.name === 'Notifications') {
                iconName = focused ?
                  'ios-information-circle'
                  : 'ios-information-circle-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarLabel: ({ focused, color }) => {
              let label;
              if (route.name === 'Feed') {
                label = 'Inicio';
              } else if (route.name === 'Appointment') {
                label = 'Citas';
              } else if (route.name === 'Account') {
                label = 'Cuenta';
              } else if (route.name === 'Notifications') {
                label = 'Notificaciones';
              }

              return <CustomLabel color={focused ? color : 'black'}>{label}</CustomLabel>;
            },
          })}
        >
          <Tab.Screen name='Feed' component={user.role === 'client' ? Feed : DoctorFeed} />
          {
            user.role === 'client' &&
            <Tab.Screen name='Appointment' component={Appointment} />
          }
          {
            user.role === 'doctor' &&
            <Tab.Screen name='Notifications' component={Notifications} />
          }
          <Tab.Screen name='Account' component={Account} />
        </Tab.Navigator>
      }
    </>
  );
};

export default Home;
