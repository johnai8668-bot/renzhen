// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { ChevronRight, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export function ProjectGantt({
  projects
}) {
  // 项目阶段定义
  const stages = ['线索', '商机', '签约', '申请', '一阶段', '二阶段', '发证', '监督'];

  // 阶段颜色配置
  const stageColors = {
    '线索': 'bg-gray-200 border-gray-300 text-gray-700',
    '商机': 'bg-blue-100 border-blue-300 text-blue-700',
    '签约': 'bg-green-100 border-green-300 text-green-700',
    '申请': 'bg-yellow-100 border-yellow-300 text-yellow-700',
    '一阶段': 'bg-orange-100 border-orange-300 text-orange-700',
    '二阶段': 'bg-red-100 border-red-300 text-red-700',
    '发证': 'bg-purple-100 border-purple-300 text-purple-700',
    '监督': 'bg-indigo-100 border-indigo-300 text-indigo-700'
  };

  // 根据项目进度计算当前阶段
  const getCurrentStage = progress => {
    if (progress < 15) return stages[0]; // 线索
    if (progress < 30) return stages[1]; // 商机
    if (progress < 45) return stages[2]; // 签约
    if (progress < 55) return stages[3]; // 申请
    if (progress < 70) return stages[4]; // 一阶段
    if (progress < 85) return stages[5]; // 二阶段
    if (progress < 95) return stages[6]; // 发证
    return stages[7]; // 监督
  };

  // 获取阶段索引
  const getStageIndex = stage => stages.indexOf(stage);

  // 渲染单个项目的甘特图
  const renderProjectGantt = project => {
    const currentStage = getCurrentStage(project.progress || 0);
    const currentIndex = getStageIndex(currentStage);
    return <div key={project._id} className="mb-4">
        {/* 项目信息头部 */}
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-gray-800">{project.projectName}</h4>
            <span className="text-xs text-gray-500">{project.clientName}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-0.5 rounded-full border ${stageColors[currentStage]}`}>
              {currentStage}
            </span>
            <span className="text-xs text-gray-600 font-medium">{project.progress}%</span>
          </div>
        </div>
        
        {/* 甘特图条形图 */}
        <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
          {/* 背景阶段分隔线 */}
          <div className="absolute inset-0 flex">
            {stages.map((stage, idx) => <div key={stage} className={`flex-1 border-r border-gray-200 ${idx === stages.length - 1 ? '' : ''}`} style={{
            backgroundColor: idx <= currentIndex ? '#e0e7ff' : 'transparent'
          }}> 
                <div className="text-[10px] text-center pt-1 text-gray-400">{stage}</div>
              </div>)}
          </div>
          
          {/* 进度条 */}
          <div className="absolute top-1 bottom-1 left-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-md shadow-md transition-all duration-300" style={{
          width: `${project.progress}%`
        }}>
            <div className="h-full flex items-center justify-end pr-2">
              <ChevronRight className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
        
        {/* 阶段详情卡片 */}
        <div className="mt-2 grid grid-cols-8 gap-1">
          {stages.map((stage, idx) => {
          const isActive = idx <= currentIndex;
          const isCurrent = idx === currentIndex;
          return <div key={stage} className={`p-1.5 text-center rounded border ${isActive ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'} ${isCurrent ? 'ring-2 ring-blue-400' : ''}`}>
                <div className={`text-[10px] ${isActive ? 'text-blue-700' : 'text-gray-400'}`}>
                  {stage}
                </div>
                {isActive && <div className={`mt-0.5 ${isCurrent ? 'w-2 h-2 bg-blue-500 rounded-full mx-auto animate-pulse' : 'w-1.5 h-1.5 bg-green-500 rounded-full mx-auto'}`}></div>}
              </div>;
        })}
        </div>
      </div>;
  };

  // 统计各阶段的项目数量
  const stageStats = stages.reduce((acc, stage) => {
    acc[stage] = 0;
    return acc;
  }, {});
  projects.forEach(project => {
    const currentStage = getCurrentStage(project.progress || 0);
    stageStats[currentStage]++;
  });
  return <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* 标题和统计 */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">项目流转看板</h3>
          <div className="flex gap-2 flex-wrap">
            {stages.map(stage => <span key={stage} className={`text-xs px-2 py-1 rounded-full border ${stageColors[stage]}`}>
                {stage}: {stageStats[stage]}
              </span>)}
          </div>
        </div>
      </div>
      
      {/* 甘特图列表 */}
      <div className="p-4">
        {projects.length === 0 ? <div className="flex items-center justify-center py-12 text-gray-400">
            暂无项目数据
          </div> : <div className="space-y-4">
            {projects.map(project => renderProjectGantt(project))}
          </div>}
      </div>
      
      {/* 图例说明 */}
      <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
        <div className="flex items-center justify-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>已完成</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <span>当前阶段</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            <span>未开始</span>
          </div>
        </div>
      </div>
    </div>;
}