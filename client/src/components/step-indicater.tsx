import { Check } from "lucide-react";

interface Step {
  title: string;
  description: string;
}

interface StepIndicatorProps {
  steps: Step[];
  activeStep: number;
}

export default function StepIndicator({ steps, activeStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="w-full flex items-center">
        <div className="relative w-full">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === activeStep;
            const isCompleted = stepNumber < activeStep;
            
            return (
              <div key={stepNumber} className="flex items-center relative">
                <div 
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                    isActive ? 'bg-primary-500' : isCompleted ? 'bg-success-500' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : stepNumber}
                </div>
                <div className="ml-4 w-full">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">{step.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">{step.description}</p>
                </div>
                
                {/* Step connector line (only if not the last step) */}
                {index < steps.length - 1 && (
                  <div 
                    className={`absolute left-5 top-10 h-full w-0.5 ${
                      stepNumber < activeStep ? 'bg-success-500' : 'bg-gray-200'
                    }`}
                  ></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
