import React from 'react';
import { Keyboard, StyleProp, ViewStyle } from 'react-native';
import { useDispatch } from 'react-redux';

import { navigateBack } from '../../actions/navigation';
import Button from '../../components/Button';
import BackArrowIcon from '../../../assets/images/backArrowIcon.svg';
import theme from '../../theme';

import styles from './styles';

interface BackButtonProps {
  style?: StyleProp<ViewStyle>;
  iconColor?: string;
  iconSize?: number;
  customNavigate?: () => void;
}

const BackButton = ({
  style,
  customNavigate,
  iconColor = theme.lightGrey,
  iconSize = 20,
}: BackButtonProps) => {
  const dispatch = useDispatch();
  const onPress = () => {
    customNavigate ? customNavigate() : dispatch(navigateBack());
    Keyboard.dismiss(); // Always dismiss the keyboard when navigating back
  };

  return (
    <Button
      style={[styles.container, style]}
      onPress={onPress}
      testID="BackButton"
    >
      <BackArrowIcon color={iconColor} width={iconSize} height={iconSize} />
    </Button>
  );
};

export default BackButton;
