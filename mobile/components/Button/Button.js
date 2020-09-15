import React from 'react';
import styled, { css } from 'styled-components/native';

const StyledButton = styled.TouchableOpacity`
  background-color: ${({ backgroundColor }) => backgroundColor || 'blue'};
  padding: 15px 20px;
  border-radius: 4px;
`;

const ButtonText = styled.Text`
  color: ${({ color }) => color || 'white'};
  font-size: 16px;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 1.5px;
`;

const Button = ({
  children,
  backgroundColor,
  color,
  onPress,
  disabled,
}) => (
  <StyledButton
    disabled={disabled}
    onPress={onPress}
    backgroundColor={backgroundColor}
  >
    <ButtonText
      color={color}
    >
      {children}
    </ButtonText>
  </StyledButton>
);

export default Button;
