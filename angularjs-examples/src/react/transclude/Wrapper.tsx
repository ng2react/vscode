import React, { FunctionComponent, ReactNode } from 'react';

interface WrapperProps {
  children: ReactNode;
}

const Wrapper: FunctionComponent<WrapperProps> = ({ children }) => {
  return <div>{children}</div>;
};

export default Wrapper;
