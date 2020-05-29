import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { assignContactAndPickStage } from '../../../actions/misc';

import AssignToMeButton from '..';

jest.mock('../../../actions/misc');
jest.mock('../../../actions/person');
jest.mock('../../../selectors/people');
jest.mock('../../../actions/navigation');

const person = { id: '100', first_name: 'Roge' };
const organization = { id: '800' };
const props = {
  person: person,
  organization,
};

const assignResponse = { type: 'success' };

it('renders correctly', () => {
  renderWithContext(<AssignToMeButton {...props} />).snapshot();
});

describe('assignToMe', () => {
  (assignContactAndPickStage as jest.Mock).mockReturnValue(assignResponse);

  it('calls assignContactAndPickStage on press', async () => {
    const { getByTestId } = renderWithContext(<AssignToMeButton {...props} />);

    await fireEvent.press(getByTestId('AssignToMeButton'));

    expect(assignContactAndPickStage).toHaveBeenCalledWith(person);
  });

  it('calls assignContactAndPickStage and onComplete on press', async () => {
    const onComplete = jest.fn();
    const { getByTestId } = renderWithContext(
      <AssignToMeButton {...props} onComplete={onComplete} />,
    );

    await fireEvent.press(getByTestId('AssignToMeButton'));

    expect(assignContactAndPickStage).toHaveBeenCalledWith(person);
    expect(onComplete).toHaveBeenCalled();
  });
});
