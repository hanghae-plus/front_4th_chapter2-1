import { useState, useCallback, ChangeEvent } from "react";

export const useSelect = (initialValue = "") => {
  const [value, setValue] = useState(initialValue);

  const handleChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    setValue(event.target.value);
  }, []);

  return {
    value,
    setValue,
    onChange: handleChange
  };
};
