// app/routes/app-proxy/countdown.jsx

import { json } from "@remix-run/node";
import { prisma } from "../../db.server";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");

  if (!shop) {
    return json({ error: "Missing shop" }, { status: 400 });
  }

  const countdown = await prisma.countdown.findFirst({ where: { shop } });

  return json({
    text: countdown?.text || "Default Countdown Text",
    date: countdown?.date || null,
    time: countdown?.time || null,
  });
};
