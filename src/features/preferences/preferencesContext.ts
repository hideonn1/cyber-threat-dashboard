import { createContext } from "react";
import type { UserProfile, UserPreferences } from "./types";

export interface PreferencesContextValue {
  profile: UserProfile;
  preferences: UserPreferences;
  updateProfile: (updates: Partial<UserProfile>) => void;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
}

export const PreferencesContext = createContext<PreferencesContextValue | null>(null);
