import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { useFetcher, useLoaderData } from "@remix-run/react";
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
import CountdownTemplate from '../components/countdown-template.jsx';
import { json } from "@remix-run/node";

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


  // const session = await authenticate.admin(request);
  // if (!session) {
  //   throw new Response("Unauthorized", { status: 401 });
  // }

  // const shop = session.session.shop;
  // return { shop };  // Return the shop data
  return null
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

  await saveCounterToDatabase({text, dateObject, time, shop});
  
  return { success: true };
};






export default function Index() {
  // const { shop, countdown } = useLoaderData();  // Destructure shop from loader data
  const fetcher = useFetcher();
  // const shopify = useAppBridge();
  const isLoading =
    ["loading", "submitting"].includes(fetcher.state) &&
    fetcher.formMethod === "POST";

  const [text, setText] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState("12");
  const [selectedMinute, setSelectedMinute] = useState("00");
  const [selectedPeriod, setSelectedPeriod] = useState("AM");
  const [remainingTime, setRemainingTime] = useState(null); // State for countdown
  const [intervalId, setIntervalId] = useState(null); // Store the interval ID

  // Date & Time picker handlers
  const handleChange = useCallback((newText) => setText(newText),[])

  const handleHourChange = (value) => setSelectedHour(value);
  const handleMinuteChange = (value) => setSelectedMinute(value);
  const handlePeriodChange = (value) => setSelectedPeriod(value);



  const startCountdown = () => {
    // Set the target time based on selected date and time
    const targetDate = new Date(selectedDate);
    targetDate.setHours(parseInt(selectedHour) + (selectedPeriod === "PM" ? 12 : 0), parseInt(selectedMinute), 0, 0);

    if (intervalId) {
      clearInterval(intervalId); // Clear previous interval if any
    }

    const newIntervalId = setInterval(() => {
      const currentTime = new Date();
      const timeDifference = targetDate - currentTime;

      if (timeDifference <= 0) {
        clearInterval(newIntervalId);
        setRemainingTime("Time's up!");
      } else {
        const hours = Math.floor(timeDifference / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
        setRemainingTime(`${hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`);
      }
    }, 1000);

    setIntervalId(newIntervalId); // Store the interval ID
  };

  // Automatically start the countdown when the date and time are selected
  useEffect(() => {
    startCountdown();
  }, [selectedDate, selectedHour, selectedMinute, selectedPeriod]); // Trigger when the time or date changes

  

  const [visible, setVisible] = useState(false);
  
  const [popoverActive, setPopoverActive] = useState(false);
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

  

  const togglePopover = useCallback(() => setPopoverActive((active) => !active), []);
  

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
                            label={"Set the date for your countdown"}
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

                  <BlockStack inlineAlign="start" gap="200">
                    <Text as="h4" variant="headingMd">Choose Time</Text>
                    <Box width="240px">
                      <Popover
                        active={popoverActive}
                        autofocusTarget="none"
                        preferredAlignment="left"
                        fullWidth
                        preferInputActivator={false}
                        preferredPosition="below"
                        preventCloseOnChildOverlayClick
                        onClose={togglePopover}
                        activator={
                          <TextField
                            label="Set the time for your countdown"
                            value={`${selectedHour}:${selectedMinute} ${selectedPeriod}`}
                            onFocus={togglePopover}
                            onChange={() => {}} // Prevents console errors; value is controlled
                            autoComplete="off"
                          />
                        }
                      >
                        <Card>
                          <Box padding="200">
                            <InlineStack gap="200">
                              <Select label="Hour" options={hours} value={selectedHour} onChange={handleHourChange} />
                              <Select label="Minute" options={minutes} value={selectedMinute} onChange={handleMinuteChange} />
                              <Select label="AM/PM" options={periods} value={selectedPeriod} onChange={handlePeriodChange} />
                            </InlineStack>
                          </Box>
                        </Card>
                      </Popover>
                    </Box>
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

            {/* Display Countdown Template */}
            {/* <CountdownTemplate/> */}

            {remainingTime && (
            <Card title="Countdown Timer">
              <BlockStack>
                <Text variant="headingLg" as="h2" align="center">
                  {text || "Your Countdown"}
                </Text>
                <Text variant="headingMd" as="h3" align="center">
                  {remainingTime}
                </Text>
              </BlockStack>
            </Card>
          )}

            {/* <Card title="Your Countdown" sectioned>
              <BlockStack inlineAlign="center">
                <Text
                  variant="heading3xl"
                  as="h2"
                  align="center"
                >
                  {text === '' ? "Last Sale!" : text}
                </Text>
                <Text variant="bodyMd" align="center">
                  Date: date
                </Text>
                <Text variant="bodyMd" align="center">
                  Time: raz
                </Text>
              </BlockStack>
            </Card> */}



          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}