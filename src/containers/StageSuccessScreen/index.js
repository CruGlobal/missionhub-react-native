import React, {Component} from 'react';
import {connect} from 'react-redux';
import {navigatePush, navigateBack} from '../../actions/navigation';

import styles from './styles';
import {Flex, Text, Button} from '../../components/common';
import projectStyles from '../../projectStyles';

class StageSuccessScreen extends Component {
  render() {
    return (
      <Flex align="center" justify="center" value={1} style={styles.container}>
        <Flex style={{position: 'absolute', top: 0, left: 0}}>
          <Button text="Back" onPress={() => this.props.dispatch(navigateBack())} />
        </Flex>

        <Text style={[projectStyles.primaryTextStyle, {textAlign: 'center'}]}>{this.props.firstName}, lorem ipsum.{"\n"}We'd like to offer some things to help you in your spiritual journey.</Text>

        <Flex style={{position: 'absolute', bottom: 0, left: 0, right: 0}}>
          <Button
            type="header"
            onPress={() => console.log('go to next screen')}
            text="OK"
            buttonTextStyle={projectStyles.primaryButtonTextStyle}
            style={projectStyles.primaryButtonStyle}
          />
        </Flex>
      </Flex>
    );
  }
}

const mapStateToProps = ({profile}) => ({
  firstName: profile.firstName,
});

export default connect(mapStateToProps)(StageSuccessScreen);
