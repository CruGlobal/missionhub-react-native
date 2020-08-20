import React, { ReactNode } from 'react';
import {
  ViewStyle,
  TextStyle,
  StyleProp,
  View,
  SafeAreaView,
  Text,
} from 'react-native';

import { Flex } from '../common';

import styles from './styles';

interface HeaderProps {
  right?: ReactNode | null;
  left?: ReactNode | null;
  center?: ReactNode | null;
  title?: string;
  shadow?: boolean;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  testID?: string;
}

const Header = ({
  right,
  left,
  center,
  title,
  titleStyle,
  style,
  shadow = false,
}: HeaderProps) => {
  const renderCenter = () => {
    if (title) {
      return (
        <Flex value={4} align="center" justify="center" style={styles.center}>
          <Text style={[styles.title, titleStyle]} numberOfLines={1}>
            {title}
          </Text>
        </Flex>
      );
    }
    if (center) {
      return (
        <Flex align="center" justify="center" style={styles.center}>
          {center}
        </Flex>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={[styles.header, style, shadow ? styles.shadow : null]}>
        <Flex value={1} align="start" justify="center" style={styles.left}>
          {left || null}
        </Flex>
        {renderCenter()}
        <Flex value={1} align="end" justify="center" style={styles.right}>
          {right || null}
        </Flex>
      </View>
    </SafeAreaView>
  );
};

export default Header;
