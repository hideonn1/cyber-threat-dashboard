import { useState, useEffect, useMemo, type ReactNode } from "react";
import Cookies from "js-cookie";
import { PreferencesContext } from "./preferencesContext";
import type { UserProfile, UserPreferences, ThemeAccent } from "./types";

const PROFILE_COOKIE_KEY = "cyber_analyst_profile";
const PREFS_LOCAL_KEY = "cyber_analyst_preferences";

const DEFAULT_PROFILE: UserProfile = {
  name: "",
  role: "UNASSIGNED",
  badgeNumber: "",
};

const DEFAULT_PREFERENCES: UserPreferences = {
  themeAccent: "cyan",
  defaultTab: "cl_alerts",
  defaultTlp: "ALL",
  autoRefreshInterval: 0, // Manual
};

const ACCENT_COLORS: Record<ThemeAccent, { primary: string; dim: string }> = {
  cyan: { primary: "#22d3ee", dim: "#0891b2" },
  green: { primary: "#4ade80", dim: "#16a34a" },
  red: { primary: "#f87171", dim: "#dc2626" },
  violet: { primary: "#a78bfa", dim: "#7c3aed" },
  amber: { primary: "#fbbf24", dim: "#d97706" },
};

export function PreferencesProvider({ children }: { children: ReactNode }) {
  // Load user profile from Cookies
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = Cookies.get(PROFILE_COOKIE_KEY);
      if (saved) {
        return JSON.parse(saved) as UserProfile;
      }
    } catch (e) {
      console.warn("Failed to load profile from cookies", e);
    }
    return DEFAULT_PROFILE;
  });

  // Load user preferences from LocalStorage
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem(PREFS_LOCAL_KEY);
      if (saved) {
        return JSON.parse(saved) as UserPreferences;
      }
    } catch (e) {
      console.warn("Failed to load preferences from localStorage", e);
    }
    return DEFAULT_PREFERENCES;
  });

  // Update profile and save to Cookie
  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updates };
      try {
        Cookies.set(PROFILE_COOKIE_KEY, JSON.stringify(next), { expires: 365 });
      } catch (e) {
        console.warn("Failed to save profile to cookies", e);
      }
      return next;
    });
  };

  // Update preferences and save to LocalStorage
  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences((prev) => {
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem(PREFS_LOCAL_KEY, JSON.stringify(next));
      } catch (e) {
        console.warn("Failed to save preferences to localStorage", e);
      }
      return next;
    });
  };

  // Apply CSS custom properties dynamically when themeAccent changes
  useEffect(() => {
    const colors = ACCENT_COLORS[preferences.themeAccent] || ACCENT_COLORS.cyan;
    document.documentElement.style.setProperty("--color-cyber-accent", colors.primary);
    document.documentElement.style.setProperty("--color-cyber-accent-dim", colors.dim);
  }, [preferences.themeAccent]);

  // Migration: If the user has the old hardcoded defaults in their cookies, nuke them
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (profile.name === "Analista de Guardia") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      updateProfile({ name: "", role: "UNASSIGNED", badgeNumber: "" });
    }
  }, []);

  const value = useMemo(
    () => ({
      profile,
      preferences,
      updateProfile,
      updatePreferences,
    }),
    [profile, preferences]
  );

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}
