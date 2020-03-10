import React from 'react';
import { Image, ImageSourcePropType, View } from 'react-native';

import { Text } from '../../components/common';
import BottomButton from '../../components/BottomButton';
import Skip from '../../components/Skip';
import BackButton from '../BackButton';
import Header from '../../components/Header';

import styles from './styles';

interface IconMessageScreenProps {
  mainText: string;
  buttonText: string;
  iconPath: ImageSourcePropType;
  onComplete: () => void;
  onSkip?: () => void;
  onBack?: () => void;
  testID?: string;
}

const IconMessageScreen = ({
  mainText,
  buttonText,
  iconPath,
  onComplete,
  onSkip,
  onBack,
}: IconMessageScreenProps) => (
  <View style={styles.container}>
    <Header
      left={onBack ? <BackButton customNavigate={onBack} /> : null}
      right={onSkip ? <Skip onSkip={onSkip} /> : null}
    />
    <View style={styles.content}>
      <Image source={iconPath} style={styles.image} />
      <Text style={styles.text}>{mainText}</Text>
    </View>
    <BottomButton onPress={onComplete} text={buttonText} />
  </View>
);

export default IconMessageScreen;
