import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import Button from '../components/Button/Button';
import FormGroup from '../components/FormGroup';
import Input from '../components/Input';
import Label from '../components/Label';
import { BASE_URL } from '../services';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

const Root = styled.View`
  justify-content: center;
  padding: 20px;
  min-height: 100%;
`;

const Title = styled.Text`
  font-size: 45px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Subtitle = styled.Text`
  font-size: 30px;
`;

const Login = ({ navigation }) => {
  const [user, setUser] = useState({
    username: '',
    password: '',
  });

  useEffect(() => {
    (async () => {
      const auth = await AsyncStorage.getItem('auth');
      if (auth) navigation.navigate('Home');
    })();
  }, []);

  const handleLogin = () => {
    (async () => {
      try {
        const { data } = await axios.post(`${BASE_URL}/auth/login`, user);
        if (data.user) {
          await AsyncStorage.setItem('auth', JSON.stringify(data.user));
          navigation.navigate('Home');
        }
      } catch (error) {
        console.error(error);
      }
    })();
  };

  const handleMoveToRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <Root>
      <Title>Smile App</Title>
      <Subtitle>Iniciar Sesión</Subtitle>
      <View>
        <FormGroup>
          <Label>Usuario</Label>
          <Input
            value={user.username}
            onChangeText={e => setUser({ ...user, username: e })}
          />
        </FormGroup>
        <FormGroup>
          <Label>Contraseña</Label>
          <Input
            secureTextEntry={true}
            value={user.password}
            onChangeText={e => setUser({ ...user, password: e })}
          />
        </FormGroup>
        <FormGroup>
          <Button onPress={handleLogin}>
            Ingresar
          </Button>
        </FormGroup>
        <FormGroup>
          <Button
            backgroundColor='transparent'
            color='blue'
            onPress={handleMoveToRegister}
          >
            Registrarse
          </Button>
        </FormGroup>
      </View>
    </Root>
  );
};

export default Login;
