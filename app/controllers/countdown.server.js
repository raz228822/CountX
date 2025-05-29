import prisma from '../db.server';

export async function getCountdown(shop) {
  try {
    const countdown = await prisma.countdown.findFirst({
      where: { shop },
    });

    console.log("📌 Countdown fetched:", countdown);
    return { countdown };
  } catch (error) {
    console.error("❌ Error fetching countdown:", error);
    return { countdown: null, error: error.message };
  }
}

export async function createCountdown({ text, date, time, color, shop }) {
  try {
    const countdown = await prisma.countdown.create({
      data: {
        text,
        date,
        time,
        color,
        shop
      },
    });

    console.log('✅ Countdown created:', countdown);
    return { success: true, countdown };
  } catch (error) {
    console.error('❌ Error creating countdown:', error);
    return { success: false, error: error.message };
  }
}

export async function updateCountdown({ id, text, date, time, color, shop }) {
  try {
    const countdown = await prisma.countdown.update({
      where: { id },
      data: {
        text,
        date,
        time,
        color,
        shop
      },
    });

    console.log('✅ Countdown updated:', countdown);
    return { success: true, countdown };
  } catch (error) {
    console.error('❌ Error updating countdown:', error);
    return { success: false, error: error.message };
  }
} 