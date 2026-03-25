// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { useToast, Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge } from '@/components/ui';
// @ts-ignore;
import { BarChart3, Package, DollarSign, FileText, Download, Eye, Calendar, Clock, CheckCircle, AlertCircle, Filter, Search, RefreshCw, Copy } from 'lucide-react';

import TabBar from '@/components/TabBar';
export default function Projects(props) {
  const {
    toast
  } = useToast();
  const [activeTab, setActiveTab] = useState('projects'); // projects, orders, templates
  const [projects, setProjects] = useState([]);
  const [orders, setOrders] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  // 项目筛选
  const [projectFilter, setProjectFilter] = useState('all');
  const [projectSearch, setProjectSearch] = useState('');

  // 订单筛选
  const [orderFilter, setOrderFilter] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');

  // 模板筛选
  const [templateFilter, setTemplateFilter] = useState('all');
  const [templateSearch, setTemplateSearch] = useState('');
  useEffect(() => {
    loadData();
  }, []);
  const loadData = async () => {
    setLoading(true);
    try {
      // 加载项目数据
      const projectResult = await props.$w.cloud.callDataSource({
        dataSourceName: 'projects',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {}
          },
          orderBy: [{
            lastContactDate: 'desc'
          }],
          select: {
            $master: true
          },
          pageSize: 100,
          pageNumber: 1
        }
      });
      if (projectResult.records) {
        setProjects(projectResult.records);
      }

      // 加载订单数据
      const orderResult = await props.$w.cloud.callDataSource({
        dataSourceName: 'orders',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {}
          },
          orderBy: [{
            orderDate: 'desc'
          }],
          select: {
            $master: true
          },
          pageSize: 100,
          pageNumber: 1
        }
      });
      if (orderResult.records) {
        setOrders(orderResult.records);
      }

      // 加载模板数据
      const templateResult = await props.$w.cloud.callDataSource({
        dataSourceName: 'document_templates',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {}
          },
          orderBy: [{
            lastUsedDate: 'desc'
          }],
          select: {
            $master: true
          },
          pageSize: 100,
          pageNumber: 1
        }
      });
      if (templateResult.records) {
        setTemplates(templateResult.records);
      }
    } catch (error) {
      console.error('加载数据失败:', error);
      toast({
        title: '加载失败',
        description: `无法加载数据: ${error.message || '未知错误'}`,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  const getStatusColor = status => {
    switch (status) {
      case '进行中':
      case '待付款':
        return 'bg-blue-100 text-blue-800';
      case '已完成':
      case '已付款':
        return 'bg-green-100 text-green-800';
      case '待审核':
      case '已开票':
        return 'bg-yellow-100 text-yellow-800';
      case '已取消':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const filteredProjects = projects.filter(p => {
    const matchFilter = projectFilter === 'all' || p.status === projectFilter;
    const matchSearch = !projectSearch || p.projectName?.toLowerCase().includes(projectSearch.toLowerCase()) || p.clientName?.toLowerCase().includes(projectSearch.toLowerCase());
    return matchFilter && matchSearch;
  });
  const filteredOrders = orders.filter(o => {
    const matchFilter = orderFilter === 'all' || o.status === orderFilter;
    const matchSearch = !orderSearch || o.orderNumber?.toLowerCase().includes(orderSearch.toLowerCase()) || o.clientName?.toLowerCase().includes(orderSearch.toLowerCase()) || o.projectName?.toLowerCase().includes(orderSearch.toLowerCase());
    return matchFilter && matchSearch;
  });
  const filteredTemplates = templates.filter(t => {
    const matchFilter = templateFilter === 'all' || t.templateType === templateFilter;
    const matchSearch = !templateSearch || t.templateName?.toLowerCase().includes(templateSearch.toLowerCase()) || t.templateCode?.toLowerCase().includes(templateSearch.toLowerCase());
    return matchFilter && matchSearch;
  });
  const renderProjectTab = () => <>
      {/* 筛选栏 */}
      <Card className="bg-white/90 backdrop-blur-sm border-amber-200 mb-4">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-amber-600" />
              <input type="text" placeholder="搜索项目或客户..." value={projectSearch} onChange={e => setProjectSearch(e.target.value)} className="border border-amber-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant={projectFilter === 'all' ? 'default' : 'outline'} onClick={() => setProjectFilter('all')} className={projectFilter === 'all' ? 'bg-amber-600 hover:bg-amber-700' : 'border-amber-300 text-amber-700'}>
                全部
              </Button>
              <Button size="sm" variant={projectFilter === '进行中' ? 'default' : 'outline'} onClick={() => setProjectFilter('进行中')} className={projectFilter === '进行中' ? 'bg-blue-600 hover:bg-blue-700' : 'border-blue-300 text-blue-700'}>
                进行中
              </Button>
              <Button size="sm" variant={projectFilter === '已完成' ? 'default' : 'outline'} onClick={() => setProjectFilter('已完成')} className={projectFilter === '已完成' ? 'bg-green-600 hover:bg-green-700' : 'border-green-300 text-green-700'}>
                已完成
              </Button>
            </div>
            <Button size="sm" onClick={loadData} className="ml-auto bg-amber-600 hover:bg-amber-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              刷新
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 项目列表 */}
      <div className="space-y-4">
        {filteredProjects.length === 0 ? <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 mx-auto mb-4 text-amber-300" />
              <p className="text-amber-800 font-serif">暂无项目数据</p>
            </CardContent>
          </Card> : filteredProjects.map(project => <Card key={project._id} className="bg-white/90 backdrop-blur-sm border-amber-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-amber-900 font-serif">{project.projectName}</CardTitle>
                    <CardDescription className="text-amber-700">
                      {project.clientName} · {project.productService}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-amber-600 font-semibold">业务员</p>
                    <p className="text-amber-900">{project.salesperson || '-'}</p>
                  </div>
                  <div>
                    <p className="text-amber-600 font-semibold">联系人</p>
                    <p className="text-amber-900">{project.contactPerson || '-'}</p>
                  </div>
                  <div>
                    <p className="text-amber-600 font-semibold">开始日期</p>
                    <p className="text-amber-900">{project.startDate || '-'}</p>
                  </div>
                  <div>
                    <p className="text-amber-600 font-semibold">预计完成</p>
                    <p className="text-amber-900">{project.expectedCompletionDate || '-'}</p>
                  </div>
                </div>
                {project.notes && <div className="mt-4 pt-4 border-t border-amber-200">
                    <p className="text-sm text-amber-700">
                      <span className="font-semibold">备注：</span>{project.notes}
                    </p>
                  </div>}
              </CardContent>
            </Card>)}
      </div>
    </>;
  const renderOrdersTab = () => <>
      {/* 订单统计 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-600">总订单数</p>
                <p className="text-2xl font-bold text-amber-900">{orders.length}</p>
              </div>
              <Package className="w-8 h-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">已付款</p>
                <p className="text-2xl font-bold text-green-900">{orders.filter(o => o.status === '已付款').length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">待付款</p>
                <p className="text-2xl font-bold text-blue-900">{orders.filter(o => o.status === '待付款').length}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-600">总金额</p>
                <p className="text-2xl font-bold text-amber-900">
                  ¥{orders.reduce((sum, o) => sum + (o.amount || 0), 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 筛选栏 */}
      <Card className="bg-white/90 backdrop-blur-sm border-amber-200 mb-4">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-amber-600" />
              <input type="text" placeholder="搜索订单号、客户或项目..." value={orderSearch} onChange={e => setOrderSearch(e.target.value)} className="border border-amber-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant={orderFilter === 'all' ? 'default' : 'outline'} onClick={() => setOrderFilter('all')} className={orderFilter === 'all' ? 'bg-amber-600 hover:bg-amber-700' : 'border-amber-300 text-amber-700'}>
                全部
              </Button>
              <Button size="sm" variant={orderFilter === '待付款' ? 'default' : 'outline'} onClick={() => setOrderFilter('待付款')} className={orderFilter === '待付款' ? 'bg-blue-600 hover:bg-blue-700' : 'border-blue-300 text-blue-700'}>
                待付款
              </Button>
              <Button size="sm" variant={orderFilter === '已付款' ? 'default' : 'outline'} onClick={() => setOrderFilter('已付款')} className={orderFilter === '已付款' ? 'bg-green-600 hover:bg-green-700' : 'border-green-300 text-green-700'}>
                已付款
              </Button>
              <Button size="sm" variant={orderFilter === '已开票' ? 'default' : 'outline'} onClick={() => setOrderFilter('已开票')} className={orderFilter === '已开票' ? 'bg-yellow-600 hover:bg-yellow-700' : 'border-yellow-300 text-yellow-700'}>
                已开票
              </Button>
              <Button size="sm" variant={orderFilter === '已完成' ? 'default' : 'outline'} onClick={() => setOrderFilter('已完成')} className={orderFilter === '已完成' ? 'bg-teal-600 hover:bg-teal-700' : 'border-teal-300 text-teal-700'}>
                已完成
              </Button>
            </div>
            <Button size="sm" onClick={loadData} className="ml-auto bg-amber-600 hover:bg-amber-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              刷新
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 订单列表 */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 mx-auto mb-4 text-amber-300" />
              <p className="text-amber-800 font-serif">暂无订单数据</p>
            </CardContent>
          </Card> : filteredOrders.map(order => <Card key={order._id} className="bg-white/90 backdrop-blur-sm border-amber-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-amber-900 font-serif">{order.orderNumber}</CardTitle>
                    <CardDescription className="text-amber-700">
                      {order.projectName} · {order.clientName}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-amber-600 font-semibold">产品服务</p>
                    <p className="text-amber-900">{order.productService}</p>
                  </div>
                  <div>
                    <p className="text-amber-600 font-semibold">订单金额</p>
                    <p className="text-amber-900 font-bold">¥{(order.amount || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-amber-600 font-semibold">下单日期</p>
                    <p className="text-amber-900">{order.orderDate}</p>
                  </div>
                  <div>
                    <p className="text-amber-600 font-semibold">预计付款</p>
                    <p className="text-amber-900">{order.expectedPaymentDate || '-'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mt-4 pt-4 border-t border-amber-200">
                  <div>
                    <p className="text-amber-600 font-semibold">付款方式</p>
                    <p className="text-amber-900">{order.paymentMethod || '-'}</p>
                  </div>
                  <div>
                    <p className="text-amber-600 font-semibold">开票状态</p>
                    <p className="text-amber-900">{order.invoiceStatus || '-'}</p>
                  </div>
                  <div>
                    <p className="text-amber-600 font-semibold">发票号码</p>
                    <p className="text-amber-900">{order.invoiceNumber || '-'}</p>
                  </div>
                </div>
                {order.notes && <div className="mt-4 pt-4 border-t border-amber-200">
                    <p className="text-sm text-amber-700">
                      <span className="font-semibold">备注：</span>{order.notes}
                    </p>
                  </div>}
              </CardContent>
            </Card>)}
      </div>
    </>;
  const renderTemplatesTab = () => <>
      {/* 模板统计 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-600">模板总数</p>
                <p className="text-2xl font-bold text-amber-900">{templates.length}</p>
              </div>
              <FileText className="w-8 h-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">已启用</p>
                <p className="text-2xl font-bold text-green-900">{templates.filter(t => t.status === '启用').length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">总使用次数</p>
                <p className="text-2xl font-bold text-blue-900">
                  {templates.reduce((sum, t) => sum + (t.usageCount || 0), 0)}
                </p>
              </div>
              <Download className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-600">模板类型</p>
                <p className="text-2xl font-bold text-amber-900">
                  {new Set(templates.map(t => t.templateType)).size}
                </p>
              </div>
              <Package className="w-8 h-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 筛选栏 */}
      <Card className="bg-white/90 backdrop-blur-sm border-amber-200 mb-4">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-amber-600" />
              <input type="text" placeholder="搜索模板名称或编号..." value={templateSearch} onChange={e => setTemplateSearch(e.target.value)} className="border border-amber-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button size="sm" variant={templateFilter === 'all' ? 'default' : 'outline'} onClick={() => setTemplateFilter('all')} className={templateFilter === 'all' ? 'bg-amber-600 hover:bg-amber-700' : 'border-amber-300 text-amber-700'}>
                全部
              </Button>
              <Button size="sm" variant={templateFilter === '合同' ? 'default' : 'outline'} onClick={() => setTemplateFilter('合同')} className={templateFilter === '合同' ? 'bg-blue-600 hover:bg-blue-700' : 'border-blue-300 text-blue-700'}>
                合同
              </Button>
              <Button size="sm" variant={templateFilter === '申请书' ? 'default' : 'outline'} onClick={() => setTemplateFilter('申请书')} className={templateFilter === '申请书' ? 'bg-green-600 hover:bg-green-700' : 'border-green-300 text-green-700'}>
                申请书
              </Button>
              <Button size="sm" variant={templateFilter === '审核方案策划表' ? 'default' : 'outline'} onClick={() => setTemplateFilter('审核方案策划表')} className={templateFilter === '审核方案策划表' ? 'bg-yellow-600 hover:bg-yellow-700' : 'border-yellow-300 text-yellow-700'}>
                审核方案
              </Button>
              <Button size="sm" variant={templateFilter === '审核任务书' ? 'default' : 'outline'} onClick={() => setTemplateFilter('审核任务书')} className={templateFilter === '审核任务书' ? 'bg-purple-600 hover:bg-purple-700' : 'border-purple-300 text-purple-700'}>
                任务书
              </Button>
              <Button size="sm" variant={templateFilter === '审核通知书' ? 'default' : 'outline'} onClick={() => setTemplateFilter('审核通知书')} className={templateFilter === '审核通知书' ? 'bg-pink-600 hover:bg-pink-700' : 'border-pink-300 text-pink-700'}>
                通知书
              </Button>
              <Button size="sm" variant={templateFilter === '审核计划' ? 'default' : 'outline'} onClick={() => setTemplateFilter('审核计划')} className={templateFilter === '审核计划' ? 'bg-teal-600 hover:bg-teal-700' : 'border-teal-300 text-teal-700'}>
                审核计划
              </Button>
              <Button size="sm" variant={templateFilter === '审核报告' ? 'default' : 'outline'} onClick={() => setTemplateFilter('审核报告')} className={templateFilter === '审核报告' ? 'bg-indigo-600 hover:bg-indigo-700' : 'border-indigo-300 text-indigo-700'}>
                审核报告
              </Button>
              <Button size="sm" variant={templateFilter === '证书确认表' ? 'default' : 'outline'} onClick={() => setTemplateFilter('证书确认表')} className={templateFilter === '证书确认表' ? 'bg-orange-600 hover:bg-orange-700' : 'border-orange-300 text-orange-700'}>
                证书确认
              </Button>
            </div>
            <Button size="sm" onClick={loadData} className="ml-auto bg-amber-600 hover:bg-amber-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              刷新
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 模板列表 */}
      <div className="space-y-4">
        {filteredTemplates.length === 0 ? <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-amber-300" />
              <p className="text-amber-800 font-serif">暂无模板数据</p>
            </CardContent>
          </Card> : filteredTemplates.map(template => <Card key={template._id} className="bg-white/90 backdrop-blur-sm border-amber-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-amber-900 font-serif">{template.templateName}</CardTitle>
                      <Badge className={template.status === '启用' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {template.status}
                      </Badge>
                    </div>
                    <CardDescription className="text-amber-700 mt-1">
                      {template.templateType} · {template.templateCode} · {template.description}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(template.variables, null, 2));
                toast({
                  title: '复制成功',
                  description: '变量列表已复制到剪贴板'
                });
              }} className="border-amber-300 text-amber-700 hover:bg-amber-50">
                      <Copy className="w-4 h-4 mr-2" />
                      复制变量
                    </Button>
                    <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                      <Download className="w-4 h-4 mr-2" />
                      下载模板
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => {
                toast({
                  title: '查看模板',
                  description: '模板预览功能开发中'
                });
              }} className="border-amber-300 text-amber-700 hover:bg-amber-50">
                      <Eye className="w-4 h-4 mr-2" />
                      预览
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-amber-600 font-semibold">版本号</p>
                    <p className="text-amber-900">{template.version}</p>
                  </div>
                  <div>
                    <p className="text-amber-600 font-semibold">使用次数</p>
                    <p className="text-amber-900">{template.usageCount || 0}</p>
                  </div>
                  <div>
                    <p className="text-amber-600 font-semibold">最后使用</p>
                    <p className="text-amber-900">{template.lastUsedDate || '-'}</p>
                  </div>
                  <div>
                    <p className="text-amber-600 font-semibold">创建时间</p>
                    <p className="text-amber-900">{new Date(template.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-amber-200">
                  <p className="text-sm text-amber-600 font-semibold mb-2">可用变量：</p>
                  <div className="flex flex-wrap gap-2">
                    {template.variables && template.variables.length > 0 ? template.variables.map((variable, index) => <Badge key={index} className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer">
                          {variable}
                        </Badge>) : <span className="text-sm text-amber-700">无变量</span>}
                  </div>
                </div>
              </CardContent>
            </Card>)}
      </div>
    </>;
  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-amber-800 font-serif">加载中...</p>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-blue-800 text-white p-6 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-serif font-bold text-center">项目管理</h1>
          <p className="text-center text-amber-100 mt-2">项目、订单与模板管理</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6 pb-24">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          <Button variant={activeTab === 'projects' ? 'default' : 'outline'} onClick={() => setActiveTab('projects')} className={activeTab === 'projects' ? 'bg-amber-600 hover:bg-amber-700' : 'border-amber-300 text-amber-700 hover:bg-amber-50'}>
            <BarChart3 className="w-4 h-4 mr-2" />
            项目列表
          </Button>
          <Button variant={activeTab === 'orders' ? 'default' : 'outline'} onClick={() => setActiveTab('orders')} className={activeTab === 'orders' ? 'bg-blue-600 hover:bg-blue-700' : 'border-blue-300 text-blue-700 hover:bg-blue-50'}>
            <DollarSign className="w-4 h-4 mr-2" />
            订单管理
          </Button>
          <Button variant={activeTab === 'templates' ? 'default' : 'outline'} onClick={() => setActiveTab('templates')} className={activeTab === 'templates' ? 'bg-green-600 hover:bg-green-700' : 'border-green-300 text-green-700 hover:bg-green-50'}>
            <FileText className="w-4 h-4 mr-2" />
            文件模板库
          </Button>
        </div>

        {/* Tab Content */}
        {activeTab === 'projects' && renderProjectTab()}
        {activeTab === 'orders' && renderOrdersTab()}
        {activeTab === 'templates' && renderTemplatesTab()}
      </main>

      {/* Bottom Navigation */}
      <TabBar currentPage="projects" $w={props.$w} />
    </div>;
}