import React from 'react';
import { SafeAreaView, Image, ImageSourcePropType } from 'react-native';

import { Flex, Text } from '../../components/common';
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
  <SafeAreaView style={styles.container}>
    <Header
      left={onBack ? <BackButton customNavigate={onBack} /> : null}
      right={onSkip ? <Skip onSkip={onSkip} /> : null}
    />
    <Flex align="center" justify="center" value={1} style={styles.content}>
      <Flex align="start" justify="center" value={4}>
        <Image source={iconPath} style={styles.image} />
        <Text style={styles.text}>{mainText}</Text>
      </Flex>

      <BottomButton onPress={onComplete} text={buttonText} />
    </Flex>
  </SafeAreaView>
);

export default IconMessageScreen;
