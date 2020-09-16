import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';

import { SocialAuthButton } from '../SocialAuthButton';

const btnText = 'Auth Button';
const btnIcon = 'some icon component';
const onPress = jest.fn();

it('should match snapshot', () => {
  expect(
    render(
      <SocialAuthButton text={btnText} icon={btnIcon} onPress={onPress} />,
    ).toJSON(),
  ).toMatchSnapshot();
});

it('should call onPress when the button is pressed', () => {
  jest.useFakeTimers();
  const { getByText } = render(
    <SocialAuthButton text={btnText} icon={btnIcon} onPress={onPress} />,
  );

  fireEvent.press(getByText(btnText));
  jest.runAllTimers();

  expect(onPress).toHaveBeenCalled();
});
