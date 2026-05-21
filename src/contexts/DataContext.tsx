import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface BookingMatrixRecord {
  id: string;
  originArea: string;
  originCountry: string;
  polCode: string;
  pol: string;
  destinationArea: string;
  podCode: string;
  pod: string;
  delCode: string;
  delCountry: string;
  delName: string;
  service: string;
  carrier: string;
  mot: string;
  serviceName: string;
  tsPort: string;
  transitTime: number;
  ctrType: string;
  award: number;
  assignment: number;
  keyLane: string;
  keyLaneType: string;
  keyLaneCtrSize: string;
  prio: number;
}

export interface FNDRule {
  carrier: string;
  dwh: string;
  pod: string;
  fnd: string;
}

interface DataContextType {
  bookingMatrix: BookingMatrixRecord[];
  fndRules: FNDRule[];
  earlyShipmentLots: string[];
  addBookingMatrix: (records: BookingMatrixRecord[]) => void;
  clearImportedBookingMatrix: () => void;
  addFndRules: (rules: FNDRule[]) => void;
  clearImportedFndRules: () => void;
  addEarlyShipmentLots: (lots: string[]) => void;
  clearImportedEarlyShipment: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [bookingMatrix, setBookingMatrix] = useState<BookingMatrixRecord[]>([]);
  const [fndRules, setFndRules] = useState<FNDRule[]>([]);
  const [earlyShipmentLots, setEarlyShipmentLots] = useState<string[]>([]);

  const addBookingMatrix = (records: BookingMatrixRecord[]) => {
    setBookingMatrix(prev => [...prev, ...records]);
  };

  const clearImportedBookingMatrix = () => {
    setBookingMatrix([]);
  };

  const addFndRules = (rules: FNDRule[]) => {
    setFndRules(prev => [...prev, ...rules]);
  };

  const clearImportedFndRules = () => {
    setFndRules([]);
  };

  const addEarlyShipmentLots = (lots: string[]) => {
    setEarlyShipmentLots(prev => [...prev, ...lots]);
  };

  const clearImportedEarlyShipment = () => {
    setEarlyShipmentLots([]);
  };

  return (
    <DataContext.Provider value={{
      bookingMatrix,
      fndRules,
      earlyShipmentLots,
      addBookingMatrix,
      clearImportedBookingMatrix,
      addFndRules,
      clearImportedFndRules,
      addEarlyShipmentLots,
      clearImportedEarlyShipment,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}
