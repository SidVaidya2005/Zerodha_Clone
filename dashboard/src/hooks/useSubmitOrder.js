import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";

import GeneralContext from "../context/GeneralContext";
import { BACKEND_URL } from "../config";

const CLOSE_DELAY_MS = 900;

export function useSubmitOrder() {
  const generalContext = useContext(GeneralContext);
  const [toast, setToast] = useState({
    visible: false,
    type: "success",
    message: "",
  });
  const closeTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const submit = async ({ name, qty, price, mode }) => {
    try {
      await axios.post(`${BACKEND_URL}/newOrder`, { name, qty, price, mode });

      setToast({
        visible: true,
        type: "success",
        message: `${mode} order placed!`,
      });

      closeTimerRef.current = setTimeout(() => {
        generalContext.closeBuyWindow();
      }, CLOSE_DELAY_MS);
    } catch (error) {
      console.error("Failed to place order", error);
      setToast({
        visible: true,
        type: "error",
        message: "Order failed. Please retry.",
      });
    }
  };

  return { submit, toast };
}
