import { useFetcher } from "@remix-run/react";
import { useState, useCallback, useEffect, useMemo } from "react";
import { Toast } from "@shopify/polaris";

import {
    Text,
    Card,
    Button,
    BlockStack,
    Box,
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

export const CountdownForm = ({
    text,
    setText,
    selectedDate,
    setSelectedDate,
    selectedHour,
    setSelectedHour,
    selectedMinute,
    setSelectedMinute,
    selectedPeriod,
    setSelectedPeriod
  }) => {

    const fetcher = useFetcher();
    // const shopify = useAppBridge();
    const isLoading = ["loading", "submitting"].includes(fetcher.state) &&
        fetcher.formMethod === "POST";

    const [successToastActive, setSuccessToastActive] = useState(false);
    const [errorToastActive, setErrorToastActive] = useState(false);

    const toggleSuccessToastActive = useCallback(() => setSuccessToastActive((active) => !active), []);
    const toggleErrorToastActive = useCallback(() => setErrorToastActive((active) => !active), []);
    
    const successToastMarkup = successToastActive ? (
        <Toast content="Countdown created!" onDismiss={toggleSuccessToastActive} />
      ) : null;

    const errorToastMarkup = errorToastActive ? (
    <Toast content="Please enter text for the countdown!" onDismiss={toggleErrorToastActive} error />
    ) : null;
  
    // Date & Time picker handlers
    const handleChange = useCallback((newText) => setText(newText),[])
    const handleHourChange = (value) => setSelectedHour(value);
    const handleMinuteChange = (value) => setSelectedMinute(value);
    const handlePeriodChange = (value) => setSelectedPeriod(value);


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
        setSelectedDate(() => {
        const now = new Date();
        now.setDate(now.getDate() + 1); // Move to tomorrow
        return now;
        });
        setSelectedHour("12");
        setSelectedMinute("00");
        setSelectedPeriod("AM");
    };

    useEffect(() => {
        if (fetcher.data?.success) {
            resetState();  // Reset state after successful form submission
            setSuccessToastActive(true);
        }
    }, [fetcher.data]);  // Trigger on successful response

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent the default form submission
    
        if (!text.trim()) {
          toggleErrorToastActive(); // Show error toast if no text entered
          return;
        }
    
        // Proceed with the form submission if text is valid
        fetcher.submit(event.target);
      };

    return (
        <>
            {errorToastMarkup}
            <Card>
                <fetcher.Form method="post" onSubmit={handleSubmit}>
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
                    
                    <BlockStack inlineAlign="start" gap="200">
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
            {successToastMarkup}
        </>
    )
}