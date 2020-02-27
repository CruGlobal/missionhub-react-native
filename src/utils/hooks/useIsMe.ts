import { useSelector } from 'react-redux';

import { AuthState } from '../../reducers/auth';

export const useIsMe = (personId: string) => {
  const authPersonId = useSelector<{ auth: AuthState }, string>(
    ({ auth }) => auth.person.id,
  );
  return personId === authPersonId;
};
