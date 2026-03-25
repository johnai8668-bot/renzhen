// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Calendar, Clock, FileText, CheckCircle2, AlertCircle, Upload, Download, MapPin, User, Plus, Search, Filter, ChevronRight, FileCheck, ClipboardCheck, X } from 'lucide-react';
// @ts-ignore;
import { Button, Input, Textarea, useToast, Calendar as CalendarComponent, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';

import TabBar from '@/components/TabBar.jsx';
export default function AuditDepartment({
  className = '',
  $w
}) {
  const {
    toast
  } = useToast();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTask, setSelectedTask] = useState(null);
  const [showRecordDialog, setShowRecordDialog] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [onSiteRecord, setOnSiteRecord] = useState('');
  const [reportFile, setReportFile] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [statistics, setStatistics] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0
  });

  // 当前用户信息
  const currentUser = $w?.auth?.currentUser || {};
  const userId = currentUser.userId || '';
  const userName = currentUser.name || '';

  // 加载审核任务数据
  const loadTasks = async () => {
    try {
      setLoading(true);
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'audit_tasks',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {}
          },
          orderBy: {
            createdAt: -1
          },
          pageSize: 100
        }
      });
      if (result?.data?.records) {
        const taskList = result.data.records;
        setTasks(taskList);
        updateStatistics(taskList);
      } else {
        // 如果没有数据，使用示例数据
        const sampleTasks = [{
          _id: 'audit_001',
          taskName: 'ISO9001质量体系审核',
          projectName: '某制造企业ISO9001认证',
          auditType: '质量体系审核',
          status: '待接收',
          auditorId: '',
          auditorName: '',
          dueDate: '2026-03-30',
          startDate: '2026-03-25',
          endDate: '2026-03-29',
          location: '企业现场',
          description: '对该企业的质量管理体系进行全面审核，包括文件审查、现场检查、人员访谈等环节',
          onSiteRecord: '',
          reportUrl: '',
          createdAt: '2026-03-20T10:00:00Z',
          updatedAt: '2026-03-20T10:00:00Z'
        }, {
          _id: 'audit_002',
          taskName: 'ISO14001环境管理体系审核',
          projectName: '某化工企业环境认证',
          auditType: '环境体系审核',
          status: '进行中',
          auditorId: 'user_001',
          auditorName: '张审核员',
          dueDate: '2026-03-28',
          startDate: '2026-03-24',
          endDate: '2026-03-27',
          location: '企业现场',
          description: '环境管理体系审核，重点检查环保设施运行情况、废水废气处理合规性等',
          onSiteRecord: '已完成文件审查，现场检查进行中，发现3项轻微不符合项',
          reportUrl: '',
          createdAt: '2026-03-18T10:00:00Z',
          updatedAt: '2026-03-24T10:00:00Z'
        }, {
          _id: 'audit_003',
          taskName: 'ISO45001职业健康安全体系审核',
          projectName: '某建筑企业安全认证',
          auditType: '职业健康安全审核',
          status: '已完成',
          auditorId: 'user_002',
          auditorName: '李审核员',
          dueDate: '2026-03-20',
          startDate: '2026-03-15',
          endDate: '2026-03-19',
          location: '项目现场',
          description: '职业健康安全管理体系审核，检查安全管理制度、应急预案、劳动防护等',
          onSiteRecord: '审核完成，发现2项不符合项，企业已整改完成',
          reportUrl: 'audit_report_003.pdf',
          createdAt: '2026-03-10T10:00:00Z',
          updatedAt: '2026-03-20T10:00:00Z'
        }, {
          _id: 'audit_004',
          taskName: '双碳认证审核',
          projectName: '某能源企业双碳认证',
          auditType: '双碳认证审核',
          status: '待接收',
          auditorId: '',
          auditorName: '',
          dueDate: '2026-04-05',
          startDate: '2026-04-01',
          endDate: '2026-04-04',
          location: '企业现场',
          description: '碳足迹核查和碳中和认证，核查企业碳排放数据、减排措施有效性',
          onSiteRecord: '',
          reportUrl: '',
          createdAt: '2026-03-22T10:00:00Z',
          updatedAt: '2026-03-22T10:00:00Z'
        }, {
          _id: 'audit_005',
          taskName: '监督审核',
          projectName: '某制造企业年度监督审核',
          auditType: '监督审核',
          status: '待报告',
          auditorId: 'user_003',
          auditorName: '王审核员',
          dueDate: '2026-03-26',
          startDate: '2026-03-23',
          endDate: '2026-03-25',
          location: '企业现场',
          description: 'ISO9001认证后的年度监督审核，确认体系持续有效性',
          onSiteRecord: '现场审核已完成，各项指标符合要求，需上传最终报告',
          reportUrl: '',
          createdAt: '2026-03-16T10:00:00Z',
          updatedAt: '2026-03-25T10:00:00Z'
        }];
        setTasks(sampleTasks);
        updateStatistics(sampleTasks);
      }
    } catch (error) {
      console.error('加载审核任务失败:', error);
      toast({
        title: '加载失败',
        description: error.message || '加载审核任务数据失败',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // 更新统计数据
  const updateStatistics = taskList => {
    setStatistics({
      total: taskList.length,
      pending: taskList.filter(t => t.status === '待接收').length,
      inProgress: taskList.filter(t => t.status === '进行中').length,
      completed: taskList.filter(t => t.status === '已完成').length
    });
  };

  // 接受任务
  const handleAcceptTask = async taskId => {
    try {
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'audit_tasks',
        methodName: 'wedaUpdateV2',
        params: {
          filter: {
            where: {
              _id: taskId
            }
          },
          data: {
            status: '进行中',
            auditorId: userId,
            auditorName: userName,
            updatedAt: new Date().toISOString()
          }
        }
      });
      toast({
        title: '任务已接收',
        description: '您已成功接收该审核任务'
      });
      loadTasks();
    } catch (error) {
      console.error('接收任务失败:', error);
      toast({
        title: '接收失败',
        description: error.message || '接收任务失败',
        variant: 'destructive'
      });
    }
  };

  // 保存现场记录
  const handleSaveRecord = async () => {
    if (!onSiteRecord.trim()) {
      toast({
        title: '请填写现场记录',
        variant: 'destructive'
      });
      return;
    }
    try {
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'audit_tasks',
        methodName: 'wedaUpdateV2',
        params: {
          filter: {
            where: {
              _id: selectedTask._id
            }
          },
          data: {
            onSiteRecord: onSiteRecord,
            status: '待报告',
            updatedAt: new Date().toISOString()
          }
        }
      });
      toast({
        title: '记录已保存',
        description: '现场记录已成功保存'
      });
      setShowRecordDialog(false);
      setOnSiteRecord('');
      loadTasks();
    } catch (error) {
      console.error('保存记录失败:', error);
      toast({
        title: '保存失败',
        description: error.message || '保存现场记录失败',
        variant: 'destructive'
      });
    }
  };

  // 上传报告
  const handleUploadReport = async () => {
    if (!reportFile) {
      toast({
        title: '请选择文件',
        variant: 'destructive'
      });
      return;
    }
    try {
      // 模拟文件上传
      toast({
        title: '文件上传中...',
        description: '正在上传报告文件'
      });

      // 这里应该调用真实的文件上传API
      const fileUrl = `report_${Date.now()}.pdf`;
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'audit_tasks',
        methodName: 'wedaUpdateV2',
        params: {
          filter: {
            where: {
              _id: selectedTask._id
            }
          },
          data: {
            reportUrl: fileUrl,
            status: '已完成',
            updatedAt: new Date().toISOString()
          }
        }
      });
      toast({
        title: '报告已上传',
        description: '审核报告已成功上传'
      });
      setShowUploadDialog(false);
      setReportFile(null);
      loadTasks();
    } catch (error) {
      console.error('上传报告失败:', error);
      toast({
        title: '上传失败',
        description: error.message || '上传报告失败',
        variant: 'destructive'
      });
    }
  };

  // 过滤任务
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.taskName?.toLowerCase().includes(searchTerm.toLowerCase()) || task.projectName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // 根据标签页过滤任务
  const getTabTasks = () => {
    switch (activeTab) {
      case 'pending':
        return filteredTasks.filter(t => t.status === '待接收');
      case 'inProgress':
        return filteredTasks.filter(t => t.status === '进行中');
      case 'completed':
        return filteredTasks.filter(t => t.status === '已完成' || t.status === '待报告');
      default:
        return filteredTasks;
    }
  };

  // 获取状态样式
  const getStatusStyle = status => {
    switch (status) {
      case '待接收':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case '进行中':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case '待报告':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case '已完成':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // 获取状态图标
  const getStatusIcon = status => {
    switch (status) {
      case '待接收':
        return <AlertCircle className="w-4 h-4 text-amber-600" />;
      case '进行中':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case '待报告':
        return <FileCheck className="w-4 h-4 text-purple-600" />;
      case '已完成':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };
  useEffect(() => {
    loadTasks();
  }, []);
  return <div className={`min-h-screen bg-gray-50 pb-20 ${className}`}>
      {/* 页面头部 */}
      <div className="bg-gradient-to-r from-[#003D79] to-[#004d99] text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">审核部工作台</h1>
            <p className="text-sm opacity-90 mt-1">审核计划 • 任务管理 • 现场记录</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4" />
            <span>{userName || '审核员'}</span>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-4 gap-3 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-[#D4AF37]">{statistics.total}</div>
            <div className="text-xs text-white/80 mt-1">总任务</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-amber-300">{statistics.pending}</div>
            <div className="text-xs text-white/80 mt-1">待接收</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-300">{statistics.inProgress}</div>
            <div className="text-xs text-white/80 mt-1">进行中</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-emerald-300">{statistics.completed}</div>
            <div className="text-xs text-white/80 mt-1">已完成</div>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="px-4 py-6">
        {/* 搜索和筛选 */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input type="text" placeholder="搜索任务名称或项目..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#003D79] focus:border-transparent" />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#003D79]">
              <SelectValue placeholder="状态筛选" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="待接收">待接收</SelectItem>
              <SelectItem value="进行中">进行中</SelectItem>
              <SelectItem value="待报告">待报告</SelectItem>
              <SelectItem value="已完成">已完成</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 标签页 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="bg-white border border-gray-200 rounded-lg p-1 w-full">
            <TabsTrigger value="all" className="flex-1 data-[state=active]:bg-[#003D79] data-[state=active]:text-white">
              全部任务
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex-1 data-[state=active]:bg-[#D4AF37] data-[state=active]:text-white">
              待接收
            </TabsTrigger>
            <TabsTrigger value="inProgress" className="flex-1 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              进行中
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex-1 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              已完成
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {loading ? <div className="text-center py-12 text-gray-500">
                加载中...
              </div> : getTabTasks().length === 0 ? <div className="text-center py-12 text-gray-500">
                <ClipboardCheck className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>暂无相关任务</p>
              </div> : <div className="space-y-4">
                {getTabTasks().map(task => <div key={task._id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    {/* 任务头部 */}
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusIcon(task.status)}
                            <h3 className="text-lg font-semibold text-gray-900">
                              {task.taskName}
                            </h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(task.status)}`}>
                              {task.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{task.projectName}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 mt-1" />
                      </div>
                    </div>

                    {/* 任务详情 */}
                    <div className="p-4">
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4 text-[#D4AF37]" />
                          <span>截止: {task.dueDate}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-[#00A896]" />
                          <span>{task.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User className="w-4 h-4 text-blue-500" />
                          <span>审核员: {task.auditorName || '未分配'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FileText className="w-4 h-4 text-purple-500" />
                          <span>类型: {task.auditType}</span>
                        </div>
                      </div>

                      {/* 任务描述 */}
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {task.description}
                      </p>

                      {/* 现场记录（如果有） */}
                      {task.onSiteRecord && <div className="bg-gray-50 rounded-lg p-3 mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <ClipboardCheck className="w-4 h-4 text-[#00A896]" />
                            <span className="text-sm font-medium text-gray-700">现场记录</span>
                          </div>
                          <p className="text-sm text-gray-600">{task.onSiteRecord}</p>
                        </div>}

                      {/* 操作按钮 */}
                      <div className="flex gap-2">
                        {task.status === '待接收' && <Button onClick={() => handleAcceptTask(task._id)} className="flex-1 bg-[#D4AF37] hover:bg-[#c4a035] text-white">
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            接受任务
                          </Button>}
                        
                        {task.status === '进行中' && <Button onClick={() => {
                    setSelectedTask(task);
                    setOnSiteRecord(task.onSiteRecord || '');
                    setShowRecordDialog(true);
                  }} className="flex-1 bg-[#003D79] hover:bg-[#002d5c] text-white">
                            <FileText className="w-4 h-4 mr-2" />
                            填写现场记录
                          </Button>}

                        {task.status === '待报告' && <Button onClick={() => {
                    setSelectedTask(task);
                    setReportFile(null);
                    setShowUploadDialog(true);
                  }} className="flex-1 bg-[#00A896] hover:bg-[#009688] text-white">
                            <Upload className="w-4 h-4 mr-2" />
                            上传报告
                          </Button>}

                        {task.status === '已完成' && task.reportUrl && <Button onClick={() => {
                    toast({
                      title: '下载报告',
                      description: '正在下载审核报告...'
                    });
                  }} variant="outline" className="flex-1 border-[#003D79] text-[#003D79] hover:bg-[#003D79]/5">
                            <Download className="w-4 h-4 mr-2" />
                            下载报告
                          </Button>}
                      </div>
                    </div>
                  </div>)}
              </div>}
          </TabsContent>
        </Tabs>
      </div>

      {/* 现场记录填写对话框 */}
      <Dialog open={showRecordDialog} onOpenChange={setShowRecordDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#003D79]">
              填写现场记录
            </DialogTitle>
            <DialogDescription>
              任务: {selectedTask?.taskName}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                现场记录
              </label>
              <Textarea value={onSiteRecord} onChange={e => setOnSiteRecord(e.target.value)} placeholder="请详细记录现场审核情况，包括文件审查、现场检查、不符合项等..." rows={8} className="border-gray-200 focus:ring-2 focus:ring-[#003D79] focus:border-transparent" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
            setShowRecordDialog(false);
            setOnSiteRecord('');
          }} className="border-gray-300 text-gray-700 hover:bg-gray-50">
              取消
            </Button>
            <Button onClick={handleSaveRecord} className="bg-[#003D79] hover:bg-[#002d5c] text-white">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              保存记录
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 报告上传对话框 */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#00A896]">
              上传审核报告
            </DialogTitle>
            <DialogDescription>
              任务: {selectedTask?.taskName}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#00A896] transition-colors cursor-pointer">
              <Upload className="w-12 h-12 mx-auto mb-3 text-[#00A896]" />
              <p className="text-sm text-gray-600 mb-2">
                点击选择文件或拖拽文件到此处
              </p>
              <p className="text-xs text-gray-400">
                支持 PDF、Word 格式，文件大小不超过 10MB
              </p>
              <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={e => setReportFile(e.target.files[0])} />
              {reportFile && <div className="mt-3 text-sm text-[#00A896] font-medium">
                  已选择: {reportFile.name}
                </div>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
            setShowUploadDialog(false);
            setReportFile(null);
          }} className="border-gray-300 text-gray-700 hover:bg-gray-50">
              取消
            </Button>
            <Button onClick={handleUploadReport} className="bg-[#00A896] hover:bg-[#009688] text-white">
              <Upload className="w-4 h-4 mr-2" />
              上传报告
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 底部导航栏 */}
      <TabBar currentPage="audit-department" />
    </div>;
}