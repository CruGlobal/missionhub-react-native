import React from 'react';
import { Keyboard, StyleProp, ViewStyle, Insets } from 'react-native';
import { useDispatch } from 'react-redux';

import { navigateBack } from '../../actions/navigation';
import CloseButtonIcon from '../../../assets/images/closeButton.svg';
import CloseIcon from '../../../assets/images/closeIcon.svg';
import ThickCloseIcon from '../../../assets/images/thickCloseIcon.svg';
import { Touchable } from '../common';
import theme from '../../theme';

import styles from './styles';

export enum CloseButtonTypeEnum {
  circle = 'circle',
  noCircle = 'noCircle',
  thick = 'thick',
}

interface CloseButtonProps {
  style?: StyleProp<ViewStyle>;
  type?: CloseButtonTypeEnum;
  iconColor?: string;
  customNavigate?: () => void;
  size?: number;
  hitSlop?: Insets;
  testID?: string;
}

const CloseButton = ({
  style,
  customNavigate,
  type = CloseButtonTypeEnum.noCircle,
  iconColor = theme.lightGrey,
  size,
  ...rest
}: CloseButtonProps) => {
  const dispatch = useDispatch();
  const onPress = () => {
    customNavigate ? customNavigate() : dispatch(navigateBack());
    Keyboard.dismiss(); // Always dismiss the keyboard when navigating back
  };

  const getIcon = () => {
    const extraStyles = size ? { width: size, height: size } : {};

    switch (type) {
      case CloseButtonTypeEnum.noCircle:
        return <CloseIcon color={iconColor} {...extraStyles} />;
      case CloseButtonTypeEnum.circle:
        return <CloseButtonIcon color={iconColor} {...extraStyles} />;
      case CloseButtonTypeEnum.thick:
        return <ThickCloseIcon color={iconColor} {...extraStyles} />;
    }
  };

  return (
    <Touchable
      style={[styles.container, style]}
      onPress={onPress}
      testID="CloseButton"
      {...rest}
    >
      {getIcon()}
    </Touchable>
  );
};

export default CloseButton;
