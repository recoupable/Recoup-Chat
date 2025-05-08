import React from "react";
import { type Components } from "react-markdown";
import SocialAccount from "./SocialAccount";

interface CodeBlockProps extends React.HTMLAttributes<HTMLElement> {
  inline?: boolean;
  className?: string;
}

const MarkdownCode: Components['code'] = (props: CodeBlockProps) => {
  const { inline, className, children } = props;
  const content = String(children).trim();

  // Check if this is a social account block
  if (!inline && className === 'language-social') {
    const socialInfo = SocialAccount.parse(content);
    if (socialInfo) {
      return <SocialAccount username={socialInfo.username} platform={socialInfo.platform} />;
    }
  }

  if (!inline) {
    return (
      <pre className="max-w-full overflow-x-auto p-4 bg-gray-100 rounded-md my-2">
        <code className={className}>
          {children}
        </code>
      </pre>
    );
  }
  
  return (
    <code className="px-1 py-0.5 rounded-sm bg-gray-100">
      {children}
    </code>
  );
};

export default MarkdownCode; 