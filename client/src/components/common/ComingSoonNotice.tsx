
import React from 'react';
import { AlertTriangle, Construction, Shield, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface ComingSoonNoticeProps {
  pageName: string;
  features?: string[];
  estimatedCompletion?: string;
  className?: string;
}

export const ComingSoonNotice: React.FC<ComingSoonNoticeProps> = ({
  pageName,
  features = [],
  estimatedCompletion,
  className = ""
}) => {
  return (
    <div className={`min-h-[60vh] flex items-center justify-center p-4 ${className}`}>
      <Card className="max-w-2xl w-full border-2 border-dashed border-orange-300 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <Construction className="h-16 w-16 text-orange-500 animate-pulse" />
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 text-xs px-2 py-1"
              >
                BETA
              </Badge>
            </div>
          </div>
          
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            {pageName} - Coming Soon
          </CardTitle>
          
          <div className="flex justify-center gap-2">
            <Badge variant="outline" className="text-orange-600 border-orange-300">
              <Clock className="h-3 w-3 mr-1" />
              In Development
            </Badge>
            {estimatedCompletion && (
              <Badge variant="outline" className="text-blue-600 border-blue-300">
                ETA: {estimatedCompletion}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Alert className="border-amber-300 bg-amber-50 dark:bg-amber-950/20">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800 dark:text-amber-200">
              <strong>Development Notice:</strong> This page is currently under active development. 
              Some features may not work as expected or may be temporarily unavailable.
            </AlertDescription>
          </Alert>

          <Alert className="border-red-300 bg-red-50 dark:bg-red-950/20">
            <Shield className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 dark:text-red-200">
              <strong>Security Warning:</strong> User submissions and data handling may not be as secure 
              as they will be in the finished production version. Please avoid submitting sensitive information.
            </AlertDescription>
          </Alert>

          {features.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Construction className="h-4 w-4" />
                Planned Features:
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="h-2 w-2 rounded-full bg-orange-400"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Thank you for your patience as we build something amazing! 🚧✨
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              Check back soon for updates or follow our development progress.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComingSoonNotice;
