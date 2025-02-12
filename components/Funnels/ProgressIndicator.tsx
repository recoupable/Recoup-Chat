interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressIndicator = ({
  currentStep,
  totalSteps,
}: ProgressIndicatorProps) => {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={`
            w-2 h-2 rounded-full transition-all duration-300
            ${
              index < currentStep
                ? "bg-black"
                : index === currentStep
                  ? "bg-gray-400"
                  : "bg-gray-200"
            }
          `}
        />
      ))}
    </div>
  );
};

export default ProgressIndicator;
