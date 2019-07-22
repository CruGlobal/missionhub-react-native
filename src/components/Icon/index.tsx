import React from 'react';
import { Platform, TextStyle, StyleProp } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Material from 'react-native-vector-icons/MaterialIcons';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import icoMoonConfig from '../../../assets/icoMoonConfig.json';

import PLATFORM_MAP from './mapping';
import styles from './styles';

const MissionHub = createIconSetFromIcoMoon(icoMoonConfig);

export interface IconProps {
  name: string;
  style?: StyleProp<TextStyle>;
  type?: 'Material' | 'FontAwesome' | 'Ionicons' | 'MissionHub';
  size?: number;
  testID?: string;
}

const Icon = ({ name, type, size = 18, style = {} }: IconProps) => {
  // Default style options
  let iconName = name;
  let iconType = type;
  // Get any platform specific icons
  if (PLATFORM_MAP[name]) {
    if (Platform.OS == 'android' && PLATFORM_MAP[name].android) {
      iconName = PLATFORM_MAP[name].android.name;
      iconType = PLATFORM_MAP[name].android.type;
    } else if (Platform.OS == 'ios' && PLATFORM_MAP[name].ios) {
      iconName = PLATFORM_MAP[name].ios.name;
      iconType = PLATFORM_MAP[name].ios.type;
    }
  }
  // Set the type of icon to be rendered
  let Tag;
  if (iconType === 'FontAwesome') {
    Tag = FontAwesome;
  } else if (iconType === 'Ionicons') {
    Tag = Ionicons;
  } else if (iconType === 'MissionHub') {
    Tag = MissionHub;
  } else {
    Tag = Material;
  }
  return (
    <Tag name={iconName} style={[styles.icon, { fontSize: size }, style]} />
  );
};

export default Icon;
