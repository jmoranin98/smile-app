import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import axios from 'axios';
import { BASE_URL } from '../services';
import AsyncStorage from '@react-native-community/async-storage';
import {
  ScrollView,
  Text,
} from 'react-native';
import moment from 'moment';

const Title = styled.Text`
  font-size: 40px;
  line-height: 42px;
  margin-bottom: 20px;
`;

const Container = styled.View`
  padding: ${({ verticalPadding, horizontalPadding }) => `${verticalPadding || 0}px ${horizontalPadding || 0}px`};
`;

const NotificationItem = styled.View`
  padding: 10px 0;
`;

const NotificationTitle = styled.Text`
  font-size: 25px;
  font-weight: bold;
`;

const NotificationMessage = styled.Text`
  font-size: 16px;
`;

const Notifications = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    (async () => {
      const auth = await AsyncStorage.getItem('auth');
      const user = JSON.parse(auth);
      const { data } = await axios(`${BASE_URL}/notifications?userId=${user.id}`);
      setNotifications(data.notifications);
    })();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      (async () => {
        const auth = await AsyncStorage.getItem('auth');
        const user = JSON.parse(auth);
        const { data } = await axios(`${BASE_URL}/notifications?userId=${user.id}`);
        setNotifications(data.notifications);
      })();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <ScrollView>
      <Container
        verticalPadding='20'
        horizontalPadding='20'
      >
        <Title>Notificaciones</Title>
        {
          notifications.map(notification => (
            <NotificationItem>
              <NotificationTitle>{notification.title}</NotificationTitle>
              <NotificationMessage>
                {notification.message}.
                Generado el {moment(notification.createdAt).format('DD-MM-YY')}
              </NotificationMessage>
            </NotificationItem>
          ))
        }
      </Container>
    </ScrollView>
  )
};

export default Notifications;
