import { DateTime } from "luxon";
import { MessageDto } from "../services/messageService";

export const formatToLocalTime = (iso: string | undefined): string => {
  if (!iso) return "";

  return DateTime.fromISO(iso, { zone: "utc" })  // Parse UTC correctly
    .setZone(DateTime.local().zoneName)          // Convert to user's actual timezone
    .toFormat("hh:mm a");                        // Format in AM/PM
};

export const groupMessagesByDay = (messages: MessageDto[]) => {
    const groups: any = {};

    messages.forEach(msg => {
        const dt = DateTime.fromISO(msg.sentAt).startOf("day");
        const today = DateTime.now().startOf("day");
        const yesterday = today.minus({ days: 1 });

        let label = dt.toFormat("dd LLL yyyy");

        if (dt.hasSame(today, "day")) label = "Today";
        else if (dt.hasSame(yesterday, "day")) label = "Yesterday";

        if (!groups[label]) groups[label] = [];
        groups[label].push(msg);
    });

    return groups;
};

export const formatLastSeen = (iso?: string): string => {
  if (!iso) return "Last seen recently";

  // Parse as UTC (like your formatToLocalTime), then convert to user's zone
  const dt = DateTime.fromISO(iso, { zone: "utc" }).setZone(DateTime.local().zoneName);
  const now = DateTime.local();

  const isToday = dt.hasSame(now, "day");
  const isYesterday = dt.hasSame(now.minus({ days: 1 }), "day");

  if (isToday) {
    return `Last seen today at ${dt.toFormat("hh:mm a")}`;
  }

  if (isYesterday) {
    return `Last seen yesterday at ${dt.toFormat("hh:mm a")}`;
  }

  // If within the same week (since startOf('week') depends on locale, this uses default locale-week definition)
  if (dt >= now.startOf("week")) {
    return `Last seen on ${dt.toFormat("cccc")} at ${dt.toFormat("hh:mm a")}`;
  }

  // Older → show full date + time
  return `Last seen on ${dt.toFormat("dd LLL yyyy, hh:mm a")}`;
};