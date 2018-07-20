import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Flex, Text, Button } from '../../components/common';

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
    const { title, title2, center } = this.props;
    if (title && title2) {
      return (
        <Flex
          value={2}
          direction="column"
          align="center"
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
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </Flex>
      );
    }
    return (
      <Flex align="center" justify="center" value={5} style={styles.center}>
        {center || null}
      </Flex>
    );
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
    const { shadow } = this.props;
    return (
      <Flex
        direction="row"
        style={[styles.header, shadow ? styles.shadow : null]}
      >
        {this.renderLeft()}
        {this.renderCenter()}
        {this.renderRight()}
      </Flex>
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
