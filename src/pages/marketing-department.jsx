// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { useToast, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input, Button, Tabs, TabsContent, TabsList, TabsTrigger, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea } from '@/components/ui';
// @ts-ignore;
import { Users, FileText, TrendingUp, Phone, Mail, MapPin, Building2, DollarSign, CheckCircle2, Plus, Search, Download, MessageSquare, Video, Target } from 'lucide-react';

import { useForm } from 'react-hook-form';
import { LineChart, Line, BarChart, Bar, PieChart as RechartsPieChart, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
const COLORS = {
  primary: '#003D79',
  gold: '#D4AF37',
  teal: '#00A896',
  green: '#10B981',
  red: '#EF4444',
  orange: '#F59E0B',
  purple: '#8B5CF6'
};
// 新增客户对话框组件
function AddCustomerDialog({
  isOpen,
  onClose,
  onSubmit,
  form
}) {
  if (!isOpen) return null;
  return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4" style={{
        color: COLORS.primary
      }}>新增客户</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({
            field
          }) => <FormItem><FormLabel>客户名称 *</FormLabel><FormControl><Input placeholder="请输入客户名称" {...field} /></FormControl><FormMessage /></FormItem>} />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="contact_person" render={({
              field
            }) => <FormItem><FormLabel>联系人 *</FormLabel><FormControl><Input placeholder="请输入联系人" {...field} /></FormControl><FormMessage /></FormItem>} />
              <FormField control={form.control} name="phone" render={({
              field
            }) => <FormItem><FormLabel>联系电话 *</FormLabel><FormControl><Input placeholder="请输入联系电话" {...field} /></FormControl><FormMessage /></FormItem>} />
            </div>
            <FormField control={form.control} name="email" render={({
            field
          }) => <FormItem><FormLabel>邮箱地址</FormLabel><FormControl><Input type="email" placeholder="请输入邮箱地址" {...field} /></FormControl><FormMessage /></FormItem>} />
            <FormField control={form.control} name="company" render={({
            field
          }) => <FormItem><FormLabel>公司名称</FormLabel><FormControl><Input placeholder="请输入公司名称" {...field} /></FormControl><FormMessage /></FormItem>} />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="industry" render={({
              field
            }) => <FormItem><FormLabel>行业</FormLabel><FormControl><Input placeholder="请输入行业" {...field} /></FormControl><FormMessage /></FormItem>} />
              <FormField control={form.control} name="source" render={({
              field
            }) => <FormItem><FormLabel>客户来源</FormLabel><FormControl><Input placeholder="请输入客户来源" {...field} /></FormControl><FormMessage /></FormItem>} />
            </div>
            <FormField control={form.control} name="address" render={({
            field
          }) => <FormItem><FormLabel>地址</FormLabel><FormControl><Input placeholder="请输入地址" {...field} /></FormControl><FormMessage /></FormItem>} />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="status" render={({
              field
            }) => <FormItem><FormLabel>客户状态 *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="请选择客户状态" /></SelectTrigger></FormControl>
                    <SelectContent><SelectItem value="潜在">潜在</SelectItem><SelectItem value="跟进中">跟进中</SelectItem><SelectItem value="已成交">已成交</SelectItem><SelectItem value="已流失">已流失</SelectItem></SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>} />
              <FormField control={form.control} name="level" render={({
              field
            }) => <FormItem><FormLabel>客户级别 *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="请选择客户级别" /></SelectTrigger></FormControl>
                    <SelectContent><SelectItem value="A">A（重点）</SelectItem><SelectItem value="B">B（重要）</SelectItem><SelectItem value="C">C（一般）</SelectItem></SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>} />
            </div>
            <FormField control={form.control} name="remark" render={({
            field
          }) => <FormItem><FormLabel>备注</FormLabel><FormControl><Textarea placeholder="请输入备注信息" {...field} /></FormControl><FormMessage /></FormItem>} />
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => {
              onClose();
              form.reset();
            }}>取消</Button>
              <Button type="submit" style={{
              backgroundColor: COLORS.primary,
              color: 'white'
            }}>保存</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>;
}

// 新增跟进记录对话框组件
function AddFollowUpDialog({
  isOpen,
  onClose,
  onSubmit,
  selectedCustomer,
  form
}) {
  if (!isOpen) return null;
  return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4" style={{
        color: COLORS.primary
      }}>添加跟进记录</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {selectedCustomer && <div className="p-3 rounded-lg mb-4" style={{
            backgroundColor: COLORS.primary + '10'
          }}>
                <p className="font-medium" style={{
              color: COLORS.primary
            }}>{selectedCustomer.name}</p>
                <p className="text-sm text-gray-600">{selectedCustomer.company || ''}</p>
              </div>}
            <FormField control={form.control} name="contact_type" render={({
            field
          }) => <FormItem><FormLabel>沟通方式 *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="请选择沟通方式" /></SelectTrigger></FormControl>
                  <SelectContent><SelectItem value="电话">电话</SelectItem><SelectItem value="微信">微信</SelectItem><SelectItem value="拜访">拜访</SelectItem><SelectItem value="邮件">邮件</SelectItem><SelectItem value="会议">会议</SelectItem></SelectContent>
                </Select>
                <FormMessage />
              </FormItem>} />
            <FormField control={form.control} name="content" render={({
            field
          }) => <FormItem><FormLabel>沟通内容 *</FormLabel><FormControl><Textarea placeholder="请输入沟通内容" {...field} /></FormControl><FormMessage /></FormItem>} />
            <FormField control={form.control} name="next_step" render={({
            field
          }) => <FormItem><FormLabel>下一步计划</FormLabel><FormControl><Input placeholder="请输入下一步计划" {...field} /></FormControl><FormMessage /></FormItem>} />
            <FormField control={form.control} name="next_date" render={({
            field
          }) => <FormItem><FormLabel>下次跟进日期</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>} />
            <FormField control={form.control} name="result" render={({
            field
          }) => <FormItem><FormLabel>跟进结果 *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="请选择跟进结果" /></SelectTrigger></FormControl>
                  <SelectContent><SelectItem value="积极">积极</SelectItem><SelectItem value="一般">一般</SelectItem><SelectItem value="消极">消极</SelectItem></SelectContent>
                </Select>
                <FormMessage />
              </FormItem>} />
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => {
              onClose();
              form.reset();
            }}>取消</Button>
              <Button type="submit" style={{
              backgroundColor: COLORS.primary,
              color: 'white'
            }}>保存</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>;
}

// 新建合同对话框组件
function AddContractDialog({
  isOpen,
  onClose,
  onSubmit,
  customers,
  selectedCustomer,
  setSelectedCustomer,
  selectedTemplate,
  setSelectedTemplate,
  form
}) {
  if (!isOpen) return null;
  return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4" style={{
        color: COLORS.primary
      }}>新建合同</h2>
        {!selectedCustomer ? <div className="mb-4">
            <label className="block text-sm font-medium mb-2">选择客户 *</label>
            <Select onValueChange={value => setSelectedCustomer(customers.find(c => c._id === value))}>
              <SelectTrigger><SelectValue placeholder="请选择客户" /></SelectTrigger>
              <SelectContent>{customers.map(customer => <SelectItem key={customer._id} value={customer._id}>{customer.name}</SelectItem>)}</SelectContent>
            </Select>
          </div> : <div className="mb-4 p-3 rounded-lg" style={{
        backgroundColor: COLORS.primary + '10'
      }}>
            <div className="flex items-center justify-between">
              <div><p className="font-medium" style={{
              color: COLORS.primary
            }}>{selectedCustomer.name}</p><p className="text-sm text-gray-600">{selectedCustomer.company || ''}</p></div>
              <Button variant="outline" size="sm" onClick={() => setSelectedCustomer(null)}>重新选择</Button>
            </div>
          </div>}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="template_type" render={({
            field
          }) => <FormItem><FormLabel>合同类型 *</FormLabel>
                <Select onValueChange={value => {
              setSelectedTemplate(value);
              field.onChange(value);
            }} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="请选择合同类型" /></SelectTrigger></FormControl>
                  <SelectContent><SelectItem value="审核服务">审核服务</SelectItem><SelectItem value="咨询服务">咨询服务</SelectItem><SelectItem value="培训服务">培训服务</SelectItem><SelectItem value="综合服务">综合服务</SelectItem></SelectContent>
                </Select>
                <FormMessage />
              </FormItem>} />
            <FormField control={form.control} name="contract_amount" render={({
            field
          }) => <FormItem><FormLabel>合同金额 *</FormLabel><FormControl><Input type="number" placeholder="请输入合同金额" {...field} /></FormControl><FormMessage /></FormItem>} />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="start_date" render={({
              field
            }) => <FormItem><FormLabel>开始日期 *</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>} />
              <FormField control={form.control} name="end_date" render={({
              field
            }) => <FormItem><FormLabel>结束日期 *</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>} />
            </div>
            <FormField control={form.control} name="content" render={({
            field
          }) => <FormItem><FormLabel>合同内容</FormLabel><FormControl><Textarea placeholder="请输入合同内容" {...field} /></FormControl><FormMessage /></FormItem>} />
            <FormField control={form.control} name="remark" render={({
            field
          }) => <FormItem><FormLabel>备注</FormLabel><FormControl><Textarea placeholder="请输入备注" {...field} /></FormControl><FormMessage /></FormItem>} />
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => {
              onClose();
              form.reset();
            }}>取消</Button>
              <Button type="submit" style={{
              backgroundColor: COLORS.primary,
              color: 'white'
            }}>创建合同</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>;
}
const Pie = ({
  data,
  cx,
  cy,
  labelLine,
  label,
  outerRadius,
  fill,
  dataKey
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const radius = outerRadius;
  return <g>
      {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color || fill} />)}
    </g>;
};
export default function MarketingDepartment(props) {
  const {
    toast
  } = useToast();
  const {
    $w
  } = props;
  const [activeTab, setActiveTab] = useState('customers');
  const [customers, setCustomers] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [followUps, setFollowUps] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showAddFollowUp, setShowAddFollowUp] = useState(false);
  const [showAddContract, setShowAddContract] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [loading, setLoading] = useState(true);
  const customerForm = useForm({
    defaultValues: {
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
      remark: ''
    }
  });
  const followUpForm = useForm({
    defaultValues: {
      contact_type: '电话',
      content: '',
      next_step: '',
      next_date: '',
      result: '一般'
    }
  });
  const contractForm = useForm({
    defaultValues: {
      template_type: '审核服务',
      contract_amount: '',
      start_date: '',
      end_date: '',
      content: '',
      remark: ''
    }
  });
  useEffect(() => {
    loadData();
  }, []);
  const loadData = async () => {
    try {
      setLoading(true);
      const [customersRes, contractsRes, followUpsRes] = await Promise.all([$w.cloud.callFunction({
        name: 'callDataSource',
        data: {
          collectionName: 'customers',
          action: 'list'
        }
      }), $w.cloud.callFunction({
        name: 'callDataSource',
        data: {
          collectionName: 'contracts',
          action: 'list'
        }
      }), $w.cloud.callFunction({
        name: 'callDataSource',
        data: {
          collectionName: 'follow_ups',
          action: 'list'
        }
      })]);
      if (customersRes.success) setCustomers(customersRes.data || []);
      if (contractsRes.success) setContracts(contractsRes.data || []);
      if (followUpsRes.success) setFollowUps(followUpsRes.data || []);
    } catch (error) {
      console.error('加载数据失败:', error);
      toast({
        title: '数据加载失败',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  const handleAddCustomer = async values => {
    try {
      const currentUser = $w.auth.currentUser;
      const newCustomer = {
        ...values,
        salesperson_id: currentUser?.userId || 'unknown',
        salesperson_name: currentUser?.name || '未知',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      const result = await $w.cloud.callFunction({
        name: 'callDataSource',
        data: {
          collectionName: 'customers',
          action: 'create',
          data: newCustomer
        }
      });
      if (result.success) {
        setCustomers([...customers, {
          ...newCustomer,
          _id: result.data._id
        }]);
        setShowAddCustomer(false);
        customerForm.reset();
        toast({
          title: '客户添加成功',
          description: '客户信息已成功录入系统'
        });
      } else {
        throw new Error(result.message || '添加失败');
      }
    } catch (error) {
      console.error('添加客户失败:', error);
      toast({
        title: '添加客户失败',
        description: error.message,
        variant: 'destructive'
      });
    }
  };
  const handleAddFollowUp = async values => {
    try {
      if (!selectedCustomer) {
        toast({
          title: '请选择客户',
          description: '请先选择要跟进的客户',
          variant: 'destructive'
        });
        return;
      }
      const currentUser = $w.auth.currentUser;
      const newFollowUp = {
        customer_id: selectedCustomer._id,
        customer_name: selectedCustomer.name,
        ...values,
        salesperson_id: currentUser?.userId || 'unknown',
        salesperson_name: currentUser?.name || '未知',
        files: [],
        created_at: new Date().toISOString()
      };
      const result = await $w.cloud.callFunction({
        name: 'callDataSource',
        data: {
          collectionName: 'follow_ups',
          action: 'create',
          data: newFollowUp
        }
      });
      if (result.success) {
        setFollowUps([...followUps, {
          ...newFollowUp,
          _id: result.data._id
        }]);
        setShowAddFollowUp(false);
        followUpForm.reset();
        setSelectedCustomer(null);
        toast({
          title: '跟进记录添加成功',
          description: '跟进记录已成功保存'
        });
      } else {
        throw new Error(result.message || '添加失败');
      }
    } catch (error) {
      console.error('添加跟进记录失败:', error);
      toast({
        title: '添加跟进记录失败',
        description: error.message,
        variant: 'destructive'
      });
    }
  };
  const handleCreateContract = async values => {
    try {
      if (!selectedCustomer) {
        toast({
          title: '请选择客户',
          description: '请先选择要签约的客户',
          variant: 'destructive'
        });
        return;
      }
      const currentUser = $w.auth.currentUser;
      const contractNo = `HT${new Date().getFullYear()}${String(contracts.length + 1).padStart(4, '0')}`;
      const newContract = {
        contract_no: contractNo,
        customer_id: selectedCustomer._id,
        customer_name: selectedCustomer.name,
        template_type: selectedTemplate,
        contract_amount: parseFloat(values.contract_amount) || 0,
        paid_amount: 0,
        start_date: values.start_date,
        end_date: values.end_date,
        status: '草稿',
        sign_date: null,
        salesperson_id: currentUser?.userId || 'unknown',
        salesperson_name: currentUser?.name || '未知',
        content: values.content,
        remark: values.remark,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      const result = await $w.cloud.callFunction({
        name: 'callDataSource',
        data: {
          collectionName: 'contracts',
          action: 'create',
          data: newContract
        }
      });
      if (result.success) {
        setContracts([...contracts, {
          ...newContract,
          _id: result.data._id
        }]);
        setShowAddContract(false);
        setSelectedCustomer(null);
        setSelectedTemplate('');
        contractForm.reset();
        toast({
          title: '合同创建成功',
          description: `合同 ${contractNo} 已成功创建`
        });
        setActiveTab('contracts');
      } else {
        throw new Error(result.message || '创建失败');
      }
    } catch (error) {
      console.error('创建合同失败:', error);
      toast({
        title: '创建合同失败',
        description: error.message,
        variant: 'destructive'
      });
    }
  };
  const getContactTypeIcon = type => {
    const icons = {
      电话: Phone,
      微信: MessageSquare,
      拜访: Users,
      邮件: Mail,
      会议: Video
    };
    return icons[type] || Phone;
  };
  const getStatusColor = status => {
    const colors = {
      潜在: COLORS.gold,
      跟进中: COLORS.primary,
      已成交: COLORS.green,
      已流失: COLORS.red
    };
    return colors[status] || COLORS.primary;
  };
  const getContractStatusColor = status => {
    const colors = {
      草稿: COLORS.orange,
      待审批: COLORS.primary,
      已生效: COLORS.green,
      已完成: COLORS.teal,
      已取消: COLORS.red
    };
    return colors[status] || COLORS.primary;
  };
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || customer.company?.toLowerCase().includes(searchTerm.toLowerCase()) || customer.contact_person.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || customer.status === filterStatus;
    return matchesSearch && matchesFilter;
  });
  const customerFollowUps = selectedCustomer ? followUps.filter(f => f.customer_id === selectedCustomer._id) : [];
  const getPerformanceData = () => {
    const monthlyData = {};
    const now = new Date();
    const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    months.forEach(month => {
      monthlyData[month] = {
        month,
        customerCount: 0,
        contractAmount: 0
      };
    });
    customers.forEach(customer => {
      const date = new Date(customer.created_at);
      const month = date.getMonth();
      if (date.getFullYear() === now.getFullYear()) monthlyData[months[month]].customerCount++;
    });
    contracts.forEach(contract => {
      if (contract.status === '已生效') {
        const date = new Date(contract.created_at);
        const month = date.getMonth();
        if (date.getFullYear() === now.getFullYear()) monthlyData[months[month]].contractAmount += contract.contract_amount;
      }
    });
    return Object.values(monthlyData).slice(0, now.getMonth() + 1);
  };
  const getCustomerDistribution = () => {
    const distribution = {
      潜在: 0,
      跟进中: 0,
      已成交: 0,
      已流失: 0
    };
    customers.forEach(customer => {
      if (distribution[customer.status] !== undefined) distribution[customer.status]++;
    });
    return Object.entries(distribution).map(([name, value]) => ({
      name,
      value
    }));
  };
  const performanceData = getPerformanceData();
  const customerDistribution = getCustomerDistribution();
  const totalCustomers = customers.length;
  const totalContracts = contracts.length;
  const activeContracts = contracts.filter(c => c.status === '已生效').length;
  const totalContractAmount = contracts.filter(c => c.status === '已生效').reduce((sum, c) => sum + c.contract_amount, 0);
  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{
          borderColor: COLORS.primary
        }}></div>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold" style={{
            color: COLORS.primary
          }}>市场部工作台</h1>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" style={{
              color: COLORS.primary
            }} />
              <span className="text-sm text-gray-600">{$w.auth.currentUser?.name || '未登录'}</span>
            </div>
          </div>
          <p className="text-gray-600">客户管理 · 合同发起 · 跟进记录 · 业绩统计</p>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border-l-4" style={{
          borderColor: COLORS.primary
        }}>
            <div className="flex items-center justify-between">
              <div><p className="text-sm text-gray-600 mb-1">总客户数</p><p className="text-3xl font-bold" style={{
                color: COLORS.primary
              }}>{totalCustomers}</p></div>
              <Users className="w-12 h-12" style={{
              color: COLORS.primary,
              opacity: 0.2
            }} />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border-l-4" style={{
          borderColor: COLORS.gold
        }}>
            <div className="flex items-center justify-between">
              <div><p className="text-sm text-gray-600 mb-1">合同总数</p><p className="text-3xl font-bold" style={{
                color: COLORS.gold
              }}>{totalContracts}</p></div>
              <FileText className="w-12 h-12" style={{
              color: COLORS.gold,
              opacity: 0.2
            }} />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border-l-4" style={{
          borderColor: COLORS.teal
        }}>
            <div className="flex items-center justify-between">
              <div><p className="text-sm text-gray-600 mb-1">生效合同</p><p className="text-3xl font-bold" style={{
                color: COLORS.teal
              }}>{activeContracts}</p></div>
              <CheckCircle2 className="w-12 h-12" style={{
              color: COLORS.teal,
              opacity: 0.2
            }} />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border-l-4" style={{
          borderColor: COLORS.green
        }}>
            <div className="flex items-center justify-between">
              <div><p className="text-sm text-gray-600 mb-1">合同总额</p><p className="text-3xl font-bold" style={{
                color: COLORS.green
              }}>¥{(totalContractAmount / 10000).toFixed(1)}万</p></div>
              <DollarSign className="w-12 h-12" style={{
              color: COLORS.green,
              opacity: 0.2
            }} />
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white rounded-lg p-1 shadow-sm">
            <TabsTrigger value="customers" className="flex items-center gap-2"><Users className="w-4 h-4" style={{
              color: COLORS.primary
            }} />客户管理</TabsTrigger>
            <TabsTrigger value="followup" className="flex items-center gap-2"><MessageSquare className="w-4 h-4" style={{
              color: COLORS.primary
            }} />跟进记录</TabsTrigger>
            <TabsTrigger value="contracts" className="flex items-center gap-2"><FileText className="w-4 h-4" style={{
              color: COLORS.primary
            }} />合同管理</TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2"><TrendingUp className="w-4 h-4" style={{
              color: COLORS.primary
            }} />业绩统计</TabsTrigger>
          </TabsList>

          <TabsContent value="customers">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input placeholder="搜索客户名称、公司、联系人" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 w-80" />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-32"><SelectValue placeholder="全部状态" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部状态</SelectItem>
                      <SelectItem value="潜在">潜在</SelectItem>
                      <SelectItem value="跟进中">跟进中</SelectItem>
                      <SelectItem value="已成交">已成交</SelectItem>
                      <SelectItem value="已流失">已流失</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={() => setShowAddCustomer(true)} style={{
                backgroundColor: COLORS.primary,
                color: 'white'
              }} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />新增客户
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {filteredCustomers.map(customer => <div key={customer._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedCustomer(customer)}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{
                      backgroundColor: COLORS.primary,
                      color: 'white'
                    }}><Building2 className="w-6 h-6" /></div>
                        <div><h3 className="font-semibold text-lg" style={{
                        color: COLORS.primary
                      }}>{customer.name}</h3><p className="text-sm text-gray-500">{customer.company || ''}</p></div>
                      </div>
                      <span className="px-3 py-1 rounded-full text-sm font-medium" style={{
                    backgroundColor: getStatusColor(customer.status) + '20',
                    color: getStatusColor(customer.status)
                  }}>{customer.status}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600"><Users className="w-4 h-4" /><span>{customer.contact_person}</span></div>
                      <div className="flex items-center gap-2 text-gray-600"><Phone className="w-4 h-4" /><span>{customer.phone}</span></div>
                      <div className="flex items-center gap-2 text-gray-600"><MapPin className="w-4 h-4" /><span className="truncate">{customer.industry || '-'}</span></div>
                      <div className="flex items-center gap-2 text-gray-600"><Target className="w-4 h-4" /><span>级别: {customer.level}</span></div>
                    </div>
                    {customer.remark && <div className="mt-3 pt-3 border-t text-sm text-gray-600"><p className="truncate">{customer.remark}</p></div>}
                  </div>)}
              </div>
              {filteredCustomers.length === 0 && <div className="text-center py-12 text-gray-500"><Users className="w-16 h-16 mx-auto mb-4 text-gray-300" /><p>暂无客户数据</p></div>}
            </div>
          </TabsContent>

          <TabsContent value="followup">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold" style={{
                color: COLORS.primary
              }}>跟进记录</h2>
                <Button onClick={() => setShowAddFollowUp(true)} style={{
                backgroundColor: COLORS.primary,
                color: 'white'
              }} className="flex items-center gap-2"><Plus className="w-4 h-4" />添加跟进</Button>
              </div>
              {selectedCustomer ? <>
                  <div className="mb-6 p-4 rounded-lg" style={{
                backgroundColor: COLORS.primary + '10'
              }}>
                    <div className="flex items-center justify-between">
                      <div><h3 className="font-bold" style={{
                      color: COLORS.primary
                    }}>{selectedCustomer.name}</h3><p className="text-sm text-gray-600">{selectedCustomer.company || ''}</p></div>
                      <Button variant="outline" size="sm" onClick={() => setSelectedCustomer(null)}>选择其他客户</Button>
                    </div>
                  </div>
                  <div className="relative pl-8">
                    <div className="absolute left-3 top-0 bottom-0 w-0.5" style={{
                  backgroundColor: COLORS.primary + '30'
                }}></div>
                    {customerFollowUps.length === 0 ? <div className="text-center py-12 text-gray-500"><MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" /><p>暂无跟进记录</p></div> : customerFollowUps.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map(followUp => {
                  const Icon = getContactTypeIcon(followUp.contact_type);
                  const resultColor = followUp.result === '积极' ? COLORS.green : followUp.result === '消极' ? COLORS.red : COLORS.orange;
                  return <div key={followUp._id} className="relative pb-8">
                            <div className="absolute left-[-26px] w-5 h-5 rounded-full flex items-center justify-center" style={{
                      backgroundColor: COLORS.primary
                    }}><Icon className="w-3 h-3 text-white" /></div>
                            <div className="bg-gray-50 rounded-lg p-4">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-1 rounded text-xs font-medium" style={{
                            backgroundColor: COLORS.primary + '20',
                            color: COLORS.primary
                          }}>{followUp.contact_type}</span>
                                  <span className="text-sm text-gray-500">{new Date(followUp.created_at).toLocaleString('zh-CN')}</span>
                                </div>
                                <span className="px-2 py-1 rounded text-xs font-medium" style={{
                          backgroundColor: resultColor + '20',
                          color: resultColor
                        }}>{followUp.result}</span>
                              </div>
                              <p className="text-gray-700 mb-3">{followUp.content}</p>
                              {followUp.next_step && <div className="flex items-start gap-2 text-sm text-gray-600">
                                  <Target className="w-4 h-4 mt-0.5 flex-shrink-0" style={{
                          color: COLORS.primary
                        }} />
                                  <div><p>下一步: {followUp.next_step}</p>{followUp.next_date && <p className="text-xs text-gray-500">截止: {followUp.next_date}</p>}</div>
                                </div>}
                            </div>
                          </div>;
                })}
                  </div>
                </> : <div className="text-center py-12 text-gray-500">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" /><p className="mb-4">请先选择一个客户查看跟进记录</p>
                  <Button onClick={() => setActiveTab('customers')} style={{
                backgroundColor: COLORS.primary,
                color: 'white'
              }}>前往客户管理</Button>
                </div>}
            </div>
          </TabsContent>

          <TabsContent value="contracts">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold" style={{
                color: COLORS.primary
              }}>合同管理</h2>
                <div className="flex gap-2">
                  <Button onClick={() => setShowAddContract(true)} style={{
                  backgroundColor: COLORS.primary,
                  color: 'white'
                }} className="flex items-center gap-2"><Plus className="w-4 h-4" />新建合同</Button>
                  <Button variant="outline" className="flex items-center gap-2"><Download className="w-4 h-4" />导出 Excel</Button>
                </div>
              </div>
              <div className="space-y-4">
                {contracts.map(contract => <div key={contract._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{
                      backgroundColor: COLORS.primary,
                      color: 'white'
                    }}><FileText className="w-5 h-5" /></div>
                        <div><h3 className="font-semibold" style={{
                        color: COLORS.primary
                      }}>{contract.contract_no}</h3><p className="text-sm text-gray-600">{contract.customer_name}</p></div>
                      </div>
                      <span className="px-3 py-1 rounded-full text-sm font-medium" style={{
                    backgroundColor: getContractStatusColor(contract.status) + '20',
                    color: getContractStatusColor(contract.status)
                  }}>{contract.status}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div><p className="text-gray-500 mb-1">合同类型</p><p className="font-medium">{contract.template_type}</p></div>
                      <div><p className="text-gray-500 mb-1">合同金额</p><p className="font-medium" style={{
                      color: COLORS.green
                    }}>¥{contract.contract_amount.toLocaleString()}</p></div>
                      <div><p className="text-gray-500 mb-1">已付金额</p><p className="font-medium" style={{
                      color: COLORS.teal
                    }}>¥{contract.paid_amount.toLocaleString()}</p></div>
                      <div><p className="text-gray-500 mb-1">合同期限</p><p className="font-medium">{contract.start_date} ~ {contract.end_date}</p></div>
                    </div>
                    {contract.content && <div className="mt-3 pt-3 border-t text-sm text-gray-600"><p className="truncate">{contract.content}</p></div>}
                  </div>)}
              </div>
              {contracts.length === 0 && <div className="text-center py-12 text-gray-500"><FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" /><p>暂无合同数据</p></div>}
            </div>
          </TabsContent>

          <TabsContent value="performance">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold mb-4" style={{
                color: COLORS.primary
              }}>客户数量趋势</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Legend />
                    <Line type="monotone" dataKey="customerCount" stroke={COLORS.primary} strokeWidth={2} name="客户数量" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold mb-4" style={{
                color: COLORS.primary
              }}>合同金额趋势</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Legend />
                    <Bar dataKey="contractAmount" fill={COLORS.gold} name="合同金额（元）" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold mb-4" style={{
                color: COLORS.primary
              }}>客户状态分布</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie data={customerDistribution} cx="50%" cy="50%" labelLine={false} label={({
                    name,
                    percent
                  }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                      {customerDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={[COLORS.gold, COLORS.primary, COLORS.green, COLORS.red][index % 4]} />)}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold mb-4" style={{
                color: COLORS.primary
              }}>业绩概览</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg" style={{
                  backgroundColor: COLORS.primary + '10'
                }}>
                    <div className="flex items-center gap-3"><Users className="w-8 h-8" style={{
                      color: COLORS.primary
                    }} /><span>总客户数</span></div>
                    <span className="text-2xl font-bold" style={{
                    color: COLORS.primary
                  }}>{totalCustomers}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg" style={{
                  backgroundColor: COLORS.gold + '10'
                }}>
                    <div className="flex items-center gap-3"><FileText className="w-8 h-8" style={{
                      color: COLORS.gold
                    }} /><span>合同总数</span></div>
                    <span className="text-2xl font-bold" style={{
                    color: COLORS.gold
                  }}>{totalContracts}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg" style={{
                  backgroundColor: COLORS.teal + '10'
                }}>
                    <div className="flex items-center gap-3"><DollarSign className="w-8 h-8" style={{
                      color: COLORS.teal
                    }} /><span>合同总额</span></div>
                    <span className="text-2xl font-bold" style={{
                    color: COLORS.teal
                  }}>¥{(totalContractAmount / 10000).toFixed(1)}万</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg" style={{
                  backgroundColor: COLORS.green + '10'
                }}>
                    <div className="flex items-center gap-3"><TrendingUp className="w-8 h-8" style={{
                      color: COLORS.green
                    }} /><span>平均客单价</span></div>
                    <span className="text-2xl font-bold" style={{
                    color: COLORS.green
                  }}>{activeContracts > 0 ? `¥${(totalContractAmount / activeContracts / 10000).toFixed(1)}万` : '-'}</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* 对话框组件 */}
      <AddCustomerDialog isOpen={showAddCustomer} onClose={() => setShowAddCustomer(false)} onSubmit={handleAddCustomer} form={customerForm} />
      <AddFollowUpDialog isOpen={showAddFollowUp} onClose={() => setShowAddFollowUp(false)} onSubmit={handleAddFollowUp} selectedCustomer={selectedCustomer} form={followUpForm} />
      <AddContractDialog isOpen={showAddContract} onClose={() => {
      setShowAddContract(false);
      setSelectedCustomer(null);
      setSelectedTemplate('');
    }} onSubmit={handleCreateContract} customers={customers} selectedCustomer={selectedCustomer} setSelectedCustomer={setSelectedCustomer} selectedTemplate={selectedTemplate} setSelectedTemplate={setSelectedTemplate} form={contractForm} />
    </div>;
}