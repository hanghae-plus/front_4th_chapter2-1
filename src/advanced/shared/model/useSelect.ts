import { useState, useCallback, ChangeEvent, useEffect } from "react";

export const useSelect = (initialValue = "") => {
  const [value, setValue] = useState(initialValue);

  const handleChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    setValue(event.target.value);
  }, []);

  useEffect(() => {
    if (initialValue) {
      setValue(initialValue);
    }
  }, [initialValue]);

  return {
    value,
    onChange: handleChange
  };
};
