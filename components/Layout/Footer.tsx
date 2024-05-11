import React from "react";

const Footer = () => {
  return (
    <div
      className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center justify-center text-base font-comfortaa text-amber-950"
      style={{ height: "100px" }}
    >
      Made with NextJS, GraphQL, and CockroachDB.
    </div>
  );
};

export default Footer;
