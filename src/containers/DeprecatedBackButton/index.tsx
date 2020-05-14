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

import styles from './styles';

interface DeprecatedBackButtonProps {
  dispatch: ThunkDispatch<{}, {}, AnyAction>;
  style?: StyleProp<ViewStyle>;
  customIcon?: string;
  RenderIcon?: React.ReactNode;
  image?: ImageSourcePropType;
  iconStyle?: StyleProp<TextStyle>;
  customNavigate?: () => void;
}

const DeprecatedBackButton = ({
  dispatch,
  style,
  customIcon,
  image,
  iconStyle,
  customNavigate,
}: DeprecatedBackButtonProps) => {
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
        image={image}
        testID="DeprecatedBackButton"
      />
    </View>
  );
};

export default connect()(DeprecatedBackButton);
