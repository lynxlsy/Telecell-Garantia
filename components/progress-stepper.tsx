import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface Step {
  number: number
  title: string
}

interface ProgressStepperProps {
  currentStep: number
  steps: Step[]
}

export function ProgressStepper({ currentStep, steps }: ProgressStepperProps) {
  return (
    <div className="w-full py-8 mb-6">
      <div className="flex items-center justify-between max-w-3xl mx-auto">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all shadow-md",
                  currentStep > step.number
                    ? "bg-red-600 text-white scale-100"
                    : currentStep === step.number
                      ? "bg-red-600 text-white ring-4 ring-red-200 scale-110"
                      : "bg-gray-200 text-gray-500 scale-100",
                )}
              >
                {currentStep > step.number ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <span className="text-lg">{step.number}</span>
                )}
              </div>
              <span
                className={cn(
                  "text-sm mt-3 font-semibold text-center whitespace-nowrap",
                  currentStep >= step.number ? "text-gray-900" : "text-gray-400",
                )}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "h-1.5 flex-1 mx-3 transition-all rounded-full",
                  currentStep > step.number ? "bg-red-600" : "bg-gray-200",
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
