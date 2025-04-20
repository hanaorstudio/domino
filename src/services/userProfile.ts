
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/profile";

// Function to fetch user profile
export const fetchUserProfile = async (userId: string): Promise<Profile | null> => {
  try {
    console.log('Fetching profile for user:', userId);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
      
    if (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
    
    console.log('Profile data retrieved:', data);
    return data;
  } catch (error) {
    console.error('Error in fetchUserProfile:', error);
    return null;
  }
};

// Function to update user profile
export const updateUserProfile = async (
  userId: string, 
  profileData: Partial<Profile>
): Promise<Profile | null> => {
  try {
    console.log('Updating profile for user:', userId, 'with data:', profileData);
    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', userId)
      .select()
      .maybeSingle();
      
    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
    
    console.log('Profile updated successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    return null;
  }
};
