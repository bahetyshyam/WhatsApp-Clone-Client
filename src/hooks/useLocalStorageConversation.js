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

  const addMessageToNonActiveUserConversation = (data) => {
    const jsonValue = localStorage.getItem(prefixedKey);
    if (jsonValue === null) return;
    let valueFromLocalStorage = JSON.parse(jsonValue);
    if (
      valueFromLocalStorage[data.senderId] === null ||
      valueFromLocalStorage[data.senderId] === undefined
    ) {
      valueFromLocalStorage[data.senderId] = data;
    } else {
      valueFromLocalStorage[data.senderId] = [
        ...valueFromLocalStorage[data.senderId],
        data,
      ];
    }
    localStorage.setItem(prefixedKey, JSON.stringify(valueFromLocalStorage));
  };

  return [value, setValue, addMessageToNonActiveUserConversation];
}
