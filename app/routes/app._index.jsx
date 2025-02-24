import { useState, useCallback, useEffect } from "react";
import { useFetcher } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
  List,
  Link,
  InlineStack,
  TextField,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { saveCounterToDatabase } from '../api/save-counter'
export const loader = async ({ request }) => {
  await authenticate.admin(request);

  return null;
};

export const action = async ({ request }) => {
  console.log("🔹 Action function called!");

  const { admin } = await authenticate.admin(request);
  const formData = new URLSearchParams(await request.text());
  const text = formData.get("text");

  console.log("📩 Received text:", text);

  await saveCounterToDatabase(text);
  
  return { success: true };
};



export default function Index() {
  const fetcher = useFetcher();
  // const shopify = useAppBridge();
  const isLoading =
    ["loading", "submitting"].includes(fetcher.state) &&
    fetcher.formMethod === "POST";

  const [value, setValue] = useState('');
  const handleChange = useCallback((newValue) => setValue(newValue),[])

  return (
    <Page>
      <TitleBar title="Countdown timer" />
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="500">
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    Headline
                  </Text>
                  <fetcher.Form method="post">
                    <TextField
                      label="Add your timer to manage sales"
                      value={value}
                      onChange={handleChange}
                      autoComplete="off"
                      name="text"
                    />
                    <Button
                      loading={isLoading}
                      submit
                      variant="primary"
                    >
                      Create a countdown
                    </Button>
                  </fetcher.Form>
                </BlockStack>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}