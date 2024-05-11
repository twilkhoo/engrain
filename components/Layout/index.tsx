import React from "react";
import Header from "./Header";
import Footer from "./Footer";

interface Props {
  children: React.ReactNode;
}
const Layout: React.FC<Props> = ({ children }) => {
  return (
    <div className="bg-orange-400">
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
