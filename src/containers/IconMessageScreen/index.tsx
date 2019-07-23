import React from 'react';
import { SafeAreaView, Image, ImageSourcePropType } from 'react-native';

import { Flex, Text } from '../../components/common';
import BottomButton from '../../components/BottomButton';
import AbsoluteSkip from '../../components/AbsoluteSkip';
import { BackButton } from '../BackButton';

import styles from './styles';

interface IconMessageScreenProps {
  mainText: string;
  buttonText: string;
  iconPath: ImageSourcePropType;
  onComplete: () => void;
  onSkip?: () => void;
  onBack?: () => void;
}

const IconMessageScreen = ({
  mainText,
  buttonText,
  iconPath,
  onComplete,
  onSkip,
  onBack,
}: IconMessageScreenProps) => (
  <Flex align="center" justify="center" value={1} style={styles.container}>
    <Flex align="start" justify="center" value={4}>
      <Image source={iconPath} style={styles.image} />
      <Text style={styles.text}>{mainText}</Text>
    </Flex>
    <SafeAreaView style={{ flex: 1, justifyContent: 'flex-end' }}>
      <BottomButton onPress={onComplete} text={buttonText} />
    </SafeAreaView>
    {onSkip ? <AbsoluteSkip onSkip={onSkip} /> : null}
    {onBack ? <BackButton absolute={true} customNavigate={onBack} /> : null}
  </Flex>
);

export default IconMessageScreen;
