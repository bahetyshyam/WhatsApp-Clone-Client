import { useCallback, useEffect, useState } from "react";

const PREFIX = "WhatsAppClone-Conversations";

export default function useLocalStorageConversation(activeUser) {
  const prefixedKey = PREFIX;
  const generateInitialValue = useCallback(() => {
    const jsonValue = localStorage.getItem(prefixedKey);
    if (jsonValue === null) {
      return [];
    } else if (
      JSON.parse(jsonValue)[activeUser] === null ||
      JSON.parse(jsonValue)[activeUser] === undefined
    )
      return [];
    else {
      const constParsedValue = JSON.parse(jsonValue);
      return constParsedValue[activeUser];
    }
  }, [activeUser, prefixedKey]);
  const [value, setValue] = useState(() => generateInitialValue());

  useEffect(() => {
    setValue(generateInitialValue());
  }, [activeUser, generateInitialValue]);

  useEffect(() => {
    let storageValue = localStorage.getItem(prefixedKey);
    if (storageValue === null) {
      localStorage.setItem(prefixedKey, JSON.stringify({}));
    }
    storageValue = JSON.parse(localStorage.getItem(prefixedKey));
    storageValue[activeUser] = value;
    localStorage.setItem(prefixedKey, JSON.stringify(storageValue));
  }, [prefixedKey, value, activeUser]);

  return [value, setValue];
}
