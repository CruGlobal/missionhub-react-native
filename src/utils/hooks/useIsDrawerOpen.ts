import { useSelector } from 'react-redux';

import { DrawerState } from '../../reducers/drawer';

export const useIsDrawerOpen = () =>
  useSelector<{ drawer: DrawerState }, boolean>(({ drawer }) => drawer.isOpen);
