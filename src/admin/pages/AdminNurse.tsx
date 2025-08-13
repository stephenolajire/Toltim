import React from "react";
import PatientStatCard from "../components/user/UserStatCard";
import UserNavigation from "../components/user/UserNavigation";
import NursesTable from "../components/user/NurseTable";

const AdminNurse: React.FC = () => {
  return (
    <div>
      <div className="py-5">
        <h1 className="font-bold text-black text-4xl capitalize">
          Nurses Overview
        </h1>
        <p className="text-gray-500 mt-1">
          Monitor your healthcare operations at a glance
        </p>
      </div>
      <PatientStatCard
        text1="Total Nurses"
        text2="Verified Nurses"
        text3="Unverified Nurses"
        num1={50}
        num2={40}
        num3={20}
      />

      <div className="py-10">
        <UserNavigation />
      </div>

      <div>
        <NursesTable />
      </div>
    </div>
  );
};

export default AdminNurse;
