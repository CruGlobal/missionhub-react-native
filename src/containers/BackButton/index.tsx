import React from 'react';
import { View, Keyboard, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';

import { navigateBack } from '../../actions/navigation';
import IconButton from '../../components/IconButton';

import styles from './styles';

interface BackButtonProps {
  dispatch: ThunkDispatch<{}, {}, AnyAction>;
  style?: StyleProp<ViewStyle>;
  customIcon?: string;
  iconStyle?: StyleProp<TextStyle>;
  customNavigate?: () => void;
}

const BackButton = ({
  dispatch,
  style,
  customIcon,
  iconStyle,
  customNavigate,
}: BackButtonProps) => {
  const onPress = () => {
    customNavigate ? customNavigate() : dispatch(navigateBack());
    Keyboard.dismiss(); // Always dismiss the keyboard when navigating back
  };

  return (
    <View style={[styles.container, style]}>
      <IconButton
        name={customIcon || 'backIcon'}
        type="MissionHub"
        onPress={onPress}
        style={iconStyle}
        testID="BackButton"
      />
    </View>
  );
};

export default connect()(BackButton);
