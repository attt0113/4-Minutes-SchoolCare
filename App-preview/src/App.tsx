/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { ShieldAlert } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import AssessmentScreen from './screens/AssessmentScreen';
import EmergencyProtocolScreen from './screens/EmergencyProtocolScreen';
import ActiveEmergencyScreen from './screens/ActiveEmergencyScreen';
import StudentProfileScreen from './screens/StudentProfileScreen';
import LogsScreen from './screens/LogsScreen';

interface Notification {
  id: string;
  type: 'EMERGENCY' | 'CLINICAL' | 'ADMIN' | 'DAILY';
  title: string;
  description: string;
  time: string;
  isRead: boolean;
}

interface EmergencyContextType {
  isEmergencyActive: boolean;
  setIsEmergencyActive: (active: boolean) => void;
  emergencyStartTime: number | null;
  setEmergencyStartTime: (time: number | null) => void;
  triggerAlert: () => void;
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'isRead'>) => void;
  markAllAsRead: () => void;
  hasUnread: boolean;
}

const EmergencyContext = createContext<EmergencyContextType | undefined>(undefined);

export const useEmergency = () => {
  const context = useContext(EmergencyContext);
  if (!context) throw new Error('useEmergency must be used within EmergencyProvider');
  return context;
};

export default function App() {
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [emergencyStartTime, setEmergencyStartTime] = useState<number | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const triggerAlert = useCallback(() => {
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  }, []);

  const addNotification = useCallback((n: Omit<Notification, 'id' | 'isRead'>) => {
    setNotifications(prev => [
      { ...n, id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, isRead: false },
      ...prev
    ]);
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => {
      const hasUnread = prev.some(n => !n.isRead);
      if (!hasUnread) return prev;
      return prev.map(n => ({ ...n, isRead: true }));
    });
  }, []);

  const hasUnread = useMemo(() => notifications.some(n => !n.isRead), [notifications]);

  const contextValue = useMemo(() => ({ 
    isEmergencyActive, 
    setIsEmergencyActive, 
    emergencyStartTime,
    setEmergencyStartTime,
    triggerAlert, 
    notifications, 
    addNotification, 
    markAllAsRead,
    hasUnread
  }), [isEmergencyActive, emergencyStartTime, triggerAlert, notifications, addNotification, markAllAsRead, hasUnread]);

  return (
    <EmergencyContext.Provider value={contextValue}>
      <div className="relative">
        <AnimatePresence>
          {showAlert && (
            <motion.div 
              initial={{ opacity: 0, y: -20, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: -20, x: '-50%' }}
              className="fixed top-6 left-1/2 w-[calc(100%-3rem)] max-w-[400px] z-[1000] bg-tertiary text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/20"
            >
              <ShieldAlert className="w-6 h-6 shrink-0" />
              <p className="text-xs font-bold uppercase tracking-wider leading-tight">Critical status reporting only available after emergency activation</p>
            </motion.div>
          )}
        </AnimatePresence>
        
        <Router>
          <Routes>
            <Route path="/" element={<LoginScreen />} />
            <Route path="/dashboard" element={<DashboardScreen />} />
            <Route path="/assess/:level" element={<AssessmentScreen />} />
            <Route path="/emergency" element={<EmergencyProtocolScreen />} />
            <Route path="/emergency/active" element={<ActiveEmergencyScreen />} />
            <Route path="/student-profile" element={<StudentProfileScreen />} />
            <Route path="/logs" element={<LogsScreen />} />
            <Route path="/alerts" element={<LogsScreen />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </div>
    </EmergencyContext.Provider>
  );
}
