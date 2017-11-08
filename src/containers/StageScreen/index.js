import React, {Component} from 'react';
import {connect} from 'react-redux';
import {navigatePush, navigateBack} from '../../actions/navigation';
import {View, ScrollView, Image} from 'react-native';
import {getStages} from '../../actions/stages';
import {selectStage} from '../../actions/selectStage';

import styles from './styles';
import {Flex, Text, Button} from '../../components/common';
import projectStyles from '../../projectStyles';
import {PRIMARY_BACKGROUND_COLOR} from '../../theme';

class StageScreen extends Component {
  componentWillMount() {
    this.props.dispatch(getStages());
  }

  setStage(id) {
    this.props.dispatch(selectStage(id));
    this.props.dispatch(navigatePush('StageSuccess'));
  }

  render() {
    return (
      <Flex align="center" justify="center" value={1} style={styles.container}>
        <View style={{flex: 1, alignSelf: 'flex-start'}}>
          <Button style={{borderWidth: 0}} onPress={() => this.props.dispatch(navigateBack())}>
            <Image source={require('../../../assets/images/back_arrow.png')} />
          </Button>
        </View>
        <View style={{flex: 4}}>
          <Text style={{color: PRIMARY_BACKGROUND_COLOR, fontFamily: 'SourceSansPro-Regular', fontSize: 18, paddingBottom: 25, paddingLeft: 30, paddingRight: 30, textAlign: 'center'}}>{this.props.firstName}, which stage best describes where you are on your journey?</Text>
          <ScrollView horizontal={true}>
            {this.renderStages()}
          </ScrollView>
        </View>
        <View style={{flex: 1}} />
      </Flex>
    );
  }

  renderStages() {
    if (this.props.stages) {
      return this.props.stages.map(stage =>
        <View key={stage.id} style={{justifyContent: 'space-between', backgroundColor: 'white', width: 250, marginLeft: 20, marginRight: 20}}>
          <View style={{alignItems: 'center', paddingTop: 30, paddingRight: 15, paddingLeft: 15}}>
            <Image source={require('../../../assets/images/Forgiven.png')} />
            <Text style={[projectStyles.primaryHeaderStyle, {fontSize: 42, color: PRIMARY_BACKGROUND_COLOR, textAlign: 'center'}]}>{stage.name.toLowerCase()}</Text>
            <Text style={[projectStyles.primaryTextStyle, {color: '#505256', textAlign: 'center'}]}>{stage.description}</Text>
          </View>

          <Button
            type="header"
            style={[projectStyles.primaryButtonStyle, {backgroundColor: PRIMARY_BACKGROUND_COLOR}]}
            onPress={() => this.setStage(stage.id)}
            buttonTextStyle={projectStyles.primaryButtonTextStyle}
            text="I AM HERE"
          />
        </View>
      );
    }

    return null;
  }
}

const mapStateToProps = ({profile, stages}, { navigation }) => ({
  id: navigation.state.params ? navigation.state.params.id : '',
  firstName: profile.firstName,
  stages: stages.stages,
});

export default connect(mapStateToProps)(StageScreen);
