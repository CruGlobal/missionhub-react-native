import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { useDispatch } from 'react-redux';

import Avatar from '../Avatar';
import Button from '../Button';
import { openMainMenu } from '../../utils/common';

import { GET_CURRENT_USER_AVATAR } from './queries';
import { GetCurrentUserAvatar } from './__generated__/GetCurrentUserAvatar';

const AvatarMenuButton = () => {
  const dispatch = useDispatch();
  const { data: { currentUser } = {} } = useQuery<GetCurrentUserAvatar>(
    GET_CURRENT_USER_AVATAR,
    { fetchPolicy: 'cache-first' },
  );

  return (
    <Button onPress={() => dispatch(openMainMenu())} testID="menuButton">
      <Avatar size="mediumSmall" person={currentUser?.person} />
    </Button>
  );
};

export default AvatarMenuButton;
