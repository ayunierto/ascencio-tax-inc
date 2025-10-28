import { Staff } from "@/core/staff/interfaces";

export interface AvailableSlot {
  /** Tiempo de inicio del slot en formato ISO 8601 (UTC). Ejemplo: '2025-10-20T14:30:00.000Z' */
  startTimeUTC: string;
  /** Tiempo de fin del slot en formato ISO 8601 (UTC). Ejemplo: '2025-10-20T15:00:00.000Z' */
  endTimeUTC: string;
  /** Miembros del Staff disponibles para este slot. */
  availableStaff: Staff[];
}
