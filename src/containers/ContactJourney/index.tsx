import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { connect } from 'react-redux-legacy';
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
import { getAnalyticsAssignmentType } from '../../utils/analytics';
import {
  EDIT_JOURNEY_STEP,
  EDIT_JOURNEY_ITEM,
  ACCEPTED_STEP,
  ANALYTICS_ASSIGNMENT_TYPE,
} from '../../constants';
import { Person } from '../../reducers/people';
import { Organization } from '../../reducers/organizations';
import Analytics from '../Analytics';

import styles from './styles';

// @ts-ignore
@withTranslation('contactJourney')
class ContactJourney extends Component {
  // @ts-ignore
  constructor(props) {
    super(props);

    this.completeBump = this.completeBump.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.handleEditInteraction = this.handleEditInteraction.bind(this);
  }

  componentDidMount() {
    this.getInteractions();
  }

  completeBump = () => {
    // @ts-ignore
    this.props.dispatch(removeSwipeJourney());
  };

  getInteractions() {
    // @ts-ignore
    const { dispatch, person, organization } = this.props;

    dispatch(getJourney(person.id, organization && organization.id));
  }

  // @ts-ignore
  handleEditInteraction = interaction => {
    // @ts-ignore
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

  // @ts-ignore
  renderRow = ({ item }) => {
    // @ts-ignore
    const { showReminder, myId, person } = this.props;
    const content = (
      <JourneyItem
        // @ts-ignore
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
          // @ts-ignore
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

  // @ts-ignore
  listRef = c => (this.list = c);
  // @ts-ignore
  keyExtractor = i => `${i.id}-${i._type}`;
  // @ts-ignore
  itemSeparator = (sectionID, rowID) => <Separator key={rowID} />;

  renderList() {
    // @ts-ignore
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
    // @ts-ignore
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
    // @ts-ignore
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
    const {
      // @ts-ignore
      myId,
      // @ts-ignore
      person,
      // @ts-ignore
      organization,
      // @ts-ignore
      analyticsAssignmentType,
    } = this.props;
    return (
      <View style={styles.container}>
        <Analytics
          screenName={[
            'person',
            person.id === myId ? 'my journey' : 'our journey',
          ]}
          screenContext={{
            [ANALYTICS_ASSIGNMENT_TYPE]: analyticsAssignmentType,
          }}
        />
        {this.renderContent()}
        <Flex justify="end">
          <JourneyCommentBox person={person} organization={organization} />
        </Flex>
      </View>
    );
  }
}

// @ts-ignore
ContactJourney.propTypes = {
  person: PropTypes.object.isRequired,
  organization: PropTypes.object,
};

const mapStateToProps = (
  // @ts-ignore
  { auth, swipe, journey },
  { person, organization }: { person: Person; organization: Organization },
) => {
  const orgId = (organization && organization.id) || 'personal';
  const personId = person.id;
  const journeyOrg = journey[orgId];
  const journeyItems = (journeyOrg && journeyOrg[personId]) || undefined;

  return {
    journeyItems,
    isCasey: !auth.isJean,
    myId: auth.person.id,
    showReminder: swipe.journey,
    analyticsAssignmentType: getAnalyticsAssignmentType(
      person,
      auth,
      organization,
    ),
  };
};

export default connect(mapStateToProps)(ContactJourney);
