import React from 'react';
import { View, ImageBackground } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/react-hooks';
import { useDispatch } from 'react-redux';

import {
  createCollapsibleViewContext,
  CollapsibleViewHeader,
} from '../../../components/CollapsibleView/CollapsibleView';
import { Text, Flex, Button } from '../../../components/common';
import { HeaderTabBar } from '../../../components/HeaderTabBar/HeaderTabBar';
import {
  GROUP_CELEBRATE,
  GROUP_CHALLENGES,
  GROUP_IMPACT,
} from '../../Groups/GroupScreen';
import BackButton from '../../BackButton';
import theme from '../../../theme';
import Header from '../../../components/Header';
import { ErrorNotice } from '../../../components/ErrorNotice/ErrorNotice';
import { navigatePush } from '../../../actions/navigation';
import { COMMUNITY_PROFILE } from '../CommunityProfile/CommunityProfile';
import InfoIcon from '../../../../assets/images/infoIcon.svg';
import EditIcon from '../../../../assets/images/editIcon.svg';
import { useMyId } from '../../../utils/hooks/useIsMe';
import { useCommunityPhoto } from '../hooks/useCommunityPhoto';
import { canEditCommunity } from '../../../utils/common';

import styles from './styles';
import { COMMUNITY_HEADER_QUERY } from './queries';
import {
  CommunityHeader as CommunityHeaderQuery,
  CommunityHeaderVariables,
} from './__generated__/CommunityHeader';

export const CommunitiesCollapsibleHeaderContext = createCollapsibleViewContext();

interface CommunityHeaderProps {
  communityId: string;
}

export const CommunityHeader = ({ communityId }: CommunityHeaderProps) => {
  const { t } = useTranslation('communityHeader');
  const dispatch = useDispatch();
  const myId = useMyId();

  const { data, error, refetch } = useQuery<
    CommunityHeaderQuery,
    CommunityHeaderVariables
  >(COMMUNITY_HEADER_QUERY, {
    variables: { id: communityId, myId },
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
              <Button
                onPress={() =>
                  dispatch(navigatePush(COMMUNITY_PROFILE, { communityId }))
                }
              >
                {canEditCommunity(
                  data?.community.people.edges[0].communityPermission
                    .permission,
                  data?.community.userCreated,
                ) ? (
                  <EditIcon color={theme.white} />
                ) : (
                  <InfoIcon color={theme.white} />
                )}
              </Button>
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
              {data?.community.name ?? '-'}
            </Text>
            <Flex direction="row" align="start">
              <Button
                pill={true}
                type="transparent"
                onPress={() => {
                  // TODO: navigate to new members list screen
                }}
                style={styles.communityMembersButton}
                buttonTextStyle={styles.communityMembersText}
                text={t('memberCount', {
                  count: data?.community.report.memberCount ?? 0,
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
        <HeaderTabBar
          tabs={[
            { name: t('feed'), navigationAction: GROUP_CELEBRATE },
            {
              name: t('challenges'),
              navigationAction: GROUP_CHALLENGES,
            },
            { name: t('impact'), navigationAction: GROUP_IMPACT },
          ]}
        />
      </View>
    </CollapsibleViewHeader>
  );
};
