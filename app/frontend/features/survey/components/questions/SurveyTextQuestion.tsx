import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, TextField } from '@mui/material';
import { Question } from '../../api/types';

interface TextQuestionProps {
  question: Question;
  onChange: (value: string) => void;
  value?: string;
  error?: string | null;
}

const SurveyTextQuestion: React.FC<TextQuestionProps> = ({ question, onChange, value: initialValue, error }) => {
  const [value, setValue] = useState(initialValue || '');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue(initialValue || '');
    // Focus the input when the component mounts or question changes
    inputRef.current?.focus()
  }, [question, initialValue]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value;
    setValue(text);
    onChange(text);
  };

  return (
    <Box mb={3}>
      <Typography variant="h6" gutterBottom>{question.title}</Typography>
      <TextField
        multiline
        fullWidth
        inputRef={inputRef}
        variant="outlined"
        value={value}
        onChange={handleChange}
        slotProps={{ htmlInput: { maxLength: question.limit } }}
        error={!!error}
        helperText={error || `${value.length}/${question.limit}`}
      />
    </Box>
  );
};

export default SurveyTextQuestion;
