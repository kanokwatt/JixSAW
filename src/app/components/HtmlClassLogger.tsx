"use client";

import { useEffect } from "react";

export default function HtmlClassLogger() {
  useEffect(() => {
    try {
      // Log the html.className so we can compare server vs client
      // during hydration to diagnose the "Extra attributes from the server: class" warning.
      // This will appear in the browser console.
      // Example output: client html.className: theme-dark
      // If it's different from the server source, we have a hydration mismatch.
      // eslint-disable-next-line no-console
      console.log("client html.className:", document.documentElement.className);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn("HtmlClassLogger failed:", e);
    }
  }, []);

  return null;
}
