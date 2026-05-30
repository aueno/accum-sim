import { useEffect, useState } from "react";
import useFCMToken from "@/app/utils/hooks/useFCMToken";
import { messaging } from "@/app/utils/firebase";
import { MessagePayload, onMessage } from "firebase/messaging";

const useFCM = () => {
  const fcmToken = useFCMToken();
  const [messages, setMessages] = useState<MessagePayload[]>([]);
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const fcmMessaging = messaging();
      const unsubscribe = onMessage(fcmMessaging, (payload) => {
        setMessages((messages) => [...messages, payload]);
      });
      return () => unsubscribe();
    }
  }, [fcmToken]);
  return { fcmToken, messages };
};

export default useFCM;
