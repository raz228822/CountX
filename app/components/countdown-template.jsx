import { 
  Card,
  Text,
  BlockStack,
  Box,
  InlineStack,
  useBreakpoints
} from '@shopify/polaris';
import { useState } from 'react';
import './countdown-template.css';

const TimeUnit = ({ value, label, color }) => (
  <div className="time-unit">
    <div className="number" style={{ color }}>{value}</div>
    <div className="label" style={{ color: color + "99" }}>{label}</div>
  </div>
);

const CountdownTemplate = ({
  text,
  remainingTime,
  color = "#000000"
}) => {
  if (!remainingTime) return null;

  const { days, hours, minutes, seconds, isExpired } = remainingTime;
  const breakpoints = useBreakpoints();
  
  return (
    <Card>
      <div className="countdown-widget">
        <div className="countdown-text-wrapper">
          <div style={{ color }}>
            <Text 
              variant={breakpoints.smDown ? "heading3xl" : "headingXl"} 
              as="h2"
            >
              {text || "Enter text for your countdown"}
            </Text>
          </div>
        </div>
        
        {isExpired ? (
          <div style={{ color }}>
            <Text variant="headingMd" as="h3" alignment="center">
              Expired!
            </Text>
          </div>
        ) : (
          <div className="countdown-display">
            <TimeUnit value={days} label="days" color={color} />
            <span className="colon" style={{ color }}>{":"}</span>
            <TimeUnit value={hours} label="hours" color={color} />
            <span className="colon" style={{ color }}>{":"}</span>
            <TimeUnit value={minutes} label="minutes" color={color} />
            <span className="colon" style={{ color }}>{":"}</span>
            <TimeUnit value={seconds} label="seconds" color={color} />
          </div>
        )}
      </div>
    </Card>
  );
};

export default CountdownTemplate;
