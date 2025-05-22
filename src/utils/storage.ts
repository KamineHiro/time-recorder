import { StudyRecord } from '@/components/StudyRecords';

const STORAGE_KEY = 'study-time-records';

export const saveRecord = (record: Omit<StudyRecord, 'id' | 'date'>): StudyRecord => {
  const records = getRecords();
  
  const newRecord: StudyRecord = {
    ...record,
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
  };
  
  records.push(newRecord);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  
  return newRecord;
};

export const getRecords = (): StudyRecord[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  
  const storedRecords = localStorage.getItem(STORAGE_KEY);
  return storedRecords ? JSON.parse(storedRecords) : [];
};

export const deleteRecord = (id: string): void => {
  const records = getRecords();
  const updatedRecords = records.filter(record => record.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecords));
};

export const clearAllRecords = (): void => {
  localStorage.removeItem(STORAGE_KEY);
}; 