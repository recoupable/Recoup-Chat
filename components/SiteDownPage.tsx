import Image from "next/image";

const SiteDownPage = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white text-center px-4 z-50">
      <div className="w-full max-w-lg flex flex-col items-center">
        <div className="mb-6">
          <Image
            src="/Recoup_Icon_Wordmark_Black.svg"
            alt="Recoup Logo"
            width={160}
            height={60}
            priority
          />
        </div>
        <h1 className="text-2xl md:text-4xl font-bold mb-4">
          Recoup is Offline
        </h1>
        <p className="text-gray-500 max-w-md mx-auto text-base md:text-lg">
          The internet is having an outage, affecting Recoup and thousands of
          other applications.
          <br />
          We expect this to be resolved shortly
        </p>
      </div>
    </div>
  );
};

export default SiteDownPage;
