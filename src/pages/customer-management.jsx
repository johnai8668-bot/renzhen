// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Search, Plus, Edit2, Trash2, Filter, RefreshCw, Building2, User, Phone, Mail, MapPin, Tag, History, TrendingUp, AlertCircle, CheckCircle, XCircle, Star, DollarSign, Calendar, FileText, MoreVertical } from 'lucide-react';
// @ts-ignore;
import { Button, Input, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, useToast } from '@/components/ui';

import TabBar from '@/components/TabBar';
export default function CustomerManagement({
  $w,
  className,
  style
}) {
  const {
    toast
  } = useToast();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showVersionDialog, setShowVersionDialog] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [versionHistory, setVersionHistory] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 表单状态
  const [formData, setFormData] = useState({
    name: '',
    contact_person: '',
    phone: '',
    email: '',
    company: '',
    industry: '',
    address: '',
    status: '潜在',
    level: 'C',
    source: '',
    remark: '',
    // 扩展字段
    scale: '',
    risk_level: '',
    relationship_strength: '',
    credit_code: '',
    legal_representative: '',
    business_scope: '',
    registered_capital: '',
    establishment_date: ''
  });
  useEffect(() => {
    loadCurrentUser();
    loadCustomers();
  }, []);
  const loadCurrentUser = async () => {
    try {
      const user = $w.auth.currentUser;
      if (user) {
        setCurrentUser(user);

        // 查询当前用户的权限信息
        const result = await $w.cloud.callDataSource({
          dataSourceName: 'employee_permissions',
          methodName: 'wedaGetRecordsV2',
          params: {
            filter: {
              where: {
                _openid: user.userId
              }
            },
            pageSize: 1
          }
        });
        if (result.records && result.records.length > 0) {
          const permissions = result.records[0];
          setIsSuperAdmin(permissions.role === '超级管理员');
        }
      }
    } catch (error) {
      console.error('加载用户信息失败:', error);
    }
  };
  const loadCustomers = async () => {
    setLoading(true);
    try {
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'customers',
        methodName: 'wedaGetRecordsV2',
        params: {
          orderBy: [{
            updated_at: 'desc'
          }],
          select: {
            $master: true
          },
          pageSize: 100
        }
      });
      if (result.records) {
        setCustomers(result.records);
      }
    } catch (error) {
      console.error('加载客户数据失败:', error);
      toast({
        title: '加载失败',
        description: `无法加载客户数据: ${error.message || '未知错误'}`,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  const loadVersionHistory = async customerId => {
    try {
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'customer_versions',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {
              customer_id: customerId
            }
          },
          orderBy: [{
            created_at: 'desc'
          }],
          pageSize: 50
        }
      });
      if (result.records) {
        setVersionHistory(result.records);
      }
    } catch (error) {
      console.error('加载版本历史失败:', error);
      toast({
        title: '加载失败',
        description: '无法加载版本历史',
        variant: 'destructive'
      });
    }
  };
  const handleCreateVersionRecord = async (customerData, changeType, oldData = null) => {
    try {
      const maxVersion = await $w.cloud.callDataSource({
        dataSourceName: 'customer_versions',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {
              customer_id: customerData._id
            }
          },
          orderBy: [{
            version: 'desc'
          }],
          pageSize: 1
        }
      });
      const nextVersion = maxVersion.records && maxVersion.records.length > 0 ? maxVersion.records[0].version + 1 : 1;
      const versionData = {
        customer_id: customerData._id,
        customer_name: customerData.name,
        version: nextVersion,
        change_type: changeType,
        changed_fields: changeType === 'update' ? {} : undefined,
        old_data: oldData,
        new_data: customerData,
        changed_by: currentUser?.userId || 'unknown',
        changed_by_name: currentUser?.name || '未知用户',
        change_reason: changeType === 'create' ? '新建客户' : '更新客户信息',
        created_at: new Date().toISOString(),
        department: ''
      };
      await $w.cloud.callDataSource({
        dataSourceName: 'customer_versions',
        methodName: 'wedaCreateV2',
        params: {
          data: versionData
        }
      });
    } catch (error) {
      console.error('创建版本记录失败:', error);
    }
  };
  const handleAddCustomer = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const customerData = {
        ...formData,
        salesperson_id: currentUser?.userId || '',
        salesperson_name: currentUser?.name || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'customers',
        methodName: 'wedaCreateV2',
        params: {
          data: customerData
        }
      });
      if (result._id) {
        await handleCreateVersionRecord({
          ...customerData,
          _id: result._id
        }, 'create');
        toast({
          title: '创建成功',
          description: '客户信息已成功创建'
        });
        setShowAddDialog(false);
        resetForm();
        loadCustomers();
      }
    } catch (error) {
      console.error('创建客户失败:', error);
      toast({
        title: '创建失败',
        description: `无法创建客户: ${error.message || '未知错误'}`,
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };
  const handleEditCustomer = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const oldCustomer = customers.find(c => c._id === selectedCustomer._id);
      const customerData = {
        ...formData,
        updated_at: new Date().toISOString()
      };
      await $w.cloud.callDataSource({
        dataSourceName: 'customers',
        methodName: 'wedaUpdateV2',
        params: {
          recordId: selectedCustomer._id,
          data: customerData
        }
      });
      await handleCreateVersionRecord({
        ...selectedCustomer,
        ...customerData
      }, 'update', oldCustomer);
      toast({
        title: '更新成功',
        description: '客户信息已成功更新'
      });
      setShowEditDialog(false);
      setSelectedCustomer(null);
      resetForm();
      loadCustomers();
    } catch (error) {
      console.error('更新客户失败:', error);
      toast({
        title: '更新失败',
        description: `无法更新客户: ${error.message || '未知错误'}`,
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };
  const handleDeleteCustomer = async () => {
    if (!selectedCustomer) return;
    if (!isSuperAdmin) {
      toast({
        title: '权限不足',
        description: '只有超级管理员可以删除客户',
        variant: 'destructive'
      });
      return;
    }
    try {
      await $w.cloud.callDataSource({
        dataSourceName: 'customers',
        methodName: 'wedaDeleteV2',
        params: {
          recordId: selectedCustomer._id
        }
      });
      await handleCreateVersionRecord(selectedCustomer, 'delete');
      toast({
        title: '删除成功',
        description: '客户信息已成功删除'
      });
      setShowDeleteDialog(false);
      setSelectedCustomer(null);
      loadCustomers();
    } catch (error) {
      console.error('删除客户失败:', error);
      toast({
        title: '删除失败',
        description: `无法删除客户: ${error.message || '未知错误'}`,
        variant: 'destructive'
      });
    }
  };
  const handleViewVersionHistory = async customer => {
    setSelectedCustomer(customer);
    await loadVersionHistory(customer._id);
    setShowVersionDialog(true);
  };
  const handleEditClick = customer => {
    setSelectedCustomer(customer);
    setFormData(customer);
    setShowEditDialog(true);
  };
  const handleDeleteClick = customer => {
    setSelectedCustomer(customer);
    setShowDeleteDialog(true);
  };
  const resetForm = () => {
    setFormData({
      name: '',
      contact_person: '',
      phone: '',
      email: '',
      company: '',
      industry: '',
      address: '',
      status: '潜在',
      level: 'C',
      source: '',
      remark: '',
      scale: '',
      risk_level: '',
      relationship_strength: '',
      credit_code: '',
      legal_representative: '',
      business_scope: '',
      registered_capital: '',
      establishment_date: ''
    });
  };
  const getStatusColor = status => {
    switch (status) {
      case '已成交':
        return 'bg-green-100 text-green-800';
      case '跟进中':
        return 'bg-blue-100 text-blue-800';
      case '潜在':
        return 'bg-yellow-100 text-yellow-800';
      case '已流失':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const getLevelColor = level => {
    switch (level) {
      case 'A':
        return 'text-amber-500';
      case 'B':
        return 'text-blue-500';
      case 'C':
        return 'text-gray-500';
      default:
        return 'text-gray-500';
    }
  };
  const getChangeTypeColor = changeType => {
    switch (changeType) {
      case 'create':
        return 'bg-green-100 text-green-800';
      case 'update':
        return 'bg-blue-100 text-blue-800';
      case 'delete':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const getChangeTypeText = changeType => {
    switch (changeType) {
      case 'create':
        return '创建';
      case 'update':
        return '更新';
      case 'delete':
        return '删除';
      default:
        return changeType;
    }
  };
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) || customer.contact_person?.toLowerCase().includes(searchTerm.toLowerCase()) || customer.company?.toLowerCase().includes(searchTerm.toLowerCase()) || customer.phone?.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    const matchesLevel = levelFilter === 'all' || customer.level === levelFilter;
    return matchesSearch && matchesStatus && matchesLevel;
  });
  const statistics = {
    total: customers.length,
    active: customers.filter(c => c.status === '已成交').length,
    following: customers.filter(c => c.status === '跟进中').length,
    potential: customers.filter(c => c.status === '潜在').length,
    levelA: customers.filter(c => c.level === 'A').length
  };
  return <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#003D79] to-[#0056A3] text-white px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">客户管理</h1>
              <p className="text-blue-100">管理客户信息、跟踪客户关系、维护客户档案</p>
            </div>
            <Button onClick={() => {
            resetForm();
            setShowAddDialog(true);
          }} className="bg-[#D4AF37] hover:bg-[#C4A027] text-white flex items-center gap-2">
              <Plus className="w-5 h-5" />
              新增客户
            </Button>
          </div>
          
          {/* Statistics Cards */}
          <div className="grid grid-cols-5 gap-4">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Building2 className="w-8 h-8 text-[#D4AF37]" />
                <div>
                  <p className="text-2xl font-bold">{statistics.total}</p>
                  <p className="text-sm text-blue-100">总客户数</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-400" />
                <div>
                  <p className="text-2xl font-bold">{statistics.active}</p>
                  <p className="text-sm text-blue-100">已成交</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-blue-400" />
                <div>
                  <p className="text-2xl font-bold">{statistics.following}</p>
                  <p className="text-sm text-blue-100">跟进中</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-8 h-8 text-yellow-400" />
                <div>
                  <p className="text-2xl font-bold">{statistics.potential}</p>
                  <p className="text-sm text-blue-100">潜在客户</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Star className="w-8 h-8 text-[#D4AF37]" />
                <div>
                  <p className="text-2xl font-bold">{statistics.levelA}</p>
                  <p className="text-sm text-blue-100">重点客户</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input placeholder="搜索客户名称、联系人、公司、电话..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
            <Filter className="text-gray-400 w-5 h-5" />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">全部状态</option>
              <option value="已成交">已成交</option>
              <option value="跟进中">跟进中</option>
              <option value="潜在">潜在</option>
              <option value="已流失">已流失</option>
            </select>
            <select value={levelFilter} onChange={e => setLevelFilter(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">全部级别</option>
              <option value="A">A级（重点）</option>
              <option value="B">B级（重要）</option>
              <option value="C">C级（一般）</option>
            </select>
            <Button variant="outline" onClick={loadCustomers} className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              刷新
            </Button>
          </div>
        </div>

        {/* Customer List */}
        {loading ? <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003D79]"></div>
          </div> : filteredCustomers.length === 0 ? <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">暂无客户数据</p>
            <p className="text-gray-400 text-sm mt-2">点击"新增客户"开始添加</p>
          </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCustomers.map(customer => <div key={customer._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border-l-4 border-l-[#003D79]">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Building2 className="w-5 h-5 text-[#003D79]" />
                      <h3 className="font-bold text-lg text-gray-900">{customer.name}</h3>
                    </div>
                    <p className="text-sm text-gray-500 ml-7">{customer.company}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(customer.level === 'A' ? 3 : customer.level === 'B' ? 2 : 1)].map((_, i) => <Star key={i} className={`w-4 h-4 ${getLevelColor(customer.level)} fill-current`} />)}
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{customer.contact_person}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{customer.email || '未提供'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{customer.industry || '未分类'}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                    {customer.status}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleViewVersionHistory(customer)} className="text-blue-600 hover:text-blue-700">
                      <History className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEditClick(customer)} className="text-[#003D79] hover:text-blue-700">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    {isSuperAdmin && <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(customer)} className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>}
                  </div>
                </div>
                
                {customer.remark && <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500">{customer.remark}</p>
                  </div>}
              </div>)}
          </div>}
      </div>

      {/* Add Customer Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>新增客户</DialogTitle>
            <DialogDescription>填写客户基本信息</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddCustomer}>
            <div className="grid grid-cols-2 gap-4 py-4">
              {/* Basic Info */}
              <div className="col-span-2">
                <h3 className="font-semibold text-gray-900 mb-3">基本信息</h3>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">客户名称 *</label>
                <Input required value={formData.name} onChange={e => setFormData({
                ...formData,
                name: e.target.value
              })} placeholder="请输入客户名称" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">公司名称</label>
                <Input value={formData.company} onChange={e => setFormData({
                ...formData,
                company: e.target.value
              })} placeholder="请输入公司名称" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">联系人 *</label>
                <Input required value={formData.contact_person} onChange={e => setFormData({
                ...formData,
                contact_person: e.target.value
              })} placeholder="请输入联系人姓名" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">联系电话 *</label>
                <Input required type="tel" value={formData.phone} onChange={e => setFormData({
                ...formData,
                phone: e.target.value
              })} placeholder="请输入联系电话" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">邮箱地址</label>
                <Input type="email" value={formData.email} onChange={e => setFormData({
                ...formData,
                email: e.target.value
              })} placeholder="请输入邮箱地址" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">行业</label>
                <Input value={formData.industry} onChange={e => setFormData({
                ...formData,
                industry: e.target.value
              })} placeholder="请输入行业" />
              </div>
              
              <div className="col-span-2 space-y-2">
                <label className="text-sm font-medium text-gray-700">地址</label>
                <Input value={formData.address} onChange={e => setFormData({
                ...formData,
                address: e.target.value
              })} placeholder="请输入地址" />
              </div>
              
              {/* Customer Status */}
              <div className="col-span-2 mt-4">
                <h3 className="font-semibold text-gray-900 mb-3">客户状态</h3>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">客户状态 *</label>
                <select required value={formData.status} onChange={e => setFormData({
                ...formData,
                status: e.target.value
              })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="潜在">潜在</option>
                  <option value="跟进中">跟进中</option>
                  <option value="已成交">已成交</option>
                  <option value="已流失">已流失</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">客户级别 *</label>
                <select required value={formData.level} onChange={e => setFormData({
                ...formData,
                level: e.target.value
              })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="C">C级（一般）</option>
                  <option value="B">B级（重要）</option>
                  <option value="A">A级（重点）</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">客户来源</label>
                <Input value={formData.source} onChange={e => setFormData({
                ...formData,
                source: e.target.value
              })} placeholder="展会、网络推广、客户介绍等" />
              </div>
              
              {/* Extended Fields */}
              <div className="col-span-2 mt-4">
                <h3 className="font-semibold text-gray-900 mb-3">扩展信息</h3>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">企业规模</label>
                <Input value={formData.scale} onChange={e => setFormData({
                ...formData,
                scale: e.target.value
              })} placeholder="大型、中型、小型" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">风险等级</label>
                <Input value={formData.risk_level} onChange={e => setFormData({
                ...formData,
                risk_level: e.target.value
              })} placeholder="高、中、低" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">关系强度</label>
                <Input value={formData.relationship_strength} onChange={e => setFormData({
                ...formData,
                relationship_strength: e.target.value
              })} placeholder="强、中、弱" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">统一社会信用代码</label>
                <Input value={formData.credit_code} onChange={e => setFormData({
                ...formData,
                credit_code: e.target.value
              })} placeholder="请输入统一社会信用代码" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">法定代表人</label>
                <Input value={formData.legal_representative} onChange={e => setFormData({
                ...formData,
                legal_representative: e.target.value
              })} placeholder="请输入法定代表人" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">注册资本</label>
                <Input value={formData.registered_capital} onChange={e => setFormData({
                ...formData,
                registered_capital: e.target.value
              })} placeholder="请输入注册资本" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">成立日期</label>
                <Input type="date" value={formData.establishment_date} onChange={e => setFormData({
                ...formData,
                establishment_date: e.target.value
              })} />
              </div>
              
              <div className="col-span-2 space-y-2">
                <label className="text-sm font-medium text-gray-700">经营范围</label>
                <textarea value={formData.business_scope} onChange={e => setFormData({
                ...formData,
                business_scope: e.target.value
              })} placeholder="请输入经营范围" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]" />
              </div>
              
              <div className="col-span-2 space-y-2">
                <label className="text-sm font-medium text-gray-700">备注</label>
                <textarea value={formData.remark} onChange={e => setFormData({
                ...formData,
                remark: e.target.value
              })} placeholder="请输入备注信息" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]" />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                取消
              </Button>
              <Button type="submit" disabled={submitting} className="bg-[#003D79] hover:bg-blue-800">
                {submitting ? '创建中...' : '创建'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Customer Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>编辑客户</DialogTitle>
            <DialogDescription>修改客户信息</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditCustomer}>
            <div className="grid grid-cols-2 gap-4 py-4">
              {/* Basic Info */}
              <div className="col-span-2">
                <h3 className="font-semibold text-gray-900 mb-3">基本信息</h3>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">客户名称 *</label>
                <Input required value={formData.name} onChange={e => setFormData({
                ...formData,
                name: e.target.value
              })} placeholder="请输入客户名称" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">公司名称</label>
                <Input value={formData.company} onChange={e => setFormData({
                ...formData,
                company: e.target.value
              })} placeholder="请输入公司名称" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">联系人 *</label>
                <Input required value={formData.contact_person} onChange={e => setFormData({
                ...formData,
                contact_person: e.target.value
              })} placeholder="请输入联系人姓名" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">联系电话 *</label>
                <Input required type="tel" value={formData.phone} onChange={e => setFormData({
                ...formData,
                phone: e.target.value
              })} placeholder="请输入联系电话" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">邮箱地址</label>
                <Input type="email" value={formData.email} onChange={e => setFormData({
                ...formData,
                email: e.target.value
              })} placeholder="请输入邮箱地址" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">行业</label>
                <Input value={formData.industry} onChange={e => setFormData({
                ...formData,
                industry: e.target.value
              })} placeholder="请输入行业" />
              </div>
              
              <div className="col-span-2 space-y-2">
                <label className="text-sm font-medium text-gray-700">地址</label>
                <Input value={formData.address} onChange={e => setFormData({
                ...formData,
                address: e.target.value
              })} placeholder="请输入地址" />
              </div>
              
              {/* Customer Status */}
              <div className="col-span-2 mt-4">
                <h3 className="font-semibold text-gray-900 mb-3">客户状态</h3>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">客户状态 *</label>
                <select required value={formData.status} onChange={e => setFormData({
                ...formData,
                status: e.target.value
              })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="潜在">潜在</option>
                  <option value="跟进中">跟进中</option>
                  <option value="已成交">已成交</option>
                  <option value="已流失">已流失</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">客户级别 *</label>
                <select required value={formData.level} onChange={e => setFormData({
                ...formData,
                level: e.target.value
              })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="C">C级（一般）</option>
                  <option value="B">B级（重要）</option>
                  <option value="A">A级（重点）</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">客户来源</label>
                <Input value={formData.source} onChange={e => setFormData({
                ...formData,
                source: e.target.value
              })} placeholder="展会、网络推广、客户介绍等" />
              </div>
              
              {/* Extended Fields */}
              <div className="col-span-2 mt-4">
                <h3 className="font-semibold text-gray-900 mb-3">扩展信息</h3>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">企业规模</label>
                <Input value={formData.scale} onChange={e => setFormData({
                ...formData,
                scale: e.target.value
              })} placeholder="大型、中型、小型" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">风险等级</label>
                <Input value={formData.risk_level} onChange={e => setFormData({
                ...formData,
                risk_level: e.target.value
              })} placeholder="高、中、低" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">关系强度</label>
                <Input value={formData.relationship_strength} onChange={e => setFormData({
                ...formData,
                relationship_strength: e.target.value
              })} placeholder="强、中、弱" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">统一社会信用代码</label>
                <Input value={formData.credit_code} onChange={e => setFormData({
                ...formData,
                credit_code: e.target.value
              })} placeholder="请输入统一社会信用代码" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">法定代表人</label>
                <Input value={formData.legal_representative} onChange={e => setFormData({
                ...formData,
                legal_representative: e.target.value
              })} placeholder="请输入法定代表人" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">注册资本</label>
                <Input value={formData.registered_capital} onChange={e => setFormData({
                ...formData,
                registered_capital: e.target.value
              })} placeholder="请输入注册资本" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">成立日期</label>
                <Input type="date" value={formData.establishment_date} onChange={e => setFormData({
                ...formData,
                establishment_date: e.target.value
              })} />
              </div>
              
              <div className="col-span-2 space-y-2">
                <label className="text-sm font-medium text-gray-700">经营范围</label>
                <textarea value={formData.business_scope} onChange={e => setFormData({
                ...formData,
                business_scope: e.target.value
              })} placeholder="请输入经营范围" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]" />
              </div>
              
              <div className="col-span-2 space-y-2">
                <label className="text-sm font-medium text-gray-700">备注</label>
                <textarea value={formData.remark} onChange={e => setFormData({
                ...formData,
                remark: e.target.value
              })} placeholder="请输入备注信息" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]" />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowEditDialog(false)}>
                取消
              </Button>
              <Button type="submit" disabled={submitting} className="bg-[#003D79] hover:bg-blue-800">
                {submitting ? '更新中...' : '更新'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              确定要删除客户「{selectedCustomer?.name}」吗？此操作不可恢复。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleDeleteCustomer}>
              删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Version History Dialog */}
      <Dialog open={showVersionDialog} onOpenChange={setShowVersionDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>版本历史</DialogTitle>
            <DialogDescription>
              客户「{selectedCustomer?.name}」的变更记录
            </DialogDescription>
          </DialogHeader>
          
          <div className="max-h-[60vh] overflow-y-auto">
            {versionHistory.length === 0 ? <div className="text-center py-8 text-gray-500">
                暂无版本历史
              </div> : <div className="space-y-4">
                {versionHistory.map((version, index) => <div key={version._id || index} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getChangeTypeColor(version.change_type)}`}>
                          {getChangeTypeText(version.change_type)}
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          版本 {version.version}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <User className="w-4 h-4" />
                        <span>{version.changed_by_name}</span>
                        <span>•</span>
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(version.created_at).toLocaleString('zh-CN')}</span>
                      </div>
                    </div>
                    
                    {version.change_type === 'update' && version.changed_fields && <div className="mb-3">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">变更字段：</h4>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          {Object.entries(version.changed_fields).map(([field, values]) => <div key={field} className="bg-gray-100 rounded p-2">
                              <div className="font-medium text-gray-700">{field}</div>
                              <div className="mt-1">
                                <div className="text-red-600">旧值: {values.old || '-'}</div>
                                <div className="text-green-600">新值: {values.new || '-'}</div>
                              </div>
                            </div>)}
                        </div>
                      </div>}
                    
                    {version.change_reason && <div className="text-sm text-gray-600">
                        <span className="font-medium">变更原因：</span>
                        {version.change_reason}
                      </div>}
                  </div>)}
              </div>}
          </div>
        </DialogContent>
      </Dialog>

      {/* TabBar */}
      <TabBar currentPage="customer-management" $w={$w} />
    </div>;
}