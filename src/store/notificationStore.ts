/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from "zustand";
import { SystemNotification } from "../types";

interface NotificationState {
  notifications: SystemNotification[];
  addNotification: (title: string, message: string, type?: SystemNotification["type"]) => void;
  dismissNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [
    {
      id: "init-noti",
      title: "Helios OS Active",
      message: "Autonomous AI kernel version 2.5.4 successfully loaded.",
      type: "success",
      timestamp: new Date().toLocaleTimeString(),
    },
  ],
  addNotification: (title, message, type = "info") => {
    const newNoti: SystemNotification = {
      id: `noti-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title,
      message,
      type,
      timestamp: new Date().toLocaleTimeString(),
    };
    set((state) => ({
      notifications: [newNoti, ...state.notifications.slice(0, 9)],
    }));
  },
  dismissNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  clearAll: () => set({ notifications: [] }),
}));
