import React, { useState, useRef } from 'react';
import { Calendar, FileText, AlertTriangle, Printer, ShieldAlert, Info, Clock, CheckCircle2 } from 'lucide-react';
import { calculateSchedule, Schedule } from './utils/calculator';
import { DateResultCard } from './components/DateResultCard';
import { InfoCard } from './components/InfoCard';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

export default function App() {
  const [meetingDate, setMeetingDate] = useState<string>('');
  const [schedule, setSchedule] = useState<Schedule | null>(null);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateStr = e.target.value;
    setMeetingDate(dateStr);
    
    if (dateStr) {
      const date = new Date(dateStr);
      const calculated = calculateSchedule(date);
      setSchedule(calculated);
    } else {
      setSchedule(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen pb-12 print:pb-0 print:bg-white">
      {/* Header */}
      <header className="bg-cet-primary text-white shadow-lg print:bg-white print:text-cet-primary print:border-b-2 print:border-cet-primary print:shadow-none">
        <div className="max-w-6xl mx-auto px-4 py-6 md:flex md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-cet-primary font-bold text-xl shadow-inner print:border-2 print:border-cet-primary">
              CET
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Comitato Etico Territoriale</h1>
              <p className="text-cet-secondary text-blue-200 font-medium print:text-slate-600">Lombardia 1 &mdash; Dashboard Operativa</p>
            </div>
          </div>
          <div className="hidden md:block print:hidden">
            <p className="text-xs text-blue-200 text-right">Sistema di Calcolo Scadenze<br />Ver. 2.0.1 Stand-alone</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Controls Section - Hidden on Print */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8 no-print flex flex-col md:flex-row md:items-end gap-6">
          <div className="flex-1">
            <label htmlFor="meetingDate" className="block text-sm font-semibold text-slate-700 mb-2">
              Seleziona Data Seduta
            </label>
            <div className="relative">
              <input
                type="date"
                id="meetingDate"
                value={meetingDate}
                onChange={handleDateChange}
                className="w-full text-lg p-3 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cet-secondary focus:border-cet-secondary outline-none transition-all shadow-inner"
              />
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Inserisci la data in cui il comitato si riunisce per generare la timeline.
            </p>
          </div>
          
          <div>
            <button
              onClick={handlePrint}
              disabled={!schedule}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors shadow-sm
                ${schedule 
                  ? 'bg-cet-primary text-white hover:bg-cet-secondary cursor-pointer' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
              `}
            >
              <Printer className="w-4 h-4" />
              Stampa / Salva PDF
            </button>
          </div>
        </div>

        {/* Print Header Only */}
        <div className="hidden print:block mb-8">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-300 pb-2 mb-4">
            Prospetto Scadenze Seduta del {schedule && format(new Date(meetingDate), 'dd/MM/yyyy', { locale: it })}
          </h2>
        </div>

        {/* Results Grid */}
        {schedule ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-2 print:gap-6">
              <DateResultCard
                code="T-15"
                label="Start / Assegnazione"
                date={schedule.start}
                icon={CheckCircle2}
                description="Ricevi la notifica mail automatica. Il workflow è attivo."
              />
              
              <DateResultCard
                code="Giorni 1-5"
                label="Fine Queries"
                date={schedule.endQueries}
                icon={Info}
                description="Ultimo giorno per chiedere integrazioni al Promotore (pre-seduta)."
              />

              <DateResultCard
                code="T-8"
                label="Convocazione"
                date={schedule.convocation}
                icon={FileText}
                description="Ricevi OdG provvisorio. Studio in elenco, in attesa di relazione."
              />

              <DateResultCard
                code="T-5"
                label="CUT-OFF TASSATIVO"
                date={schedule.cutOff}
                timeOverride="ore 14:00"
                icon={AlertTriangle}
                isCritical={true}
                description="Termine ultimo upload relazione PA/PD. Oltre questa data lo studio slitta."
              />
            </div>

            {/* Info Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:block print:space-y-6">
              
              <div className="space-y-6">
                <InfoCard title="1. IL TUO CALENDARIO (REGOLA '15-5-10')" icon={Calendar}>
                  <ul className="list-disc pl-4 space-y-3">
                    <li>
                      <strong>T-15: Assegnazione:</strong> Ricevi la notifica mail automatica. Il workflow è attivo.
                    </li>
                    <li>
                      <strong>Giorni 1-5: Fase "Queries":</strong> Hai 5 giorni solari per chiedere integrazioni al Promotore.
                      <span className="block mt-1 text-xs font-bold text-cet-secondary">
                        ⚠ Alert: Deadline: Oltre il 5° giorno non è più possibile chiedere integrazioni pre-seduta.
                      </span>
                    </li>
                    <li>
                      <strong>T-8: Convocazione:</strong> Ricevi l'OdG provvisorio. Il tuo studio è in elenco, ma verrà discusso solo se caricherai la relazione in tempo.
                    </li>
                    <li>
                      <strong>T-5: CUT-OFF (Venerdì ore 14:00):</strong> Termine tassativo per l'upload della relazione PA/PD.
                      <span className="block mt-1 text-xs font-bold text-cet-red">
                        ⚠ Alert Rosso: Se manchi questa scadenza, lo studio slitta al mese successivo e l'inadempienza viene tracciata.
                      </span>
                    </li>
                  </ul>
                </InfoCard>

                <InfoCard title="PRIORITÀ NORMATIVA (STUDI CTIS - EUROPA)" icon={ShieldAlert} variant="alert">
                  <p className="font-medium">
                    Per studi UE 536/2014, le scadenze europee (RFI AIFA) hanno precedenza assoluta sulle tempistiche interne.
                  </p>
                  <p className="mt-2 text-sm">
                    La priorità assoluta è rispondere entro la data indicata dalla STS.
                  </p>
                </InfoCard>
              </div>

              <div className="space-y-6">
                 <InfoCard title="2. ISTRUZIONI OPERATIVE" icon={FileText}>
                  <p className="font-semibold mb-2">Triangolazione: Vietato contattare il Promotore via mail. Usa sempre il gestionale.</p>
                  <ol className="list-decimal pl-4 space-y-2">
                    <li>
                      <span className="font-semibold">Dubbi?</span> Scrivi in "Annotazioni Componenti CET".
                    </li>
                    <li>
                      <span className="font-semibold">Upload?</span> Folder "Relazioni Componenti/Segreterie CET".
                    </li>
                    <li>
                      <span className="font-semibold">Classificazione:</span> PA (Approvazione), PD (Discussione).
                    </li>
                  </ol>
                </InfoCard>

                <div className="bg-slate-100 p-4 rounded-lg border border-slate-200 text-xs text-slate-500 card-print">
                  <div className="flex items-center gap-2 mb-2 font-semibold text-cet-primary">
                    <Clock className="w-4 h-4" />
                    <span>Nota sull'Algoritmo Cut-off</span>
                  </div>
                  <p>
                    Il sistema calcola automaticamente il Cut-off identificando il Venerdì immediatamente precedente la data della seduta. 
                    Tale termine scade alle ore 14:00.
                  </p>
                </div>
              </div>

            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">Nessuna data selezionata</h3>
            <p className="text-slate-500 max-w-sm mx-auto mt-2">
              Seleziona la data della prossima seduta dal calendario in alto per visualizzare la timeline operativa.
            </p>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 mt-auto print:hidden">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-slate-400">
          <p>&copy; {new Date().getFullYear()} CET Lombardia 1. Uso interno.</p>
        </div>
      </footer>
    </div>
  );
}