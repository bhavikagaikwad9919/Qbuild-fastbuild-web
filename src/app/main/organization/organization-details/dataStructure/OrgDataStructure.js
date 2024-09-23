import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SafeManHours from './SafeManHours';
import AreaOfConcern from "./AreaOfConcern";
import WayForward from "./WayForward";
import Milestones from "./Milestones";
import CashFlow from "./CashFlow";
import Staffs from "./Staffs";

function OrgDataStructure(props) {
  const details = useSelector(({ organizations }) => organizations.organization);
  const [orgType, setOrgType] = useState('');
  
  useEffect(() => {
    if(details === undefined || details === null){
      setOrgType('');
    }else{
      let type = details.orgType === undefined || details.orgType === null ? '' : details.orgType;
      setOrgType(type);
    }
  }, [details]);

  
  return (
    <React.Fragment>
      <div>
        {orgType !== 'SSA'  ?
          <div className="p-16 sm:p-24">
            <Staffs />
          </div>
        :null}

        {/* for SSA dataStructure */}
        {orgType === 'SSA'  ?           
          <div>
            <div className="p-16 sm:p-24" >
              <CashFlow /> 

              <SafeManHours />

              <AreaOfConcern />

              <WayForward />

              <Milestones />
            </div>         
          </div>
        :null}        
      </div>
    </React.Fragment>
  );
}

export default OrgDataStructure;