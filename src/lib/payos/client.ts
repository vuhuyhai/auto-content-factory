// Dau moi ket noi PayOS - tao san 1 client dung chung cho ca app.
// Doc 3 key tu .env.local. Pattern giong src/lib/email/resend.ts (Day 16).

import { PayOS } from "@payos/node";

const clientId = process.env.PAYOS_CLIENT_ID;
const apiKey = process.env.PAYOS_API_KEY;
const checksumKey = process.env.PAYOS_CHECKSUM_KEY;

if (!clientId || !apiKey || !checksumKey) {
  throw new Error(
    "[payos] Thieu bien moi truong PayOS. Can co PAYOS_CLIENT_ID, PAYOS_API_KEY, PAYOS_CHECKSUM_KEY trong .env.local"
  );
}

export const payos = new PayOS({
  clientId,
  apiKey,
  checksumKey,
});
