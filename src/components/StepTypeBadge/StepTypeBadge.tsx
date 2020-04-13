import React from 'react';
import { View, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SvgProps } from 'react-native-svg';

import { StepTypeEnum } from '../../../__generated__/globalTypes';
import { Text } from '../common';
import theme from '../../theme';
import RelateIcon from '../../../assets/images/stepTypes/relate.svg';
import PrayIcon from '../../../assets/images/stepTypes/pray.svg';
import CareIcon from '../../../assets/images/stepTypes/care.svg';
import ShareIcon from '../../../assets/images/stepTypes/share.svg';
import GenericIcon from '../../../assets/images/stepTypes/generic.svg';

interface StepTypeBadgeProps {
  stepType?: StepTypeEnum | null;
  displayVertically?: boolean;
  hideLabel?: boolean;
  hideIcon?: boolean;
  labelUppercase?: boolean;
  includeStepInLabel?: boolean;
  iconProps?: SvgProps;
  color?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const StepTypeBadge = ({
  stepType,
  displayVertically = false,
  hideLabel = false,
  hideIcon = false,
  labelUppercase = true,
  includeStepInLabel = true,
  iconProps = {},
  textStyle,
  color = theme.lightGrey,
  style,
}: StepTypeBadgeProps) => {
  const { t } = useTranslation('stepTypes');

  const renderIcon = () => {
    switch (stepType) {
      case 'relate':
        return <RelateIcon height={24} color={color} {...iconProps} />;
      case 'pray':
        return <PrayIcon height={24} color={color} {...iconProps} />;
      case 'care':
        return <CareIcon height={24} color={color} {...iconProps} />;
      case 'share':
        return <ShareIcon height={24} color={color} {...iconProps} />;
      default:
        return <GenericIcon height={24} color={color} {...iconProps} />;
    }
  };

  const renderText = () => {
    switch (stepType) {
      case 'relate':
      case 'pray':
      case 'care':
      case 'share':
        return `${t(stepType)}${includeStepInLabel ? ` ${t('step')}` : ''}`;
      default:
        return t('stepOfFaith');
    }
  };

  return (
    <View
      style={[
        {
          flexDirection: displayVertically ? 'column' : 'row',
          alignItems: 'center',
        },
        style,
      ]}
    >
      {hideIcon ? null : renderIcon()}
      {hideLabel ? null : (
        <Text
          style={[
            {
              fontSize: 16,
              fontWeight: 'bold',
              color,
              letterSpacing: 1,
              paddingLeft: hideIcon ? 0 : 4,
            },
            textStyle,
          ]}
        >
          {labelUppercase ? renderText().toUpperCase() : renderText()}
        </Text>
      )}
    </View>
  );
};