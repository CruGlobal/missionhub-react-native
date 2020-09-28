import { useAuthPerson } from '../../auth/authHooks';

export const useMyId = () => {
  const authPerson = useAuthPerson();
  return authPerson.id;
};

export const useIsMe = (personId: string | undefined): boolean => {
  const authPersonId = useMyId();
  return !!personId && personId === authPersonId;
};
