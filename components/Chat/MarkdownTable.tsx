import React from "react";

interface MarkdownTableProps {
  children?: React.ReactNode;
}

const MarkdownTable: React.FC<MarkdownTableProps & React.TableHTMLAttributes<HTMLTableElement>> = ({ 
  children,
  ...props 
}) => {
  return (
    <div className="w-full max-w-full overflow-visible">
      <div className="overflow-x-auto w-full max-w-full relative" style={{ maxWidth: '100%' }}>
        <table className="w-auto min-w-full" {...props}>
          {children}
        </table>
      </div>
    </div>
  );
};

export default MarkdownTable; 