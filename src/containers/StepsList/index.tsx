import React, { useState, useEffect } from 'react';
import { FlatList } from 'react-native';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { useTranslation } from 'react-i18next';

import { getStepSuggestions } from '../../actions/steps';
import { insertName } from '../../utils/steps';
import StepSuggestionItem from '../../components/StepSuggestionItem';
import LoadMore from '../../components/LoadMore';
import { keyExtractorId } from '../../utils/common';
import { AuthState } from '../../reducers/auth';
import { Step } from '../SelectStepScreen';
import { Text, Icon } from '../../components/common';
import { Card } from '../../components/common';

import styles from './styles';

interface StepInterface {
  body: string;
}

interface StepsComputedProps {
  isMe: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  suggestions: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: ThunkDispatch<any, null, never>;
}

interface StepsListOwnProps {
  personId: string;
  contactStageId: string;
  contactName?: string;
  onPressStep: (step: Step) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onPressCreateStep: any;
}

type StepsListProps = StepsListOwnProps & StepsComputedProps;

const StepsList = ({
  isMe,
  contactStageId,
  suggestions,
  contactName,
  onPressStep,
  onPressCreateStep,
  dispatch,
}: StepsListProps) => {
  const { t } = useTranslation('selectStep');

  const [suggestionIndex, setSuggestionIndex] = useState(4);

  useEffect(() => {
    dispatch(getStepSuggestions(isMe, contactStageId));
  }, [contactStageId, dispatch, isMe]);

  const handleLoadSteps = () => {
    setSuggestionIndex(suggestionIndex => suggestionIndex + 4);
  };

  const getSuggestionSubset = () => {
    const newSuggestions = suggestions.slice(0, suggestionIndex);
    return isMe ? newSuggestions : insertName(newSuggestions, contactName);
  };

  const renderItem = ({ item }: { item: StepInterface }) => {
    return <StepSuggestionItem step={item} onPress={onPressStep} />;
  };

  const { list } = styles;

  return (
    <>
      <Card style={styles.card} onPress={onPressCreateStep}>
        <Text style={styles.createStepText}>{t('createStep')}</Text>
        <Icon
          style={styles.createStepIcon}
          name="createStepIcon"
          type="MissionHub"
          size={10}
        />
      </Card>
      <FlatList
        keyExtractor={keyExtractorId}
        data={getSuggestionSubset()}
        renderItem={renderItem}
        scrollEnabled={true}
        style={list}
        ListFooterComponent={
          suggestions.length > suggestionIndex ? (
            <LoadMore
              testID="loadMore"
              onPress={handleLoadSteps}
              text={t('loadMoreSteps').toUpperCase()}
            />
          ) : null
        }
      />
    </>
  );
};

const mapStateToProps = (
  { auth, steps }: { auth: AuthState; steps: Step }, // eslint-disable-line @typescript-eslint/no-explicit-any
  { personId, contactStageId }: StepsListOwnProps,
) => {
  const myId = auth.person.id;
  const isMe = personId === myId;

  return {
    isMe,
    suggestions:
      (isMe
        ? steps.suggestedForMe[contactStageId]
        : steps.suggestedForOthers[contactStageId]) || [],
  };
};
export default connect(mapStateToProps)(StepsList);
