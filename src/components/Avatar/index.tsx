import React from 'react';
import {
  View,
  StyleProp,
  ViewStyle,
  Image,
  ImageStyle,
  TextStyle,
} from 'react-native';
import { useSelector } from 'react-redux';

import { PeopleState } from '../../reducers/people';
import { personSelector } from '../../selectors/people';
import { Text } from '../common';
import theme from '../../theme';

import styles from './styles';

type PersonType = {
  id: string | number;
  first_name?: string;
  firstName?: string;
  fullName?: string;
  full_name?: string;
  picture?: string | null;
};

type AvatarSize = 'small' | 'medium' | 'large';

const wrapStyles: { [key in AvatarSize]: StyleProp<ViewStyle> } = {
  small: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.white,
  },
  medium: { width: 48, height: 48, borderRadius: 24 },
  large: { width: 96, height: 96, borderRadius: 48 },
};
const textStyles: { [key in AvatarSize]: StyleProp<TextStyle> } = {
  small: { fontSize: 12 },
  medium: { fontSize: 26, fontWeight: '300' },
  large: { fontSize: 64, fontWeight: '300' },
};

interface AvatarPropsCommon {
  size: AvatarSize;
  style?: StyleProp<ViewStyle>;
  personId?: string;
  person?: PersonType;
  orgId?: string;
}
interface AvatarPropsPerson extends AvatarPropsCommon {
  person: PersonType;
}
interface AvatarPropsPersonId extends AvatarPropsCommon {
  personId: string;
}
export type AvatarProps = AvatarPropsPerson | AvatarPropsPersonId;
interface AvatarViewProps extends AvatarPropsCommon {
  person: PersonType;
}

const EMPTY_PERSON = { id: '-', first_name: '-' };

const AvatarView = React.memo(({ person, size, style }: AvatarViewProps) => {
  const name =
    person.firstName ||
    person.first_name ||
    person.fullName ||
    person.full_name ||
    '';
  const initial = name[0] || '-';

  const wrapStyle = [wrapStyles[size], style];

  if (person.picture) {
    return (
      <Image
        source={{ uri: person.picture }}
        style={[wrapStyle as StyleProp<ImageStyle>]}
        resizeMode="cover"
      />
    );
  }

  return (
    <View style={[styles.avatar, wrapStyle]}>
      <Text style={[styles.text, textStyles[size]]}>{initial}</Text>
    </View>
  );
});

const AvatarPersonId = ({ personId, orgId, ...rest }: AvatarPropsPersonId) => {
  const person = useSelector<{ people: PeopleState }, PersonType>(
    ({ people }) => personSelector({ people }, { personId, orgId }),
  );
  return <AvatarView person={person || EMPTY_PERSON} {...rest} />;
};

const Avatar = ({
  person,
  personId,
  ...rest
}: AvatarPropsPerson | AvatarPropsPersonId) => {
  if (personId) {
    return <AvatarPersonId personId={personId} {...rest} />;
  }
  return <AvatarView person={person || EMPTY_PERSON} {...rest} />;
};

export default Avatar;
