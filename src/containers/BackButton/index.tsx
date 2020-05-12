import React from 'react';
import {
  View,
  Keyboard,
  StyleProp,
  ViewStyle,
  TextStyle,
  ImageSourcePropType,
} from 'react-native';
import { AnyAction } from 'redux';
import { connect } from 'react-redux-legacy';
import { ThunkDispatch } from 'redux-thunk';

import { navigateBack } from '../../actions/navigation';
import IconButton from '../../components/IconButton';
import Button from '../../components/Button';

import styles from './styles';

interface BackButtonProps {
  dispatch: ThunkDispatch<{}, {}, AnyAction>;
  style?: StyleProp<ViewStyle>;
  customIcon?: string;
  RenderIcon?: React.ReactNode;
  image?: ImageSourcePropType;
  iconStyle?: StyleProp<TextStyle>;
  customNavigate?: () => void;
}

const BackButton = ({
  dispatch,
  style,
  RenderIcon,
  customIcon,
  image,
  iconStyle,
  customNavigate,
}: BackButtonProps) => {
  const onPress = () => {
    customNavigate ? customNavigate() : dispatch(navigateBack());
    Keyboard.dismiss(); // Always dismiss the keyboard when navigating back
  };

  if (RenderIcon) {
    return (
      <Button style={[styles.container, style]} onPress={onPress}>
        {RenderIcon}
      </Button>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <IconButton
        name={customIcon || 'backIcon'}
        type="MissionHub"
        onPress={onPress}
        style={iconStyle}
        image={image}
        testID="BackButton"
      />
    </View>
  );
};

export default connect()(BackButton);
