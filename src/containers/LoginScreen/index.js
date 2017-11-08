import React, {Component} from 'react';
import {connect} from 'react-redux';
import {View, Image} from 'react-native';

import {login, firstTime} from '../../actions/auth';
import styles from './styles';
import {Text, Button} from '../../components/common';
import {navigatePush} from '../../actions/navigation';
import projectStyles from '../../projectStyles';

class LoginScreen extends Component {
  buttonTextStyle = {
    color: 'white',
    fontFamily: 'SourceSansPro-Bold',
    fontSize: 14,
  };

  login() {
    this.props.dispatch(login());
    this.navigateToNext();
  }

  tryItNow() {
    this.props.dispatch(firstTime());
    this.navigateToNext();
  }

  navigateToNext() {
    if (this.props.stageId) {
      this.props.dispatch(navigatePush('MainTabs'));
    } else {
      this.props.dispatch(navigatePush('Welcome'));
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{flex: 1}} />
        <View style={{flex: 4, justifyContent: 'space-between'}}>
          <View style={{alignItems: 'center'}}>
            <Image source={require('../../../assets/images/missionhub_logo_circle.png')} />
            <Text style={projectStyles.primaryTextStyle}>Grow closer to God.</Text>
            <Text style={projectStyles.primaryTextStyle}>Help others experience Him.</Text>
          </View>
          <View>
            <Button
              onPress={() => console.log('join')}
              text="SIGN UP WITH FACEBOOK"
              style={{alignItems: 'center', backgroundColor: '#005A7F', borderWidth: 0}}
              buttonTextStyle={this.buttonTextStyle}
            />
            <View style={{paddingTop: 10}}>
              <Button
                onPress={() => this.tryItNow()}
                text="TRY IT NOW"
                style={{alignItems: 'center', borderColor: '#52C5DC'}}
                buttonTextStyle={this.buttonTextStyle}
              />
            </View>
          </View>
        </View>
        <View style={{flex: 1, justifyContent: 'flex-end', alignSelf: 'center'}}>
          <Button
            style={{alignItems: 'center', borderWidth: 0}}
            onPress={() => this.login()}
            text="SIGN IN"
            buttonTextStyle={this.buttonTextStyle}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = ({myStageReducer}) => {
  return {
    stageId: myStageReducer.stageId,
  };
};

export default connect(mapStateToProps)(LoginScreen);
