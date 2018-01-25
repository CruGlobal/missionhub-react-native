import React, { Component } from 'react';
import { View, FlatList, Image } from 'react-native';
import { connect } from 'react-redux';
import { navigatePush } from '../../actions/navigation';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import styles from './styles';
// import { clearJourney, getJourney } from '../../actions/journey';
import { clearJourney } from '../../actions/journey';
import { Flex, Button, Separator, Text } from '../../components/common';
import JourneyItem from '../../components/JourneyItem';
import RowSwipeable from '../../components/RowSwipeable';
import NULL from '../../../assets/images/ourJourney.png';

@translate('contactJourney')
class ContactJourney extends Component {

  constructor(props) {
    super(props);

    this.renderRow = this.renderRow.bind(this);
    this.handleAddStep = this.handleAddStep.bind(this);
    this.handleCreateInteraction = this.handleCreateInteraction.bind(this);
    this.handleEditInteraction = this.handleEditInteraction.bind(this);
  }

  componentWillMount() {
    this.getInteractions();
  }

  componentWillUnmount() {
    this.props.dispatch(clearJourney());
  }

  getInteractions() {
    //TODO: make api call to get interactions
    // this.props.dispatch(getJourney());
  }

  handleEditInteraction(interaction) {
    LOG(interaction);
  }

  handleAddStep(text) {
    // TODO: Add a comment to the journey
    LOG('add a comment', text);
  }

  handleCreateInteraction() {
    this.props.dispatch(navigatePush('AddStep', {
      onComplete: this.handleAddStep,
      type: 'journey',
    }));
  }

  renderRow({ item }) {
    const { isCasey } = this.props;
    if (isCasey) {
      return (
        <RowSwipeable
          key={item.id}
          onEdit={() => this.handleEditInteraction(item)}
        >
          <JourneyItem item={item} type={item.type} />
        </RowSwipeable>
      );
    }
    return <JourneyItem item={item} type={item.type} />;
  }

  renderList() {
    const { journey } = this.props;
    return (
      <FlatList
        ref={(c) => this.list = c}
        style={styles.list}
        data={journey}
        keyExtractor={(i) => i.id}
        renderItem={this.renderRow}
        bounces={true}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={100}
        ItemSeparatorComponent={(sectionID, rowID) => <Separator key={rowID} />}
      />
    );
  }

  renderNull() {
    const { t } = this.props;
    return (
      <Flex align="center" justify="center">
        <Image source={NULL} />
        <Text type="header" style={styles.nullHeader}>{t('ourJourney').toUpperCase()}</Text>
        <Text style={styles.nullText}>{t('journeyNull')}</Text>
      </Flex>
    );
  }

  render() {
    const { t, journey } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <Flex align="center" justify="center" value={1} style={styles.container}>
          {
            journey.length > 0 ? this.renderList() : this.renderNull()
          }
        </Flex>
        <Flex justify="end">
          <Button
            type="secondary"
            onPress={this.handleCreateInteraction}
            text={t('addJourney').toUpperCase()}
          />
        </Flex>
      </View>
    );
  }
}

ContactJourney.propTypes = {
  person: PropTypes.object,
};

const mapStateToProps = ({ auth }) => ({
  journey: [
    { type: 'step', title: 'Growing Step of Faith', id: '1', text: 'You are cool\nCheck it out\n\nNew lines all over', completed_at: '2018-01-25T16:21:02Z' },
    { type: 'stage', title: 'Stage', id: '2', text: 'Step 2 fjldsja fkldjs alkf', completed_at: '2018-01-25T16:21:02Z' },
    { type: 'comment', id: '3', text: 'Step 3', completed_at: '2018-01-25T16:21:02Z' },
    { type: 'survey', title: 'Survey 2017', id: '4', text: 'Step 4', completed_at: '2018-01-25T16:21:02Z' },
    { type: 'comment', title: 'Comment', id: '5', text: 'Step 5', completed_at: '2018-01-25T16:21:02Z' },
    { type: 'step', id: '6', text: 'Step 6', completed_at: '2018-01-25T16:21:02Z' },
  ],
  // journey: [],
  isCasey: !auth.isJean,
});

export default connect(mapStateToProps)(ContactJourney);
