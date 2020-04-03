import React, { useMemo } from 'react';
import { View, StyleProp, ViewStyle, Image } from 'react-native';
import { useSelector } from 'react-redux';
import colorThis from '@eknowles/color-this';

import { PeopleState } from '../../reducers/people';
import { personSelector } from '../../selectors/people';
import { Text } from '../common';

import styles from './styles';

type PersonType = { id: string | number; first_name: string; image?: string };
type AvatarSize = 'small' | 'medium' | 'large';
interface AvatarPropsCommon {
  size: AvatarSize;
  style?: StyleProp<ViewStyle>;
  orgId?: string;
}
interface AvatarPropsPerson extends AvatarPropsCommon {
  person: PersonType;
  personId?: string;
}
interface AvatarPropsPersonId extends AvatarPropsCommon {
  person?: PersonType;
  personId: string;
}

const EMPTY_PERSON = { id: '-', first_name: '-' };

function getSizeStyle(size: AvatarSize, type?: 'Image' | 'Text') {
  // @ts-ignore
  return styles[`${size}${type || ''}`];
}

const AvatarView = React.memo(({ person, size, style }: AvatarPropsPerson) => {
  const color = useMemo(() => colorThis(`${person.first_name}${person.id}`), [
    person,
  ]);
  const bgColor = { backgroundColor: color };
  let content;

  // TODO: Figure out what property this is on the person
  if (person.image) {
    content = (
      <Image
        source={{ uri: person.image, cache: 'force-cache' }}
        style={[styles.image, bgColor, getSizeStyle(size, 'Image')]}
      />
    );
  } else {
    content = (
      <Text style={[styles.text, getSizeStyle(size, 'Text')]}>
        {(person.first_name || '')[0] || '-'}
      </Text>
    );
  }
  return (
    <View style={[styles.avatar, bgColor, getSizeStyle(size), style]}>
      {content}
    </View>
  );
});

const AvatarPersonId = ({ personId, orgId, ...rest }: AvatarPropsPersonId) => {
  const person = useSelector<{ people: PeopleState }, PersonType>(
    ({ people }) => personSelector({ people }, { personId, orgId }),
  );

  if (person) {
    return <AvatarView person={person} {...rest} />;
  }
  return <AvatarView person={EMPTY_PERSON} {...rest} />;
};

const Avatar = React.memo(
  ({ person, personId, ...rest }: AvatarPropsPerson | AvatarPropsPersonId) => {
    if (person) {
      return <AvatarView person={person} {...rest} />;
    }
    if (personId) {
      return <AvatarPersonId personId={personId} {...rest} />;
    }

    return <AvatarView person={EMPTY_PERSON} {...rest} />;
  },
);

export default Avatar;
