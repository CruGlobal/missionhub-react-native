import React, { Component } from 'react';
import { View, FlatList, Image } from 'react-native';
import { connect } from 'react-redux';
import { navigatePush } from '../../actions/navigation';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import styles from './styles';
import { Flex, Button, Separator, Text } from '../../components/common';
import JourneyItem from '../../components/JourneyItem';
import RowSwipeable from '../../components/RowSwipeable';
import NULL from '../../../assets/images/ourJourney.png';

@translate('contactJourney')
class ContactJourney extends Component {

  constructor(props) {
    super(props);

    this.renderRow = this.renderRow.bind(this);
    this.handleCreateInteraction = this.handleCreateInteraction.bind(this);
    this.handleEditInteraction = this.handleEditInteraction.bind(this);
  }

  componentWillMount() {
    this.getInteractions();
  }

  getInteractions() {
    //TODO: make api call to get interactions
  }

  handleEditInteraction(interaction) {
    LOG(interaction);
  }

  handleCreateInteraction() {
    this.props.dispatch(navigatePush('AddStep', {
      onComplete: (t) => LOG(t),
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
          <JourneyItem item={item} type="step" />
        </RowSwipeable>
      );
    }
    return <JourneyItem item={item} type="step" />;
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
    { id: '1', text: 'You are cool\nCheck it out\n\nNew lines all over', completed_at: '2017-12-28T16:21:02Z' },
    { id: '2', text: 'Step 2 fjldsja fkldjs alkf jdsalkf jdaskl fjdsa jfdklsaj flkdsaj flkdsaj fldksaj fldksaj fdlkasf jdlksa fjhldsal dksajfkl dsa jflkdhsalfk dasf jdsaklfj dkslafj dlsakfjkdlasfjlsdak kjlfd', completed_at: '2017-12-28T16:21:02Z' },
    { id: '3', text: 'Step 3', completed_at: '2017-12-28T16:21:02Z' },
    { id: '4', text: 'Step 4', completed_at: '2017-12-28T16:21:02Z' },
    { id: '5', text: 'Step 5', completed_at: '2017-12-28T16:21:02Z' },
    { id: '6', text: 'Step 6', completed_at: '2017-12-28T16:21:02Z' },
  ],
  // journey: [],
  isCasey: !auth.hasMinistries,
});

export default connect(mapStateToProps)(ContactJourney);
