// utils/credits.ts
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

interface CreditResponse {
  success: boolean;
  message: string;
  remainingCredits?: number;
  remainingTrialCredits?: number;
}

export const checkCreditsForAvailability = async (
  userId: string
): Promise<CreditResponse> => {
  try {
    const { data: userData, error } = await supabase
      .from('users')
      .select('credits, trial_credits')
      .eq('id', userId)
      .single();

    if (error) throw error;

    const hasCredits = (userData.credits || 0) > 0;
    const hasTrialCredits = (userData.trial_credits || 0) > 0;

    if (!hasCredits && !hasTrialCredits) {
      return {
        success: false,
        message:
          'Insufficient credits. Please purchase more credits to set availability.',
        remainingCredits: userData.credits,
        remainingTrialCredits: userData.trial_credits
      };
    }

    return {
      success: true,
      message: 'Sufficient credits available',
      remainingCredits: userData.credits,
      remainingTrialCredits: userData.trial_credits
    };
  } catch (error) {
    console.error('Error checking credits:', error);
    return {
      success: false,
      message: 'Error checking credit balance'
    };
  }
};

export const deductCreditsForAvailability = async (
  userId: string
): Promise<CreditResponse> => {
  try {
    // First check if user has any credits
    const { data: userData, error: checkError } = await supabase
      .from('users')
      .select('credits, trial_credits')
      .eq('id', userId)
      .single();

    if (checkError) throw checkError;

    // Determine which type of credits to use
    const useTrialCredits = userData.trial_credits > 0;
    const updateField = useTrialCredits ? 'trial_credits' : 'credits';
    const currentValue = useTrialCredits
      ? userData.trial_credits
      : userData.credits;

    if (currentValue <= 0) {
      return {
        success: false,
        message: 'Insufficient credits',
        remainingCredits: userData.credits,
        remainingTrialCredits: userData.trial_credits
      };
    }

    // Update the credits
    const { data, error } = await supabase
      .from('users')
      .update({ [updateField]: currentValue - 1 })
      .eq('id', userId)
      .select('credits, trial_credits')
      .single();

    if (error) throw error;

    return {
      success: true,
      message: `Successfully deducted 1 ${useTrialCredits ? 'trial credit' : 'credit'}`,
      remainingCredits: data.credits,
      remainingTrialCredits: data.trial_credits
    };
  } catch (error) {
    console.error('Error deducting credits:', error);
    return {
      success: false,
      message: 'Error processing credit deduction'
    };
  }
};
