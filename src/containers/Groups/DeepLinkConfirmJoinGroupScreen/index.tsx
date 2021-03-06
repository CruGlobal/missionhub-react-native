import React, { Component } from 'react';
import { Image, View, Text } from 'react-native';
import { connect } from 'react-redux-legacy';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { Flex, IconButton } from '../../../components/common';
import GroupCardItem from '../../../components/GroupCardItem';
import Header from '../../../components/Header';
import GROUP_ICON from '../../../../assets/images/MemberContacts_light.png';
import { navigateBack } from '../../../actions/navigation';
import { lookupOrgCommunityUrl } from '../../../actions/organizations';
import Analytics from '../../Analytics';

import styles from './styles';

// @ts-ignore
@withTranslation('groupsJoinGroup')
class DeepLinkConfirmJoinGroupScreen extends Component {
  state = {
    errorMessage: '',
    community: undefined,
  };

  async componentDidMount() {
    // @ts-ignore
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
    // @ts-ignore
    const { dispatch, next } = this.props;
    const { community } = this.state;

    dispatch(
      next({
        community,
      }),
    );
  };

  renderStart() {
    // @ts-ignore
    const { t } = this.props;
    return (
      <Flex align="center" justify="center">
        {/* 
        // @ts-ignore */}
        <Image resizeMode="contain" source={GROUP_ICON} style={styles.image} />
        <Text style={styles.text}>{t('findingCommunity')}</Text>
      </Flex>
    );
  }

  // @ts-ignore
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
      // @ts-ignore
      id,
      // @ts-ignore
      name,
      // @ts-ignore
      owner,
      // @ts-ignore
      contactReport = {},
      // @ts-ignore
      community_photo_url,
      // @ts-ignore
      unread_comments_count,
    } = community;

    const group = {
      id,
      __typename: 'Community' as const,
      name,
      owner: {
        __typename: 'CommunityPersonConnection' as const,
        nodes: owner
          ? [
              {
                __typename: 'Person' as const,
                firstName: owner.first_name,
                lastName: owner.last_name,
              },
            ]
          : [],
      },
      report: {
        __typename: 'CommunitiesReport' as const,
        contactCount: contactReport.contactsCount || 0,
        unassignedCount: contactReport.unassignedCount || 0,
        memberCount: contactReport.memberCount || 0,
      },
      communityPhotoUrl: community_photo_url,
      unreadCommentsCount: unread_comments_count,
    };

    return (
      <GroupCardItem
        testID="groupCardItem"
        group={group}
        onJoin={this.navigateNext}
      />
    );
  }

  render() {
    // @ts-ignore
    const { t } = this.props;
    const { errorMessage, community } = this.state;

    return (
      <View style={styles.container}>
        <Analytics screenName={['deep link', 'community']} />
        <Header
          left={
            <IconButton
              testID="backButton"
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
      </View>
    );
  }
}

// @ts-ignore
DeepLinkConfirmJoinGroupScreen.propTypes = {
  next: PropTypes.func.isRequired,
  communityUrlCode: PropTypes.string.isRequired,
};

// @ts-ignore
const mapStateToProps = (_, { navigation }) => {
  const { communityUrlCode } = navigation.state.params || {};

  return { communityUrlCode };
};

export default connect(mapStateToProps)(DeepLinkConfirmJoinGroupScreen);
export const DEEP_LINK_CONFIRM_JOIN_GROUP_SCREEN =
  'nav/DEEP_LINK_CONFIRM_JOIN_GROUP_SCREEN';
