// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { useToast, Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Avatar, AvatarFallback, AvatarImage, Badge, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
// @ts-ignore;
import { User, FileText, Award, BookOpen, Briefcase, Calculator, Clock, Share2, Settings, TrendingUp, AlertCircle, CheckCircle, ClipboardList, ArrowUp, ArrowDown, Download, Filter } from 'lucide-react';

// @ts-ignore;
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import TabBar from '@/components/TabBar';
export default function Home(props) {
  const {
    toast
  } = useToast();

  // 用户信息
  const currentUser = props.$w.auth.currentUser || {};
  const userName = currentUser.name || '用户';
  const userRole = userName === '管理员' ? 'admin' : 'employee';

  // 状态管理
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('month'); // week, month, year
  const [dashboardData, setDashboardData] = useState({
    auditCompletionRate: 85,
    clientGrowth: 12,
    qualityIssues: [{
      name: '流程不规范',
      value: 5
    }, {
      name: '资料不全',
      value: 3
    }, {
      name: '时间延误',
      value: 2
    }, {
      name: '沟通不足',
      value: 2
    }]
  });

  // 待办事项数据
  const [todoTasks, setTodoTasks] = useState([{
    id: 1,
    type: 'audit',
    title: '某制造业ISO9001首次审核',
    client: 'XX制造有限公司',
    date: '2026-03-26',
    priority: 'high',
    status: 'pending'
  }, {
    id: 2,
    type: 'contract',
    title: '新客户合同发起审核',
    client: 'YY科技集团',
    date: '2026-03-27',
    priority: 'medium',
    status: 'pending'
  }, {
    id: 3,
    type: 'approval',
    title: '项目报价审批',
    client: 'ZZ环保公司',
    date: '2026-03-25',
    priority: 'low',
    status: 'waiting'
  }]);

  // 快捷入口
  const quickActions = [{
    id: 'add-client',
    title: '客户录入',
    description: '新增客户信息',
    icon: User,
    color: 'bg-[#003D79]',
    pageId: 'customer-management'
  }, {
    id: 'audit-plan',
    title: '审核计划',
    description: '查看审核安排',
    icon: ClipboardList,
    color: 'bg-[#D4AF37]',
    pageId: 'projects'
  }, {
    id: 'certificates',
    title: '证书查看',
    description: '管理资质证书',
    icon: Award,
    color: 'bg-[#00A896]',
    pageId: 'certificates'
  }, {
    id: 'project-progress',
    title: '项目进度',
    description: '跟踪项目状态',
    icon: TrendingUp,
    color: 'bg-[#003366]',
    pageId: 'projects'
  }];

  // 统计数据
  const [stats, setStats] = useState({
    totalProjects: 28,
    activeProjects: 15,
    pendingAudits: 5,
    completedAudits: 23,
    pendingContracts: 3,
    pendingApprovals: 7
  });

  // 图表数据
  const [chartData, setChartData] = useState({
    completionRate: [{
      month: '1月',
      rate: 82
    }, {
      month: '2月',
      rate: 85
    }, {
      month: '3月',
      rate: 88
    }, {
      month: '4月',
      rate: 85
    }, {
      month: '5月',
      rate: 90
    }, {
      month: '6月',
      rate: 87
    }],
    clientGrowth: [{
      month: '1月',
      newClients: 8,
      total: 120
    }, {
      month: '2月',
      newClients: 12,
      total: 132
    }, {
      month: '3月',
      newClients: 15,
      total: 147
    }, {
      month: '4月',
      newClients: 10,
      total: 157
    }, {
      month: '5月',
      newClients: 18,
      total: 175
    }, {
      month: '6月',
      newClients: 14,
      total: 189
    }]
  });

  // 质量问题分布饼图颜色
  const COLORS = ['#003D79', '#D4AF37', '#00A896', '#FF6B6B'];

  // 导航处理
  const handleNavigate = pageId => {
    props.$w.utils.navigateTo({
      pageId,
      params: {}
    });
  };

  // 加载数据
  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // 加载项目统计数据
      const projectsResult = await props.$w.cloud.callDataSource({
        dataSourceName: 'projects',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {
              isDeleted: {
                $ne: true
              }
            }
          }
        }
      });
      if (projectsResult.data?.records) {
        const projects = projectsResult.data.records;
        const totalProjects = projects.length;
        const activeProjects = projects.filter(p => p.status === '进行中').length;
        const pendingAudits = projects.filter(p => p.status === '待审核').length;
        const completedAudits = projects.filter(p => p.status === '已完成').length;
        setStats(prev => ({
          ...prev,
          totalProjects,
          activeProjects,
          pendingAudits,
          completedAudits
        }));
      }
    } catch (error) {
      console.error('加载数据失败:', error);
      toast({
        title: '加载数据失败',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Excel导出
  const handleExportExcel = async () => {
    try {
      // 模拟导出功能
      const exportData = {
        stats,
        chartData,
        todoTasks,
        exportTime: new Date().toISOString(),
        exportedBy: userName
      };

      // 这里应该调用云函数生成Excel文件并返回下载链接
      const result = await props.$w.cloud.callFunction({
        name: 'exportDashboardData',
        data: exportData
      });
      toast({
        title: '导出成功',
        description: '数据看板已导出为Excel文件'
      });
    } catch (error) {
      console.error('导出失败:', error);
      toast({
        title: '导出失败',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  // 待办事项类型图标
  const getTaskIcon = type => {
    switch (type) {
      case 'audit':
        return <ClipboardList className="h-4 w-4" />;
      case 'contract':
        return <FileText className="h-4 w-4" />;
      case 'approval':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  // 待办事项优先级颜色
  const getPriorityColor = priority => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'medium':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'low':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  // 待办事项状态
  const getStatusBadge = status => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-[#D4AF37]">待处理</Badge>;
      case 'waiting':
        return <Badge className="bg-[#00A896]">审批中</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">已完成</Badge>;
      default:
        return <Badge variant="secondary">未知</Badge>;
    }
  };
  useEffect(() => {
    loadDashboardData();
  }, []);
  return <div className="min-h-screen bg-gradient-to-br from-white via-[#f8f9fa] to-[#f5f5f5] pb-20">
      {/* 顶部导航栏 */}
      <div className="bg-gradient-to-r from-[#003D79] via-[#003366] to-[#002952] text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">工作台</h1>
            <p className="text-blue-100 text-sm">
              {userName} · {userRole === 'admin' ? '管理员' : '员工'}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" className="text-white hover:text-blue-100" onClick={() => handleNavigate('settings')}>
              <Settings className="h-5 w-5" />
            </Button>
            <Avatar className="h-10 w-10">
              <AvatarImage src={currentUser.avatarUrl} />
              <AvatarFallback>
                {userName.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="bg-white border-[#e0e0e0] shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#003D79] font-medium">待审核</p>
                  <p className="text-2xl font-bold text-[#003366]">{stats.pendingAudits}</p>
                </div>
                <ClipboardList className="h-8 w-8 text-[#003D79]" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-[#e0e0e0] shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#D4AF37] font-medium">进行中</p>
                  <p className="text-2xl font-bold text-[#b8972f]">{stats.activeProjects}</p>
                </div>
                <Briefcase className="h-8 w-8 text-[#D4AF37]" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-[#e0e0e0] shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#00A896] font-medium">已完成</p>
                  <p className="text-2xl font-bold text-[#008f7a]">{stats.completedAudits}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-[#00A896]" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-[#e0e0e0] shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#003366] font-medium">总项目</p>
                  <p className="text-2xl font-bold text-[#002952]">{stats.totalProjects}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-[#003366]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 待办事项 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-800">待办事项</h2>
            <Badge variant="secondary" className="bg-[#003D79]/10 text-[#003D79]">
              {todoTasks.length} 项
            </Badge>
          </div>
          <div className="space-y-3">
            {todoTasks.map(task => <Card key={task.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${task.type === 'audit' ? 'bg-[#003D79]/10' : task.type === 'contract' ? 'bg-[#D4AF37]/10' : 'bg-[#00A896]/10'}`}>
                      {task.type === 'audit' && <ClipboardList className="h-4 w-4 text-[#003D79]" />}
                      {task.type === 'contract' && <FileText className="h-4 w-4 text-[#D4AF37]" />}
                      {task.type === 'approval' && <CheckCircle className="h-4 w-4 text-[#00A896]" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-[#212121]">{task.title}</h4>
                        {getStatusBadge(task.status)}
                      </div>
                      <p className="text-sm text-[#616161] mb-2">{task.client}</p>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded border ${getPriorityColor(task.priority)}`}>
                          {task.priority === 'high' ? '紧急' : task.priority === 'medium' ? '中等' : '普通'}
                        </span>
                        <span className="text-xs text-[#757575] flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {task.date}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </div>

        {/* 快捷入口 */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[#424242] mb-3">快捷入口</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map(action => {
            const IconComponent = action.icon;
            return <Card key={action.id} className="cursor-pointer hover:shadow-lg transition-shadow duration-200" onClick={() => handleNavigate(action.pageId)}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className={`${action.color} p-2 rounded-lg`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#424242]">{action.title}</h3>
                        <p className="text-sm text-[#757575]">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>;
          })}
          </div>
        </div>

        {/* 数据看板 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-800">数据看板</h2>
            <div className="flex items-center space-x-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-24 h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">本周</SelectItem>
                  <SelectItem value="month">本月</SelectItem>
                  <SelectItem value="year">今年</SelectItem>
                </SelectContent>
              </Select>
              <Button size="sm" variant="outline" className="h-8 border-[#003D79] text-[#003D79] hover:bg-[#003D79] hover:text-white" onClick={handleExportExcel}>
                <Download className="h-4 w-4 mr-1" />
                导出
              </Button>
            </div>
          </div>
          
          {/* 审核完成率 */}
          <Card className="bg-white border-[#e0e0e0] shadow-sm mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-[#424242]">
                审核完成率趋势
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData.completionRate}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="month" stroke="#616161" fontSize={12} />
                  <YAxis stroke="#616161" fontSize={12} domain={[0, 100]} label={{
                  value: '%',
                  position: 'insideLeft',
                  angle: -90,
                  offset: -10,
                  fontSize: 10
                }} />
                  <Tooltip formatter={value => [`${value}%`, '完成率']} />
                  <Line type="monotone" dataKey="rate" stroke="#003D79" strokeWidth={2} dot={{
                  fill: '#003D79',
                  r: 4
                }} activeDot={{
                  r: 6
                }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          {/* 客户增长趋势 */}
          <Card className="bg-white border-[#e0e0e0] shadow-sm mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-[#424242]">
                客户增长趋势
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData.clientGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="month" stroke="#616161" fontSize={12} />
                  <YAxis stroke="#616161" fontSize={12} />
                  <Tooltip formatter={(value, name) => [value, name === 'newClients' ? '新增客户' : '总客户数']} />
                  <Legend verticalAlign="top" height={36} formatter={value => <span className="text-xs text-[#616161]">
                        {value === 'newClients' ? '新增客户' : '总客户数'}
                      </span>} />
                  <Bar dataKey="newClients" fill="#D4AF37" name="newClients" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="total" fill="#00A896" name="total" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          {/* 质量问题分布 */}
          <Card className="bg-white border-[#e0e0e0] shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-[#424242]">
                质量问题分布
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={dashboardData.qualityIssues} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value" label={({
                  name,
                  percent
                }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                    {dashboardData.qualityIssues.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={value => [`${value}个`, '问题数']} />
                </PieChart>
              </ResponsiveContainer>
              
              {/* 图例 */}
              <div className="flex justify-center space-x-4 mt-4 pt-4 border-t border-gray-200">
                {dashboardData.qualityIssues.map((item, index) => <div key={index} className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{
                  backgroundColor: COLORS[index % COLORS.length]
                }} />
                    <span className="text-xs text-[#616161]">{item.name}</span>
                  </div>)}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 底部导航栏 */}
      <TabBar currentPage="home" $w={props.$w} />
    </div>;
}