import React, { Component } from 'react';
import { SafeAreaView, FlatList } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import JourneyCommentBox from '../../components/JourneyCommentBox';
import { navigatePush } from '../../actions/navigation';
import { getJourney } from '../../actions/journey';
import { Flex, Separator, LoadingGuy } from '../../components/common';
import JourneyItem from '../../components/JourneyItem';
import RowSwipeable from '../../components/RowSwipeable';
import NULL from '../../../assets/images/ourJourney.png';
import { removeSwipeJourney } from '../../actions/swipe';
import NullStateComponent from '../../components/NullStateComponent';
import { JOURNEY_EDIT_FLOW } from '../../routes/constants';
import {
  EDIT_JOURNEY_STEP,
  EDIT_JOURNEY_ITEM,
  ACCEPTED_STEP,
} from '../../constants';

import styles from './styles';

@withTranslation('contactJourney')
class ContactJourney extends Component {
  constructor(props) {
    super(props);

    const org = props.organization || {};
    const isPersonal = props.isCasey || !org.id || org.id === 'personal';

    this.state = {
      isPersonalMinistry: isPersonal,
    };

    this.completeBump = this.completeBump.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.handleEditInteraction = this.handleEditInteraction.bind(this);
  }

  componentDidMount() {
    this.getInteractions();
  }

  completeBump = () => {
    this.props.dispatch(removeSwipeJourney());
  };

  getInteractions() {
    const { dispatch, person, organization } = this.props;

    dispatch(getJourney(person.id, organization && organization.id));
  }

  handleEditInteraction = interaction => {
    const { dispatch, person, organization } = this.props;

    const isStep = interaction._type === ACCEPTED_STEP;

    dispatch(
      navigatePush(JOURNEY_EDIT_FLOW, {
        id: interaction.id,
        type: isStep ? EDIT_JOURNEY_STEP : EDIT_JOURNEY_ITEM,
        initialText: isStep ? interaction.note : interaction.comment,
        personId: person.id,
        orgId: organization && organization.id,
      }),
    );
  };

  renderRow = ({ item }) => {
    const { showReminder, myId, person } = this.props;
    const content = (
      <JourneyItem
        item={item}
        myId={myId}
        personFirstName={person.first_name}
      />
    );

    if (
      item._type !== 'answer_sheet' &&
      item._type !== 'pathway_progression_audit'
    ) {
      return (
        <RowSwipeable
          key={item.id}
          editPressProps={[item]}
          onEdit={this.handleEditInteraction}
          bump={showReminder && item.isFirstInteraction}
          onBumpComplete={
            showReminder && item.isFirstInteraction
              ? this.completeBump
              : undefined
          }
        >
          {content}
        </RowSwipeable>
      );
    }
    return content;
  };

  listRef = c => (this.list = c);
  keyExtractor = i => `${i.id}-${i._type}`;
  itemSeparator = (sectionID, rowID) => <Separator key={rowID} />;

  renderList() {
    const { journeyItems } = this.props;

    return (
      <FlatList
        ref={this.listRef}
        style={styles.list}
        data={journeyItems}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderRow}
        bounces={true}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={100}
        ItemSeparatorComponent={this.itemSeparator}
      />
    );
  }

  renderNull() {
    const { t } = this.props;

    return (
      <NullStateComponent
        imageSource={NULL}
        headerText={t('ourJourney').toUpperCase()}
        descriptionText={t('journeyNull')}
      />
    );
  }

  renderContent() {
    const { journeyItems } = this.props;
    const isLoading = !journeyItems;
    const hasItems = journeyItems && journeyItems.length > 0;
    return (
      <Flex align="center" justify="center" value={1} style={styles.container}>
        {!isLoading && !hasItems && this.renderNull()}
        {isLoading && <LoadingGuy />}
        {hasItems && this.renderList()}
      </Flex>
    );
  }

  render() {
    const { isPersonalMinistry } = this.state;
    const { person, organization, isUserCreatedOrg } = this.props;
    return (
      <SafeAreaView style={styles.container}>
        {this.renderContent()}
        <Flex justify="end">
          <JourneyCommentBox
            person={person}
            organization={organization}
            hideActions={isPersonalMinistry || isUserCreatedOrg}
          />
        </Flex>
      </SafeAreaView>
    );
  }
}

ContactJourney.propTypes = {
  person: PropTypes.object.isRequired,
  organization: PropTypes.object,
};

const mapStateToProps = (
  { auth, swipe, journey },
  { person = {}, organization = {} },
) => {
  const orgId = organization.id || 'personal';
  const personId = person.id;
  const journeyOrg = journey[orgId];
  const journeyItems = (journeyOrg && journeyOrg[personId]) || undefined;

  return {
    journeyItems,
    isCasey: !auth.isJean,
    myId: auth.person.id,
    showReminder: swipe.journey,
    isUserCreatedOrg: organization && organization.user_created,
  };
};

export default connect(mapStateToProps)(ContactJourney);
