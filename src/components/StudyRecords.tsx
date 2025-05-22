'use client';

import { useState } from 'react';

export type StudyRecord = {
  id: string;
  subject: string;
  duration: number;
  date: string;
};

type StudyRecordsProps = {
  records: StudyRecord[];
  onDelete: (id: string) => void;
};

const StudyRecords = ({ records, onDelete }: StudyRecordsProps) => {
  const [filter, setFilter] = useState<string>('');

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredRecords = records.filter(
    (record) =>
      record.subject.toLowerCase().includes(filter.toLowerCase())
  );

  // 合計時間を計算
  const totalTime = filteredRecords.reduce((acc, record) => acc + record.duration, 0);
  
  // 科目ごとの合計時間を計算
  const subjectTotals = filteredRecords.reduce((acc, record) => {
    if (!acc[record.subject]) {
      acc[record.subject] = 0;
    }
    acc[record.subject] += record.duration;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        勉強記録
      </h2>
      
      <div className="mb-4">
        <label htmlFor="filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          科目で絞り込み
        </label>
        <input
          type="text"
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="科目名を入力して絞り込み"
        />
      </div>
      
      <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
        <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">統計</h3>
        <p className="text-gray-700 dark:text-gray-300">合計勉強時間: <span className="font-bold">{formatTime(totalTime)}</span></p>
        
        <div className="mt-2">
          <h4 className="text-md font-semibold mb-1 text-gray-800 dark:text-white">科目別時間:</h4>
          <ul className="space-y-1">
            {Object.entries(subjectTotals).map(([subject, time]) => (
              <li key={subject} className="text-gray-700 dark:text-gray-300">
                {subject}: <span className="font-mono">{formatTime(time)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {filteredRecords.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">日時</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">科目</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">勉強時間</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {formatDate(record.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {record.subject}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 font-mono">
                    {formatTime(record.duration)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => onDelete(record.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      削除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-center py-4">
          {filter ? '該当する記録がありません' : '記録がありません'}
        </p>
      )}
    </div>
  );
};

export default StudyRecords; 