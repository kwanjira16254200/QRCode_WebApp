import { Check } from 'lucide-react';

const StepIndicator = ({ currentStep, steps }) => {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-center max-w-4xl mx-auto">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <div key={stepNumber} className="flex items-center">
              <div className="flex flex-col items-center" style={{ width: '140px' }}>
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all ${
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : isActive
                      ? 'bg-primary-600 text-white ring-4 ring-primary-100'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : stepNumber}
                </div>
                <div className="mt-2 text-center w-full">
                  <p
                    className={`text-sm font-medium truncate ${
                      isActive ? 'text-primary-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{step.description}</p>
                </div>
              </div>

              {stepNumber < steps.length && (
                <div
                  className={`h-1 mx-2 transition-all ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                  style={{ width: '60px' }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
