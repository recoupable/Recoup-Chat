const PRIVACY_POLICY_CONTENT = {
    title: "Privacy Policy",
    description: "Learn how we handle your data and protect your privacy.",
    sections: [
      {
        title: "1. Introduction",
        paragraphs: [
          "We value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our services.",
        ],
      },
      {
        title: "2. Information We Collect",
        list: [
          "Account information (such as email address, username, and profile details)",
          "Usage data (such as pages visited, features used, and interactions)",
          "Device and browser information",
          "Cookies and similar tracking technologies",
        ],
      },
      {
        title: "3. How We Use Your Information",
        list: [
          "To provide, operate, and maintain our services",
          "To improve, personalize, and expand our services",
          "To communicate with you, including customer support and updates",
          "To analyze usage and trends to enhance user experience",
          "To comply with legal obligations and protect our rights",
        ],
      },
      {
        title: "4. Cookies and Tracking Technologies",
        paragraphs: [
          "We use cookies and similar technologies to track activity on our service and store certain information. You can control the use of cookies through your browser settings.",
        ],
      },
      {
        title: "5. Third-Party Services",
        paragraphs: [
          "We may use third-party services for analytics, authentication, and other functionalities. These third parties may have access to your information as necessary to perform their functions, but they are not permitted to use it for other purposes.",
        ],
      },
      {
        title: "6. Data Security",
        paragraphs: [
          "We implement reasonable security measures to protect your information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure.",
        ],
      },
      {
        title: "7. Your Rights",
        list: [
          "Access, update, or delete your personal information",
          "Object to or restrict the processing of your data",
          "Withdraw consent at any time where applicable",
        ],
        paragraphs: [
          "To exercise these rights, please contact us using the information provided below.",
        ],
      },
      {
        title: "8. Changes to This Policy",
        paragraphs: [
          "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page. Your continued use of the service after changes are made constitutes acceptance of those changes.",
        ],
      },
      {
        title: "9. Contact Us",
        paragraphs: [
          "If you have any questions or concerns about this Privacy Policy, please contact us at support@example.com.",
        ],
      },
    ],
  };
  
  const PrivacyPolicy = () => (
    <div className="max-w-full md:max-w-[calc(100vw-200px)] grow py-8 px-6 md:px-12">
      <h1 className="text-3xl font-bold mb-4">{PRIVACY_POLICY_CONTENT.title}</h1>
      <p className="text-lg mb-8 text-gray-600">
        {PRIVACY_POLICY_CONTENT.description}
      </p>
      {PRIVACY_POLICY_CONTENT.sections.map((section) => (
        <div key={section.title} className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">{section.title}</h2>
          {section.paragraphs &&
            section.paragraphs.map((text, idx) => (
              <p key={idx} className="mb-2 text-gray-600">
                {text}
              </p>
            ))}
          {section.list && (
            <ul className="list-disc pl-6 mb-2">
              {section.list.map((item) => (
                <li key={item} className="text-gray-600">
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
  
  export default PrivacyPolicy;
  