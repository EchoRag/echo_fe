self.addEventListener('push', event => {
  const options = {
    body: event.data.text(),
    icon: './echologo.png', // Replace with your icon path
  };
  event.waitUntil(
    self.registration.showNotification('Echo', options)
  );
}); 