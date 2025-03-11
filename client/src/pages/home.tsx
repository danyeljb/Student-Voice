import { useState } from "react";
import { Card } from "@/components/ui/card";
import IdeaForm from "@/components/idea-form";
import GenerateNarrative from "@/components/generate-narrative";
import Results from "@/components/results";
import StepIndicator from "@/components/step-indicator";
import HowItWorks from "@/components/how-it-works";

type Step = 1 | 2 | 3;

interface NarrativeData {
  topic: string;
  customTopic?: string;
  name?: string;
  content: string;
}

export default function Home() {
  const [activeStep, setActiveStep] = useState<Step>(1);
  const [narrativeData, setNarrativeData] = useState<NarrativeData | null>(null);
  const [generatedContent, setGeneratedContent] = useState<{
    narrative: string;
    topicDisplayName: string;
  } | null>(null);

  const steps = [
    {
      title: "Add Your Input",
      description: "Share your thoughts on a school topic",
    },
    {
      title: "Generate Narrative",
      description: "AI combines all ideas fairly",
    },
    {
      title: "Review & Share",
      description: "Use the generated narrative",
    },
  ];

  const reset = () => {
    setActiveStep(1);
    setNarrativeData(null);
    setGeneratedContent(null);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 md:space-x-10">
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <a href="#" className="flex items-center">
                <i className="ri-chat-voice-fill text-primary-500 text-3xl mr-2"></i>
                <span className="text-xl font-bold text-gray-800">StudentVoice</span>
              </a>
            </div>
            <div>
              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                Beta
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* App Intro */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-800 sm:text-4xl">Make Your Voice Heard</h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-600 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Share your ideas on school topics and let AI combine everyone's input into a fair narrative.
            </p>
          </div>

          {/* Main App Container */}
          <Card className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              {/* Step Indicator */}
              <StepIndicator steps={steps} activeStep={activeStep} />

              {/* Content Container for each step */}
              <div className="mt-8">
                {activeStep === 1 && (
                  <IdeaForm 
                    setActiveStep={setActiveStep} 
                    setNarrativeData={setNarrativeData} 
                  />
                )}
                
                {activeStep === 2 && narrativeData && (
                  <GenerateNarrative 
                    setActiveStep={setActiveStep}
                    narrativeData={narrativeData}
                    setGeneratedContent={setGeneratedContent}
                    onCancel={reset}
                  />
                )}
                
                {activeStep === 3 && generatedContent && (
                  <Results 
                    generatedContent={generatedContent}
                    reset={reset}
                  />
                )}
              </div>
            </div>
          </Card>

          {/* Additional Info Section */}
          <HowItWorks />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 overflow-hidden sm:px-6 lg:px-8">
          <p className="text-center text-base text-gray-500">
            &copy; {new Date().getFullYear()} StudentVoice. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
