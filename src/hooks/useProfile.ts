import { useState, useCallback } from 'react';
import { ProfileState, ProfileType } from '../types';

export function useProfile() {
  const [profile, setProfile] = useState<ProfileState>({ id: "", type: null });

  const openProfile = useCallback((id: string, type: ProfileType) => {
    if (type && (type === "colaborador" || type === "projeto")) {
      setProfile({ id, type });
    }
  }, []);

  const closeProfile = useCallback(() => {
    setProfile({ id: "", type: null });
  }, []);

  return {
    profile,
    openProfile,
    closeProfile,
    setProfile
  };
}
