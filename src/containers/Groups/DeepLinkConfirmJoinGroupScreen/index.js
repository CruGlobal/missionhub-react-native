import React, { Component } from 'react';
import { Image, SafeAreaView } from 'react-native';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { Flex, Text, IconButton } from '../../../components/common';
import GroupCardItem from '../../../components/GroupCardItem';
import Header from '../../../components/Header';
import GROUP_ICON from '../../../../assets/images/MemberContacts_light.png';
import { navigateBack } from '../../../actions/navigation';
import { lookupOrgCommunityUrl } from '../../../actions/organizations';

import styles from './styles';

@withTranslation('groupsJoinGroup')
class DeepLinkConfirmJoinGroupScreen extends Component {
  state = {
    errorMessage: '',
    community: undefined,
  };

  async componentDidMount() {
    const { dispatch, t, communityUrlCode } = this.props;

    const errorState = {
      errorMessage: t('communityNotFoundLink'),
      community: undefined,
    };

    try {
      const org = await dispatch(lookupOrgCommunityUrl(communityUrlCode));

      if (!org) {
        this.setState(errorState);
        return;
      }
      this.setState({ errorMessage: '', community: org });
    } catch (e) {
      this.setState(errorState);
    }
  }

  navigateNext = () => {
    const { dispatch, next } = this.props;
    const { community } = this.state;

    dispatch(
      next({
        community,
      }),
    );
  };

  renderStart() {
    const { t } = this.props;
    return (
      <Flex align="center" justify="center">
        <Image resizeMode="contain" source={GROUP_ICON} style={styles.image} />
        <Text style={styles.text}>{t('findingCommunity')}</Text>
      </Flex>
    );
  }

  navigateBack = () => this.props.dispatch(navigateBack());

  renderError() {
    const { errorMessage } = this.state;
    return (
      <Flex align="center" justify="center">
        <Text style={styles.text}>{errorMessage}</Text>
      </Flex>
    );
  }

  renderGroupCard() {
    const { community } = this.state;

    const {
      id,
      name,
      owner,
      contactReport = {},
      user_created,
      community_photo_url,
      unread_comments_count,
    } = community;

    const group = {
      id,
      name,
      owner: {
        firstName: owner.first_name,
        lastName: owner.last_name,
      },
      report: {
        contactCount: contactReport.contactsCount || 0,
        unassignedCount: contactReport.unassignedCount || 0,
        memberCount: contactReport.memberCount || 0,
      },
      userCreated: user_created,
      communityPhotoUrl: community_photo_url,
      unreadCommentsCount: unread_comments_count,
    };

    return <GroupCardItem group={group} onJoin={this.navigateNext} />;
  }

  render() {
    const { t } = this.props;
    const { errorMessage, community } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <Header
          left={
            <IconButton
              name="deleteIcon"
              type="MissionHub"
              onPress={this.navigateBack}
            />
          }
          title={t('joinCommunity')}
        />
        <Flex
          value={1}
          align="center"
          justify="center"
          style={styles.imageWrap}
        >
          {errorMessage
            ? this.renderError()
            : community
            ? this.renderGroupCard()
            : this.renderStart()}
        </Flex>
      </SafeAreaView>
    );
  }
}

DeepLinkConfirmJoinGroupScreen.propTypes = {
  next: PropTypes.func.isRequired,
  communityUrlCode: PropTypes.string.isRequired,
};

const mapStateToProps = (_, { navigation }) => {
  const { communityUrlCode } = navigation.state.params || {};

  return { communityUrlCode };
};

export default connect(mapStateToProps)(DeepLinkConfirmJoinGroupScreen);
export const DEEP_LINK_CONFIRM_JOIN_GROUP_SCREEN =
  'nav/DEEP_LINK_CONFIRM_JOIN_GROUP_SCREEN';
