import { useState, useEffect } from 'react';
import { Card, Text, Button, Layout, Page, BlockStack } from '@shopify/polaris';
import { getCountdownDetails } from '../api/get-countdown'; // Import your API function

const CountdownTemplate = () => {
  console.log("CountdownTemplate component rendering");
  useEffect(() => {
    console.log("useEffect triggered");
  }, []);
  
  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Card title="Your Countdown" sectioned>
              <BlockStack vertical spacing="tight">
                <Text variant="headingMd" as="h2">
                  text
                </Text>
                <Text variant="bodyMd">
                  Date: date
                </Text>
                <Text variant="bodyMd">
                  Time: raz
                </Text>
                <Button onClick={() => alert('Countdown triggered')}>
                  Trigger Countdown
                </Button>
              </BlockStack>
            </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default CountdownTemplate;
