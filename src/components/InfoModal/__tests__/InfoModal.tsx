import React from 'react';

import { renderWithContext } from '../../../../testUtils';
import { InfoModal } from '../InfoModal';

it('should render correctly', () => {
  renderWithContext(
    <InfoModal title="Test Title" buttonLabel="Test Button" />,
  ).snapshot();
});
