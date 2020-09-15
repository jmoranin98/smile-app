import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import Button from '../components/Button/Button';
import Input from '../components/Input';
import { Picker } from '@react-native-community/picker';
import {
  View,
  Text,
  ToastAndroid,
} from 'react-native';
import axios from 'axios';
import { BASE_URL } from '../services';

const Root = styled.View`
  margin: 20px;
`;

const Title = styled.Text`
  font-size: 40px;
  line-height: 42px;
  margin-bottom: 20px;
`;

const Subtitle = styled.Text`
  font-size: 25px;
  color: #78909C;
  margin: 10px 0;
`;

const Container = styled.View`
  padding: ${({ verticalPadding, horizontalPadding }) => `${verticalPadding || 0}px ${horizontalPadding || 0}px`};
`;

const ConfirmAppointment = ({ route, navigation }) => {
  const { appointmentId } = route.params;

  const [materials, setMaterials] = useState([]);
  const [newItem, setNewItem] = useState({
    productId: -1,
    quantity: '1',
  });

  const [productsSelected, setProductsSelected] = useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await axios(`${BASE_URL}/materials`);
      setMaterials(data);
    })();
  }, []);

  const handleAdd = () => {
    setProductsSelected([
      ...productsSelected,
      newItem,
    ]);
    setNewItem({
      ...newItem,
      quantity: '1',
    });
  };

  const handleConfirm = () => {
    (async () => {
      try {
        const { data } = await axios.put(`${BASE_URL}/appointments/${appointmentId}`, {
          appointment: {
            status: 'confirmed',
          },
          items: productsSelected,
        });
        console.log(data);
        navigation.goBack();
      } catch (error) {
        ToastAndroid.show('No se pudo confirmar la cita', ToastAndroid.SHORT);
      }
    })();
  };

  return (
    <Root>
      <Title>Seleccionar materiales</Title>
      <Container>
        <View style={{
          display: 'flex',
          flexDirection: 'row',
        }}>
          <View style={{
            flex: 9,
          }}>
            <Picker
              onValueChange={e => setNewItem({ ...newItem, productId: e })}
              selectedValue={newItem.productId}
            >
              {
                materials.map(material => (
                  <Picker.Item
                    key={`product-${material.id_prod}`}
                    label={material.nombre}
                    value={material.id_prod}
                  />
                ))
              }
            </Picker>
          </View>
          <View style={{
            flex: 3,
          }}>
            <Input
              value={newItem.quantity}
              onChangeText={e => setNewItem({ ...newItem, quantity: e })}
              keyboardType='numeric'
            />
          </View>
        </View>
        <Button
          onPress={handleAdd}
          backgroundColor='transparent'
          color='blue'
        >
          Agregar material
        </Button>
      </Container>
      <Container verticalPadding='10'>
        <Subtitle>
          Materiales
        </Subtitle>
        {
          productsSelected.map(product => (
            <View>
              <Text>x{product.quantity} Producto #{product.productId}</Text>
            </View>
          ))
        }
      </Container>
      <Container
        verticalPadding='30'
      >
        <Button
          onPress={handleConfirm}
        >
          Confirmar
        </Button>
      </Container>
    </Root>
  )
};

export default ConfirmAppointment;
