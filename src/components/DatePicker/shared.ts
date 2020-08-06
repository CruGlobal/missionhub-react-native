import { ReactNode } from 'react';
import { IOSNativeProps } from '@react-native-community/datetimepicker';

export interface DateTimePickerButtonProps {
  date: IOSNativeProps['date'] | string;
  mode?: IOSNativeProps['mode'];
  minimumDate?: IOSNativeProps['minimumDate'];
  height?: number;
  onDateChange: (date: Date) => void;
  onPress?: ({ showPicker }: { showPicker: () => void }) => void;
  children?: ReactNode;
  iOSModalContent?: ReactNode;
  testID?: string;
}
