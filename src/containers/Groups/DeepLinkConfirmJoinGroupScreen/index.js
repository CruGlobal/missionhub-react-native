import React, { Component } from 'react';
import { View, Image } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import { Flex, Text, IconButton } from '../../../components/common';
import GroupCardItem from '../../../components/GroupCardItem';
import Header from '../../Header';
import GROUP_ICON from '../../../../assets/images/MemberContacts_light.png';
import { navigateBack } from '../../../actions/navigation';
import { lookupOrgCommunityUrl } from '../../../actions/organizations';

import styles from './styles';

@translate('groupsJoinGroup')
class DeepLinkConfirmJoinGroupScreen extends Component {
  state = {
    errorMessage: '',
    community: undefined,
  };

  async componentDidMount() {
    const { dispatch, t, communityUrlCode } = this.props;

    const errorState = {
      errorMessage: t('communityNotFound'),
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
        <Text style={styles.text}>{t('enterCode')}</Text>
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

    return <GroupCardItem group={community} onJoin={this.navigateNext} />;
  }

  render() {
    const { t } = this.props;
    const { errorMessage, community } = this.state;

    return (
      <View style={styles.container}>
        <Header
          left={
            <IconButton
              name="deleteIcon"
              type="MissionHub"
              onPress={this.navigateBack}
            />
          }
          shadow={false}
          title={t('joinCommunity')}
        />
        <Flex align="center" justify="end" style={styles.imageWrap}>
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
