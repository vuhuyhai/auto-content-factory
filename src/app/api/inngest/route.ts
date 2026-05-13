import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { workflowRunner } from "@/inngest/functions/workflow-runner";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [workflowRunner],
});
