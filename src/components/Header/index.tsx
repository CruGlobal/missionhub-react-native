import React from 'react';
import { SafeAreaView, ViewStyle, TextStyle, StyleProp } from 'react-native';

import { Flex, Text, Button } from '../common';

import styles from './styles';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const HeaderIcon = ({ ...rest }: any) => (
  <Button type="transparent" style={styles.headerIcon} {...rest} />
);

interface HeaderProps {
  right?: JSX.Element | null;
  left?: JSX.Element | null;
  center?: JSX.Element | null;
  title?: string;
  title2?: string;
  shadow?: boolean;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
}

const Header = ({
  right,
  left,
  center,
  title,
  title2,
  titleStyle,
  style,
  shadow = true,
}: HeaderProps) => {
  const renderLeft = () => {
    return (
      <Flex value={1} align="start" justify="center" style={styles.left}>
        {left || null}
      </Flex>
    );
  };

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

  const renderRight = () => {
    return (
      <Flex value={1} align="end" justify="center" style={styles.right}>
        {right || null}
      </Flex>
    );
  };

  return (
    <SafeAreaView style={[styles.header, style, shadow ? styles.shadow : null]}>
      {renderLeft()}
      {renderCenter()}
      {renderRight()}
    </SafeAreaView>
  );
};

export default Header;
