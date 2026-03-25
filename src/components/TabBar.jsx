// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Card, Users, FileText, Award, BookOpen, BarChart3, Calculator, Home, Building2 } from 'lucide-react';

export default function TabBar({
  currentPage = 'home',
  $w
}) {
  const tabs = [{
    id: 'home',
    name: '首页',
    icon: Home,
    path: '/home'
  }, {
    id: 'projects',
    name: '项目',
    icon: BarChart3,
    path: '/projects'
  }, {
    id: 'customer-management',
    name: '客户',
    icon: Building2,
    path: '/customer-management'
  }, {
    id: 'knowledge',
    name: '知识库',
    icon: BookOpen,
    path: '/knowledge'
  }, {
    id: 'accounting',
    name: '财务',
    icon: Calculator,
    path: '/accounting'
  }];
  const handleTabClick = tab => {
    // 使用小程序路由跳转
    if ($w?.utils?.navigateTo) {
      $w.utils.navigateTo({
        pageId: tab.path.replace('/', ''),
        params: {}
      });
    }
  };
  return <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e0e0e0] shadow-lg z-50">
      <div className="flex justify-around items-center py-2">
        {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = currentPage === tab.id;
        return <button key={tab.id} onClick={() => handleTabClick(tab)} className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${isActive ? 'text-[#003D79] bg-[#003D79]/10' : 'text-[#9e9e9e] hover:text-[#003D79] hover:bg-[#003D79]/10'}`}>
              <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-[#003D79]' : ''}`} />
              <span className={`text-xs font-medium ${isActive ? 'text-[#003D79]' : 'text-[#9e9e9e]'}`}>
                {tab.name}
              </span>
            </button>;
      })}
      </div>
    </div>;
}