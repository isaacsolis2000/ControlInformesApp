import { FormControl, InputLabel, Select, MenuItem, type SelectChangeEvent } from '@mui/material';

interface Option {
  value: string | number;
  label: string;
}

interface CustomSelectProps {
  label: string;
  value: string | number;
  options: Option[];
  onChange: (value: string | number) => void;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
}

export default function CustomSelect({
  label,
  value,
  options,
  onChange,
  fullWidth = true,
  size = 'small',
}: CustomSelectProps) {
  const handleChange = (e: SelectChangeEvent<string | number>) => {
    onChange(e.target.value);
  };

  return (
    <FormControl fullWidth={fullWidth} size={size}>
      <InputLabel>{label}</InputLabel>
      <Select value={value} label={label} onChange={handleChange}>
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
