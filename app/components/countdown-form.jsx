import { useFetcher } from "@remix-run/react";
import { useState, useCallback, useEffect, useMemo, useRef } from "react";
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
    ColorPicker,
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
    setSelectedPeriod,
    selectedColor,
    setSelectedColor,
    countdown
  }) => {

    const fetcher = useFetcher();
    // const shopify = useAppBridge();
    const isLoading = ["loading", "submitting"].includes(fetcher.state) &&
        fetcher.formMethod === "POST";

    const [successToastActive, setSuccessToastActive] = useState(false);
    const [errorToastActive, setErrorToastActive] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [colorPickerActive, setColorPickerActive] = useState(false);
    const lastActionRef = useRef(null);

    const toggleSuccessToastActive = useCallback(() => {
        setSuccessToastActive(false);
        setToastMessage("");
    }, []);
    
    const toggleErrorToastActive = useCallback(() => setErrorToastActive((active) => !active), []);
    const toggleColorPicker = useCallback(() => setColorPickerActive((active) => !active), []);
    
    const successToastMarkup = successToastActive ? (
        <Toast content={toastMessage} onDismiss={toggleSuccessToastActive} />
    ) : null;

    const errorToastMarkup = errorToastActive ? (
        <Toast content="Please enter text for the countdown!" onDismiss={toggleErrorToastActive} error />
    ) : null;
  
    // Date & Time picker handlers
    const handleChange = useCallback((newText) => setText(newText),[setText])
    const handleHourChange = (value) => setSelectedHour(value);
    const handleMinuteChange = (value) => setSelectedMinute(value);
    const handlePeriodChange = (value) => setSelectedPeriod(value);
    const handleColorChange = useCallback(
      (color) => {
        console.log('Color change:', color);
        const { hue, saturation, brightness } = color;
        
        // Convert HSB to RGB
        const h = hue / 360;
        const s = saturation;
        const v = brightness;
        
        let r, g, b;
        
        const i = Math.floor(h * 6);
        const f = h * 6 - i;
        const p = v * (1 - s);
        const q = v * (1 - f * s);
        const t = v * (1 - (1 - f) * s);
        
        switch (i % 6) {
          case 0: r = v; g = t; b = p; break;
          case 1: r = q; g = v; b = p; break;
          case 2: r = p; g = v; b = t; break;
          case 3: r = p; g = q; b = v; break;
          case 4: r = t; g = p; b = v; break;
          case 5: r = v; g = p; b = q; break;
        }
        
        // Convert to hex
        const toHex = (n) => {
          const hex = Math.round(n * 255).toString(16);
          return hex.length === 1 ? '0' + hex : hex;
        };
        
        const hexColor = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
        setSelectedColor(hexColor);
      },
      [setSelectedColor]
    );

    const [hsbColor, setHsbColor] = useState(() => ({
      hue: 0,
      brightness: 0,
      saturation: 0,
      alpha: 1
    }));

    // Convert hex to HSB
    const hexToHsb = useCallback((hex) => {
      // Remove the hash if present
      hex = hex.replace(/^#/, '');
      
      // Parse the hex values
      const r = parseInt(hex.slice(0, 2), 16) / 255;
      const g = parseInt(hex.slice(2, 4), 16) / 255;
      const b = parseInt(hex.slice(4, 6), 16) / 255;
      
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const d = max - min;
      
      let h, s, v = max;
      
      s = max === 0 ? 0 : d / max;
      
      if (max === min) {
        h = 0;
      } else {
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }
      
      return {
        hue: h * 360,
        saturation: s,
        brightness: v,
        alpha: 1
      };
    }, []);

    const colorPickerColor = useMemo(() => {
      return hexToHsb(selectedColor || '#000000');
    }, [selectedColor, hexToHsb]);

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

    useEffect(() => {
        const formData = fetcher.formData;
        if (fetcher.data?.success && lastActionRef.current !== fetcher.data.countdown.id) {
            const isCreate = !formData?.get('id');
            setToastMessage(isCreate ? "Countdown created!" : "Countdown updated!");
            setSuccessToastActive(true);
            lastActionRef.current = fetcher.data.countdown.id;
        }
    }, [fetcher.data?.success]);

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        if (!text.trim()) {
            toggleErrorToastActive();
            return;
        }
    
        fetcher.submit(event.target);
    };

    return (
        <>
            {errorToastMarkup}
            <Card>
                <fetcher.Form method="post" onSubmit={handleSubmit}>
                <BlockStack gap="500">
                    {countdown && (
                        <input type="hidden" name="id" value={countdown.id} />
                    )}

                    <BlockStack inlineAlign="start" gap="200">
                    <Text as="h2" variant="headingMd">
                        {countdown ? "Edit Countdown" : "Create Countdown"}
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

                    <BlockStack inlineAlign="start" gap="200">
                      <Text as="h4" variant="headingMd">Choose Color</Text>
                      <Box width="240px">
                        <Popover
                          active={colorPickerActive}
                          autofocusTarget="none"
                          preferredAlignment="left"
                          preferredPosition="below"
                          onClose={toggleColorPicker}
                          activator={
                            <TextField
                              label="Countdown color"
                              value={selectedColor}
                              onFocus={toggleColorPicker}
                              autoComplete="off"
                              prefix={
                                <div
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    backgroundColor: selectedColor,
                                    borderRadius: "2px",
                                    border: "1px solid #ddd"
                                  }}
                                />
                              }
                            />
                          }
                        >
                          <Card>
                            <Box padding="200">
                              <ColorPicker 
                                onChange={(color) => {
                                  setHsbColor(color);
                                  handleColorChange(color);
                                }}
                                color={hsbColor}
                                allowAlpha={false}
                              />
                            </Box>
                          </Card>
                        </Popover>
                      </Box>
                    </BlockStack>

                    <input type="hidden" name="date" value={formattedDate} />
                    <input type="hidden" name="time" value={`${selectedHour}:${selectedMinute} ${selectedPeriod}`} />
                    <input type="hidden" name="color" value={selectedColor} />
                    
                    <BlockStack inlineAlign="start" gap="200">
                    <Button
                        loading={isLoading}
                        submit
                        variant="primary"
                    >
                        {countdown ? "Update Countdown" : "Create Countdown"}
                    </Button>
                    </BlockStack>

                </BlockStack>
                </fetcher.Form>
            </Card>
            {successToastMarkup}
        </>
    )
}