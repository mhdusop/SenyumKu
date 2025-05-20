export function dateFormat(dateInput: string | Date): string {
   const date = new Date(dateInput);
   if (isNaN(date.getTime())) return "-";

   return (
      date.toLocaleDateString("id-ID", {
         day: "2-digit",
         month: "short",
         year: "numeric",
      }) +
      ", " +
      date.toLocaleTimeString("id-ID", {
         hour: "2-digit",
         minute: "2-digit",
         hour12: false,
      })
   );
}
