import { json } from "@remix-run/node"
import { authenticate } from "../shopify.server"

export const loader = async ({ request }) => {
  const session = await authenticate.admin(request);
  if (!session) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const shop = session.session.shop;

  try {
    const countdown = await prisma.countdown.findFirst({
      where: { shop },
    });

    return json({ countdown });
  } catch (error) {
    console.error("❌ Error fetching countdown:", error);
    return json({ countdown: null, error: error.message }, { status: 500 });
  }
};