import React from 'react';
import { connect } from 'react-redux-legacy';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Text, Icon, Card, Touchable } from '../common';
import ItemHeaderText from '../ItemHeaderText';
import { AuthState } from '../../reducers/auth';
import ReminderButton from '../ReminderButton';
import ReminderDateText from '../ReminderDateText';
import { StepReminderState, ReminderType } from '../../reducers/stepReminders';
import { reminderSelector } from '../../selectors/stepReminders';

import styles from './styles';

type StepType = {
  id: string;
  title: string;
  accepted_at?: string;
  completed_at?: string;
  created_at?: string;
  updated_at?: string;
  notified_at?: string;
  note?: string;
  owner: object;
  receiver?: { id: string; full_name: string };
};

export interface StepItemProps {
  step: StepType;
  onSelect?: (step: StepType) => void;
  onPressName?: (step: StepType) => void;
  myId?: string;
  reminder?: ReminderType;
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
    : (step.receiver && step.receiver.full_name) || '';
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
  { step }: any,
) => ({
  myId: auth.person.id,
  reminder: reminderSelector({ stepReminders }, { stepId: step.id }),
});
export default connect(mapStateToProps)(StepItem);
