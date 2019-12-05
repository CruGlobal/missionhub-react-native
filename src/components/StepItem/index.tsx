import React from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import gql from 'graphql-tag';

import { Text, Icon, Card, Touchable } from '../common';
import ItemHeaderText from '../ItemHeaderText';
import { AuthState } from '../../reducers/auth';
import ReminderButton from '../ReminderButton';
import ReminderDateText from '../ReminderDateText';
import { StepReminderState, ReminderType } from '../../reducers/stepReminders';
import { reminderSelector } from '../../selectors/stepReminders';

import styles from './styles';
import { StepItem as Step } from './__generated__/StepItem';

export const STEP_ITEM_FRAGMENT = gql`
  fragment StepItem on Step {
    id
    title
    receiver {
      id
      fullName
    }
    community {
      id
    }
  }
`;

export interface StepItemProps {
  step: Step;
  onSelect?: (step: Step) => void;
  onPressName?: (step: Step) => void;
  myId?: string;
  reminder?: ReminderType;
  testID?: string;
}
const StepItem = ({
  step,
  onSelect,
  myId,
  reminder,
  onPressName,
}: StepItemProps) => {
  const { t } = useTranslation();

  const handleSelect = () => {
    step.receiver && onSelect && onSelect(step);
  };

  const handlePressName = () => {
    step.receiver && onPressName && onPressName(step);
  };

  const isMe = step.receiver && step.receiver.id === myId;
  const ownerName = isMe
    ? t('me')
    : (step.receiver && step.receiver.fullName) || '';
  const { bellIcon, reminderButton } = styles;
  return (
    <Card testID="StepItemCard" onPress={handleSelect} style={styles.card}>
      <View style={styles.flex1}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Touchable
            testID="StepItemPersonButton"
            onPress={handlePressName}
            style={styles.nameWrap}
          >
            <ItemHeaderText style={styles.stepUserName} text={ownerName} />
          </Touchable>
          <ReminderButton
            testID="StepReminderButton"
            stepId={step.id}
            reminder={reminder}
          >
            <View style={reminderButton}>
              <Icon name="bellIcon" type="MissionHub" style={bellIcon} />
              <ReminderDateText reminder={reminder} />
            </View>
          </ReminderButton>
        </View>
        <Text style={styles.description}>{step.title}</Text>
      </View>
    </Card>
  );
};

const mapStateToProps = (
  {
    auth,
    stepReminders,
  }: { auth: AuthState; stepReminders: StepReminderState },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { step }: { step: Step },
) => ({
  myId: auth.person.id,
  reminder: reminderSelector({ stepReminders }, { stepId: step.id }),
});
export default connect(mapStateToProps)(StepItem);
