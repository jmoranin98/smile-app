import React, { useState } from 'react';
import styled from 'styled-components/native';
import Button from '../components/Button/Button';
import FormGroup from '../components/FormGroup';
import Input from '../components/Input';
import Label from '../components/Label';
import { View } from 'react-native';
import axios from 'axios';
import { BASE_URL } from '../services';

const Root = styled.ScrollView`
  padding: 0 20px;
`;

const Title = styled.Text`
  font-size: 25px;
  margin: 20px 0;
  font-weight: bold;
  color: blue;
`;

const Register = ({ navigation }) => {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    documentNumber: '',
    age: 5,
    address: '',
    email: '',
    username: '',
    password: '',
    role: 'client',
  });

  const handleChange = (field, value) => {
    setUser({
      ...user,
      [field]: value,
    });
  };

  const handleRegister = () => {
    (async () => {
      try {
        await axios.post(`${BASE_URL}/auth/signup`, { user });
        navigation.navigate('Login');
      } catch (error) {
        console.error(error);
        alert('No se completó el registro correctamente');
      }
    })();
  };

  return (
    <Root>
      <Title>Registrarse</Title>
      <View>
        <FormGroup>
          <Label>Nro de documento</Label>
          <Input
            value={user.documentNumber}
            onChangeText={e => handleChange('documentNumber', e)}
          />
        </FormGroup>
        <FormGroup>
          <Label>Nombres</Label>
          <Input
            value={user.firstName}
            onChangeText={e => handleChange('firstName', e)}
          />
        </FormGroup>
        <FormGroup>
          <Label>Apellidos</Label>
          <Input
            value={user.lastName}
            onChangeText={e => handleChange('lastName', e)}
          />
        </FormGroup>
        <FormGroup>
          <Label>Edad</Label>
          <Input
            value={user.age}
            onChangeText={e => handleChange('age', e)}
            keyboardType='numeric'
          />
        </FormGroup>
        <FormGroup>
          <Label>Dirección</Label>
          <Input
            value={user.address}
            onChangeText={e => handleChange('address', e)}
          />
        </FormGroup>
        <FormGroup>
          <Label>Email</Label>
          <Input
            value={user.email}
            onChangeText={e => handleChange('email', e)}
            keyboardType='email-address'
          />
        </FormGroup>
        <FormGroup>
          <Label>Usuario</Label>
          <Input
            value={user.username}
            onChangeText={e => handleChange('username', e)}
          />
        </FormGroup>
        <FormGroup>
          <Label>Contraseña</Label>
          <Input
            value={user.password}
            secureTextEntry={true}
            onChangeText={e => handleChange('password', e)}
          />
        </FormGroup>
        <FormGroup>
          <Button
            onPress={handleRegister}
          >Aceptar</Button>
        </FormGroup>
      </View>
    </Root>
  )
};

export default Register;
