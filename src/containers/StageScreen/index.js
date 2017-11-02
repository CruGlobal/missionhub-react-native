import React, {Component} from 'react';
import {connect} from 'react-redux';
import {navigatePush} from '../../actions/navigation';
import {View, ScrollView} from 'react-native';
import {getStages} from '../../actions/stages';

import styles from './styles';
import {Flex, Text, Button} from '../../components/common';

class StageScreen extends Component {
  componentWillMount() {
    this.props.dispatch(getStages());
  }

  render() {
    return (
      <Flex align="center" justify="center" value={1} style={styles.container}>
        <Text>{this.props.firstName}, which stage best describes where you are on your journey?</Text>
        <ScrollView horizontal={true}>
          {this.renderStages()}
        </ScrollView>
      </Flex>
    );
  }

  renderStages() {
    if (this.props.stages) {
      return this.props.stages.map(stage =>
        <View key={stage.id}>
          <Text>{stage.name}</Text>
          <Text>{stage.description}</Text>
          <Button
            onPress={() => console.log('stage selected')}
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
