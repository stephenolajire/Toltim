import React from "react";
import PatientStatCard from "../components/user/UserStatCard";
import UserNavigation from "../components/user/UserNavigation";
import CHWTable from "../components/user/CHWTable";

const AdminCHW: React.FC = () => {
  return (
    <div>
      <div className="py-5">
        <h1 className="font-bold text-black text-4xl capitalize">
          CHW Overview
        </h1>
        <p className="text-gray-500 mt-1">
          Monitor your healthcare operations at a glance
        </p>
      </div>
      <PatientStatCard
        text1="Total CHW"
        text2="Verified CHW"
        text3="Unverified CHW"
        num1={20}
        num2={40}
        num3={40}
      />

      <div className="py-10">
        <UserNavigation />
      </div>
      
      <div>
        <CHWTable/>
      </div>
    </div>
  );
};

export default AdminCHW;
