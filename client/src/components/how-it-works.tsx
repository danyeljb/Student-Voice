import { Card, CardContent } from "@/components/ui/card";
import { Edit, Brain, Users, Shield, Scale3d, Lock } from "lucide-react";

export default function HowItWorks() {
  return (
    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
      <Card className="bg-white overflow-hidden shadow rounded-lg">
        <CardContent className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">How It Works</h3>
          <div className="mt-4 text-sm text-gray-600">
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <Edit className="text-primary-500 h-5 w-5" />
                </div>
                <p className="ml-3">Share your ideas on school topics that matter to you</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <Brain className="text-primary-500 h-5 w-5" />
                </div>
                <p className="ml-3">Our AI combines everyone's input into a fair narrative</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <Users className="text-primary-500 h-5 w-5" />
                </div>
                <p className="ml-3">Use the narrative for student council, presentations, or administration meetings</p>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white overflow-hidden shadow rounded-lg">
        <CardContent className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Privacy & Usage</h3>
          <div className="mt-4 text-sm text-gray-600">
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <Shield className="text-success-500 h-5 w-5" />
                </div>
                <p className="ml-3">Your name is optional - share ideas anonymously if you prefer</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <Scale3d className="text-success-500 h-5 w-5" />
                </div>
                <p className="ml-3">All ideas are given equal consideration by our AI</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <Lock className="text-success-500 h-5 w-5" />
                </div>
                <p className="ml-3">We never share individual responses with third parties</p>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
