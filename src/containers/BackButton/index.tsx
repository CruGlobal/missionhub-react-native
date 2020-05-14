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

import { Touchable } from '../../components/common';
import { navigateBack } from '../../actions/navigation';
import IconButton from '../../components/IconButton';

import styles from './styles';
import BackArrowIcon from './BackArrowIcon.svg';

interface BackButtonProps {
  dispatch: ThunkDispatch<{}, {}, AnyAction>;
  style?: StyleProp<ViewStyle>;
  customIcon?: string;
  image?: ImageSourcePropType;
  iconStyle?: StyleProp<TextStyle>;
  customNavigate?: () => void;
}

const BackButton = ({
  dispatch,
  style,
  customIcon,
  image,
  iconStyle,
  customNavigate,
}: BackButtonProps) => {
  const onPress = () => {
    customNavigate ? customNavigate() : dispatch(navigateBack());
    Keyboard.dismiss(); // Always dismiss the keyboard when navigating back
  };

  return (
    <View style={[styles.container, style]}>
      {customIcon ? (
        <IconButton
          name="backIcon"
          type="MissionHub"
          onPress={onPress}
          style={iconStyle}
          image={image}
          testID="BackButton"
        />
      ) : (
        <Touchable onPress={onPress} testID="BackButton" style={styles.button}>
          <BackArrowIcon />
        </Touchable>
      )}
    </View>
  );
};

export default connect()(BackButton);
