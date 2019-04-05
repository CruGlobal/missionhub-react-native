import React, { Component } from 'react';
import { SafeAreaView } from 'react-native';
import PropTypes from 'prop-types';

import { Flex, Text, Button } from '../common';

import styles from './styles';

export const HeaderIcon = ({ ...rest }) => (
  <Button type="transparent" style={styles.headerIcon} {...rest} />
);

export default class Header extends Component {
  renderLeft() {
    const { left } = this.props;
    return (
      <Flex value={1} align="start" justify="center" style={styles.left}>
        {left || null}
      </Flex>
    );
  }
  renderCenter() {
    const { title, title2, center, titleStyle } = this.props;
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
  }
  renderRight() {
    const { right } = this.props;
    return (
      <Flex value={1} align="end" justify="center" style={styles.right}>
        {right || null}
      </Flex>
    );
  }
  render() {
    const { shadow, style } = this.props;
    return (
      <SafeAreaView
        style={[styles.header, style, shadow ? styles.shadow : null]}
      >
        {this.renderLeft()}
        {this.renderCenter()}
        {this.renderRight()}
      </SafeAreaView>
    );
  }
}

Header.propTypes = {
  right: PropTypes.element,
  left: PropTypes.element,
  center: PropTypes.element,
  title: PropTypes.string,
  title2: PropTypes.string,
  shadow: PropTypes.bool,
};

Header.defaultProps = {
  shadow: true,
};
