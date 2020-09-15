import React, { useState, useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import styled from 'styled-components/native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { BASE_URL } from '../services';
import moment from 'moment';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Title = styled.Text`
  font-size: 40px;
  line-height: 42px;
  font-weight: ${({ bold }) => bold ? 'bold' : 'normal'};
  color: ${({ color }) => color || 'black'};
`;

const Subtitle = styled.Text`
  font-size: 25px;
  color: #78909C;
  margin: 10px 0;
`;

const Container = styled.View`
  padding: ${({ verticalPadding, horizontalPadding }) => `${verticalPadding || 0}px ${horizontalPadding || 0}px`};
`;

const ListCard = styled.View`
  height: 100px;
  border-radius: 4px;
  margin: 10px 0;
  background-color: ${({ backgroundColor }) => backgroundColor || '#304FFE'};
  padding: 15px;
`;

const ListCardText = styled.Text`
  color: #ffffff;
  font-size: ${({ fontSize }) => fontSize || '20'}px;
  margin-bottom: ${({ marginBottom }) => marginBottom || '0'}px;
`;

const DoctorOverview = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [appointments, setAppointments] = useState([1, 2]);

  const fetchAppointments = async (userId) => {
    const { data } = await axios(`${BASE_URL}/appointments?doctorId=${userId}`);
    const appointments = data.appointments.map(appointment => ({
      ...appointment,
      startDate: moment(appointment.startDate).format('DD-MM-YYYY HH:mm:ss'),
      endDate: moment(appointment.endDate).format('DD-MM-YYYY HH:mm:ss'),
      literalStatus: appointment.status === 'pending' ? 'Pendiente' : 'Confirmado',
    }));
    setAppointments(appointments);
  };

  useEffect(() => {
    (async () => {
      const auth = await AsyncStorage.getItem('auth');
      const user = JSON.parse(auth);
      setUser(user);
      setLoading(false);
      fetchAppointments(user.id);
    })();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      (async () => {
        const auth = await AsyncStorage.getItem('auth');
        const user = JSON.parse(auth);
        setUser(user);
        setLoading(false);
        fetchAppointments(user.id);
      })();
    });

    return unsubscribe;
  }, [navigation]);

  const navigateToConfirm = (id, status) => {
    if (status === 'pending') {
      navigation.navigate('ConfirmAppointment', {
        appointmentId: id,
      });
    } else {
      navigation.navigate('BudgetDetail', {
        appointmentId: id,
      });
    }
  };

  return (
    <ScrollView>
      {
        !loading &&
        <>
          <Container
            verticalPadding='20'
            horizontalPadding='20'
          >
            <Title>
              Bienvenido,
            </Title>
            <Title
              bold
              color='blue'
            >
              Dr. {user.firstName} {user.lastName}
            </Title>
          </Container>
          <Container
            horizontalPadding='20'
          >
            <Subtitle>
              Citas
            </Subtitle>
            {
              appointments.map((appointment, index) => (
                <TouchableOpacity
                  key={`appointment-${index}`}
                  onPress={() => navigateToConfirm(appointment.id, appointment.status)}
                >
                  <ListCard
                    backgroundColor={appointment.status === 'pending' ? '#DD2C00' : '#304FFE'}
                  >
                    <ListCardText
                      marginBottom='5'
                    >
                      Cita #{appointment.id} {appointment.clientFirstName} {appointment.clientLastName}
                    </ListCardText>
                    <ListCardText
                      fontSize='16'
                    >
                      Comienza el {appointment.startDate}
                    </ListCardText>
                  </ListCard>
                </TouchableOpacity>
              ))
            }
          </Container>
        </>
      }
    </ScrollView>
  );
};

export default DoctorOverview;
