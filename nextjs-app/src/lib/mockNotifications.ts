import { NotificationData } from "@/types";

const MOCK_NOTIFICATIONS: NotificationData[] = [
  {
    _id: "n1",
    userId: "user_1",
    title: "Booking Confirmed",
    description: "Your stay at Grand Palace Hotel has been confirmed. Check-in: Aug 15, 2026.",
    category: "booking",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    _id: "n2",
    userId: "user_1",
    title: "Payment Successful",
    description: "Payment of $1,167 for Grand Palace Hotel has been processed successfully.",
    category: "payment",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    _id: "n3",
    userId: "user_1",
    title: "Weekend Getaway Offer",
    description: "Enjoy 20% off on weekend stays at premium hotels. Book by Sunday!",
    category: "offer",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    _id: "n4",
    userId: "user_1",
    title: "Profile Updated",
    description: "Your account details were successfully updated.",
    category: "account",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    _id: "n5",
    userId: "user_1",
    title: "Check-in Reminder",
    description: "Your check-in at Ocean View Resort starts tomorrow. Have a great stay!",
    category: "booking",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    _id: "n6",
    userId: "user_1",
    title: "Refund Issued",
    description: "Your refund of $450 for the cancelled booking at Seaside Villa has been issued.",
    category: "payment",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    _id: "n7",
    userId: "user_1",
    title: "Exclusive Member Deal",
    description: "Loyalty members get up to 30% off on luxury suites. Limited time only!",
    category: "offer",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    _id: "n8",
    userId: "user_1",
    title: "Password Changed",
    description: "Your account password was changed successfully. If this wasn't you, contact support.",
    category: "account",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
  {
    _id: "n9",
    userId: "user_1",
    title: "Booking Modified",
    description: "Your booking at Mountain Lodge has been updated. New check-in: Sep 10, 2026.",
    category: "booking",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    _id: "n10",
    userId: "user_1",
    title: "Welcome to LuminaStay",
    description: "Thank you for joining! Explore our curated collection of luxury hotels worldwide.",
    category: "account",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  },
];

let mutableNotifications = [...MOCK_NOTIFICATIONS.map((n) => ({ ...n }))];

export function getMockNotifications(userId: string): NotificationData[] {
  return mutableNotifications.filter((n) => n.userId === userId);
}

export function markRead(notificationId: string) {
  const idx = mutableNotifications.findIndex((n) => n._id === notificationId);
  if (idx !== -1) mutableNotifications[idx] = { ...mutableNotifications[idx], read: true };
}

export function markAllRead() {
  mutableNotifications = mutableNotifications.map((n) => ({ ...n, read: true }));
}

export function deleteNotification(notificationId: string) {
  mutableNotifications = mutableNotifications.filter((n) => n._id !== notificationId);
}

export function deleteAllNotifications() {
  mutableNotifications = [];
}

export function resetNotifications() {
  mutableNotifications = MOCK_NOTIFICATIONS.map((n) => ({ ...n }));
}
