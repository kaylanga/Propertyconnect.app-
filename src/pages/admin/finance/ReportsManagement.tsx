import React from 'react';

const ReportsManagement: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Financial Reports</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">Revenue Reports</h2>
          <p className="text-gray-600 mb-4">View and analyze revenue streams across different time periods.</p>
          <button className="text-blue-600 hover:text-blue-800">
            Generate Report →
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">Transaction History</h2>
          <p className="text-gray-600 mb-4">Detailed breakdown of all financial transactions.</p>
          <button className="text-blue-600 hover:text-blue-800">
            View Transactions →
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">User Analytics</h2>
          <p className="text-gray-600 mb-4">Insights into user financial behavior and patterns.</p>
          <button className="text-blue-600 hover:text-blue-800">
            View Analytics →
          </button>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Custom Report Generator</h2>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Type
              </label>
              <select className="w-full border rounded-md p-2">
                <option>Revenue Analysis</option>
                <option>Transaction Summary</option>
                <option>User Activity</option>
                <option>Custom Report</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <select className="w-full border rounded-md p-2">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 3 Months</option>
                <option>Custom Range</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Format
              </label>
              <select className="w-full border rounded-md p-2">
                <option>PDF</option>
                <option>Excel</option>
                <option>CSV</option>
              </select>
            </div>
          </div>

          <button className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Generate Custom Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportsManagement;