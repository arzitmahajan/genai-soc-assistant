// src/utils/guest.js
import { v4 as uuidv4 } from "uuid";

export function GetOrCreateGuestUser() {
  let guestId = localStorage.getItem("guest_id");

  if (!guestId) {
    guestId = `guest_${uuidv4()}`;
    localStorage.setItem("guest_id", guestId);
  }

  return {
    id: guestId,
    email: null,
    isGuest: true,
  };
}
