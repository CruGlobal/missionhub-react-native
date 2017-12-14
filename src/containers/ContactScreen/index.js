import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { navigateBack } from '../../actions/navigation';

import styles from './styles';
import { Flex, Text, IconButton } from '../../components/common';
import ContactHeader from '../../components/ContactHeader';
import Header from '../Header';

class ContactScreen extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { person } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <Header
          left={
            <IconButton name="backIcon" type="MissionHub" onPress={() => this.props.dispatch(navigateBack())} />
          }
          right={
            <IconButton name="moreIcon" type="MissionHub" onPress={()=> LOG('more')} />
          }
          shadow={false}
        />
        <ContactHeader type="casey" name={person.first_name} />
        <Flex align="center" justify="center" value={1} style={styles.container}>
          <Text>{person.id}</Text>
        </Flex>
      </View>
    );
  }
}

ContactScreen.propTypes = {
  person: PropTypes.shape({
    id: PropTypes.string.isRequired,
    first_name: PropTypes.string.isRequired,
  }).isRequired,
};

const mapStateToProps = (state, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default connect(mapStateToProps)(ContactScreen);
