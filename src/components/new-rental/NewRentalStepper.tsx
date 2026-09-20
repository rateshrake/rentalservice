import React from 'react';

interface NewRentalStepperProps {
  currentStep: number;
  onSelectStep: (step: number) => void;
}

export const NewRentalStepper: React.FC<NewRentalStepperProps> = ({
  currentStep,
  onSelectStep,
}) => {
  const steps = [
    {
      number: 1,
      title: 'Customer',
      subtitle: 'Select or add customer',
    },
    {
      number: 2,
      title: 'Equipment',
      subtitle: 'Choose equipment',
    },
    {
      number: 3,
      title: 'Schedule',
      subtitle: 'Pick dates & timing',
    },
    {
      number: 4,
      title: 'Review',
      subtitle: 'Review items & schedule',
    },
    {
      number: 5,
      title: 'Pricing & Payment',
      subtitle: 'Confirm and collect payment',
    },
  ];

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200/80 px-6 py-4 mb-5 shadow-xs">
      <div className="flex items-center justify-between">
        {steps.map((step, idx) => {
          // In screenshot: Step 1 and Step 2 both have solid red circles because Customer & Equipment are both configured on this page
          const isRed = step.number <= Math.max(currentStep, 2);
          const isStepActive = step.number === currentStep;
          const isFirstStepActive = step.number === 1 && currentStep <= 2;

          return (
            <React.Fragment key={step.number}>
              {/* Step indicator */}
              <button
                onClick={() => onSelectStep(step.number)}
                className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer"
              >
                {/* Number Circle */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                    isRed
                      ? 'bg-[#E11D48] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 group-hover:bg-slate-200'
                  }`}
                >
                  {step.number}
                </div>

                {/* Text Content */}
                <div className="flex flex-col">
                  <span
                    className={`text-xs font-bold leading-tight ${
                      isFirstStepActive && step.number === 1
                        ? 'text-[#E11D48]'
                        : isRed || isStepActive
                        ? 'text-slate-900'
                        : 'text-slate-700 group-hover:text-slate-900'
                    }`}
                  >
                    {step.title}
                  </span>
                  <span className="text-[11px] text-slate-500 font-normal leading-tight mt-0.5">
                    {step.subtitle}
                  </span>
                </div>
              </button>

              {/* Connecting Line between steps */}
              {idx < steps.length - 1 && (
                <div className="flex-1 mx-4 h-[2px] min-w-[24px]">
                  <div
                    className={`h-full rounded-full transition-colors ${
                      idx === 0 || step.number < currentStep
                        ? 'bg-[#E11D48]'
                        : 'bg-slate-200'
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
