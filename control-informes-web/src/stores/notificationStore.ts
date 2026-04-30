import { create } from 'zustand';

type Severity = 'success' | 'error' | 'warning' | 'info';

interface NotificationState {
  open: boolean;
  message: string;
  severity: Severity;
  showNotification: (message: string, severity?: Severity) => void;
  hideNotification: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  open: false,
  message: '',
  severity: 'info',
  showNotification: (message: string, severity: Severity = 'info') =>
    set({ open: true, message, severity }),
  hideNotification: () => set({ open: false }),
}));
