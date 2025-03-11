import { Button } from "@/components/ui/button";
import { Clipboard, Share2, RefreshCcw, MessageSquare } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { useToast } from "@/hooks/use-toast";

interface ResultsProps {
  generatedContent: {
    narrative: string;
    topicDisplayName: string;
  };
  reset: () => void;
}

export default function Results({ generatedContent, reset }: ResultsProps) {
  const [copied, copy] = useCopyToClipboard();
  const { toast } = useToast();

  const handleCopyToClipboard = () => {
    copy(generatedContent.narrative);
    toast({
      title: "Copied to clipboard!",
      description: "The narrative has been copied to your clipboard.",
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `Student Voice: ${generatedContent.topicDisplayName}`,
          text: generatedContent.narrative,
        })
        .catch(() => {
          toast({
            description: "Sharing options coming soon!",
          });
        });
    } else {
      toast({
        description: "Sharing options coming soon!",
      });
    }
  };

  const handleProvideFeedback = () => {
    toast({
      description: "Feedback form will open soon!",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Generated Narrative</h3>
        <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-2">{generatedContent.topicDisplayName}</h4>
          <div className="prose prose-sm text-gray-700">
            {generatedContent.narrative.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
          <h3 className="text-lg font-semibold text-gray-900">What would you like to do next?</h3>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={handleCopyToClipboard}>
              <Clipboard className="mr-2 h-4 w-4" />
              Copy Text
            </Button>
            <Button className="bg-primary-600 hover:bg-primary-700" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <div className="flex justify-between">
          <Button variant="outline" onClick={reset}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            New Topic
          </Button>
          <Button 
            variant="outline" 
            className="text-primary-700 bg-primary-100 hover:bg-primary-200 border-primary-200"
            onClick={handleProvideFeedback}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Provide Feedback
          </Button>
        </div>
      </div>
    </div>
  );
}
