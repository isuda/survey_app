import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Slider } from '@mui/material';
import { Question } from '../../api/types';

interface ScaleQuestionProps {
  question: Question;
  onChange: (value: number) => void;
  value?: number;
  error?: string | null;
}

const SurveyScaleQuestion: React.FC<ScaleQuestionProps> = ({ question, onChange, value: initialValue, error }) => {
  // Calculate middle value, floored
  const defaultValue = Math.floor((question.max! + question.min!) / 2);
  const [value, setValue] = useState<number>(initialValue ?? defaultValue);
  const sliderRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setValue(initialValue ?? defaultValue);
    // Focus the slider when the component mounts or question changes
    sliderRef.current?.querySelector("input")?.focus()
  }, [question, initialValue, defaultValue]);

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    const numValue = newValue as number;
    setValue(numValue);
    onChange(numValue);
  };

  return (
    <Box mb={3}>
      <Typography variant="h6" gutterBottom>{question.title}</Typography>
      <Typography variant="h2" align="center" sx={{ my: 3 }}>
        {value}
      </Typography>
      <Box>
        <Slider
          ref={sliderRef}
          value={value}
          onChange={handleSliderChange}
          min={question.min}
          max={question.max}
          step={1}
          marks
          valueLabelDisplay="off"
          aria-label={question.title}
        />
        {error && (
          <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
            {error}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default SurveyScaleQuestion;
