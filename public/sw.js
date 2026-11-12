self.addEventListener("push", (event) => {
  let data = { title: "K5 Garage", body: "New alert" }
  try {
    data = { ...data, ...event.data.json() }
  } catch {
    // A push with no JSON still needs a visible notification on iPhone.
  }
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      data: { url: "/garage" },
    })
  )
})

self.addEventListener("notificationclick", (event) => {
  event.notification.close()
  const url = event.notification.data?.url || "/garage"
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((windows) => {
      for (const window of windows) {
        if (window.url.includes("/garage") && "focus" in window) return window.focus()
      }
      return self.clients.openWindow(url)
    })
  )
})
