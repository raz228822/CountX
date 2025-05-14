import { 
  Card,
  Text,
  BlockStack
} from '@shopify/polaris';

const CountdownTemplate = ({
  text,
  remainingTime
}) => {
  
  return (
      <Card title="Countdown Timer">
          <BlockStack align="end">
            <Text variant="headingLg" as="h2" align="center">
              {text || "Enter text for your countdown"}
            </Text>
            <Text variant="headingMd" as="h3" align="center">
              {remainingTime}
            </Text>
          </BlockStack>
      </Card>
  );
};

export default CountdownTemplate;
