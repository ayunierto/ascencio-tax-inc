import z from "zod";

export const bookingSchema = z.object({
  serviceId: z.string().uuid({ message: "Invalid service ID format" }),
  staffId: z.string().uuid({ message: "Staff member is required" }),
  utcDateTime: z
    .string({ required_error: "The date-time is required" })
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/, {
      message: "Invalid date-time format",
    }),
  timeZone: z
    .string({ required_error: "The time zone is required" })
    .min(2)
    .max(100),
  comments: z.string().optional(),

  date: z.string({ required_error: "The date is required" }),
  time: z.string({ required_error: "The time is required" }),
});

export type BookingFormFields = z.infer<typeof bookingSchema>;

export type BookingDataApiRequest = Omit<BookingFormFields, "date" | "time">;
