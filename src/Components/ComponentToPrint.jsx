import React from "react";
import BillPage from "./BillPage";
export const ComponentToPrint = React.forwardRef((props, ref) => {
    console.log("Middle aprops",props)
    return (
      <div style={{display:'none'}}>
        <div ref={ref}>
          <BillPage data={props} />
        </div>
      </div>
    );
  });