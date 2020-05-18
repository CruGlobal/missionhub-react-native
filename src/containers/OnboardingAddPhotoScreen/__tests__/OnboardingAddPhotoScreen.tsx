import React from 'react';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';
import { useMutation } from '@apollo/react-hooks';

import { renderWithContext } from '../../../../testUtils';
import { UPDATE_PERSON } from '../../../containers/SetupScreen/queries';
import { OnboardingAddPhotoScreen } from '../';

const MOCK_IMAGE = 'base64image.jpeg';
const MOCK_IMAGE_2 = 'base64image2.jpeg';
const next = jest.fn(() => () => ({}));

describe('OnboardingAddPhotoScreen', () => {
  it('renders without image correctly', () => {
    renderWithContext(<OnboardingAddPhotoScreen next={next} />).snapshot();
  });

  it('should select an image', async () => {
    const { getByTestId, recordSnapshot, diffSnapshot } = renderWithContext(
      <OnboardingAddPhotoScreen next={next} />,
    );
    recordSnapshot();

    await fireEvent(getByTestId('ImagePicker'), 'onSelectImage', {
      data: `data:image/jpeg;base64,${MOCK_IMAGE}`,
    });

    diffSnapshot();
  });

  it('should change an image', async () => {
    const { getByTestId, recordSnapshot, diffSnapshot } = renderWithContext(
      <OnboardingAddPhotoScreen next={next} />,
    );

    await fireEvent(getByTestId('ImagePicker'), 'onSelectImage', {
      data: `data:image/jpeg;base64,${MOCK_IMAGE}`,
    });

    recordSnapshot();

    await fireEvent(getByTestId('ImagePicker'), 'onSelectImage', {
      data: `data:image/jpeg;base64,${MOCK_IMAGE_2}`,
    });

    diffSnapshot();
  });

  it('skips to next screen', () => {
    let personUpdated = false;
    const { getByTestId } = renderWithContext(
      <OnboardingAddPhotoScreen next={next} />,
      {
        mocks: {
          Mutation: () => ({
            updatePerson: () => {
              personUpdated = true;
              return;
            },
          }),
        },
      },
    );

    fireEvent.press(getByTestId('skipButton'));

    expect(next).toHaveBeenCalledWith();
    expect(personUpdated).toEqual(false);
  });

  it('saves image and navigates to next screen', async () => {
    const myId = '1';
    let personUpdated = false;

    const { getByTestId } = renderWithContext(
      <OnboardingAddPhotoScreen next={next} />,
      {
        mocks: {
          Query: () => ({
            person: () => ({
              id: myId,
            }),
          }),
          Mutation: () => ({
            updatePerson: () => {
              personUpdated = true;
              return;
            },
          }),
        },
      },
    );

    await flushMicrotasksQueue();

    await fireEvent(getByTestId('ImagePicker'), 'onSelectImage', {
      data: MOCK_IMAGE,
    });

    fireEvent.press(getByTestId('bottomButton'));

    expect(next).toHaveBeenCalledWith();
    expect(personUpdated).toEqual(true);
    expect(useMutation).toHaveBeenMutatedWith(UPDATE_PERSON, {
      variables: {
        input: {
          id: myId,
          picture: MOCK_IMAGE,
        },
      },
    });
  });
});
