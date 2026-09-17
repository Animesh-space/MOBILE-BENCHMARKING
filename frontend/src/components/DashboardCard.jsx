import React from 'react';

function DashboardCard({ title, value, color }) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm flex flex-col justify-center">
      <h3 className="text-sm font-medium text-gray-500 mb-2">
        {title}
      </h3>
      
      {/* The color prop is applied here dynamically (e.g., 'text-blue-600') */}
      <p className={`text-4xl font-bold ${color}`}>
        {value}
      </p>
    </div>
  );
}

export default DashboardCard;