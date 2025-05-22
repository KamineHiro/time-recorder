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

  // 科目ごとの割合を計算（円グラフ用）
  const subjectPercentages = Object.entries(subjectTotals).map(([subject, time]) => ({
    subject,
    time,
    percentage: totalTime > 0 ? (time / totalTime) * 100 : 0,
  }));

  // ランダムな色を生成する関数
  const generatePastelColor = (index: number) => {
    const hue = (index * 137) % 360; // ゴールデンアングルで色相を分散
    return `hsl(${hue}, 70%, 80%)`;
  };

  return (
    <div className="w-full p-6 rounded-2xl overflow-hidden relative glass-effect neon-shadow border border-indigo-100 dark:border-indigo-900/30">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 z-0"></div>
      <div className="relative z-10">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 gradient-text">
          勉強記録
        </h2>
        
        <div className="mb-6">
          <label htmlFor="filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            科目で絞り込み
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              id="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 dark:text-white transition-all duration-200"
              placeholder="科目名を入力して絞り込み"
            />
          </div>
        </div>
        
        <div className="mb-8 p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white gradient-text">学習統計</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-700 dark:text-gray-300 mb-2">合計勉強時間</p>
              <div className="text-3xl font-bold font-mono text-gray-900 dark:text-white">
                {formatTime(totalTime)}
              </div>
              
              <div className="mt-6">
                <h4 className="text-md font-semibold mb-3 text-gray-800 dark:text-white">科目別時間:</h4>
                <ul className="space-y-2">
                  {Object.entries(subjectTotals).map(([subject, time], index) => (
                    <li key={subject} className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: generatePastelColor(index) }}
                      ></div>
                      <div className="flex-1 text-gray-700 dark:text-gray-300">{subject}</div>
                      <div className="font-mono text-gray-900 dark:text-white">{formatTime(time)}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              {totalTime > 0 ? (
                <div className="relative w-48 h-48">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {subjectPercentages.map((item, index) => {
                      // 円グラフのセグメントを計算
                      let cumulativePercentage = subjectPercentages
                        .slice(0, index)
                        .reduce((acc, curr) => acc + curr.percentage, 0);
                      
                      const startAngle = (cumulativePercentage / 100) * 360;
                      const endAngle = ((cumulativePercentage + item.percentage) / 100) * 360;
                      
                      // SVGの円弧を描画するためのパス
                      const x1 = 50 + 40 * Math.cos((startAngle - 90) * (Math.PI / 180));
                      const y1 = 50 + 40 * Math.sin((startAngle - 90) * (Math.PI / 180));
                      const x2 = 50 + 40 * Math.cos((endAngle - 90) * (Math.PI / 180));
                      const y2 = 50 + 40 * Math.sin((endAngle - 90) * (Math.PI / 180));
                      
                      // 大きな弧かどうか
                      const largeArcFlag = item.percentage > 50 ? 1 : 0;
                      
                      return (
                        <path
                          key={index}
                          d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                          fill={generatePastelColor(index)}
                          stroke="#fff"
                          strokeWidth="1"
                        />
                      );
                    })}
                    {/* 中心の円 */}
                    <circle cx="50" cy="50" r="20" fill="white" className="dark:fill-gray-800" />
                  </svg>
                </div>
              ) : (
                <div className="text-gray-500 dark:text-gray-400 text-center">
                  まだ記録がありません
                </div>
              )}
            </div>
          </div>
        </div>
        
        {filteredRecords.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50/80 dark:bg-gray-700/80 backdrop-blur-sm">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider rounded-tl-lg">日時</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">科目</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">勉強時間</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider rounded-tr-lg">操作</th>
                </tr>
              </thead>
              <tbody className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm divide-y divide-gray-200 dark:divide-gray-700">
                {filteredRecords.map((record, index) => (
                  <tr
                    key={record.id}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 ${
                      index === filteredRecords.length - 1 ? 'rounded-b-lg' : ''
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {formatDate(record.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      <div className="flex items-center">
                        <div 
                          className="w-2 h-2 rounded-full mr-2" 
                          style={{ backgroundColor: generatePastelColor(subjectPercentages.findIndex(item => item.subject === record.subject)) }}
                        ></div>
                        {record.subject}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 font-mono">
                      {formatTime(record.duration)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => onDelete(record.id)}
                        className="text-rose-500 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 transition-colors duration-150 flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        削除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {filter ? '該当する記録がありません' : '記録がありません'}
            </p>
            <p className="text-gray-400 dark:text-gray-500 mt-2">
              {filter ? 'フィルターを変更してみてください' : '勉強を記録してみましょう！'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyRecords; 