import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { addNewInteraction } from '../../../actions/interactions';
import CommentBox from '../../CommentBox';
import { INTERACTION_TYPES } from '../../../constants';
import JourneyCommentBox from '..';

jest.mock('../../../actions/interactions');
jest.mock('../../CommentBox', () => 'CommentBox');

const person = { id: '4243242' };
const text = 'matt watts loves the spurs';

let onSubmit: jest.Mock;

beforeEach(() => {
  onSubmit = jest.fn();
  (addNewInteraction as jest.Mock).mockReturnValue(() => Promise.resolve());
});

it('renders correctly', () => {
  renderWithContext(
    <JourneyCommentBox person={person} onSubmit={onSubmit} />,
  ).snapshot();
});

describe('onSubmit', () => {
  it('creates note', () => {
    const { getAllByType } = renderWithContext(
      <JourneyCommentBox person={person} onSubmit={onSubmit} />,
    );

    fireEvent(getAllByType(CommentBox)[0], 'onSubmit', text);

    expect(addNewInteraction).toHaveBeenCalledWith(
      person.id,
      INTERACTION_TYPES.MHInteractionTypeNote,
      text,
      undefined,
    );
    expect(onSubmit).toHaveBeenCalledWith();
  });
});
