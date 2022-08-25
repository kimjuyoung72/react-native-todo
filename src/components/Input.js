import React from "react";
import styled from "styled-components/native";
import { Dimensions } from 'react-native';
import PropTypes from 'prop-types';
// import { PlatformColor, useWindowDimensions } from 'react-native';
import reactDom from "react-dom";

const StyledInput = styled.TextInput.attrs(
    ({placeholder}) =>
    ({

        placeholderTextColor : 'orange'
    })
    
)`
    width: ${({width})=>width - 40}px;
    /* height: 60px; */
    margin: 3px 0;
    padding: 15px 20px;
    border-radius: 10px;
    background-color: ${({theme})=>theme.itemBackground};
    font-size: 25px;
    color: ${({theme})=>theme.text};
`;

const Input = ({placeholder, value, onChangeText, onSubmitEditing, onBlur}) => {
    const width = Dimensions.get('window').width;
    // const width = useWindowDimensions().width;
    return (<StyledInput 
                width={width} 
                placeholder={placeholder} 
                maxLength={50}
                autoCapitalize={'none'}
                // multiline={true}
                // numberOfLines={3}
                value={value}
                onChangeText={onChangeText}
                onSubmitEditing={onSubmitEditing}
                onBlur={onBlur}
                />);
}
Input.defaultProps = {
    value: 'lorem'
}
Input.propTypes = {
    placeholder: PropTypes.string.isRequired,
    value: PropTypes.string,
    onChangeText: PropTypes.func.isRequired,
    onSubmitEditing: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired
};
export default Input;