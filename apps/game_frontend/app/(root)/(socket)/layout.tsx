import React from "react";
import SocketProvider from "../../context/SocketProvider";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SocketProvider>{children}</SocketProvider>
    </>
  );
};

export default layout;
