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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-indigo-950 dark:to-blue-950 py-12 px-4 relative overflow-hidden">
      {/* 装飾要素 */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-300 dark:bg-purple-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-indigo-300 dark:bg-indigo-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-blue-300 dark:bg-blue-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <h1 className="text-4xl font-bold text-center mb-12 gradient-text">
          勉強時間レコーダー
        </h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/3">
            <Timer onSave={handleSaveRecord} />
          </div>
          
          <div className="lg:w-2/3">
            <StudyRecords records={records} onDelete={handleDeleteRecord} />
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: scale(1) translate(0px, 0px);
          }
          33% {
            transform: scale(1.1) translate(30px, -50px);
          }
          66% {
            transform: scale(0.9) translate(-20px, 20px);
          }
          100% {
            transform: scale(1) translate(0px, 0px);
          }
        }
        .animate-blob {
          animation: blob 10s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
