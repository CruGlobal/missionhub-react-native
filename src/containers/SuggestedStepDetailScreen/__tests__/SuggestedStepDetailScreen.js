import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { addStep } from '../../../actions/steps';

import SuggestedStepDetailScreen from '..';

jest.mock('../../../actions/steps');

const step = {
  body: 'do this step',
  description_markdown: 'some markdown',
};
const receiverId = '423325';
const orgId = '880124';

const nextResponse = { type: 'next' };
const addStepResponse = { type: 'add step' };

const next = jest.fn();

next.mockReturnValue(nextResponse);
addStep.mockReturnValue(addStepResponse);

it('renders correctly', () => {
  renderWithContext(<SuggestedStepDetailScreen next={next} />, {
    navParams: { step, receiverId, orgId },
  }).snapshot();
});

describe('bottomButtonProps', () => {
  it('adds step', async () => {
    const { getByTestId, store } = renderWithContext(
      <SuggestedStepDetailScreen next={next} />,
      {
        navParams: { step, receiverId, orgId },
      },
    );

    await fireEvent.press(getByTestId('bottomButton'));

    expect(addStep).toHaveBeenCalledWith(step, receiverId, orgId);
    expect(store.getActions()).toEqual([addStepResponse, nextResponse]);
  });
});
