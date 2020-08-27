import React from 'react';
import { View, StyleProp, ViewStyle, TextStyle, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SvgProps } from 'react-native-svg';

import { StepTypeEnum } from '../../../__generated__/globalTypes';
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
  largeIcon?: boolean;
  labelUppercase?: boolean;
  includeStepInLabel?: boolean;
  iconProps?: SvgProps;
  color?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const StepTypeBadge = React.memo(
  ({
    stepType,
    displayVertically = false,
    hideLabel = false,
    hideIcon = false,
    largeIcon = false,
    labelUppercase = true,
    includeStepInLabel = true,
    iconProps = {},
    textStyle,
    color = theme.lightGrey,
    style,
  }: StepTypeBadgeProps) => {
    const { t } = useTranslation('stepTypes');

    const renderIcon = () => {
      const props = {
        height: largeIcon ? 32 : 24,
        color,
        ...iconProps,
      };

      switch (stepType) {
        case 'relate':
          return <RelateIcon {...props} />;
        case 'pray':
          return <PrayIcon {...props} />;
        case 'care':
          return <CareIcon {...props} />;
        case 'share':
          return <ShareIcon {...props} />;
        default:
          return <GenericIcon {...props} />;
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
              labelUppercase ? theme.textBold16 : theme.textRegular14,
              {
                color,
                paddingLeft: hideIcon ? 0 : 4,
                ...(displayVertically && !hideIcon ? { marginTop: 7 } : {}),
              },
              textStyle,
            ]}
          >
            {labelUppercase ? renderText().toUpperCase() : renderText()}
          </Text>
        )}
      </View>
    );
  },
);
