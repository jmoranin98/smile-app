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

const Root = styled.ScrollView`
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

const BudgetItem = styled.View`
  flex-direction: row;
  padding: 5px 0;
`;

const BudgetDetail = ({ route, navigation }) => {
  const { appointmentId } = route.params;

  const [materials, setMaterials] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    (async () => {
      const { data } = await axios(`${BASE_URL}/appointments/${appointmentId}/budget`);
      let total = 0;
      data.materials.forEach(material => total += material.totalPrice);
      setTotal(total);
      setMaterials(data.materials);
    })();
  }, []);

  return (
    <Root>
      <Title>Proforma</Title>
      {
        materials.length === 0 ?
          <Subtitle>
            La proforma no se ha generado aún
          </Subtitle> :
          <Container>
            <Subtitle>Materiales</Subtitle>
            <BudgetItem>
              <View style={{ flex: 4 }}>
                <Text style={{ fontSize: 18 }}>ID</Text>
              </View>
              <View style={{ flex: 4 }}>
                <Text style={{ fontSize: 18, textAlign: 'center' }}>Cantidad</Text>
              </View>
              <View style={{ flex: 4 }}>
                <Text style={{ fontSize: 18, textAlign: 'right' }}>Submonto</Text>
              </View>
            </BudgetItem>
            {
              materials.map(material => (
                <BudgetItem>
                  <View style={{ flex: 4 }}>
                    <Text style={{ fontSize: 18 }}>{material.productId}</Text>
                  </View>
                  <View style={{ flex: 4 }}>
                    <Text style={{ fontSize: 18, textAlign: 'center' }}>{material.quantity}</Text>
                  </View>
                  <View style={{ flex: 4 }}>
                    <Text style={{ fontSize: 18, textAlign: 'right' }}>{material.totalPrice}</Text>
                  </View>
                </BudgetItem>
              ))
            }
            <Container
              verticalPadding='30'
            >
              <Text style={{
                fontWeight: 'bold',
                fontSize: 30,
              }}>
                Total: {total} PEN.
              </Text>
            </Container>
            {/* <BudgetItem>
              <View style={{ flex: 8 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Total</Text>
              </View>
              <View style={{ flex: 4 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'right' }}>{total}</Text>
              </View>
            </BudgetItem> */}
          </Container>
      }
    </Root>
  );
};

export default BudgetDetail;
