import React from 'react';
import {MainRoutes, FirstTimeRoutes, LoginRoutes} from '../AppRoutes';

export const getRoutesFromState = (state) => {
  if (isMainRoutes(state)) {
    return MainRoutes;
  } else if (isFirstTimeRoutes(state)) {
    return FirstTimeRoutes;
  } else {
    return LoginRoutes;
  }
};

export const getJsxRoutesFromState = (state, navigation) => {
  if (isMainRoutes(state)) {
    return <MainRoutes navigation={navigation} />;
  } else if (isFirstTimeRoutes(state)) {
    return <FirstTimeRoutes navigation={navigation} />;
  } else {
    return <LoginRoutes navigation={navigation} />;
  }
};

const isMainRoutes = (state) => {
  return state.routes[0].key === 'InteractionsTab' || state.routes[0].routeName === 'MainTabs';
};

const isFirstTimeRoutes = (state) => {
  return state.routes[0].routeName === 'Welcome';
};