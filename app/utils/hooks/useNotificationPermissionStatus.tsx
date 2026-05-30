"use client";

import { useEffect, useState } from "react";

export default function useNotificationPermissionStatus() {
  const [permission, setPermission] =
    useState<NotificationPermission>("default");

  useEffect(() => {
    // SSR対策
    if (typeof window === "undefined") {
      return;
    }

    // Notification API未対応
    if (typeof Notification === "undefined") {
      return;
    }

    const updatePermission = () => {
      setPermission(Notification.permission);
    };

    // 初期値反映
    updatePermission();

    let permissionStatus: PermissionStatus | null = null;

    // Safari対策
    if ("permissions" in navigator) {
      navigator.permissions
        .query({ name: "notifications" as PermissionName })
        .then((status) => {
          permissionStatus = status;
          status.onchange = updatePermission;
        })
        .catch(() => {
          // Safariでは未対応な場合がある
        });
    }

    return () => {
      if (permissionStatus) {
        permissionStatus.onchange = null;
      }
    };
  }, []);

  return permission;
}