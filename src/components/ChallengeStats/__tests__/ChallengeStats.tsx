import React from 'react';
import MockDate from 'mockdate';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { navigatePush } from '../../../actions/navigation';
import { CHALLENGE_MEMBERS_SCREEN } from '../../../containers/ChallengeMembers';

import ChallengeStats from '..';

jest.mock('../../../actions/celebration');
jest.mock('../../../actions/navigation');

const mockDate = '2019-08-25 12:00:00 PM GMT+0';
MockDate.set(mockDate);

const organization = { id: '456' };
const date = '2019-08-25';
const daysAgo2 = '2019-08-23';
const daysAhead1 = '2019-08-26';
const challenge = {
  id: '1',
  creator_id: 'person1',
  organization,
  title: 'Read "There and Back Again"',
  end_date: date,
  accepted_at: date,
  accepted_count: 5,
  completed_count: 3,
  isPast: false,
  created_at: daysAgo2,
};
const props = {
  challenge,
};

beforeEach(() => {
  (navigatePush as jest.Mock).mockReturnValue({ type: 'navigate push' });
});

it('render challenge stats', () => {
  renderWithContext(<ChallengeStats {...props} />).snapshot();
});

it('render challenge stats | DetailScreen', () => {
  renderWithContext(
    <ChallengeStats {...props} isDetailScreen={true} />,
  ).snapshot();
});

it('render challenge stats small with style', () => {
  renderWithContext(
    <ChallengeStats {...props} isDetailScreen={false} style={{ padding: 5 }} />,
  ).snapshot();
});

it('render challenge stats with style', () => {
  renderWithContext(
    <ChallengeStats {...props} style={{ padding: 5 }} />,
  ).snapshot();
});

it('render past challenge stats', () => {
  renderWithContext(
    <ChallengeStats
      {...props}
      challenge={{
        ...challenge,
        isPast: true,
      }}
    />,
  ).snapshot();
});

it('render upcoming challenge stats', () => {
  renderWithContext(
    <ChallengeStats
      {...props}
      challenge={{
        ...challenge,
        end_date: daysAhead1,
      }}
    />,
  ).snapshot();
});

it('navigates to ChallengeMemberScreen when Pressed | Joined', async () => {
  const { getByTestId } = renderWithContext(<ChallengeStats {...props} />);
  await fireEvent.press(getByTestId('joinedCount'));
  expect(navigatePush).toHaveBeenCalledWith(CHALLENGE_MEMBERS_SCREEN, {
    challenge,
    orgId: organization.id,
    completed: false,
  });
});

it('navigates to ChallengeMemberScreen when Pressed | Completed', async () => {
  const { getByTestId } = renderWithContext(<ChallengeStats {...props} />);
  await fireEvent.press(getByTestId('completedCount'));
  expect(navigatePush).toHaveBeenCalledWith(CHALLENGE_MEMBERS_SCREEN, {
    challenge,
    orgId: organization.id,
    completed: true,
  });
});

it('does not navigate if accepted_count is 0 | Joined', async () => {
  const { getByTestId, snapshot } = renderWithContext(
    <ChallengeStats
      {...props}
      challenge={{
        ...challenge,
        accepted_count: 0,
      }}
    />,
  );
  snapshot();
  await fireEvent.press(getByTestId('joinedCount'));
  expect(navigatePush).not.toHaveBeenCalled();
});

it('does not navigate if completed_count is 0 | Completed', async () => {
  const { getByTestId, snapshot } = renderWithContext(
    <ChallengeStats
      {...props}
      challenge={{
        ...challenge,
        completed_count: 0,
      }}
    />,
  );
  snapshot();
  await fireEvent.press(getByTestId('completedCount'));
  expect(navigatePush).not.toHaveBeenCalled();
});

it('does not navigate if organization is null | Joined', async () => {
  const { getByTestId, snapshot } = renderWithContext(
    <ChallengeStats
      {...props}
      challenge={{
        ...challenge,
        organization: null,
        accepted_count: 0,
      }}
    />,
  );
  snapshot();
  await fireEvent.press(getByTestId('joinedCount'));
  expect(navigatePush).not.toHaveBeenCalled();
});

it('does not navigate if organization is null | Completed', async () => {
  const { getByTestId, snapshot } = renderWithContext(
    <ChallengeStats
      {...props}
      challenge={{
        ...challenge,
        organization: null,
        completed_count: 0,
      }}
    />,
  );
  snapshot();
  await fireEvent.press(getByTestId('completedCount'));
  expect(navigatePush).not.toHaveBeenCalled();
});
