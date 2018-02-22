import React, { Component } from 'react';
import { View, FlatList, Image } from 'react-native';
import { connect } from 'react-redux';
import { navigatePush } from '../../actions/navigation';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import styles from './styles';
import { getJourney } from '../../actions/journey';
import { Flex, Button, Separator, Text } from '../../components/common';
import JourneyItem from '../../components/JourneyItem';
import RowSwipeable from '../../components/RowSwipeable';
import NULL from '../../../assets/images/ourJourney.png';
import { ADD_STEP_SCREEN } from '../AddStepScreen';
import { trackState } from '../../actions/analytics';
import { addNewComment, editComment } from '../../actions/interactions';
import { removeSwipeJourney } from '../../actions/swipe';
import { buildTrackingObj, getAnalyticsSubsection } from '../../utils/common';

@translate('contactJourney')
class ContactJourney extends Component {

  constructor(props) {
    super(props);

    const isPersonal = !props.isCasey && !props.organization;


    this.state = {
      isLoading: true,
      journey: [],
      editingInteraction: null,
      isPersonalMinistry: isPersonal,
    };

    this.completeBump = this.completeBump.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.handleAddComment = this.handleAddComment.bind(this);
    this.handleEditComment = this.handleEditComment.bind(this);
    this.handleCreateInteraction = this.handleCreateInteraction.bind(this);
    this.handleEditInteraction = this.handleEditInteraction.bind(this);
  }

  componentDidMount() {
    this.getInteractions();
  }

  completeBump() {
    this.props.dispatch(removeSwipeJourney());
  }

  getInteractions() {
    this.props.dispatch(getJourney(this.props.person.id, this.state.isPersonalMinistry, this.props.organization)).then((items) => {
      this.setState({
        journey: items,
        isLoading: false,
      });
    }).catch(() => {
      this.setState({ isLoading: false });
    });
  }

  handleEditInteraction(interaction) {
    this.setState({ editingInteraction: interaction });
    this.props.dispatch(navigatePush(ADD_STEP_SCREEN, {
      onComplete: this.handleEditComment,
      type: 'editJourney',
      isEdit: true,
      text: interaction.text,
    }));
  }

  handleEditComment(text) {
    const { editingInteraction } = this.state;
    this.props.dispatch(editComment(editingInteraction, text)).then(() => {
      // Refresh the journey list after editing a comment
      this.getInteractions();
      this.setState({ editingInteraction: null });
    });
  }

  handleAddComment(text) {
    const { person, dispatch, organization } = this.props;
    const orgId = organization && organization.id;

    dispatch(addNewComment(person.id, text, orgId)).then(() => {
      // Add new comment to journey
      this.getInteractions();
    });
  }

  handleCreateInteraction() {
    this.props.dispatch(navigatePush(ADD_STEP_SCREEN, {
      onComplete: this.handleAddComment,
      type: 'journey',
    }));

    const subsection = getAnalyticsSubsection(this.props.person.id, this.props.myId);
    const trackingObj = buildTrackingObj(`people : ${subsection} : journey : edit`, 'people', subsection, 'journey');
    this.props.dispatch(trackState(trackingObj));
  }

  renderRow({ item }) {
    const { isCasey, showReminder } = this.props;
    let content = <JourneyItem item={item} type={item.type} />;
    if (item.type === 'interaction' && (isCasey || this.state.isPersonalMinistry)) {
      return (
        <RowSwipeable
          key={item.id}
          onEdit={() => this.handleEditInteraction(item)}
          bump={showReminder && item.isFirstInteraction}
          onBumpComplete={showReminder && item.isFirstInteraction ? this.completeBump : undefined}
        >
          {content}
        </RowSwipeable>
      );
    }
    return content;
  }

  renderList() {
    const { journey } = this.state;
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
      <Flex align="center" justify="center" value={1}>
        <Image source={NULL} />
        <Text type="header" style={styles.nullHeader}>{t('ourJourney').toUpperCase()}</Text>
        <Text style={styles.nullText}>{t('journeyNull')}</Text>
      </Flex>
    );
  }

  renderLoading() {
    const { t } = this.props;
    return (
      <Flex align="center" justify="center">
        <Text type="header" style={styles.nullText}>{t('loading')}</Text>
      </Flex>
    );
  }

  renderContent() {
    const { journey, isLoading } = this.state;
    if (isLoading) return this.renderLoading();
    if (journey.length === 0) return this.renderNull();
    return this.renderList();
  }

  render() {
    const { t } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <Flex align="center" justify="center" value={1} style={styles.container}>
          {this.renderContent()}
        </Flex>
        <Flex justify="end">
          <Button
            type="secondary"
            onPress={this.handleCreateInteraction}
            text={t('addComment').toUpperCase()}
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

const mapStateToProps = ({ auth, swipe }) => ({
  isCasey: !auth.isJean,
  myId: auth.personId,
  showReminder: swipe.journey,  
});

export default connect(mapStateToProps)(ContactJourney);
