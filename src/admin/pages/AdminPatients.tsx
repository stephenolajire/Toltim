import React from "react";
import PatientStatCard from "../components/user/UserStatCard";
import UserNavigation from "../components/user/UserNavigation";
import PatientsTable from "../components/user/PatientTable";
import { useUser, useUserUnVerified, useUserVerified } from "../../constant/GlobalContext";
import Loading from "../../components/common/Loading";
import Error from "../../components/Error";
import type { Patient } from "../../types/patient";

const AdminPatients: React.FC = () => {
  const role = "patient";
  const { data, isLoading, error } = useUser(role);
  const {data:verified, isLoading:loading, error:verifiedError} = useUserVerified(role)
  const {data:unverified, isLoading:loadings, error:UnverifiedError} = useUserUnVerified(role)

  if (isLoading || loading || loadings) {
    return <Loading />;
  }

  if (error || verifiedError || UnverifiedError) {
    return <Error />;
  }

  // Add a check for data existence before accessing nested properties
  if (!data || !data.results) {
    return <Loading />;
  }

  console.log("verified patient", verified)

  const patientData = data.results || [];
  const totalCount = data.results.length || 0;
  const totalVerified = verified.results.length || 0;
  const totalUnVerified = unverified.results.length || 0;


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
        num1={totalCount}
        text2="Verified Patients"
        num2={totalVerified}
        text3="Unverified Patients"
        num3={totalUnVerified}
      />

      <div className="py-10">
        <UserNavigation />
      </div>

      <div>
        <PatientsTable patients={patientData as Patient[]} role={role} />
      </div>
    </div>
  );
};

export default AdminPatients;
