import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "auto-content-factory",
  eventKey: process.env.INNGEST_EVENT_KEY,
});
