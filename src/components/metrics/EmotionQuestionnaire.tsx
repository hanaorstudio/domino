
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { EmotionData, saveEmotionData } from '@/services/metricsService';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const emotions = [
  { 
    name: 'confidence', 
    label: 'Confidence', 
    description: 'How confident do you feel about your job search?',
    min: 1,
    max: 10
  },
  { 
    name: 'motivation', 
    label: 'Motivation', 
    description: 'How motivated are you to continue your job search?',
    min: 1,
    max: 10
  },
  { 
    name: 'stress', 
    label: 'Stress', 
    description: 'How stressed do you feel about your job search?',
    min: 1,
    max: 10
  },
  { 
    name: 'satisfaction', 
    label: 'Satisfaction', 
    description: 'How satisfied are you with your job search progress?',
    min: 1,
    max: 10
  }
];

const EmotionQuestionnaire: React.FC = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emotionValues, setEmotionValues] = useState<Record<string, number>>({
    confidence: 5,
    motivation: 5,
    stress: 5,
    satisfaction: 5
  });

  const handleSliderChange = (emotion: string, value: number[]) => {
    setEmotionValues(prev => ({ ...prev, [emotion]: value[0] }));
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("You need to be logged in to submit your responses");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const emotionData: EmotionData = {
        date: new Date().toISOString(),
        confidence: emotionValues.confidence,
        motivation: emotionValues.motivation,
        stress: emotionValues.stress,
        satisfaction: emotionValues.satisfaction
      };
      
      const success = await saveEmotionData(user.id, emotionData);
      
      if (success) {
        // Reset to default values
        setEmotionValues({
          confidence: 5,
          motivation: 5,
          stress: 5,
          satisfaction: 5
        });
      }
    } catch (error) {
      console.error('Error submitting emotion data:', error);
      toast.error("Failed to save your responses");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Helper function to get slider value label
  const getValueLabel = (value: number, type: string) => {
    if (type === 'stress') {
      return value <= 3 ? 'Low' : value <= 7 ? 'Moderate' : 'High';
    } else {
      return value <= 3 ? 'Low' : value <= 7 ? 'Moderate' : 'High';
    }
  };

  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle>How are you feeling today?</CardTitle>
        <CardDescription>
          Track your job search emotions to gain insights into your progress and mental well-being.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {emotions.map((emotion) => (
          <div key={emotion.name} className="space-y-3">
            <div className="flex justify-between items-center">
              <Label htmlFor={emotion.name} className="text-base font-medium">
                {emotion.label}
              </Label>
              <span className="text-sm font-medium bg-primary/10 px-2 py-1 rounded-md">
                {emotionValues[emotion.name]} - {getValueLabel(emotionValues[emotion.name], emotion.name)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{emotion.description}</p>
            <Slider
              id={emotion.name}
              min={emotion.min}
              max={emotion.max}
              step={1}
              value={[emotionValues[emotion.name]]}
              onValueChange={(value) => handleSliderChange(emotion.name, value)}
              className="py-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>
        ))}
        
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting} 
          className="w-full mt-4"
        >
          {isSubmitting ? 'Saving...' : 'Save My Responses'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmotionQuestionnaire;
