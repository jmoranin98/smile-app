import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import styled from 'styled-components/native';
import Button from '../components/Button/Button';

const Root = styled.View`
  margin: 20px;
`;

const Title = styled.Text`
  font-size: 40px;
  line-height: 42px;
`;

const Text = styled.Text`
  font-size: 16px;
  margin: 5px 0;
`;

const Container = styled.View`
  padding: ${({ verticalPadding, horizontalPadding }) => `${verticalPadding || 0}px ${horizontalPadding || 0}px`};
`;

const Account = ({ navigation }) => {
  const [user, setUser] = useState({});

  const handleLogout = () => {
    (async () => {
      await AsyncStorage.removeItem('auth');
      navigation.navigate('Login');
    })();
  };

  useEffect(() => {
    (async () => {
      const auth = await AsyncStorage.getItem('auth');
      const user = JSON.parse(auth);
      setUser(user);
    })();
  }, []);

  return (
    <Root>
      <Title>Cuenta</Title>
      <Container
        verticalPadding='20'
      >
        <Text>
          Document: {user.documentNumber}
        </Text>
        <Text>
          Nombres y Apellidos: {user.firstName} {user.lastName}
        </Text>
        <Text>
          Edad: {user.age}
        </Text>
        <Text>
          Dirección: {user.addres}
        </Text>
        <Text>
          Usuario: {user.username}
        </Text>
      </Container>
      <Container>
        <Button
          onPress={handleLogout}
        >
          Cerrar sesión
        </Button>
      </Container>
    </Root>
  );
};

export default Account;
