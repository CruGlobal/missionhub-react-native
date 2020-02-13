import React, { ReactNode } from 'react';
import {
  ViewStyle,
  TextStyle,
  StyleProp,
  View,
  SafeAreaView,
} from 'react-native';

import { Flex, Text, Button } from '../common';

import styles from './styles';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const HeaderIcon = (props: any) => (
  <Button type="transparent" style={styles.headerIcon} {...props} />
);

interface HeaderProps {
  right?: ReactNode | null;
  left?: ReactNode | null;
  center?: ReactNode | null;
  title?: string;
  title2?: string;
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
  title2,
  titleStyle,
  style,
  shadow = false,
}: HeaderProps) => {
  const renderCenter = () => {
    if (title && title2) {
      return (
        <Flex
          value={4}
          align="center"
          justify="center"
          style={styles.headerTwoLine}
        >
          <Text style={styles.headerTwoLine1} numberOfLines={1}>
            {title2}
          </Text>
          <Text style={styles.headerTwoLine2} numberOfLines={1}>
            {title}
          </Text>
        </Flex>
      );
    }
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
        <Flex align="center" justify="center" value={5} style={styles.center}>
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
        <Flex value={0} align="end" justify="center" style={styles.right}>
          {right || null}
        </Flex>
      </View>
    </SafeAreaView>
  );
};

export default Header;
