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
const organization = { id: '99999' };
const text = 'matt watts loves the spurs';

let onSubmit: jest.Mock;

beforeEach(() => {
  onSubmit = jest.fn();
  (addNewInteraction as jest.Mock).mockReturnValue(() => Promise.resolve());
});

it('renders correctly', () => {
  renderWithContext(
    <JourneyCommentBox
      person={person}
      organization={null}
      onSubmit={onSubmit}
    />,
  ).snapshot();
});

describe('onSubmit', () => {
  describe('without organization', () => {
    describe('action type is not submitted', () => {
      it('creates note', () => {
        const { getAllByType } = renderWithContext(
          <JourneyCommentBox
            person={person}
            organization={null}
            onSubmit={onSubmit}
          />,
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
  });

  describe('with organization', () => {
    it('creates interaction with org id', () => {
      const { getAllByType } = renderWithContext(
        <JourneyCommentBox
          person={person}
          organization={organization}
          onSubmit={onSubmit}
        />,
      );

      fireEvent(getAllByType(CommentBox)[0], 'onSubmit', text);

      expect(addNewInteraction).toHaveBeenCalledWith(
        person.id,
        INTERACTION_TYPES.MHInteractionTypeNote,
        text,
        undefined,
      );
    });
  });
});
