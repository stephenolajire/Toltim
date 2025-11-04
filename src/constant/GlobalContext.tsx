import {
  createContext,
  type ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";
import api from "./api";
import { jwtDecode } from "jwt-decode";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";

interface Context {
  Authentication: () => void;
  isAuthenticated: boolean;
}

const queryKeys = {
  useNurseVerification: "useNurseVerification",
  useNurseVerificationStat: "useNurseVerificationStat",
  useNurseProcedures: "useNurseProcedures",
  useNurseProfile: "useNurseProfile",
  useNurseActiveBooking: "useNurseActiveBooking",
  useInBedProcedures: "useInBedProcedures",
  useNearByCHW: "useNearByCHW",
  useCHWVerification: "useCHWVerification",
  useCHWProcedures: "useCHWProcedures",
  useHistory: "useHistory",
  useCareGiverBooking: "useCareGiverBooking",
  usePatientProfile: "usePatientProfile",
  useBedSide: "useBedSide",
  useUser: "useUser",
  useWallet: "useWallet",
  useWalletTransactions: "useWalletTransactions",
  usePatientStats: "usePatientStats",
  useFinancialSummary:"useFinancialSummary",
  useUserVerified:"useUserVerified",
  useUserUnVerified:"useUserUnverified"
  
};

export const GlobalContext = createContext<Context | undefined>(undefined);

interface GlobalProviderProps {
  children: ReactNode;
}

export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const Authentication = () => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const expiryDate: any = decoded.exp;
        const currentTime: number = Date.now() / 1000;

        if (expiryDate > currentTime) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          // Optionally remove expired token
          localStorage.removeItem("accessToken");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        setIsAuthenticated(false);
        localStorage.removeItem("accessToken");
      }
    } else {
      setIsAuthenticated(false);
    }
  };

  // Check authentication on mount
  useEffect(() => {
    Authentication();
  }, []);

  const contextValue: Context = {
    isAuthenticated,
    Authentication,
  };

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
};

// Custom hook for using the context
export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};

// Separate custom hook for nurse verification
export const useNurseVerification = () => {
  return useQuery({
    queryKey: [queryKeys.useNurseVerification],
    queryFn: async () => {
      const response = await api.get("user/nurse/verification");
      // console.log("API Response:", response);
      return response.data;
    },
    enabled: true,
    retry: 1,
    staleTime: 20 * 60 * 1000,
  });
};

export const useCHWVerification = () => {
  return useQuery({
    queryKey: [queryKeys.useCHWVerification],
    queryFn: async () => {
      const response = await api.get("user/chw/verification");
      // console.log("API Response:", response);
      return response.data;
    },
    enabled: true,
    retry: 1,
    staleTime: 20 * 60 * 1000,
  });
};

// Fetch verification stats
export const useNurseVerificationStat = () => {
  return useQuery({
    queryKey: [queryKeys.useNurseVerificationStat],
    queryFn: async () => {
      const response = await api.get("user/nurse/verification/stats/");
      // console.log("API Response:", response);
      return response.data;
    },
    enabled: true,
    retry: 1,
    staleTime: 20 * 60 * 1000,
  });
};

// Approve nurseKyc
export const useNurseApproval = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.post(`user/nurse/verification/${id}/approve/`);
      return response.data;
    },
    retry: 1,
    onSuccess: () => {
      // Invalidate both queries to refresh data
      queryClient.invalidateQueries({
        queryKey: [queryKeys.useNurseVerification],
      });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.useNurseVerificationStat],
      });
    },
    onError: (error) => {
      console.error("Error approving nurse:", error);
    },
  });
};

// Reject nurse KYC
export const useNurseRejection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.post(`user/nurse/verification/${id}/reject/`);
      return response.data;
    },
    retry: 1,
    onSuccess: () => {
      // Invalidate both queries to refresh data
      queryClient.invalidateQueries({
        queryKey: [queryKeys.useNurseVerification],
      });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.useNurseVerificationStat],
      });
    },
    onError: (error) => {
      console.error("Error rejecting nurse:", error);
    },
  });
};

// Fetch nurse procedures
export const useNurseProcedures = () => {
  return useQuery({
    queryKey: [queryKeys.useNurseProcedures],
    queryFn: async () => {
      const response = await api.get("/services/nursing-procedures/");
      // console.log("API Response:", response);
      return response.data;
    },
    enabled: true,
    retry: 1,
    staleTime: 20 * 60 * 1000,
  });
};

export const useCHWProcedures = () => {
  return useQuery({
    queryKey: [queryKeys.useCHWProcedures],
    queryFn: async () => {
      const response = await api.get("caregiver-type/");
      // console.log("API Response:", response);
      return response.data;
    },
    enabled: true,
    retry: 1,
    staleTime: 20 * 60 * 1000,
  });
};

export const useNurseProfile = (userRole: string) => {
  return useQuery({
    queryKey: ["nurseProfile", userRole],
    queryFn: async () => {
      if (userRole === "nurse") {
        const response = await api.get("/user/nurse/profile/");
        return response.data;
      } else if (userRole === "chw") {
        const response = await api.get(`/user/chw-profile/`);
        return response.data;
      }

      throw new Error("Invalid user role or missing userId");
    },
    enabled: userRole === "nurse" || userRole === "chw",
    retry: 1,
    staleTime: 20 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  });
};

export const useNurseActiveBooking = () => {
  return useQuery({
    queryKey: ["useNurseActiveBooking"],
    queryFn: async () => {
      const response = await api.get(
        "/services/nurse-procedure-bookings/approved/"
      );
      return response.data;
    },
    enabled: true,
    retry: 1,
    staleTime: 20 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  });
};

export const useInBedProcedures = () => {
  return useQuery({
    queryKey: [queryKeys.useInBedProcedures],
    queryFn: async () => {
      const response = await api.get("/inpatient-caregiver/services/");
      // console.log("API Response:", response);
      return response.data;
    },
    enabled: true,
    retry: 1,
    staleTime: 20 * 60 * 1000,
  });
};

export const useHistory = () => {
  return useQuery({
    queryKey: [queryKeys.useHistory],
    queryFn: async () => {
      const response = await api.get("history/booking-history/");
      // console.log("API Response:", response);
      return response.data;
    },
    enabled: true,
    retry: 1,
    staleTime: 20 * 60 * 1000,
  });
};

export const useCareGiverBooking = () => {
  return useQuery({
    queryKey: [queryKeys.useCareGiverBooking],
    queryFn: async () => {
      const response = await api.get("caregiver-booking/");
      // console.log("API Response:", response);
      return response.data;
    },
    enabled: true,
    retry: 1,
    staleTime: 20 * 60 * 1000,
  });
};

export const usePatientProfile = () => {
  return useQuery({
    queryKey: [queryKeys.usePatientProfile],
    queryFn: async () => {
      const response = await api.get("user/profile");
      return response.data;
    },
  });
};

export const useBedSide = () => {
  return useQuery({
    queryKey: [queryKeys.useBedSide],
    queryFn: async () => {
      const response = await api.get("inpatient-caregiver/bookings/");
      return response.data;
    },
  });
};

export const useUser = (role: string) => {
  return useQuery({
    queryKey: [queryKeys.useUser],
    queryFn: async () => {
      const response = await api.get(`/user/role-filter/?role=${role}`);
      return response.data;
    },
  });
};

export const useUserVerified = (role: string) => {
  return useQuery({
    queryKey: [queryKeys.useUserVerified],
    queryFn: async () => {
      const response = await api.get(
        `/user/role-filter/?role=${role}&verified=true`
      );
      return response.data;
    },
  });
};

export const useUserUnVerified = (role: string) => {
  return useQuery({
    queryKey: [queryKeys.useUserUnVerified],
    queryFn: async () => {
      const response = await api.get(
        `/user/role-filter/?role=${role}&verified=false`
      );
      return response.data;
    },
  });
};




export const useWallet = () => {
  return useQuery({
    queryKey: [queryKeys.useWallet],
    queryFn: async () => {
      const response = await api.get("wallet/balance");
      return response.data;
    },
  });
};

export const useWalletTransactions = () => {
  return useQuery({
    queryKey: [queryKeys.useWalletTransactions],
    queryFn: async () => {
      const response = await api.get("wallet/transactions");
      return response.data;
    },
  });
};

export const usePatientStats = () => {
  return useQuery({
    queryKey: [queryKeys.usePatientStats],
    queryFn: async () => {
      const response = await api.get("history/booking-stats/");
      return response.data;
    },
  });
};


export const useFinancialSummary = () => {
  return useQuery({
    queryKey: [queryKeys.useFinancialSummary],
    queryFn: async () => {
      const response = await api.get("wallet/financial-summary/");
      return response.data;
    },
  });
};

