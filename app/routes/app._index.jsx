import { useState, useCallback, useEffect, useMemo, useRef } from "react";
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
  DatePicker,
  Popover,
  Icon,
  Select,
} from "@shopify/polaris";

import {
  CalendarIcon
} from '@shopify/polaris-icons';

import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { saveCounterToDatabase } from '../api/save-counter'

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  return null;
};

export const action = async ({ request }) => {
  console.log("🔹 Action function called!");

  // const { admin } = await authenticate.admin(request);
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");
  const formData = new URLSearchParams(await request.text());
  const text = formData.get("text");
  const date = formData.get("date");
  const time = formData.get("time");

  const dateObject = new Date(date)

  console.log("📩 Received text:", text);
  console.log("🕒 Received date:", date);
  console.log("🕒 Received time:", time);

  await saveCounterToDatabase({text, dateObject, time, shop});
  
  return { success: true };
};




export default function Index() {
  const fetcher = useFetcher();
  // const shopify = useAppBridge();
  const isLoading =
    ["loading", "submitting"].includes(fetcher.state) &&
    fetcher.formMethod === "POST";

  // Text field
  const [text, setText] = useState('');
  const handleChange = useCallback((newText) => setText(newText),[])


  // Date picker
  const [visible, setVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [{ month, year }, setDate] = useState({
    month: selectedDate.getMonth(),
    year: selectedDate.getFullYear(),
  });
  const formattedDate = selectedDate.toLocaleDateString('en-CA');

  const yesterday = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date;
  }, []);

  function handleInputValueChange() {
    console.log("handleInputValueChange");
  }
  function handleOnClose({ relatedTarget }) {
    setVisible(false);
  }
  function handleMonthChange(month, year) {
    setDate({ month, year });
  }
  function handleDateSelection({ end: newSelectedDate }) {
    setSelectedDate(newSelectedDate);
    setVisible(false);
  }
  useEffect(() => {
    if (selectedDate) {
      setDate({
        month: selectedDate.getMonth(),
        year: selectedDate.getFullYear(),
      });
    }
  }, [selectedDate]);


  // Time picker
  const [selectedHour, setSelectedHour] = useState("12");
  const [selectedMinute, setSelectedMinute] = useState("00");
  const [selectedPeriod, setSelectedPeriod] = useState("AM");
  const [popoverActive, setPopoverActive] = useState(false);

  const togglePopover = useCallback(() => setPopoverActive((active) => !active), []);
  const handleHourChange = (value) => setSelectedHour(value);
  const handleMinuteChange = (value) => setSelectedMinute(value);
  const handlePeriodChange = (value) => setSelectedPeriod(value);

  const hours = Array.from({ length: 12 }, (_, i) => ({ label: `${i + 1}`, value: `${i + 1}` }));
  const minutes = Array.from({ length: 12 }, (_, i) => ({ label: i*5 < 10 ? `0${i*5}` : `${i*5}`, value: i*5 < 10 ? `0${i*5}` : `${i*5}` }));
  const periods = [
    { label: "AM", value: "AM" },
    { label: "PM", value: "PM" },
  ];

  const resetState = () => {
    setText('');
    setSelectedDate(new Date());
    setSelectedHour("12");
    setSelectedMinute("00");
    setSelectedPeriod("AM");
  };

  useEffect(() => {
    if (fetcher.data?.success) {
      resetState();  // Reset state after successful form submission
    }
  }, [fetcher.data]);  // Trigger on successful response
  

  return (
    <Page>
      <TitleBar title="Countdown timer" />
      
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <fetcher.Form method="post">
                <BlockStack gap="500">
                
                  {/* Countdown text */}
                  <BlockStack inlineAlign="start" gap="200">
                    <Text as="h2" variant="headingMd">
                      Enter Text
                    </Text>
                    <Box width="500px">
                      <TextField
                        value={text}
                        onChange={handleChange}
                        autoComplete="off"
                        name="text"
                        placeholder="Set the text you want on your countdown"
                      />
                    </Box>
                  </BlockStack>

                  <BlockStack inlineAlign="start" gap="200">
                    <Text as="h3" variant="headingMd">
                      Choose Date
                    </Text>
                    <Box width="270px">
                      <Popover
                        active={visible}
                        autofocusTarget="none"
                        preferredAlignment="left"
                        fullWidth
                        preferInputActivator={false}
                        preferredPosition="below"
                        preventCloseOnChildOverlayClick
                        onClose={handleOnClose}
                        activator={
                          <TextField
                            role="combobox"
                            label={"Set the final date for your countdown"}
                            prefix={<Icon source={CalendarIcon} />}
                            value={formattedDate}
                            onFocus={() => setVisible(true)}
                            onChange={handleInputValueChange}
                            autoComplete="off"
                          />
                        }
                      >
                        <Card>
                          <DatePicker
                            month={month}
                            year={year}
                            selected={selectedDate}
                            onMonthChange={handleMonthChange}
                            onChange={handleDateSelection}
                            disableDatesBefore={yesterday}
                          />
                        </Card>
                      </Popover>
                    </Box>
                  </BlockStack>

                  <BlockStack gap="200">
                    <Text as="h4" variant="headingMd">
                      Choose Time
                    </Text>
                    <Popover active={popoverActive} activator={<Button onClick={togglePopover}>Pick time</Button>} onClose={togglePopover}>
                      <Box padding="200">
                        <InlineStack gap="200">
                          <Select label="Hour" options={hours} value={selectedHour} onChange={handleHourChange} />
                          <Select label="Minute" options={minutes} value={selectedMinute} onChange={handleMinuteChange} />
                          <Select label="AM/PM" options={periods} value={selectedPeriod} onChange={handlePeriodChange} />
                        </InlineStack>
                      </Box>
                    </Popover>
                  </BlockStack>

                  {/* Hidden input to store selected date and time */}
                  <input type="hidden" name="date" value={formattedDate} />
                  <input type="hidden" name="time" value={`${selectedHour}:${selectedMinute} ${selectedPeriod}`} />
                  
                  <BlockStack inlineAlign="center" gap="200">
                    <Button
                      loading={isLoading}
                      submit
                      variant="primary"
                    >
                      Create a Countdown
                    </Button>
                  </BlockStack>

                </BlockStack>
              </fetcher.Form>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}