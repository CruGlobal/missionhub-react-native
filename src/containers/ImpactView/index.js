/* eslint complexity: 0, max-lines: 0 */

import React, { useEffect } from 'react';
import { ScrollView, Image } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { GLOBAL_COMMUNITY_ID } from '../../constants';
import { getImpactSummary } from '../../actions/impact';
import { Flex, Text } from '../../components/common';
import { impactSummarySelector } from '../../selectors/impact';
import { organizationSelector } from '../../selectors/organizations';
import OnboardingCard, {
  GROUP_ONBOARDING_TYPES,
} from '../Groups/OnboardingCard';

import styles from './styles';

const ImpactView = ({
  dispatch,
  person = {},
  organization,
  myId,
  globalImpact,
  impact,
  isGlobalCommunity,
  isMe,
  isUserCreatedOrg,
}) => {
  const { t } = useTranslation('impact');
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
    const context = c =>
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
    <ScrollView style={styles.container} bounces={false}>
      {organization.id !== 'person' ? (
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
    </ScrollView>
  );
};

ImpactView.propTypes = {
  person: PropTypes.object,
  organization: PropTypes.object,
};

export const mapStateToProps = (
  { impact, auth, organizations },
  { person = {}, orgId = 'personal' },
) => {
  const personId = person.id;
  const myId = auth.person.id;
  const isMe = personId === myId;
  const isGlobalCommunity = orgId === GLOBAL_COMMUNITY_ID;

  const organization = organizationSelector({ organizations }, { orgId });

  return {
    isMe,
    isOrgImpact: !personId,
    // Impact summary isn't scoped by org unless showing org summary. See above comment
    impact: impactSummarySelector(
      { impact },
      {
        person: isGlobalCommunity ? { id: myId } : person,
        organization: personId || isGlobalCommunity ? undefined : organization,
      },
    ),
    globalImpact: impactSummarySelector({ impact }),
    isGlobalCommunity,
    myId,
    organization,
  };
};

export default connect(mapStateToProps)(ImpactView);
