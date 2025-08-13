import React from "react";
import PatientStatCard from "../components/user/UserStatCard";
import UserNavigation from "../components/user/UserNavigation";
import PatientsTable from "../components/user/PatientTable";

const AdminPatients: React.FC = () => {
  return (
    <div>
      <div className="py-5">
        <h1 className="font-bold text-black text-4xl capitalize">
          Patients Overview
        </h1>
        <p className="text-gray-500 mt-1">
          Monitor your healthcare operations at a glance
        </p>
      </div>
      <PatientStatCard
        text1="Total Patients"
        num1={1247}
        text2="Verified Patients"
        num2={800}
        text3="Unverified Patients"
        num3={447}
      />

      <div className="py-10">
        <UserNavigation />
      </div>

      <div>
        <PatientsTable/>
      </div>
    </div>
  );
};

export default AdminPatients;
