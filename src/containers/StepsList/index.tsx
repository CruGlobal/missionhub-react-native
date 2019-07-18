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

import styles from './styles';

interface Step {
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
  receiverId: string;
  contactStageId: string;
  contactName?: string;
  onPressStep: (step: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  }) => void;
}

type StepsListProps = StepsListOwnProps & StepsComputedProps;

const StepsList = ({
  isMe,
  contactStageId,
  suggestions,
  contactName,
  onPressStep,
  dispatch,
}: StepsListProps) => {
  const { t } = useTranslation('selectStep');

  const [suggestionIndex, setSuggestionIndex] = useState(4);

  useEffect(() => {
    dispatch(getStepSuggestions(isMe, contactStageId));
  }, []);

  const handleLoadSteps = () => {
    setSuggestionIndex(suggestionIndex => suggestionIndex + 4);
  };

  const getSuggestionSubset = () => {
    const newSuggestions = suggestions.slice(0, suggestionIndex);
    return isMe ? newSuggestions : insertName(newSuggestions, contactName);
  };

  const renderItem = ({ item }: { item: Step }) => {
    return <StepSuggestionItem step={item} onPress={onPressStep} />;
  };

  const { list } = styles;

  return (
    <FlatList
      keyExtractor={keyExtractorId}
      data={getSuggestionSubset()}
      renderItem={renderItem}
      scrollEnabled={true}
      style={list}
      ListFooterComponent={
        suggestions.length > suggestionIndex && (
          <LoadMore
            onPress={handleLoadSteps}
            text={t('loadMoreSteps').toUpperCase()}
          />
        )
      }
    />
  );
};

const mapStateToProps = (
  { auth, steps }: { auth: AuthState; steps: { [key: string]: any } }, // eslint-disable-line @typescript-eslint/no-explicit-any
  { receiverId, contactStageId }: StepsListOwnProps,
) => {
  const myId = auth.person.id;
  const isMe = receiverId === myId;

  return {
    isMe,
    suggestions:
      (isMe
        ? steps.suggestedForMe[contactStageId]
        : steps.suggestedForOthers[contactStageId]) || [],
  };
};
export default connect(mapStateToProps)(StepsList);
