import React from 'react';
import styled from 'styled-components/native';

const StyledInput = styled.TextInput`
  border: #e0e0e0;
  border-radius: 4px;
  padding: 5px 10px;
`;

const Input = (props) => <StyledInput {...props}/>;

export default Input;
