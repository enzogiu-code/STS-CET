import { subDays, addDays } from 'date-fns';

export interface Schedule {
  start: Date;
  endQueries: Date;
  convocation: Date;
  cutOff: Date;
}

export const calculateSchedule = (meetingDate: Date): Schedule => {
  // Start (Assegnazione): Data Seduta meno 15 giorni.
  const start = subDays(meetingDate, 15);

  // Fine Queries: Data di Start più 5 giorni.
  const endQueries = addDays(start, 5);

  // Convocazione: Data Seduta meno 8 giorni.
  const convocation = subDays(meetingDate, 8);

  // CUT-OFF (Critico): Deve essere tassativamente il Venerdì precedente alla seduta alle ore 14:00.
  // Logica: Se la seduta è di Mercoledì, Giovedì o Venerdì, il Cut-off è il Venerdì della settimana prima.
  // Implementation: Find the immediate previous Friday.
  
  let d = new Date(meetingDate);
  d.setDate(d.getDate() - 1); // Start looking from yesterday
  
  // 5 represents Friday in getDay() (0=Sun, 1=Mon, ..., 5=Fri, 6=Sat)
  while (d.getDay() !== 5) {
    d.setDate(d.getDate() - 1);
  }
  
  // We handle the "14:00" in the display logic/string
  const cutOff = new Date(d);
  cutOff.setHours(0, 0, 0, 0);

  return {
    start,
    endQueries,
    convocation,
    cutOff
  };
};