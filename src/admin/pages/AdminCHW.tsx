import React from "react";
import PatientStatCard from "../components/user/UserStatCard";
import UserNavigation from "../components/user/UserNavigation";
import PatientsTable from "../components/user/PatientTable";
import { useUser } from "../../constant/GlobalContext";
import Loading from "../../components/common/Loading";
import Error from "../../components/Error";
import type { Patient } from "../../types/patient";

const AdminPatients: React.FC = () => {
  const role = "chw";
  const { data, isLoading, error } = useUser(role);

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
  const totalCount = data.results.length || 0;

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
        num1={totalCount}
        text2="Verified CHW"
        num2={800}
        text3="Unverified CHW"
        num3={447}
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

export default AdminPatients;
