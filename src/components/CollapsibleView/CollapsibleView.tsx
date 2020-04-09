import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { Animated } from 'react-native';

import { useCollapsibleHeader } from './useCollapsibleHeader';

type CollapsibleScrollViewProps = ReturnType<
  typeof useCollapsibleHeader
>['collapsibleScrollViewProps'];

export const createCollapsibleViewContext = () =>
  React.createContext<{
    collapsibleScrollViewProps: CollapsibleScrollViewProps | null;
    setCollapsibleScrollViewProps: (
      collapsibleScrollViewProps: CollapsibleScrollViewProps,
    ) => void;
  }>({
    collapsibleScrollViewProps: null,
    setCollapsibleScrollViewProps: () => {},
  });

type CollapsibleViewContext = ReturnType<typeof createCollapsibleViewContext>;

interface CollapsibleViewProviderProps {
  context: CollapsibleViewContext;
  children?: ReactNode;
}

export const CollapsibleViewProvider = ({
  context,
  children,
}: CollapsibleViewProviderProps) => {
  const [
    collapsibleScrollViewProps,
    setCollapsibleScrollViewProps,
  ] = useState<CollapsibleScrollViewProps | null>(null);

  return (
    <context.Provider
      value={{
        collapsibleScrollViewProps,
        setCollapsibleScrollViewProps: collapsibleScrollViewProps =>
          setCollapsibleScrollViewProps(collapsibleScrollViewProps),
      }}
    >
      {children}
    </context.Provider>
  );
};

interface CollapsibleViewHeaderProps {
  context: CollapsibleViewContext;
  headerHeight: number;
  statusBarHeight?: number;
  children?: ReactNode;
}

export const CollapsibleViewHeader = ({
  context,
  headerHeight,
  statusBarHeight,
  children,
}: CollapsibleViewHeaderProps) => {
  const {
    collapsibleHeaderProps,
    collapsibleScrollViewProps,
  } = useCollapsibleHeader({
    headerHeight,
    statusBarHeight,
  });

  const {
    collapsibleScrollViewProps: previousCollapsibleScrollViewProps,
    setCollapsibleScrollViewProps,
  } = useContext(context);

  useEffect(() => {
    previousCollapsibleScrollViewProps !== collapsibleScrollViewProps &&
      setCollapsibleScrollViewProps(collapsibleScrollViewProps);
  }, [collapsibleScrollViewProps]);

  return (
    <Animated.View
      {...collapsibleHeaderProps}
      style={[...collapsibleHeaderProps.style, { zIndex: 1 }]}
    >
      {children}
    </Animated.View>
  );
};

interface CollapsibleViewContentProps {
  context: CollapsibleViewContext;
  children?: ReactNode;
}

export const CollapsibleViewContent = ({
  context,
  children,
}: CollapsibleViewContentProps) => {
  const { collapsibleScrollViewProps } = useContext(context);

  return (
    <Animated.ScrollView {...collapsibleScrollViewProps} style={{ flex: 1 }}>
      {children}
    </Animated.ScrollView>
  );
};
