import React from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Text, Icon, Card, Touchable } from '../common';
import ItemHeaderText from '../ItemHeaderText';
import { AuthState } from '../../reducers/auth';
import ReminderButton from '../ReminderButton';
import ReminderDateText from '../ReminderDateText';

import styles from './styles';
import { StepItem as Step } from './__generated__/StepItem';

export interface StepItemProps {
  step: Step;
  onSelect?: (step: Step) => void;
  onPressName?: (step: Step) => void;
  myId?: string;
  testID?: string;
}
const StepItem = ({ step, onSelect, myId, onPressName }: StepItemProps) => {
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
            reminder={step.reminder}
          >
            <View style={reminderButton}>
              <Icon name="bellIcon" type="MissionHub" style={bellIcon} />
              <ReminderDateText reminder={step.reminder} />
            </View>
          </ReminderButton>
        </View>
        <Text style={styles.description}>{step.title}</Text>
      </View>
    </Card>
  );
};

const mapStateToProps = ({ auth }: { auth: AuthState }) => ({
  myId: auth.person.id,
});
export default connect(mapStateToProps)(StepItem);
