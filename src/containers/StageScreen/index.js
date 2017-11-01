import React, {Component} from 'react';
import {connect} from 'react-redux';
import {navigatePush} from '../../actions/navigation';
import {View, ScrollView} from 'react-native';

import styles from './styles';
import {Flex, Text, Button} from '../../components/common';

class StageScreen extends Component {
  state = {stages: [0, 1, 2, 3, 4]};

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
    return this.state.stages.map(number =>
      <View>
        <Text>This is a stage</Text>
        <Button
          onPress={() => console.log('stage selected')}
          text="I am here"
        />
      </View>
    );
  }
}

const mapStateToProps = ({profile}, { navigation }) => ({
  id: navigation.state.params ? navigation.state.params.id : '',
  firstName: profile.firstName,
});

export default connect(mapStateToProps)(StageScreen);
