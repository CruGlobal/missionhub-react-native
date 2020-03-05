import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';

import { StepTypeEnum } from '../../../__generated__/globalTypes';
import { Text } from '../common';
import theme from '../../theme';
import RelateIcon from '../../../assets/images/stepTypes/relate.svg';
import PrayIcon from '../../../assets/images/stepTypes/pray.svg';
import CareIcon from '../../../assets/images/stepTypes/care.svg';
import ShareIcon from '../../../assets/images/stepTypes/share.svg';
import GenericIcon from '../../../assets/images/stepTypes/generic.svg';

interface StepTypeBadgeProps {
  stepType?: StepTypeEnum;
  displayVertically?: boolean;
  hideLabel?: boolean;
  hideIcon?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const StepTypeBadge = ({
  stepType,
  displayVertically = false,
  hideLabel = false,
  hideIcon = false,
  style,
}: StepTypeBadgeProps) => {
  const { t } = useTranslation('stepTypes');

  const renderIcon = () => {
    switch (stepType) {
      case 'relate':
        return <RelateIcon height={24} color={theme.lightGrey} />;
      case 'pray':
        return <PrayIcon height={24} color={theme.lightGrey} />;
      case 'care':
        return <CareIcon height={24} color={theme.lightGrey} />;
      case 'share':
        return <ShareIcon height={24} color={theme.lightGrey} />;
      default:
        return <GenericIcon height={24} color={theme.lightGrey} />;
    }
  };

  const renderText = () => {
    switch (stepType) {
      case 'relate':
      case 'pray':
      case 'care':
      case 'share':
        return t(stepType);
      default:
        return t('stepOfFaith');
    }
  };

  return (
    <View
      style={[{ flexDirection: displayVertically ? 'column' : 'row' }, style]}
    >
      {hideIcon ? null : renderIcon()}
      {hideLabel ? null : (
        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: theme.lightGrey,
            letterSpacing: 1,
            paddingLeft: hideIcon ? 0 : 4,
          }}
        >
          {renderText().toUpperCase()}
        </Text>
      )}
    </View>
  );
};
