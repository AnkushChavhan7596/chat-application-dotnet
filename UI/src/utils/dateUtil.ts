import { DateTime } from "luxon";

export const formatToLocalTime = (iso: string): string => {
  if (!iso) return "";

  return DateTime.fromISO(iso, { zone: "utc" })  // Parse UTC correctly
    .setZone(DateTime.local().zoneName)          // Convert to user's actual timezone
    .toFormat("hh:mm a");                        // Format in AM/PM
};
