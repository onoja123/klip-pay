import { Redirect } from 'expo-router';

// This file redirects to the onboarding flow
// In a real app, you would check if the user has completed onboarding
// and redirect to (tabs) if they have

export default function Index() {
  // TODO: Check AsyncStorage for onboarding completion
  // const hasCompletedOnboarding = useOnboardingStatus();
  // if (hasCompletedOnboarding) {
  //   return <Redirect href="/(tabs)" />;
  // }
  
  return <Redirect href="/onboarding" />;
}
