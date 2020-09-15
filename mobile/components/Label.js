import React from 'react';
import styled from 'styled-components/native';

const StyledLabel = styled.Text`
  font-size: 16px;
  margin-bottom: 10px;
`;

const Label = (props) => <StyledLabel {...props}/>;

export default Label;

