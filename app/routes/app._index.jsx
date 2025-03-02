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

  // // Date picker
  // const today = new Date();
  // const [{month, year}, setDate] = useState({
  //   month: today.getMonth(), 
  //   year: today.getFullYear(),
  // });

  // // Polaris DatePicker always returns an object { start, end },
  // // even for single-date selections(in single they will both be the same date).
  // const [selectedDate, setSelectedDate] = useState(new Date());



  const yesterday = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date;
  }, []);

  // const handleMonthChange = useCallback(
  //   (month, year) => setDate({month, year}),
  //   [],
  // );


  // Date picker
  const [visible, setVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [{ month, year }, setDate] = useState({
    month: selectedDate.getMonth(),
    year: selectedDate.getFullYear(),
  });
  const formattedValue = selectedDate.toISOString().slice(0, 10);
  const datePickerRef = useRef(null);
  function isNodeWithinPopover(node) {
    return datePickerRef?.current
      ? nodeContainsDescendant(datePickerRef.current, node)
      : false;
  }
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
  const minutes = Array.from({ length: 60 }, (_, i) => ({ label: i < 10 ? `0${i}` : `${i}`, value: i < 10 ? `0${i}` : `${i}` }));
  const periods = [
    { label: "AM", value: "AM" },
    { label: "PM", value: "PM" },
  ];
  

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
                        value={value}
                        onChange={handleChange}
                        autoComplete="off"
                        name="text"
                        placeholder="Set the text you want on your countdown"
                      />
                    </Box>
                  </BlockStack>

                  {/* Date picker */}
                  {/* <BlockStack gap="200">
                      <Text as="h3" variant="headingMd">
                        Choose end date
                      </Text>
                      <Text as="h4" variant="bodyMd">
                        Set the final date for your countdown
                      </Text>
                        <DatePicker
                          month={month}
                          year={year}
                          onChange={(date) => setSelectedDate(date)}
                          onMonthChange={handleMonthChange}
                          selected={selectedDate}
                          disableDatesBefore={yesterday}
                        /> 
                  </BlockStack> */}

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
                            value={formattedValue}
                            onFocus={() => setVisible(true)}
                            onChange={handleInputValueChange}
                            autoComplete="off"
                          />
                        }
                      >
                        <Card ref={datePickerRef}>
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

                  {/* Countdown time
                  <BlockStack inlineAlign="start" gap="200">
                    <Text as="h4" variant="headingMd">
                      Enter time
                    </Text>
                    <Box width="500px">
                      <TextField
                        label="Set the time for your countdown"
                        value={timeInput}
                        onChange={handleTimeChange}
                        placeholder="e.g. 10:30 AM, 14:00, midnight"
                        autoComplete="off"
                      />
                    </Box>
                  </BlockStack> */}

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