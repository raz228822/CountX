import { useCountdownTimer } from "../hooks/useCountdownTimer";
import { useCountdownFormState } from "../hooks/useCountdownFormState";
import {
  Page,
  Layout,
  BlockStack,
} from "@shopify/polaris";


import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import CountdownTemplate from '../components/countdown-template.jsx';
import { json } from "@remix-run/node";
import { CountdownForm } from "../components/countdown-form.jsx";

export const loader = async ({ request }) => {
  const session = await authenticate.admin(request);
  if (!session) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const shop = session.session.shop;

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
  const dateObject = new Date(date)

  // Used as a controller to call the server logic 
  const { saveCounterToDatabase } = await import("../api/save-counter.server.js");

  await saveCounterToDatabase({ text, dateObject, time, shop });

  // await saveCounterToDatabase({text, dateObject, time, shop});
  
  return { success: true };
};


export default function Index() {
  // const { shop, countdown } = useLoaderData();  // Destructure shop from loader data
  
  // const shopify = useAppBridge();
  


  // const [metafield, setMetafield] = useState("Raz")
  // const handleChangeMetafield = useCallback((newMetafield) => setMetafield(newMetafield),[])

  const {
    text, setText,
    selectedDate, setSelectedDate,
    selectedHour, setSelectedHour,
    selectedMinute, setSelectedMinute,
    selectedPeriod, setSelectedPeriod,
  } = useCountdownFormState();
  
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
            />

            <CountdownTemplate 
              text={text} 
              remainingTime={remainingTime} 
            />

          {/* <Card>
            <Text>Metafield value</Text>
            <TextField 
              value={metafield}
              onChange={handleChangeMetafield}
              >
            </TextField>
          </Card> */}

          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}