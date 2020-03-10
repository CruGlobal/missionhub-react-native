import React, { useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { ThunkAction } from 'redux-thunk';
import { useNavigationParam } from 'react-navigation-hooks';
import { useTranslation } from 'react-i18next';
// eslint-disable-next-line import/default
import ParallaxScrollView from 'react-native-parallax-scroll-view';

import { Text } from '../../components/common';
import BackButton from '../BackButton';
import Skip from '../../components/Skip';
import theme from '../../theme';
import StepsList from '../StepsList';
import Header from '../../components/Header';
import IconButton from '../../components/IconButton';
import { useAnalytics } from '../../utils/hooks/useAnalytics';
import {
  personSelector,
  contactAssignmentSelector,
} from '../../selectors/people';
import { AuthState } from '../../reducers/auth';
import { PeopleState, Person } from '../../reducers/people';
import { useIsMe } from '../../utils/hooks/useIsMe';
import SelectStepExplainerModal from '../../components/SelectStepExplainerModal';

import styles from './styles';

export interface Step {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface SelectStepScreenProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  next: (nextProps: {
    personId: string;
    step?: Step;
    skip: boolean;
    orgId?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) => ThunkAction<void, any, null, never>;
}

const SelectStepScreen = ({ next }: SelectStepScreenProps) => {
  const { t } = useTranslation('selectStep');
  useAnalytics('add step');
  const dispatch = useDispatch();

  const [isExplainerOpen, setIsExplainerOpen] = useState(false);
  const personId: string = useNavigationParam('personId');
  const orgId: string | undefined = useNavigationParam('orgId');
  const enableSkipButton: boolean =
    useNavigationParam('enableSkipButton') || false;

  const person = useSelector<{ people: PeopleState }, Person>(({ people }) =>
    personSelector({ people }, { personId, orgId }),
  );
  const isMe = useIsMe(personId);

  const stageId = useSelector<{ auth: AuthState }, string>(
    ({ auth }) =>
      (isMe
        ? auth.person.user
        : contactAssignmentSelector(
            { auth },
            {
              person,
              orgId,
            },
          ) || {}
      ).pathway_stage_id,
  );

  const navigateNext = (step?: Step, skip = false) => {
    dispatch(
      next({
        personId,
        step,
        skip,
        orgId,
      }),
    );
  };

  const navToSuggestedStep = (step: Step) => {
    navigateNext(step);
  };

  const navToCreateStep = () => {
    navigateNext();
  };

  const handleSkip = () => {
    navigateNext(undefined, true);
  };

  const renderForeground = () => {
    return (
      <View style={{ flex: 1 }}>
        {renderHeader()}
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.headerText}>
            {isMe ? t('meHeader.part1') : t('personHeader.part1')}
          </Text>
          <Text style={styles.headerText}>
            {isMe
              ? t('meHeader.part2')
              : t('personHeader.part2', { name: person && person.first_name })}
          </Text>
        </View>
      </View>
    );
  };

  const renderHeader = () => (
    <Header
      left={<BackButton />}
      right={
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {enableSkipButton ? <Skip onSkip={handleSkip} /> : null}
          {/* TODO: Plug in the right information icon */}
          <IconButton
            name="filterIcon"
            type="MissionHub"
            onPress={() => setIsExplainerOpen(true)}
            testID="SelectStepExplainerIconButton"
          />
        </View>
      }
    />
  );

  const { headerHeight } = theme;

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ backgroundColor: theme.primaryColor }} />
      <ParallaxScrollView
        backgroundColor={theme.primaryColor}
        contentBackgroundColor={theme.extraLightGrey}
        parallaxHeaderHeight={180}
        renderForeground={renderForeground}
        stickyHeaderHeight={headerHeight}
        renderStickyHeader={renderHeader}
      >
        <StepsList
          onPressCreateStep={navToCreateStep}
          contactName={person && person.first_name}
          personId={personId}
          contactStageId={stageId}
          onPressStep={navToSuggestedStep}
        />
      </ParallaxScrollView>
      {isExplainerOpen && (
        <SelectStepExplainerModal onClose={() => setIsExplainerOpen(false)} />
      )}
    </View>
  );
};

export default SelectStepScreen;
export const SELECT_STEP_SCREEN = 'nav/SELECT_STEP';
