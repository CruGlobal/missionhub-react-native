import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import CommentBox from '../../components/CommentBox';
import { navigatePush } from '../../actions/navigation';
import { getJourney } from '../../actions/journey';
import {
  Flex,
  Separator,
  LoadingGuy,
  PlatformKeyboardAvoidingView,
} from '../../components/common';
import JourneyItem from '../../components/JourneyItem';
import RowSwipeable from '../../components/RowSwipeable';
import NULL from '../../../assets/images/ourJourney.png';
import { ADD_STEP_SCREEN } from '../AddStepScreen';
import { editComment } from '../../actions/interactions';
import { removeSwipeJourney } from '../../actions/swipe';
import { updateChallengeNote } from '../../actions/steps';
import NullStateComponent from '../../components/NullStateComponent';
import theme from '../../theme';
import { keyboardShow, keyboardHide, isAndroid } from '../../utils/common';

import styles from './styles';

@translate('contactJourney')
class ContactJourney extends Component {
  constructor(props) {
    super(props);

    const isPersonal = !props.isCasey && !props.organization;

    this.state = {
      editingInteraction: null,
      isPersonalMinistry: isPersonal,
      keyboardVisible: false,
    };

    this.completeBump = this.completeBump.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.handleEditComment = this.handleEditComment.bind(this);
    this.handleEditInteraction = this.handleEditInteraction.bind(this);
  }

  componentDidMount() {
    this.getInteractions();

    this.keyboardShowListener = keyboardShow(this.keyboardShow);
    this.keyboardHideListener = keyboardHide(this.keyboardHide);
  }

  componentWillUnmount() {
    this.keyboardShowListener.remove();
    this.keyboardHideListener.remove();
  }

  keyboardShow = () => {
    this.setState({ keyboardVisible: true });
  };

  keyboardHide = () => {
    this.setState({ keyboardVisible: false });
  };

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
          onEdit={() => this.handleEditInteraction(item)}
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

  renderList() {
    const { journeyItems } = this.props;
    return (
      <FlatList
        ref={c => (this.list = c)}
        style={styles.list}
        data={journeyItems}
        keyExtractor={i => `${i.id}-${i._type}`}
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
    const { keyboardVisible } = this.state;
    const { person, organization } = this.props;
    // Get the offset height for iOS based on the comment box and keybaord dimensions
    const height =
      theme.keyboardHeightWithAutocomplete + theme.commentBoxPaddingTop * 2;
    return (
      <PlatformKeyboardAvoidingView
        offset={!isAndroid && !keyboardVisible ? height : undefined}
      >
        {this.renderContent()}
        <Flex justify="end">
          <CommentBox person={person} organization={organization} />
        </Flex>
      </PlatformKeyboardAvoidingView>
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
  };
};

export default connect(mapStateToProps)(ContactJourney);
