import React, { useEffect } from 'react';
import { View, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { getImpactSummary } from '../../actions/impact';
import { Flex, Text } from '../../components/common';
import {
  GLOBAL_COMMUNITY_ID,
  ANALYTICS_ASSIGNMENT_TYPE,
  ANALYTICS_PERMISSION_TYPE,
} from '../../constants';
import { impactSummarySelector } from '../../selectors/impact';
import { organizationSelector } from '../../selectors/organizations';
import OnboardingCard, {
  GROUP_ONBOARDING_TYPES,
} from '../Groups/OnboardingCard';
import {
  getAnalyticsAssignmentType,
  getAnalyticsPermissionType,
} from '../../utils/analytics';
import { Person } from '../../reducers/people';
import { useMyId, useIsMe } from '../../utils/hooks/useIsMe';
import { RootState } from '../../reducers';
import { orgIsPersonalMinistry } from '../../utils/common';
import { useAnalytics } from '../../utils/hooks/useAnalytics';

import styles from './styles';

interface ImpactViewProps {
  person?: Person;
  orgId?: string;
}

const ImpactView = ({ person = {}, orgId = 'personal' }: ImpactViewProps) => {
  const { t } = useTranslation('impact');
  const dispatch = useDispatch();
  const myId = useMyId();
  const isMe = useIsMe(person.id);

  const isGlobalCommunity = orgId === GLOBAL_COMMUNITY_ID;

  const organization = useSelector(({ organizations }: RootState) =>
    organizationSelector({ organizations }, { orgId }),
  );

  const isPersonalMinistryMe = isMe && orgIsPersonalMinistry(organization);
  const isOrgImpact = !person.id;
  const isUserCreatedOrg = organization.user_created;
  // Impact summary isn't scoped by org unless showing org summary. See above comment
  const impact = useSelector((state: RootState) =>
    impactSummarySelector(state, {
      person: isGlobalCommunity ? { id: myId } : person,
      organization: person.id || isGlobalCommunity ? undefined : organization,
    }),
  );
  const globalImpact = useSelector((state: RootState) =>
    impactSummarySelector(state, {}),
  );

  const analyticsAssignmentType = useSelector(({ auth }: RootState) =>
    person.id ? getAnalyticsAssignmentType(person, auth, organization) : '',
  );
  const analyticsPermissionType = useSelector(({ auth }: RootState) =>
    !person.id ? getAnalyticsPermissionType(auth, organization) : '',
  );
  const screenSection = isOrgImpact ? 'community' : 'person';
  const screenSubsection = isOrgImpact
    ? 'impact'
    : isMe && !isPersonalMinistryMe
    ? 'my impact'
    : 'impact';
  useAnalytics([screenSection, screenSubsection], {
    screenContext: {
      [ANALYTICS_ASSIGNMENT_TYPE]: analyticsAssignmentType,
      [ANALYTICS_PERMISSION_TYPE]: analyticsPermissionType,
    },
  });

  useEffect(() => {
    // We don't scope summary sentence by org unless we are only scoping by org (person is not specified)
    // The summary sentence should include what the user has done in all of their orgs
    dispatch(
      getImpactSummary(
        isGlobalCommunity ? myId : person.id,
        person.id || isGlobalCommunity ? undefined : organization.id,
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
      : person.id
      ? person.first_name
      : steps_count === 0
      ? '$t(we)'
      : '$t(togetherWe)';

    const context = (c: number) =>
      c === 0 ? (paramGlobal ? 'emptyGlobal' : 'empty') : '';

    const isSpecificContact =
      !paramGlobal && !isMe && !isGlobalCommunity && person.id;

    const hideStageSentence =
      !paramGlobal && isUserCreatedOrg && pathway_moved_count === 0;

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
      initiator: ['$t(users)', '$t(we)', '$t(togetherWe)'].includes(initiator)
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
      {organization.id !== 'personal' ? (
        <OnboardingCard type={GROUP_ONBOARDING_TYPES.impact} />
      ) : null}
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
