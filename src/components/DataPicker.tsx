'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

type DatePickerProps = {
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
};

export function DatePicker({ date, setDate }: DatePickerProps) {
  return (
    <input
      className={cn(
        'w-auto justify-start text-left font-normal bg-muted rounded-lg p-2 border border-primary',
        !date && 'text-muted-foreground'
      )}
      type="datetime-local"
      value={date.toISOString().slice(0, -8)}
      onChange={e => {
        setDate(new Date(e.target.value));
      }}
    />
  );
}

export default DatePicker;
