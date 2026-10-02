'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { personnelService } from '@/lib/personnelService';
import { Personnel } from '@/types/personnel';

export type UserRole = 'admin' | 'user';

export interface AuthUser {
  id: string; // personnel.id
  citizen_id: string;
  military_id?: string;
  displayName: string;
  role: UserRole;
  department?: string;
  rank_en?: string;
  first_name_en?: string;
  last_name_en?: string;
  nickname?: string;
  phone_number?: string;
  photo_url?: string;
  mustChangePassword?: boolean;
}

interface LoginResult {
  success: boolean;
  message?: string;
  mustChangePassword?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  personnelData: Personnel | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (identifier: string, password: string) => Promise<LoginResult>;
  changePassword: (newPassword: string) => Promise<boolean>;
  updateSelfProfile: (fields: Partial<Personnel>) => Promise<boolean>;
  logout: () => void;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_SESSION_KEY = 'engineer_auth_session';
const LOCAL_STORAGE_PASSWORDS_KEY = 'engineer_personnel_passwords';

// Helper to normalize digits
const cleanDigits = (str?: string | null): string => {
  return str ? str.replace(/[^0-9]/g, '') : '';
};

// Get stored passwords map
const getStoredPasswords = (): Record<string, string> => {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PASSWORDS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveStoredPasswords = (passwords: Record<string, string>) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_PASSWORDS_KEY, JSON.stringify(passwords));
  } catch (e) {
    console.error('Error saving passwords map', e);
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [personnelData, setPersonnelData] = useState<Personnel | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load session from localStorage on startup
  useEffect(() => {
    async function initSession() {
      try {
        const storedSession = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);
        if (storedSession) {
          const parsedUser: AuthUser = JSON.parse(storedSession);
          setUser(parsedUser);

          // If linked to a personnel ID, load latest personnel details
          if (parsedUser.id && parsedUser.id !== 'admin-root') {
            const p = await personnelService.getById(parsedUser.id);
            if (p) setPersonnelData(p);
          }
        } else {
          // If no session, create a default user session linked to first personnel
          const all = await personnelService.getAll();
          if (all.length > 0) {
            const defaultPersonnel = all.find((p) => p.seq_no === 2) || all[0];
            const defaultUser: AuthUser = {
              id: defaultPersonnel.id,
              citizen_id: defaultPersonnel.citizen_id || '',
              military_id: defaultPersonnel.military_id || '',
              displayName: defaultPersonnel.full_name_th,
              role: 'user',
              department: defaultPersonnel.department || '',
              rank_en: defaultPersonnel.rank_en || '',
              first_name_en: defaultPersonnel.first_name_en || '',
              last_name_en: defaultPersonnel.last_name_en || '',
              nickname: defaultPersonnel.nickname || '',
              phone_number: defaultPersonnel.phone_number || '',
              photo_url: defaultPersonnel.photo_url || '',
              mustChangePassword: false,
            };
            setUser(defaultUser);
            setPersonnelData(defaultPersonnel);
            localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(defaultUser));
          }
        }
      } catch (err) {
        console.error('Session init error:', err);
      } finally {
        setIsLoading(false);
      }
    }
    initSession();
  }, []);

  // 1. Login with citizen_id (or 'admin' for system administrator)
  const login = async (identifier: string, password: string): Promise<LoginResult> => {
    const rawInput = identifier.trim();
    const cleanInput = cleanDigits(rawInput);

    // Case A: Administrator special login
    if (rawInput.toLowerCase() === 'admin' && password === 'admin123') {
      const adminUser: AuthUser = {
        id: 'admin-root',
        citizen_id: '0-0000-00000-00-0',
        displayName: 'ผู้ดูแลระบบส่วนกลาง (Admin)',
        role: 'admin',
        department: 'กองบังคับการกองพลทหารช่าง',
        mustChangePassword: false,
      };
      setUser(adminUser);
      setPersonnelData(null);
      localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(adminUser));
      return { success: true };
    }

    // Case B: Login by citizen_id (เลขประจำตัวประชาชน 13 หลัก)
    if (!cleanInput) {
      return {
        success: false,
        message: 'กรุณากรอกเลขประจำตัวประชาชน 13 หลัก',
      };
    }

    try {
      const allPersonnel = await personnelService.getAll();
      const matched = allPersonnel.find((p) => cleanDigits(p.citizen_id) === cleanInput);

      if (!matched) {
        return {
          success: false,
          message: 'ไม่พบเลขประจำตัวประชาชนนี้ในฐานข้อมูลกำลังพล',
        };
      }

      const storedPasswords = getStoredPasswords();
      const customPassword = storedPasswords[cleanInput];

      // Check if password has been set previously
      if (customPassword) {
        if (password === customPassword) {
          const authUser: AuthUser = {
            id: matched.id,
            citizen_id: matched.citizen_id || cleanInput,
            military_id: matched.military_id || '',
            displayName: matched.full_name_th,
            role: 'user',
            department: matched.department || '',
            rank_en: matched.rank_en || '',
            first_name_en: matched.first_name_en || '',
            last_name_en: matched.last_name_en || '',
            nickname: matched.nickname || '',
            phone_number: matched.phone_number || '',
            photo_url: matched.photo_url || '',
            mustChangePassword: false,
          };
          setUser(authUser);
          setPersonnelData(matched);
          localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(authUser));
          return { success: true, mustChangePassword: false };
        } else {
          return {
            success: false,
            message: 'รหัสผ่านไม่ถูกต้อง',
          };
        }
      } else {
        // First-Time Login: Password must match military_id (เลขประจำตัวทหาร 10 หลัก)
        const cleanMilitaryId = cleanDigits(matched.military_id);
        const inputPassDigits = cleanDigits(password);

        if (inputPassDigits === cleanMilitaryId || password === matched.military_id) {
          const authUser: AuthUser = {
            id: matched.id,
            citizen_id: matched.citizen_id || cleanInput,
            military_id: matched.military_id || '',
            displayName: matched.full_name_th,
            role: 'user',
            department: matched.department || '',
            rank_en: matched.rank_en || '',
            first_name_en: matched.first_name_en || '',
            last_name_en: matched.last_name_en || '',
            nickname: matched.nickname || '',
            phone_number: matched.phone_number || '',
            photo_url: matched.photo_url || '',
            mustChangePassword: true, // Must change password immediately!
          };
          setUser(authUser);
          setPersonnelData(matched);
          localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(authUser));
          return { success: true, mustChangePassword: true };
        } else {
          return {
            success: false,
            message: 'การเข้าสู่ระบบครั้งแรก กรุณาใส่รหัสผ่านเป็นเลขประจำตัวทหาร 10 หลัก',
          };
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      return {
        success: false,
        message: 'เกิดข้อผิดพลาดในการตรวจสอบข้อมูล',
      };
    }
  };

  // 2. Change password (required for first-time login or from user settings)
  const changePassword = async (newPassword: string): Promise<boolean> => {
    if (!user || !user.citizen_id) return false;
    const cleanKey = cleanDigits(user.citizen_id);

    try {
      const stored = getStoredPasswords();
      stored[cleanKey] = newPassword;
      saveStoredPasswords(stored);

      const updatedUser: AuthUser = {
        ...user,
        mustChangePassword: false,
      };
      setUser(updatedUser);
      localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(updatedUser));
      return true;
    } catch (e) {
      console.error('Change password failed', e);
      return false;
    }
  };

  // 3. User can edit ONLY: ยศ, ชื่อ, นามสกุล, ชื่อเล่น, หมายเลขโทรศัพท์
  const updateSelfProfile = async (fields: Partial<Personnel>): Promise<boolean> => {
    if (!user || !user.id || user.id === 'admin-root') return false;

    // Filter strictly to allowed fields only
    const safeData: Partial<Personnel> = {};
    if (fields.full_name_th !== undefined) safeData.full_name_th = fields.full_name_th;
    if (fields.nickname !== undefined) safeData.nickname = fields.nickname;
    if (fields.phone_number !== undefined) safeData.phone_number = fields.phone_number;
    if (fields.rank_en !== undefined) safeData.rank_en = fields.rank_en;
    if (fields.first_name_en !== undefined) safeData.first_name_en = fields.first_name_en;
    if (fields.last_name_en !== undefined) safeData.last_name_en = fields.last_name_en;

    try {
      const updated = await personnelService.update(user.id, safeData);
      setPersonnelData(updated);

      const updatedUser: AuthUser = {
        ...user,
        displayName: updated.full_name_th,
        nickname: updated.nickname || '',
        phone_number: updated.phone_number || '',
        rank_en: updated.rank_en || '',
        first_name_en: updated.first_name_en || '',
        last_name_en: updated.last_name_en || '',
      };
      setUser(updatedUser);
      localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(updatedUser));
      return true;
    } catch (err) {
      console.error('Self profile update error:', err);
      return false;
    }
  };

  // 4. Refresh current user data from database
  const refreshUserData = async () => {
    if (!user || !user.id || user.id === 'admin-root') return;
    try {
      const p = await personnelService.getById(user.id);
      if (p) {
        setPersonnelData(p);
        setUser((prev) =>
          prev
            ? {
                ...prev,
                displayName: p.full_name_th,
                nickname: p.nickname || '',
                phone_number: p.phone_number || '',
                rank_en: p.rank_en || '',
                first_name_en: p.first_name_en || '',
                last_name_en: p.last_name_en || '',
              }
            : null
        );
      }
    } catch (e) {
      console.error('Failed to refresh user data', e);
    }
  };

  // 5. Logout
  const logout = () => {
    setUser(null);
    setPersonnelData(null);
    localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        personnelData,
        isLoading,
        isAdmin,
        login,
        changePassword,
        updateSelfProfile,
        logout,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
