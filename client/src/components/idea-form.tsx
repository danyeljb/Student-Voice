import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { submitIdeaSchema, type SubmitIdea, ideaTopics } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface IdeaFormProps {
  setActiveStep: (step: number) => void;
  setNarrativeData: (data: SubmitIdea) => void;
}

export default function IdeaForm({ setActiveStep, setNarrativeData }: IdeaFormProps) {
  const { toast } = useToast();
  
  const form = useForm<SubmitIdea>({
    resolver: zodResolver(submitIdeaSchema),
    defaultValues: {
      topic: "",
      customTopic: "",
      name: "",
      content: "",
    },
  });

  const submitIdea = useMutation({
    mutationFn: (data: SubmitIdea) => {
      return apiRequest("POST", "/api/ideas", data);
    },
    onSuccess: () => {
      // Proceed to the next step
      setActiveStep(2);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit your idea. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SubmitIdea) => {
    // Store the data for the narrative generation step
    setNarrativeData(data);
    
    // Submit to the API
    submitIdea.mutate(data);
  };

  // For showing/hiding the "other" topic field
  const watchTopic = form.watch("topic");
  const showOtherTopic = watchTopic === "other";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Topic <span className="text-red-500">*</span>
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a topic" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ideaTopics.map((topic) => (
                    <SelectItem key={topic.value} value={topic.value}>
                      {topic.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {showOtherTopic && (
          <FormField
            control={form.control}
            name="customTopic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Specify Topic <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter custom topic" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Your Name <span className="text-gray-400">(optional)</span>
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="Anonymous" />
              </FormControl>
              <p className="text-xs text-gray-500 mt-1">Leave blank to remain anonymous</p>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Your Idea or Insight <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Share your thoughts, ideas, or suggestions on this topic..."
                  rows={4}
                />
              </FormControl>
              <p className="text-xs text-gray-500 mt-1">Be specific and constructive with your feedback</p>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={submitIdea.isPending} 
            className="bg-primary-600 hover:bg-primary-700"
          >
            {submitIdea.isPending ? "Submitting..." : "Continue"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
