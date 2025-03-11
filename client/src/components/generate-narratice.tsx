import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Check, Loader2, Clock } from "lucide-react";

interface GenerateNarrativeProps {
  setActiveStep: (step: number) => void;
  narrativeData: {
    topic: string;
    customTopic?: string;
    name?: string;
    content: string;
  };
  setGeneratedContent: (content: { narrative: string; topicDisplayName: string }) => void;
  onCancel: () => void;
}

export default function GenerateNarrative({
  setActiveStep,
  narrativeData,
  setGeneratedContent,
  onCancel,
}: GenerateNarrativeProps) {
  const { toast } = useToast();

  const generateMutation = useMutation({
    mutationFn: () => {
      return apiRequest("POST", "/api/narratives/generate", {
        topic: narrativeData.topic,
        customTopic: narrativeData.customTopic,
      });
    },
    onSuccess: async (response) => {
      const data = await response.json();
      setGeneratedContent({
        narrative: data.narrative,
        topicDisplayName: data.topicDisplayName,
      });
      setActiveStep(3);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to generate narrative. Please try again.",
        variant: "destructive",
      });
      // Go back to the form step
      setActiveStep(1);
    },
  });

  useEffect(() => {
    // Auto-start the narrative generation
    generateMutation.mutate();
  }, []);

  const handleCancel = () => {
    if (generateMutation.isPending) {
      generateMutation.reset();
    }
    onCancel();
  };

  return (
    <div className="text-center">
      <div className="my-8">
        <div className="mx-auto w-24 h-24 flex items-center justify-center">
          <Loader2 className="h-12 w-12 text-primary-500 animate-spin" />
        </div>
        <h3 className="mt-2 text-xl font-semibold text-gray-900">Generating Narrative</h3>
        <p className="mt-1 text-gray-500">
          Our AI is analyzing your input and creating a fair representation of ideas...
        </p>
      </div>

      {/* Progress Steps */}
      <div className="max-w-md mx-auto">
        <ul className="space-y-3">
          <li className="flex items-start">
            <div className="flex-shrink-0">
              <Check className="text-success-500 h-5 w-5" />
            </div>
            <p className="ml-3 text-sm text-gray-700">Processing topic information</p>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0">
              <Check className="text-success-500 h-5 w-5" />
            </div>
            <p className="ml-3 text-sm text-gray-700">Analyzing submitted ideas</p>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0">
              <Loader2 className="animate-spin text-primary-500 h-5 w-5" />
            </div>
            <p className="ml-3 text-sm text-gray-700">Creating balanced narrative</p>
          </li>
          <li className="flex items-start opacity-50">
            <div className="flex-shrink-0">
              <Clock className="text-gray-400 h-5 w-5" />
            </div>
            <p className="ml-3 text-sm text-gray-700">Finalizing output</p>
          </li>
        </ul>
      </div>

      {/* Cancel button */}
      <div className="mt-8">
        <Button
          variant="outline"
          onClick={handleCancel}
          disabled={generateMutation.isSuccess}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
