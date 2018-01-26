import React from 'react';
import i18next from 'i18next';

import Text from '../Text';

export default () => (
  <Text>{i18next.t('loading')}</Text>
);
