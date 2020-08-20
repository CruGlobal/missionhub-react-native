import React from 'react';
import { Keyboard, StyleProp, ViewStyle } from 'react-native';
import { useDispatch } from 'react-redux';

import { navigateBack } from '../../actions/navigation';
import BackArrowIcon from '../../../assets/images/backArrowIcon.svg';
import { Touchable } from '../common';
import theme from '../../theme';

import styles from './styles';

interface BackButtonProps {
  style?: StyleProp<ViewStyle>;
  iconColor?: string;
  customNavigate?: () => void;
}

const BackButton = ({
  style,
  customNavigate,
  iconColor = theme.lightGrey,
}: BackButtonProps) => {
  const dispatch = useDispatch();
  const onPress = () => {
    customNavigate ? customNavigate() : dispatch(navigateBack());
    Keyboard.dismiss(); // Always dismiss the keyboard when navigating back
  };

  return (
    <Touchable
      style={[styles.container, style]}
      onPress={onPress}
      testID="BackButton"
    >
      <BackArrowIcon color={iconColor} />
    </Touchable>
  );
};

export default BackButton;
