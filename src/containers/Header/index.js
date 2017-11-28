import React, { Component } from 'react';
import { connect } from 'react-redux';

// import { logout } from '../../actions/auth';
// import { navigatePush } from '../../actions/navigation';
import styles from './styles';
import { Flex, Text, Button } from '../../components/common';

export const HeaderIcon = ({ ...rest }) => (
  <Button
    type="transparent"
    style={styles.headerIcon}
    {...rest}
  />
);

class Header extends Component {
  renderLeft() {
    const { left } = this.props;
    return (
      <Flex align="center" justify="center" style={styles.left}>
        {left || null}
      </Flex>
    );
  }
  renderCenter() {
    const { title, title2, center } = this.props;
    if (title && title2) {
      return (
        <Flex value={1} direction="column" align="center" style={styles.headerTwoLine}>
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
        <Flex align="center" justify="center" value={1} style={styles.center}>
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
      <Flex align="center" justify="center" style={styles.right}>
        {right || null}
      </Flex>
    );
  }
  render() {
    return (
      <Flex direction="row" style={styles.header}>
        {this.renderLeft()}
        {this.renderCenter()}
        {this.renderRight()}
      </Flex>
    );
  }
}

export default connect()(Header);
