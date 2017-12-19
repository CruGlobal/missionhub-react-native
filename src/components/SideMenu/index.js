import React, { Component } from 'react';
import { BackHandler } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Flex } from '../common';
import styles from './styles';
import Button from '../Button';
import IconButton from '../IconButton';
import { navigatePush } from '../../actions/navigation';

@connect()
export default class SideMenu extends Component {
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }

  onBackPress = () => {
    this.props.dispatch(navigatePush('DrawerClose'));
    return true;
  };

  render() {
    return (
      <Flex value={1} style={styles.background}>
        <Flex style={styles.buttonContainer}>
          <IconButton style={styles.button} onPress={() => this.props.dispatch(navigatePush('DrawerClose'))} name="close" type="Material" size={20} />
        </Flex>
        {this.props.menuItems.map(({ label, action }, index) =>
          <Flex key={index} style={styles.buttonContainer}>
            <Button style={styles.button} buttonTextStyle={styles.buttonText} text={label.toUpperCase()} onPress={action} />
          </Flex>
        )}
      </Flex>
    );
  }
}

SideMenu.propTypes = {
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      action: PropTypes.func,
    })
  ),
};
