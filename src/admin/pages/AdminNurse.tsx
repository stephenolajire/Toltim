import React from "react";
import PatientStatCard from "../components/user/UserStatCard";
import UserNavigation from "../components/user/UserNavigation";
import PatientsTable from "../components/user/PatientTable";
import { useUser } from "../../constant/GlobalContext";
import Loading from "../../components/common/Loading";
import Error from "../../components/Error";
import type { Patient } from "../../types/patient";

const AdminNurses: React.FC = () => {
  const role = "nurse";
  const { data, isLoading, error } = useUser(role);
  // console.log("nurse data", data);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error />;
  }

  // Add a check for data existence before accessing nested properties
  if (!data || !data.results) {
    return <Loading />;
  }

  const nurseData = data.results || [];
  const totalCount = data.verification_summary.nurse.verified + data.verification_summary.nurse.unverified || 0;
  const verifiedCount = data.verification_summary.nurse.verified || 0;
  const unverifiedCount = data.verification_summary.nurse.unverified || 0;

  return (
    <div>
      <div className="py-5">
        <h1 className="font-bold text-black text-4xl capitalize">
          Nurse Overview
        </h1>
        <p className="text-gray-500 mt-1">
          Monitor your healthcare operations at a glance
        </p>
      </div>
      <PatientStatCard
        text1="Total Nurses"
        num1={totalCount}
        text2="Verified Nurses"
        num2={verifiedCount}
        text3="Unverified Nurses"
        num3={unverifiedCount}
      />

      <div className="py-10">
        <UserNavigation />
      </div>

      <div>
        <PatientsTable patients={nurseData as Patient[]} role={role} />
      </div>
    </div>
  );
};

export default AdminNurses;
