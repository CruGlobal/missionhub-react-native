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
import { getAnalyticsSubsection } from '../../utils/common';

@translate('contactJourney')
class ContactJourney extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      journey: [],
      editingInteraction: null,
      isPersonalMinistry: false,
    };

    this.renderRow = this.renderRow.bind(this);
    this.handleAddComment = this.handleAddComment.bind(this);
    this.handleEditComment = this.handleEditComment.bind(this);
    this.handleCreateInteraction = this.handleCreateInteraction.bind(this);
    this.handleEditInteraction = this.handleEditInteraction.bind(this);
  }

  componentWillMount() {
    this.getInteractions();
  }

  componentDidMount() {
    const orgIdExists = !!this.getOrganization();
    const isPersonal = !this.props.isCasey && !orgIdExists;
    this.setState({ isPersonalMinistry: isPersonal });
  }

  getInteractions() {
    this.props.dispatch(getJourney(this.props.person.id, this.state.isPersonalMinistry)).then((items) => {
      this.setState({
        journey: items,
        isLoading: false,
      });
    }).catch(() => {
      this.setState({ isLoading: false });
    });
  }

  getOrganization() {
    const { person } = this.props;
    if (person.organizational_permissions && person.organizational_permissions.length > 0) {
      return person.organizational_permissions[0].organization_id;
    }
    return undefined;
  }

  handleEditInteraction(interaction) {
    this.setState({ editingInteraction: interaction });
    this.props.dispatch(navigatePush('AddStep', {
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
    const { person, dispatch } = this.props;
    const orgId = this.getOrganization();

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

    const trackingObj = { name: `people : ${getAnalyticsSubsection(this.props.person.id, this.props.myId)} : journey : edit` };
    this.props.dispatch(trackState(trackingObj));
  }

  renderRow({ item }) {
    const { isCasey } = this.props;
    let content = <JourneyItem item={item} type={item.type} />;
    if (item.type === 'interaction' && (isCasey || this.state.isPersonalMinistry)) {
      return (
        <RowSwipeable
          key={item.id}
          onEdit={() => this.handleEditInteraction(item)}
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
      <Flex align="center" justify="center">
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
};

const mapStateToProps = ({ auth }) => ({
  isCasey: !auth.isJean,
  myId: auth.personId,
});

export default connect(mapStateToProps)(ContactJourney);
