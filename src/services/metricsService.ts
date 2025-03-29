
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Types for emotion data
export interface EmotionData {
  date: string;
  confidence: number; // 1-10 scale
  motivation: number; // 1-10 scale
  stress: number; // 1-10 scale
  satisfaction: number; // 1-10 scale
}

// Types for personalized metrics
export interface PersonalizedMetrics {
  weeklyProgress: { week: string; applications: number; interviews: number; responses: number }[];
  emotionTrends: { date: string; average: number }[];
  jobSuccessRate: number;
  applicationQuality: number;
  strengths: string[];
  areasToImprove: string[];
  recommendedActions: string[];
}

// Function to save user emotion data
export const saveEmotionData = async (userId: string, data: EmotionData): Promise<boolean> => {
  try {
    // Use the less type-safe version with explicit casting to avoid TypeScript errors
    const { error } = await supabase
      .from('user_emotions' as any)
      .insert({
        user_id: userId,
        date: data.date,
        confidence: data.confidence,
        motivation: data.motivation,
        stress: data.stress,
        satisfaction: data.satisfaction
      } as any);

    if (error) throw error;
    
    toast.success("Emotion data saved successfully");
    return true;
  } catch (error) {
    console.error('Error saving emotion data:', error);
    toast.error("Failed to save your responses");
    return false;
  }
};

// Function to get user emotion data
export const getEmotionData = async (userId: string): Promise<EmotionData[]> => {
  try {
    // Use the less type-safe version with explicit casting to avoid TypeScript errors
    const { data, error } = await supabase
      .from('user_emotions' as any)
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) throw error;
    
    // Map the returned data to our EmotionData interface
    return (data || []).map(item => ({
      date: item.date,
      confidence: item.confidence,
      motivation: item.motivation,
      stress: item.stress,
      satisfaction: item.satisfaction
    }));
  } catch (error) {
    console.error('Error fetching emotion data:', error);
    return [];
  }
};

// Function to calculate personalized metrics
export const getPersonalizedMetrics = async (userId: string): Promise<PersonalizedMetrics> => {
  try {
    // Fetch user's job applications
    const { data: applications, error: appError } = await supabase
      .from('job_applications')
      .select('*')
      .eq('user_id', userId);
      
    if (appError) throw appError;
    
    // Fetch user's emotion data
    const emotions = await getEmotionData(userId);
    
    // Calculate personalized metrics
    
    // Weekly progress calculation
    const now = new Date();
    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(now.getDate() - 28);
    
    // Initialize weekly data
    const weeklyProgress = [];
    for (let i = 0; i < 4; i++) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (7 * i + 7));
      const weekEnd = new Date(now);
      weekEnd.setDate(now.getDate() - (7 * i));
      
      const weekApplications = applications?.filter(app => {
        const appDate = new Date(app.applied_date);
        return appDate >= weekStart && appDate < weekEnd;
      }) || [];
      
      const weekInterviews = applications?.filter(app => {
        const appDate = new Date(app.applied_date);
        return appDate >= weekStart && appDate < weekEnd && app.status === 'interview';
      }) || [];
      
      const weekResponses = applications?.filter(app => {
        const appDate = new Date(app.applied_date);
        return appDate >= weekStart && appDate < weekEnd && 
          (app.status === 'interview' || app.status === 'offer' || app.status === 'rejected');
      }) || [];
      
      weeklyProgress.push({
        week: `Week ${4-i}`,
        applications: weekApplications.length,
        interviews: weekInterviews.length,
        responses: weekResponses.length
      });
    }
    
    // Reverse to get chronological order
    weeklyProgress.reverse();
    
    // Emotion trends calculation
    const emotionTrends = emotions.map(day => ({
      date: day.date,
      average: (day.confidence + day.motivation + day.satisfaction - day.stress/2) / 3.5
    }));
    
    // Job success rate calculation
    const totalApplications = applications?.length || 0;
    const successfulApplications = applications?.filter(app => 
      app.status === 'interview' || app.status === 'offer'
    ).length || 0;
    
    const jobSuccessRate = totalApplications > 0 
      ? Math.round((successfulApplications / totalApplications) * 100) 
      : 0;
    
    // Application quality score (1-100)
    const applicationQuality = Math.min(100, 
      60 + 
      (emotions.length > 0 ? Math.round(emotions[0].confidence * 2) : 0) + 
      (jobSuccessRate > 0 ? Math.round(jobSuccessRate / 5) : 0)
    );
    
    // Generate insights based on the data
    const strengths = [];
    const areasToImprove = [];
    const recommendedActions = [];
    
    // Add strengths
    if (jobSuccessRate > 15) strengths.push("Above average response rate");
    if (weeklyProgress.length > 0 && weeklyProgress[weeklyProgress.length-1].applications > 3) 
      strengths.push("Consistent application volume");
    if (emotions.length > 0 && emotions[0].motivation > 7)
      strengths.push("High motivation levels");
      
    // Add areas to improve  
    if (jobSuccessRate < 15) areasToImprove.push("Response rate");
    if (weeklyProgress.length > 0 && weeklyProgress[weeklyProgress.length-1].applications < 3)
      areasToImprove.push("Application volume");
    if (emotions.length > 0 && emotions[0].stress > 7)
      areasToImprove.push("Stress management");
      
    // Add recommended actions
    if (areasToImprove.includes("Response rate"))
      recommendedActions.push("Tailor your resume and cover letter to each job application");
    if (areasToImprove.includes("Application volume"))
      recommendedActions.push("Set a goal of applying to at least 5 jobs per week");
    if (areasToImprove.includes("Stress management"))
      recommendedActions.push("Take breaks between applications and practice self-care");
    
    // If no specific improvements, add general advice
    if (recommendedActions.length === 0) {
      recommendedActions.push("Follow up on applications after one week");
      recommendedActions.push("Research companies before interviews");
      recommendedActions.push("Practice common interview questions");
    }
    
    return {
      weeklyProgress,
      emotionTrends,
      jobSuccessRate,
      applicationQuality,
      strengths: strengths.length > 0 ? strengths : ["Not enough data to determine strengths"],
      areasToImprove: areasToImprove.length > 0 ? areasToImprove : ["Not enough data to determine areas for improvement"],
      recommendedActions
    };
  } catch (error) {
    console.error('Error calculating personalized metrics:', error);
    
    // Return default metrics if there's an error
    return {
      weeklyProgress: [],
      emotionTrends: [],
      jobSuccessRate: 0,
      applicationQuality: 0,
      strengths: ["Not enough data available"],
      areasToImprove: ["Not enough data available"],
      recommendedActions: [
        "Start tracking your job search regularly",
        "Complete the emotion questionnaire regularly",
        "Apply to at least 5 jobs per week"
      ]
    };
  }
};
