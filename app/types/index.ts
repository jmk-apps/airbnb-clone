import { Listing, Reservation, User } from "@prisma/client";

export type ReservationWithListing = Reservation & {
  listing: Listing
}

