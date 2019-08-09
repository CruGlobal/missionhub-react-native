import React from 'react';

import { Text, Card } from '../common';

import styles from './styles';

interface Step {
  body: string;
}
interface StepSuggestionItemProps {
  step: Step;
  onPress: (step: Step) => void;
}

const StepSuggestionItem = ({ step, onPress }: StepSuggestionItemProps) => {
  const handlePress = () => {
    onPress(step);
  };

  return (
    <Card testID="stepSuggestionCard" onPress={handlePress} style={styles.card}>
      <Text style={styles.stepText}>{step.body}</Text>
    </Card>
  );
};

export default StepSuggestionItem;
