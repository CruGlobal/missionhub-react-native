import React from 'react';
import { Keyboard, StyleProp, ViewStyle } from 'react-native';
import { useDispatch } from 'react-redux';

import { navigateBack } from '../../actions/navigation';
import Button from '../../components/Button';
import CloseButtonIcon from '../../../assets/images/closeButton.svg';
import CloseIcon from '../../../assets/images/closeIcon.svg';
import theme from '../../theme';

import styles from './styles';

export enum CloseButtonTypeEnum {
  circle = 'circle',
  noCircle = 'noCircle',
}

interface CloseButtonProps {
  style?: StyleProp<ViewStyle>;
  type?: CloseButtonTypeEnum;
  iconColor?: string;
  customNavigate?: () => void;
}

const CloseButton = ({
  style,
  customNavigate,
  type = CloseButtonTypeEnum.noCircle,
  iconColor = theme.lightGrey,
}: CloseButtonProps) => {
  const dispatch = useDispatch();
  const onPress = () => {
    customNavigate ? customNavigate() : dispatch(navigateBack());
    Keyboard.dismiss(); // Always dismiss the keyboard when navigating back
  };

  const getIcon = () => {
    switch (type) {
      case CloseButtonTypeEnum.noCircle:
        return <CloseIcon color={iconColor} />;
      case CloseButtonTypeEnum.circle:
        return <CloseButtonIcon color={iconColor} />;
    }
  };

  return (
    <Button
      style={[styles.container, style]}
      onPress={onPress}
      testID="CloseButton"
    >
      {getIcon()}
    </Button>
  );
};

export default CloseButton;
