import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Material from 'react-native-vector-icons/MaterialIcons';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FAGlyphs from 'react-native-vector-icons/glyphmaps/FontAwesome.json';
import MaterialGlyphs from 'react-native-vector-icons/glyphmaps/MaterialIcons.json';
import IoniconsGlyphs from 'react-native-vector-icons/glyphmaps/Ionicons.json';

import MissionHubIconGlyphs from '../../../assets/MissionHubIconGlyphs.json';
import icoMoonConfig from '../../../assets/icoMoonConfig.json';

import PLATFORM_MAP from './mapping';
import styles from './styles';

const ICON_TYPES = ['Material', 'FontAwesome', 'Ionicons', 'MissionHub'];
const MissionHub = createIconSetFromIcoMoon(icoMoonConfig);
export default class Icon extends Component {
  setNativeProps(nProps) {
    this._view.setNativeProps(nProps);
  }
  render() {
    const { name, type, size = 18, style = {} } = this.props;
    // Default style options
    let iconName = name;
    let iconType = type;

    // Get any platform specific icons
    if (PLATFORM_MAP[name] && PLATFORM_MAP[name][Platform.OS]) {
      iconName = PLATFORM_MAP[name][Platform.OS].name;
      iconType = PLATFORM_MAP[name][Platform.OS].type;
    }

    // Set the type of icon to be rendered
    let Tag;
    if (iconType === 'FontAwesome') Tag = FontAwesome;
    else if (iconType === 'Ionicons') Tag = Ionicons;
    else if (iconType === 'MissionHub') Tag = MissionHub;
    else Tag = Material;

    return (
      <Tag
        ref={c => (this._view = c)}
        name={iconName}
        style={[styles.icon, { fontSize: size }, style]}
      />
    );
  }
}

Icon.propTypes = {
  name: PropTypes.oneOf([
    ...Object.keys(FAGlyphs),
    ...Object.keys(MaterialGlyphs),
    ...Object.keys(IoniconsGlyphs),
    ...Object.keys(MissionHubIconGlyphs),
  ]).isRequired,
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.array,
  ]),
  type: PropTypes.oneOf(ICON_TYPES),
  size: PropTypes.number,
};

Icon.defaultProps = {
  type: 'Material',
};
