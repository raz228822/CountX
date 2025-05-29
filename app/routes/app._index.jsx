import { useCountdownTimer } from "../hooks/useCountdownTimer";
import { useCountdownFormState } from "../hooks/useCountdownFormState";
import {
  Page,
  Layout,
  BlockStack,
} from "@shopify/polaris";
import { useLoaderData } from "@remix-run/react";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import CountdownTemplate from '../components/countdown-template.jsx';
import { json } from "@remix-run/node";
import { CountdownForm } from "../components/countdown-form.jsx";
import { getCountdown, createCountdown, updateCountdown } from "../controllers/countdown.server";

export const loader = async ({ request }) => {
  const session = await authenticate.admin(request);
  if (!session) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const shop = session.session.shop;
  const result = await getCountdown(shop);
  
  return json(result);
};

export const action = async ({ request }) => {
  console.log("🔹 Action function called!");

  const session = await authenticate.admin(request);
  if (!session) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const shop = session.session.shop;
  const formData = new URLSearchParams(await request.text());
  const text = formData.get("text");
  const date = formData.get("date");
  const time = formData.get("time");
  const color = formData.get("color");
  const dateObject = new Date(date);
  const id = formData.get("id");

  const result = id 
    ? await updateCountdown({ id, text, date: dateObject, time, color, shop })
    : await createCountdown({ text, date: dateObject, time, color, shop });

  return json(result);
};

export default function Index() {
  const { countdown } = useLoaderData();
  
  const {
    text, setText,
    selectedDate, setSelectedDate,
    selectedHour, setSelectedHour,
    selectedMinute, setSelectedMinute,
    selectedPeriod, setSelectedPeriod,
    selectedColor, setSelectedColor,
  } = useCountdownFormState(countdown);
  
  const remainingTime = useCountdownTimer(
    selectedDate,
    selectedHour,
    selectedMinute,
    selectedPeriod
  );
  
  return (
    <Page>
      <TitleBar title="Countdown timer" />
      
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <CountdownForm 
              text={text}
              setText={setText}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedHour={selectedHour}
              setSelectedHour={setSelectedHour}
              selectedMinute={selectedMinute}
              setSelectedMinute={setSelectedMinute}
              selectedPeriod={selectedPeriod}
              setSelectedPeriod={setSelectedPeriod}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              countdown={countdown}
            />

            <CountdownTemplate 
              text={text} 
              remainingTime={remainingTime}
              color={selectedColor}
            />
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}