export const MASKED_STREAM_LABEL =
  "Endast ljud och resultat – filmmedgivande saknades";

export type BookingStreamInfo = {
  streamRequested: boolean;
  videoMasked?: boolean;
};

export function bookingStreamLabel(booking: BookingStreamInfo): string | null {
  if (!booking.streamRequested) return null;
  return booking.videoMasked
    ? MASKED_STREAM_LABEL
    : "BeachTV-stream beställd";
}

export function hasRequiredStreamConsent(
  streamRequested: boolean,
  streamConsentAttested: boolean,
): boolean {
  return !streamRequested || streamConsentAttested;
}
