import { useSelector } from 'react-redux';

import { AuthState } from '../../reducers/auth';

export const useMyId = () =>
  useSelector<{ auth: AuthState }, string>(({ auth }) => auth.person.id);

export const useIsMe = (personId: string) => {
  const authPersonId = useMyId();
  return personId === authPersonId;
};
