import React from "react";


export const stringToBoolean = (str: string | null): boolean => {
  if (!str) {
    return false;
  }
  return str.toLowerCase() === "true";
};

export const booleanToString = (val: boolean): string => {
  return val ? "true" : "false";
};

export const textExtract = (content: string): string => {
  const modifiedContent = content.replace(/[\s\n]+/g, " ");

  if (modifiedContent.length > 34) {
    return modifiedContent.substring(0, 34) + "...";
  } else {
    return modifiedContent;
  }
};

export const handleKeyDown = (e: React.KeyboardEvent, key: string, callback: () => void): void => {
  if (e.key === key) {
    callback();
  }
};



