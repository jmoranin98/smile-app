import AsyncStorage from '@react-native-community/async-storage';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import {
  Text,
} from 'react-native';
import axios from 'axios';
import { BASE_URL } from '../services';
import moment from 'moment';

const Root = styled.ScrollView``;

const Container = styled.View`
  padding: ${({ verticalPadding, horizontalPadding }) => `${verticalPadding || 0}px ${horizontalPadding || 0}px`};
`;

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

const HorizontalScroll = styled.ScrollView`
`;

const CardsSection = styled.View`
  width: ${({ elements }) => elements ? elements * 280 : 0}px;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px 0;
`;

const CardWrapper = styled.View`
  flex: 1;
  margin-right: ${({ isLast }) => isLast ? '20' : '10'}px;
  margin-left: ${({ isFirst }) => isFirst ? '20' : '10'}px;
`;

const Card = styled.View`
  background-color: ${({ backgroundColor }) => backgroundColor || '#78909C'};
  height: 180px;
  border-radius: 10px;
  padding: 20px;
`;

const CardText = styled.Text`
  font-size: ${({ fontSize }) => fontSize || '20'}px;
  color: ${({ color }) => color || '#000000'};
  margin-bottom: ${({ marginBottom }) => marginBottom || '0'}px;
`;

const ListCard = styled.View`
  height: 80px;
  border-radius: 4px;
  background-color: #78909C;
  margin: 10px 0;
`;

const InfoText = styled.Text`
  font-size: 14px;
  font-weight: 100;
`;

const cardColors = [
  {
    backgroundColor: '#FF3D00',
    color: '#ffffff',
  },
  {
    backgroundColor: '#1DE9B6',
    color: '#000000',
  },
  {
    backgroundColor: '#304FFE',
    color: '#ffffff',
  },
  {
    backgroundColor: '#512DA8',
    color: '#ffffff',
  },
  {
    backgroundColor: '#E91E63',
    color: '#ffffff',
  },
];

const Feed = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [nextAppointments, setNextAppointments] = useState([]);
  const [historyAppointments, setHistoryAppointments] = useState([]);

  const fetchNextAppointments = async (userId) => {
    const { data } = await axios(`${BASE_URL}/appointments/next?clientId=${userId}`);
    const appointments = data.appointments.map(appointment => ({
      ...appointment,
      startDate: moment(appointment.startDate).format('DD-MM-YYYY HH:mm:ss'),
      endDate: moment(appointment.endDate).format('DD-MM-YYYY HH:mm:ss'),
    }));
    setNextAppointments(appointments);
  };

  const fetchHistoryAppointments = async (userId) => {
    const { data } = await axios(`${BASE_URL}/appointments/history?clientId=${userId}`);
    const appointments = data.appointments.map(appointment => ({
      ...appointment,
      startDate: moment(appointment.startDate).format('DD-MM-YYYY HH:mm:ss'),
      endDate: moment(appointment.endDate).format('DD-MM-YYYY HH:mm:ss'),
    }));
    setHistoryAppointments(appointments);
  };

  useEffect(() => {
    (async () => {
      const auth = await AsyncStorage.getItem('auth');
      const user = JSON.parse(auth);
      setUser(user);
      fetchNextAppointments(user.id);
      fetchHistoryAppointments(user.id);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      (async () => {
        const auth = await AsyncStorage.getItem('auth');
        const user = JSON.parse(auth);
        fetchNextAppointments(user.id);
        fetchHistoryAppointments(user.id);
      })();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <Root>
      {
        loading ?
          <Text>Cargando...</Text> :
          <>
            <Container
              verticalPadding='20'
              horizontalPadding='20'
            >
              <Title>Bienvenido,</Title>
              <Title
                bold
                color='blue'
              >
                {user.firstName} {user.lastName}
              </Title>
            </Container>
            <Container
              horizontalPadding='20'
            >
              <Subtitle>
                Próximas citas
            </Subtitle>
            </Container>
            {
              nextAppointments.length === 0 ?
                <Container
                  horizontalPadding='20'
                >
                  <InfoText>No tiene citas próximas</InfoText>
                </Container> :
                <HorizontalScroll
                  showsHorizontalScrollIndicator={false}
                  horizontal
                >
                  <CardsSection
                    elements={nextAppointments.length}
                  >
                    {
                      nextAppointments.map((e, i) => {
                        const index = Math.round(Math.random() * (cardColors.length - 1));
                        const { backgroundColor, color } = cardColors[index];
                        return (
                          <CardWrapper
                            key={`na-${i}`}
                            isFirst={i === 0}
                            isLast={i === nextAppointments.length - 1}
                          >
                            <Card
                              backgroundColor={backgroundColor}
                              style={{
                                shadowColor: "#000",
                                shadowOffset: {
                                  width: 0,
                                  height: 2,
                                },
                                shadowOpacity: 0.23,
                                shadowRadius: 2.62,

                                elevation: 4,
                              }}
                            >
                              <CardText
                                color={color}
                                fontSize={22}
                                marginBottom={10}
                              >
                                Doctor {e.doctorFirstName} {e.doctorLastName}
                              </CardText>
                              <CardText
                                color={color}
                                fontSize={16}
                              >
                                Cita programada para {e.startDate}
                              </CardText>
                            </Card>
                          </CardWrapper>
                        )
                      })
                    }
                  </CardsSection>
                </HorizontalScroll>
            }
            <Container
              horizontalPadding='20'
            >
              <Subtitle>
                Historial
              </Subtitle>
              {
                historyAppointments.length === 0 ?
                  <InfoText>
                    Parece que aún no ha tenido citas previas en nuestro establecimiento
                </InfoText> :
                  historyAppointments.map(e => (
                    <ListCard></ListCard>
                  ))
              }
            </Container>
          </>
      }
    </Root>
  );
};

export default Feed;
