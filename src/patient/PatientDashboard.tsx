import { useState } from "react";
import {
  Calendar,
  User,
  MessageCircle,
  Clock,
  Wallet,
  Plus,
  X,
  CreditCard,
} from "lucide-react";
import { Link } from "react-router-dom";

// Wallet Component
const WalletCard = () => {
  const [balance, setBalance] = useState(250.75);
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [fundAmount, setFundAmount] = useState("");

  const quickAmounts = [50, 100, 200, 500];

  const handleAddFunds = () => {
    const amount = parseFloat(fundAmount);
    if (amount > 0) {
      setBalance((prev) => prev + amount);
      setFundAmount("");
      setShowAddFunds(false);
    }
  };

  const handleQuickAdd = (amount:number) => {
    setBalance((prev) => prev + amount);
    setShowAddFunds(false);
  };

  return (
    <>
      <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg shadow-sm text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center mb-2">
              <Wallet className="w-6 h-6 mr-2" />
              <h3 className="text-lg font-semibold">Wallet Balance</h3>
            </div>
            <p className="text-3xl font-bold">₦{balance.toFixed(2)}</p>
            <p className="text-green-100 text-sm mt-1">Available balance</p>
          </div>
          <button
            onClick={() => setShowAddFunds(true)}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 p-3 rounded-full transition-all duration-200"
          >
            <Plus className="w-6 h-6 text-green-500" />
          </button>
        </div>
      </div>

      {/* Add Funds Modal */}
      {showAddFunds && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Add Funds to Wallet
              </h3>
              <button
                onClick={() => setShowAddFunds(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Quick amounts */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Quick Add
              </p>
              <div className="grid grid-cols-2 gap-2">
                {quickAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleQuickAdd(amount)}
                    className="border border-gray-300 rounded-lg p-3 text-center hover:bg-green-50 hover:border-green-300 transition-colors"
                  >
                    ₦{amount}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom amount */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Or enter custom amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  ₦
                </span>
                <input
                  type="number"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Payment method */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </p>
              <div className="flex items-center p-3 border border-gray-300 rounded-lg bg-gray-50">
                <CreditCard className="w-5 h-5 text-gray-400 mr-3" />
                <span className="text-sm text-gray-600">
                  **** **** **** 4567
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => setShowAddFunds(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddFunds}
                disabled={!fundAmount || parseFloat(fundAmount) <= 0}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Funds
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Stats Cards Component
const StatsCards = () => {
  const stats = [
    {
      title: "Upcoming",
      value: "3",
      icon: Calendar,
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
    },
    {
      title: "Care Providers",
      value: "12",
      icon: User,
      bgColor: "bg-green-100",
      textColor: "text-green-600",
    },
    {
      title: "Messages",
      value: "5",
      icon: MessageCircle,
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
    },
    {
      title: "Total Visits",
      value: "28",
      icon: Clock,
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className={`p-2 ${stat.bgColor} rounded-lg`}>
              <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Recent Appointments Component
const RecentAppointments = () => {
  const appointments = [
    {
      provider: "Dr. Sarah Johnson",
      type: "General Checkup",
      time: "Today, 2:00 PM",
      status: "Confirmed",
      statusColor: "text-green-600",
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      cost: "₦5,000",
    },
    {
      provider: "Nurse Mary Adams",
      type: "Home Visit",
      time: "Tomorrow, 10:00 AM",
      status: "Pending",
      statusColor: "text-yellow-600",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      cost: "₦3,500",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col h-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Recent Appointments
      </h3>
      <div className="space-y-4 flex-1">
        {appointments.map((appointment, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <div
                className={`w-10 h-10 ${appointment.bgColor} rounded-full flex items-center justify-center`}
              >
                <User className={`w-5 h-5 ${appointment.iconColor}`} />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {appointment.provider}
                </p>
                <p className="text-xs text-gray-500">{appointment.type}</p>
                <p className="text-xs font-medium text-gray-700">
                  {appointment.cost}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">{appointment.time}</p>
              <p className={`text-xs ${appointment.statusColor}`}>
                {appointment.status}
              </p>
            </div>
          </div>
        ))}
      </div>
      <Link to="/patient/history">
        <button className="w-full mt-4 text-green-600 hover:text-green-700 text-sm font-medium">
          View All Appointments
        </button>
      </Link>
    </div>
  );
};

// Available Care Providers Component
const AvailableCareProviders = () => {
  const providers = [
    {
      name: "Dr. Michael Chen",
      specialty: "General Practice",
      distance: "2.5 km away",
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      rating: "4.8",
      cost: "from ₦4,000",
    },
    {
      name: "CHW James Wilson",
      specialty: "Community Health",
      distance: "1.8 km away",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
      rating: "4.9",
      cost: "from ₦2,500",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col h-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Available Care Providers
      </h3>
      <div className="space-y-4 flex-1">
        {providers.map((provider, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center flex-1">
              <div
                className={`w-10 h-10 ${provider.bgColor} rounded-full flex items-center justify-center`}
              >
                <User className={`w-5 h-5 ${provider.iconColor}`} />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {provider.name}
                </p>
                <p className="text-xs text-gray-500">{provider.specialty}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-gray-500">{provider.distance}</p>
                  <p className="text-xs text-gray-600">⭐ {provider.rating}</p>
                </div>
                <p className="text-xs font-medium text-green-600">
                  {provider.cost}
                </p>
              </div>
            </div>
            <Link to="/patient/appointments">
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium ml-4 transition-colors">
                Book
              </button>
            </Link>
          </div>
        ))}
      </div>
      <Link to="/patient/find-care">
        <button className="w-full mt-4 text-green-600 hover:text-green-700 text-sm font-medium">
          Find More Providers
        </button>
      </Link>
    </div>
  );
};

// Main Dashboard Component
const PatientDashboard = () => {
  return (
    <div className="w-full mx-auto">
      {/* Wallet Card */}
      <div className="mb-6">
        <WalletCard />
      </div>

      {/* Quick stats */}
      <StatsCards />

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentAppointments />
        <AvailableCareProviders />
      </div>
    </div>
  );
};

export default PatientDashboard;
