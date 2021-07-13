import React from "react";
import Header from "../Header";
import Footer from "../Footer";

export default function SidebarLayout(props) {
  function getComponent(key) {
    return props.children.filter((component) => {
      return component.key === key;
    });
  }

  return (
    <>
      <Header />
      <div className="container-fluid">
        <div className="row">
          <div className="col-3">{getComponent("side")}</div>
          <div className="col-9">{getComponent("main")}</div>
        </div>
      </div>
      <Footer />
    </>
  );
}
