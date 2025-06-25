import React from "react";

interface OrganizationSectionProps {
  organization: string;
}

const OrganizationSection: React.FC<OrganizationSectionProps> = ({
  organization,
}) => {
  return (
    <div className="mt-4 pt-4 border-t border-gray-700">
      <div className="text-sm text-gray-400">
        <span className="text-gray-300">Organization:</span>{" "}
        {organization}
      </div>
    </div>
  );
};

export default OrganizationSection; 