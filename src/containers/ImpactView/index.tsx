import React, { useEffect } from 'react';
import { View, Image, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from '@apollo/react-hooks';

import { getImpactSummary } from '../../actions/impact';
import { Flex } from '../../components/common';
import { GLOBAL_COMMUNITY_ID } from '../../constants';
import { impactSummarySelector } from '../../selectors/impact';
import { organizationSelector } from '../../selectors/organizations';
import { useMyId, useIsMe } from '../../utils/hooks/useIsMe';
import { RootState } from '../../reducers';
import { useAnalytics } from '../../utils/hooks/useAnalytics';

import styles from './styles';
import { IMPACT_QUERY } from './queries';
import { Impact, ImpactVariables } from './__generated__/Impact';

interface ImpactViewProps {
  personId?: string;
  communityId?: string;
}

const ImpactView = ({
  personId,
  communityId = 'personal',
}: ImpactViewProps) => {
  const { t } = useTranslation('impact');
  const dispatch = useDispatch();
  const myId = useMyId();
  const isMe = useIsMe(personId ?? '');

  const isGlobalCommunity = communityId === GLOBAL_COMMUNITY_ID;

  const { data } = useQuery<Impact, ImpactVariables>(IMPACT_QUERY, {
    variables: { personId: personId ?? '' },
    skip: !personId,
  });

  const organization = useSelector((state: RootState) =>
    organizationSelector(state, { orgId: communityId }),
  );

  const isOrgImpact = !personId;
  // Impact summary isn't scoped by org unless showing org summary. See above comment
  const impact = useSelector((state: RootState) =>
    impactSummarySelector(state, {
      personId: isGlobalCommunity ? myId : personId,
      organization: personId || isGlobalCommunity ? undefined : organization,
    }),
  );
  const globalImpact = useSelector((state: RootState) =>
    impactSummarySelector(state, {}),
  );

  const screenSection = isOrgImpact ? 'community' : 'person';
  const screenSubsection = isMe ? 'my impact' : 'impact';
  useAnalytics([screenSection, screenSubsection]);

  useEffect(() => {
    // We don't scope summary sentence by org unless we are only scoping by org (person is not specified)
    // The summary sentence should include what the user has done in all of their orgs
    dispatch(
      getImpactSummary(
        isGlobalCommunity ? myId : personId,
        personId || isGlobalCommunity ? undefined : organization.id,
      ),
    );
    dispatch(getImpactSummary()); // Get global impact by calling without person or org
  }, []);

  const buildImpactSentence = (
    {
      steps_count = 0,
      receivers_count = 0,
      step_owners_count = 0,
      pathway_moved_count = 0,
    },
    paramGlobal = false,
  ) => {
    const initiator = paramGlobal
      ? '$t(users)'
      : isMe || isGlobalCommunity
      ? '$t(you)'
      : personId
      ? data?.person.firstName
      : steps_count === 0
      ? '$t(we)'
      : '$t(togetherWe)';

    const context = (c: number) =>
      c === 0 ? (paramGlobal ? 'emptyGlobal' : 'empty') : '';

    const isSpecificContact =
      !paramGlobal && !isMe && !isGlobalCommunity && personId;

    const hideStageSentence = !paramGlobal && pathway_moved_count === 0;

    const year = new Date().getFullYear();

    const stepsSentenceOptions = {
      context: context(steps_count),
      numInitiators: paramGlobal ? `${step_owners_count} ` : '',
      initiator: initiator,
      initiatorSuffix: !isSpecificContact ? t('haveSuffix') : t('hasSuffix'),
      stepsCount: steps_count,
      receiversCount: receivers_count,
      beginningScope:
        initiator === '$t(togetherWe)' ? '' : `${t('inYear', { year })}, `,
      endingScope: isSpecificContact
        ? t('inTheirLife')
        : initiator !== '$t(togetherWe)'
        ? ''
        : ` ${t('inYear', { year })}`,
    };
    const stageSentenceOptions = {
      context: context(pathway_moved_count),
      initiator: ['$t(users)', '$t(we)', '$t(togetherWe)'].includes(
        initiator ?? '',
      )
        ? '$t(allOfUs)'
        : initiator,
      pathwayMovedCount: pathway_moved_count,
    };

    const stepsStr = t('stepsSentence', stepsSentenceOptions);
    return `${stepsStr[0].toUpperCase() + stepsStr.slice(1)}${
      hideStageSentence ? '' : `\n\n${t('stageSentence', stageSentenceOptions)}`
    }`;
  };

  return (
    <View style={styles.container}>
      <Flex style={styles.topSection}>
        <Text style={styles.text}>{buildImpactSentence(impact)}</Text>
      </Flex>
      <Image
        style={styles.image}
        source={require('../../../assets/images/impactBackground.png')}
      />
      <Flex style={styles.bottomSection}>
        <Text style={styles.text}>
          {buildImpactSentence(globalImpact, true)}
        </Text>
      </Flex>
    </View>
  );
};

export default ImpactView;
