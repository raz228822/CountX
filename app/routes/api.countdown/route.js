import { json } from "@remix-run/node";

export const loader = async ({ request }) => {
    const url = new URL(request.url);
    const shop = url.searchParams.get("shop");
    try {
        // Fetch the countdown associated with the shop
        const countdown = await prisma.countdown.findFirst({
          where: { shop },
        });
    
        console.log("📌 Countdown fetched:", countdown);
        return json({ countdown });
      } catch (error) {
        console.error("❌ Error fetching countdown:", error);
        return json({ countdown: null, error: error.message });
    }
};