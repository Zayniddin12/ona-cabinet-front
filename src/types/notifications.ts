import { IPaginationResponse } from "@/pages/SuperAdmin/Residents/data";

export interface INotification {
  id: 1;
  type: null;
  content_type: null;
  title: "Test Notification uz";
  description: "Test Notification Description uz";
  created_at: "2023-04-25T16:26:19.079284";
}

export interface INotificationItem {
  id: number;
  is_read: boolean;
  notification: INotification;
  participant_id: number;
  message: string;
  source: string;
  source_id: number;
  timestamp: string;
  user: number;
}

export type TNotificationResponse = IPaginationResponse<INotificationItem>;
