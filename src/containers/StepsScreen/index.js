import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { connect } from 'react-redux';

// import { logout } from '../../actions/auth';
// import { navigatePush } from '../../actions/navigation';
import { getStepSuggestions } from '../../actions/steps';

import styles from './styles';
import { Flex, Text, Icon, IconButton, Touchable } from '../../components/common';
import Header from '../Header';

const isCasey = true;

class StepsScreen extends Component {

  componentWillMount() {
    this.props.dispatch(getStepSuggestions());
  }

  handleRowSelect(step) {
    LOG('step selected', step);
  }

  render() {
    const { mine } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <Header
          left={
            <IconButton name="stepsIcon" type="MissionHub" onPress={()=> LOG('pressed')} />
          }
          right={
            isCasey ? null : (
              <IconButton name="stepsIcon" type="MissionHub" onPress={()=> LOG('pressed')} />
            )
          }
          title="STEPS OF FAITH"
        />
        <Flex align="center" justify="center" value={1} style={styles.container}>
          <Flex value={1} align="center" justify="center" style={styles.top}>
            <Flex align="center" justify="center" value={1} style={styles.topBorder}>
              <Icon name="add" size={36} />
              <Text type="header" style={styles.title}>
                Focus your week
              </Text>
              <Text style={styles.description}>
                Drag and drop up to 3 steps here and get friendly reminders.
              </Text>
            </Flex>
          </Flex>
          <Flex self="stretch" style={styles.list}>
            <ScrollView style={styles.scrollView}>
              {
                mine.map((s) => (
                  <Touchable key={s.id} onPress={() => this.handleRowSelect(s)}>
                    <Flex style={styles.row}>
                      <Text style={styles.stepPerson}>
                        {s.id}
                      </Text>
                      <Text style={styles.stepDescription}>
                        {s.body}
                      </Text>
                    </Flex>
                  </Touchable>
                ))
              }
            </ScrollView>
          </Flex>
        </Flex>
      </View>
    );
  }
}

const mapStateToProps = ({ steps }) => ({
  // mine: steps.mine,
  mine: [].concat([steps.suggestedForMe[0], steps.suggestedForMe[1], steps.suggestedForMe[2]]).filter((s) => !!s),
  suggestedForOthers: steps.suggestedForOthers,
});

export default connect(mapStateToProps)(StepsScreen);
