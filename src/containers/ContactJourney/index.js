import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import CommentBox from '../../components/CommentBox';
import { navigatePush } from '../../actions/navigation';
import { getJourney } from '../../actions/journey';
import { Flex, Separator, LoadingGuy } from '../../components/common';
import JourneyItem from '../../components/JourneyItem';
import RowSwipeable from '../../components/RowSwipeable';
import NULL from '../../../assets/images/ourJourney.png';
import { ADD_STEP_SCREEN } from '../AddStepScreen';
import { editComment } from '../../actions/interactions';
import { removeSwipeJourney } from '../../actions/swipe';
import { updateChallengeNote } from '../../actions/steps';
import NullStateComponent from '../../components/NullStateComponent';

import styles from './styles';

@translate('contactJourney')
class ContactJourney extends Component {
  constructor(props) {
    super(props);

    const org = props.organization || {};
    const isPersonal = props.isCasey || !org.id || org.id === 'personal';

    this.state = {
      editingInteraction: null,
      isPersonalMinistry: isPersonal,
    };

    this.completeBump = this.completeBump.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.handleEditComment = this.handleEditComment.bind(this);
    this.handleEditInteraction = this.handleEditInteraction.bind(this);
  }

  componentDidMount() {
    this.getInteractions();
  }

  completeBump() {
    this.props.dispatch(removeSwipeJourney());
  }

  getInteractions() {
    const { dispatch, person, organization } = this.props;

    dispatch(getJourney(person.id, organization && organization.id));
  }

  handleEditInteraction(interaction) {
    this.setState({ editingInteraction: interaction });
    const text =
      interaction._type === 'accepted_challenge'
        ? interaction.note
        : interaction.comment;

    this.props.dispatch(
      navigatePush(ADD_STEP_SCREEN, {
        onComplete: this.handleEditComment,
        type: 'editJourney',
        isEdit: true,
        text,
      }),
    );
  }

  handleEditComment(text) {
    const { editingInteraction } = this.state;
    const action =
      editingInteraction._type === 'accepted_challenge'
        ? updateChallengeNote(editingInteraction, text)
        : editComment(editingInteraction, text);

    this.props.dispatch(action).then(() => {
      // Refresh the journey list after editing a comment
      this.getInteractions();
      this.setState({ editingInteraction: null });
    });
  }

  renderRow({ item }) {
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
  }

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
    const { person, organization, isCohort } = this.props;
    return (
      <View style={{ flex: 1 }}>
        {this.renderContent()}
        <Flex justify="end">
          <CommentBox
            person={person}
            organization={organization}
            hideActions={isPersonalMinistry || isCohort}
          />
        </Flex>
      </View>
    );
  }
}

ContactJourney.propTypes = {
  person: PropTypes.object.isRequired,
  organization: PropTypes.object,
};

const mapStateToProps = (
  { auth, swipe, journey },
  { person, organization },
) => {
  const organizationId =
    organization && organization.id ? organization.id : 'personal';
  const journeyOrg = journey[organizationId];
  const journeyItems = journeyOrg ? journeyOrg[person.id] : undefined;

  return {
    journeyItems,
    isCasey: !auth.isJean,
    myId: auth.person.id,
    showReminder: swipe.journey,
    isCohort: organization.user_created,
  };
};

export default connect(mapStateToProps)(ContactJourney);
