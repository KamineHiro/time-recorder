'use client';

import { useState, useEffect } from 'react';
import Timer from '@/components/Timer';
import StudyRecords, { StudyRecord } from '@/components/StudyRecords';
import { saveRecord, getRecords, deleteRecord } from '@/utils/storage';

export default function Home() {
  const [records, setRecords] = useState<StudyRecord[]>([]);
  
  useEffect(() => {
    // クライアントサイドのみで実行
    setRecords(getRecords());
  }, []);
  
  const handleSaveRecord = (duration: number, subject: string) => {
    const newRecord = saveRecord({ duration, subject });
    setRecords(prev => [...prev, newRecord]);
  };
  
  const handleDeleteRecord = (id: string) => {
    deleteRecord(id);
    setRecords(prev => prev.filter(record => record.id !== id));
  };
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
          勉強時間レコーダー
        </h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <Timer onSave={handleSaveRecord} />
          </div>
          
          <div className="md:w-2/3">
            <StudyRecords records={records} onDelete={handleDeleteRecord} />
          </div>
        </div>
      </div>
    </div>
  );
}
