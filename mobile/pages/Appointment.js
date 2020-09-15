import React, { useEffect, useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import styled from 'styled-components/native';
import Button from '../components/Button/Button';
import FormGroup from '../components/FormGroup';
import Input from '../components/Input';
import Label from '../components/Label';
import moment from 'moment';
import { Picker } from '@react-native-community/picker';
import axios from 'axios';
import { BASE_URL } from '../services';
import AsyncStorage from '@react-native-community/async-storage';
import { ToastAndroid } from 'react-native';

const Root = styled.View`
  margin: 20px;
`;

const Title = styled.Text`
  font-size: 40px;
  line-height: 42px;
`;

const Appointment = ({ navigation }) => {
  const [appointment, setAppointment] = useState({
    doctorId: null,
    startDate: new Date(1598051730000),
    observation: '',
    clientId: '',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [doctors, setDoctors] = useState([]);

  const showAlert = (value) => {
    ToastAndroid.show(value, ToastAndroid.SHORT);
  };

  const fetchDoctors = async () => {
    const { data } = await axios(`${BASE_URL}/users?role=doctor`);
    setDoctors(data.users);
  };

  const handleRegister = () => {
    (async () => {
      try {
        const auth = await AsyncStorage.getItem('auth');
        const user = JSON.parse(auth);
        const { data } = await axios.post(`${BASE_URL}/appointments`, {
          appointment: {
            ...appointment,
            clientId: user.id,
          },
        });
        showAlert('Cita registrada correctamente');
        setAppointment({
          ...appointment,
          doctorId: -1,
          startDate: new Date(1598051730000),
          observation: '',
        });
      } catch (error) {
        showAlert('No se pudo registrar correctamente la cita');
      }
    })();
  };

  const handleChange = (field, value) => {
    setAppointment({
      ...appointment,
      [field]: value,
    });
  };

  const onDateChange = (e, selectedDate) => {
    const date = moment(selectedDate).format('YYYY-MM-DD');
    setShowDatePicker(false);
    setAppointment({
      ...appointment,
      startDate: moment(date + ' ' + moment(appointment.startDate).format('HH:mm:ss')).toDate(),
    });
  };

  const onTimeChange = (e, selectedDate) => {
    const time = moment(selectedDate).format('HH:mm:ss');
    setShowTimePicker(false);
    setAppointment({
      ...appointment,
      startDate: moment(moment(appointment.startDate).format('YYYY-MM-DD') + ' ' + time).toDate(),
    });
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (doctors.length > 0) {
      setAppointment({
        ...appointment,
        doctorId: doctors[0].id,
      });
    }
  }, [doctors]);

  return (
    <Root>
      <Title>Nueva cita</Title>
      <FormGroup>
        <Label>Doctor</Label>
        <Picker
          selectedValue={appointment.doctorId}
          onValueChange={(itemValue, itemIndex) => {
            handleChange('doctorId', itemValue);
          }}
        >
          {
            doctors.map(doctor => (
              <Picker.Item
                key={`doctor-${doctor.id}`}
                label={`${doctor.firstName} ${doctor.lastName}`}
                value={doctor.id}
              />
            ))
          }
        </Picker>
      </FormGroup>
      <FormGroup>
        <Label>Día</Label>
        <Button
          backgroundColor='transparent'
          color='blue'
          onPress={() => setShowDatePicker(true)}
        >
          Elegir día
        </Button>
        {
          showDatePicker &&
          <DateTimePicker
            mode='date'
            value={appointment.startDate}
            is24Hour={true}
            display='default'
            onChange={onDateChange}
          />
        }
      </FormGroup>
      <FormGroup>
        <Label>Hora</Label>
        <Button
          backgroundColor='transparent'
          color='blue'
          onPress={() => setShowTimePicker(true)}
        >
          Elegir hora
        </Button>
        {
          showTimePicker &&
          <DateTimePicker
            mode='time'
            value={appointment.startDate}
            is24Hour={true}
            display='default'
            onChange={onTimeChange}
          />
        }
      </FormGroup>
      <FormGroup>
        <Label>Observación</Label>
        <Input
          value={appointment.observation}
          onChangeText={e => handleChange('observation', e)}
        />
      </FormGroup>
      <FormGroup>
        <Button
          onPress={handleRegister}
        >Registrar</Button>
      </FormGroup>
    </Root>
  );
};

export default Appointment;
