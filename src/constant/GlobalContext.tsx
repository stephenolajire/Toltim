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
  useNurseActiveBooking:"useNurseActiveBooking",
  useInBedProcedures:"useInBedProcedures",
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

export const useNurseProfile = () => {
  return useQuery({
    queryKey: ['nurseProfile'],
    queryFn: async () => {
      const response = await api.get("/user/nurse/profile/");
      return response.data;
    },
    enabled: true,
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
        "services/nurse-procedures-bookings/approved/"
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
