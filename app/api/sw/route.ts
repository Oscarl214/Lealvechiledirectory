import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export function GET(request: Request) {
  const url = new URL(request.url)
  const requested = url.searchParams.get("authDomain")
  const fallback = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  const authDomain = requested === url.host || requested === fallback ? requested : fallback
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  }
  if (!config.apiKey || !config.projectId || !config.messagingSenderId || !config.appId) {
    return NextResponse.json({ error: "Firebase is not configured" }, { status: 500 })
  }

  const script = `
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");
firebase.initializeApp(${JSON.stringify(config)});
const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
  const data = payload.data || {};
  const title = data.title || (payload.notification && payload.notification.title) || "K5 Garage";
  const body = data.body || (payload.notification && payload.notification.body) || "";
  return self.registration.showNotification(title, {
    body,
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    data: { url: "/garage" },
  });
});
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "/garage";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((windows) => {
      for (const windowClient of windows) {
        if (windowClient.url.includes("/garage") && "focus" in windowClient) return windowClient.focus();
      }
      return self.clients.openWindow(url);
    })
  );
});
`
  return new NextResponse(script, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Service-Worker-Allowed": "/",
    },
  })
}
