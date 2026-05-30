"use client";
import { useEffect, useState } from "react";
import { getToken, isSupported } from "firebase/messaging";
import { messaging } from "@/app/utils/firebase";
import useNotificationPermission from "@/app/utils/hooks/useNotificationPermissionStatus";

const useFCMToken = () => {
  const permission = useNotificationPermission();
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  useEffect(() => {
    const retrieveToken = async () => {
      if (typeof window !== "undefined" && "serviceWorker" in navigator) {
        if (permission === "granted") {
          const isFCMSupported = await isSupported();
          if (!isFCMSupported) return;

          try {
            const isGitHubPages = window.location.hostname.includes('github.io');
            const swPath = isGitHubPages ? '/accum-sim/firebase-messaging-sw.js' : '/firebase-messaging-sw.js';
            const swScope = isGitHubPages ? '/accum-sim/' : '/';

            const registration = await navigator.serviceWorker.register(swPath, {
              scope: swScope,
            });

            const token = await getToken(messaging(), {
              vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
              serviceWorkerRegistration: registration,
            });

            setFcmToken(token);
          } catch (error) {
            console.error("FCM トークンの取得またはSWの登録に失敗しました:", error);
          }
        }
      }
    };
    retrieveToken();
  }, [permission]);

  return fcmToken;
};

export default useFCMToken;