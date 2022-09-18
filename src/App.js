import React, { useEffect } from "react";
import three from "./util/threeTool";

export default function App() {
  useEffect(() => {
    three.init();
    return () => {
      three.clear();
    };
  }, []);
  return <></>;
}
