// import { authenticate } from "../shopify.server";
// import prisma from '../../app/db.server'; // Your Prisma client

export async function getCountdownDetails({shop}) {
  try {
    // Fetch the countdown for the shop from the Prisma database
    const countdown = await prisma.countdown.findUnique({
      where: {
        shop: shop, // Use the shop as a filter
      },
    });

    console.log('Countdown fetched from database:', countdown);
  } catch (error) {
    console.error('Error fetching countdown:', error);
  }
}
