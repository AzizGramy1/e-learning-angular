import { Reminder } from './Reminder';
export interface CalendarDay {
  date: string;           // e.g. '2023-06-15'
  isCurrentMonth: boolean;
  reminders?: Reminder[]; // If you want to attach reminders to days
}