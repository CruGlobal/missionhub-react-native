import React from 'react';
import { View, ImageBackground } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/react-hooks';
import { useDispatch } from 'react-redux';
import { useNavigationParam } from 'react-navigation-hooks';

import {
  createCollapsibleViewContext,
  CollapsibleViewHeader,
} from '../../../../components/CollapsibleView/CollapsibleView';
import { Text, Flex, Button } from '../../../../components/common';
import { HeaderTabBar } from '../../../../components/HeaderTabBar/HeaderTabBar';
import BackButton from '../../../BackButton';
import theme from '../../../../theme';
import Header from '../../../../components/Header';
import { ErrorNotice } from '../../../../components/ErrorNotice/ErrorNotice';
import { navigatePush } from '../../../../actions/navigation';
import { COMMUNITY_PROFILE } from '../CommunityProfile/CommunityProfile';
import { COMMUNITY_MEMBERS } from '../CommunityMembers/CommunityMembers';
import InfoIcon from '../../../../../assets/images/infoIcon.svg';
import EditIcon from '../../../../../assets/images/editIcon.svg';
import { useMyId } from '../../../../utils/hooks/useIsMe';
import { useCommunityPhoto } from '../../hooks/useCommunityPhoto';
import { canEditCommunity, orgIsGlobal } from '../../../../utils/common';
import { communityTabs } from '../constants';

import styles from './styles';
import {
  COMMUNITY_HEADER_QUERY,
  COMMUNITY_HEADER_GLOBAL_QUERY,
} from './queries';
import {
  CommunityHeader as CommunityHeaderQuery,
  CommunityHeaderVariables,
} from './__generated__/CommunityHeader';
import { CommunityHeaderGlobal } from './__generated__/CommunityHeaderGlobal';

export const CommunitiesCollapsibleHeaderContext = createCollapsibleViewContext();

export const CommunityHeader = () => {
  const { t } = useTranslation('communityHeader');
  const dispatch = useDispatch();
  const communityId: string = useNavigationParam('communityId');

  const myId = useMyId();
  const isGlobalCommunity = orgIsGlobal({ id: communityId });

  const { data, error, refetch } = useQuery<
    CommunityHeaderQuery,
    CommunityHeaderVariables
  >(COMMUNITY_HEADER_QUERY, {
    variables: { id: communityId, myId },
    skip: isGlobalCommunity,
  });
  const {
    data: globalData,
    error: globalError,
    refetch: globalRefetch,
  } = useQuery<CommunityHeaderGlobal>(COMMUNITY_HEADER_GLOBAL_QUERY, {
    skip: !isGlobalCommunity,
  });

  const communityPhotoSource = useCommunityPhoto(
    communityId,
    data?.community.communityPhotoUrl,
    data?.community.userCreated,
  );

  return (
    <CollapsibleViewHeader
      context={CommunitiesCollapsibleHeaderContext}
      headerHeight={260}
    >
      <View style={styles.container}>
        <ImageBackground source={communityPhotoSource} style={styles.image}>
          <View style={styles.imageOverlay} />
          <Header
            left={<BackButton />}
            right={
              isGlobalCommunity ? null : (
                <Button
                  testID="communityProfileButton"
                  onPress={() =>
                    dispatch(navigatePush(COMMUNITY_PROFILE, { communityId }))
                  }
                >
                  {data?.community.userCreated &&
                  canEditCommunity(
                    data?.community.people.edges[0].communityPermission
                      .permission,
                    data?.community.userCreated,
                  ) ? (
                    <EditIcon color={theme.white} />
                  ) : (
                    <InfoIcon color={theme.white} />
                  )}
                </Button>
              )
            }
          />
          <Flex
            value={1}
            justify="around"
            style={{
              paddingLeft: 25,
              paddingRight: 100,
            }}
          >
            <Text style={styles.communityName} numberOfLines={2}>
              {isGlobalCommunity
                ? t('globalCommunity')
                : data?.community.name ?? '-'}
            </Text>
            <Flex direction="row" align="start">
              <Button
                testID="communityMembersButton"
                pill={true}
                type="transparent"
                onPress={() =>
                  !isGlobalCommunity &&
                  dispatch(navigatePush(COMMUNITY_MEMBERS, { communityId }))
                }
                style={styles.communityMembersButton}
                buttonTextStyle={styles.communityMembersText}
                text={t('memberCount', {
                  count:
                    (isGlobalCommunity
                      ? globalData?.globalCommunity.usersReport.usersCount
                      : data?.community.report.memberCount) ?? 0,
                })}
              />
            </Flex>
          </Flex>
        </ImageBackground>
        <ErrorNotice
          message={t('errorLoadingCommunityDetails')}
          error={error}
          refetch={refetch}
        />
        <ErrorNotice
          message={t('errorLoadingCommunityDetails')}
          error={globalError}
          refetch={globalRefetch}
        />
        <HeaderTabBar tabs={communityTabs} />
      </View>
    </CollapsibleViewHeader>
  );
};
