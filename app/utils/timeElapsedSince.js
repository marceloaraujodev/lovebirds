export default function timeElapsedSince(date, time) {
  // Combine the date and time into an ISO format date string
  const combinedDateTimeString = `${date}T${time}:00`; // Adding seconds
  const startDate = new Date(combinedDateTimeString);
  const now = new Date();

  // Calculate total seconds elapsed
  let totalSeconds = Math.floor((now - startDate) / 1000);
  
  // Calculate years, months, days, hours, minutes, and seconds
  const years = Math.floor(totalSeconds / (365.25 * 24 * 60 * 60));
  totalSeconds %= (365.25 * 24 * 60 * 60);
  
  const months = Math.floor(totalSeconds / (30 * 24 * 60 * 60));
  totalSeconds %= (30 * 24 * 60 * 60);
  
  const days = Math.floor(totalSeconds / (24 * 60 * 60));
  totalSeconds %= (24 * 60 * 60);
  
  const hours = Math.floor(totalSeconds / (60 * 60));
  totalSeconds %= (60 * 60);
  
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return { years, months, days, hours, minutes, seconds };
}