// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { useToast, Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Input, Label, Textarea, Badge, Tabs, TabsContent, TabsList, TabsTrigger, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui';
// @ts-ignore;
import { Upload, Camera, FileText, TrendingUp, TrendingDown, Calendar, Search, Filter, Download, Eye, Plus, Edit, Trash2, DollarSign, AlertCircle, CheckCircle2, Clock, Receipt, FileCheck, Wallet } from 'lucide-react';

import TabBar from '@/components/TabBar';
export default function Accounting(props) {
  const {
    toast
  } = useToast();
  const [activeTab, setActiveTab] = useState('expense');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // 费用报销相关
  const [expenseReports, setExpenseReports] = useState([]);
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    expenseType: '',
    amount: '',
    description: '',
    department: '',
    invoiceUrl: ''
  });

  // 发票申请相关
  const [invoiceRequests, setInvoiceRequests] = useState([]);
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState({
    contractId: '',
    contractAmount: '',
    customerName: '',
    invoiceType: '增值税专用发票',
    invoiceAmount: '',
    taxRate: '0.06',
    invoiceTitle: '',
    taxNumber: '',
    bankAccount: '',
    address: '',
    remark: ''
  });
  const [contracts, setContracts] = useState([]);

  // 回款记录相关
  const [paymentRecords, setPaymentRecords] = useState([]);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    contractId: '',
    contractAmount: '',
    customerName: '',
    paidAmount: '',
    currentPayment: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: '银行转账',
    bankAccount: '工商银行1234567890',
    payerName: '',
    remark: ''
  });

  // 金额显示（加密）
  const [showAmounts, setShowAmounts] = useState({});
  useEffect(() => {
    loadData();
  }, []);
  const loadData = async () => {
    setLoading(true);
    try {
      // 加载费用报销数据
      const expenseResult = await props.$w.cloud.callDataSource({
        dataSourceName: 'expense_reports',
        methodName: 'wedaGetRecordsV2',
        params: {
          orderBy: [{
            submitDate: 'desc'
          }],
          select: {
            $master: true
          },
          pageSize: 50,
          pageNumber: 1
        }
      });
      if (expenseResult.records && expenseResult.records.length > 0) {
        setExpenseReports(expenseResult.records);
      }

      // 加载发票申请数据
      const invoiceResult = await props.$w.cloud.callDataSource({
        dataSourceName: 'invoice_requests',
        methodName: 'wedaGetRecordsV2',
        params: {
          orderBy: [{
            invoiceDate: 'desc'
          }],
          select: {
            $master: true
          },
          pageSize: 50,
          pageNumber: 1
        }
      });
      if (invoiceResult.records && invoiceResult.records.length > 0) {
        setInvoiceRequests(invoiceResult.records);
      }

      // 加载合同数据（用于发票申请和回款确认）
      const contractResult = await props.$w.cloud.callDataSource({
        dataSourceName: 'contracts',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {
              status: '已生效'
            }
          },
          orderBy: [{
            createdAt: 'desc'
          }],
          select: {
            $master: true
          },
          pageSize: 50,
          pageNumber: 1
        }
      });
      if (contractResult.records && contractResult.records.length > 0) {
        setContracts(contractResult.records);
      }

      // 加载回款记录数据
      const paymentResult = await props.$w.cloud.callDataSource({
        dataSourceName: 'payment_records',
        methodName: 'wedaGetRecordsV2',
        params: {
          orderBy: [{
            paymentDate: 'desc'
          }],
          select: {
            $master: true
          },
          pageSize: 50,
          pageNumber: 1
        }
      });
      if (paymentResult.records && paymentResult.records.length > 0) {
        setPaymentRecords(paymentResult.records);
      }
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

  // 金额加密显示
  const formatAmount = (amount, recordId) => {
    if (showAmounts[recordId]) {
      return `¥${Number(amount).toLocaleString('zh-CN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`;
    }
    return '¥****.**';
  };
  const toggleAmountVisibility = recordId => {
    setShowAmounts(prev => ({
      ...prev,
      [recordId]: !prev[recordId]
    }));
  };

  // 提交费用报销
  const handleSubmitExpense = async () => {
    if (!expenseForm.expenseType || !expenseForm.amount || !expenseForm.description) {
      toast({
        title: '请填写完整信息',
        description: '费用类型、金额和说明为必填项',
        variant: 'destructive'
      });
      return;
    }
    try {
      const reportId = 'EXP' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + String(Date.now()).slice(-4);
      const currentUser = props.$w.auth.currentUser;
      await props.$w.cloud.callDataSource({
        dataSourceName: 'expense_reports',
        methodName: 'wedaCreateV2',
        params: {
          data: {
            reportId,
            applicantId: currentUser?.userId || '',
            applicantName: currentUser?.name || currentUser?.nickName || '',
            department: expenseForm.department || '市场部',
            expenseType: expenseForm.expenseType,
            amount: Number(expenseForm.amount),
            description: expenseForm.description,
            invoiceUrl: expenseForm.invoiceUrl || '',
            status: '待审批',
            submitDate: new Date().toISOString().split('T')[0],
            remark: '',
            createdAt: new Date().toISOString()
          }
        }
      });
      toast({
        title: '报销申请提交成功',
        description: `报销单号：${reportId}`
      });
      setExpenseDialogOpen(false);
      setExpenseForm({
        expenseType: '',
        amount: '',
        description: '',
        department: '',
        invoiceUrl: ''
      });
      loadData();
    } catch (error) {
      toast({
        title: '提交失败',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  // 提交发票申请
  const handleSubmitInvoice = async () => {
    if (!invoiceForm.contractId || !invoiceForm.invoiceAmount || !invoiceForm.invoiceTitle || !invoiceForm.taxNumber) {
      toast({
        title: '请填写完整信息',
        description: '合同、开票金额、发票抬头和纳税人识别号为必填项',
        variant: 'destructive'
      });
      return;
    }
    try {
      const invoiceId = 'INV' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + String(Date.now()).slice(-4);
      const currentUser = props.$w.auth.currentUser;
      const selectedContract = contracts.find(c => c.contractId === invoiceForm.contractId);
      await props.$w.cloud.callDataSource({
        dataSourceName: 'invoice_requests',
        methodName: 'wedaCreateV2',
        params: {
          data: {
            invoiceId,
            contractId: invoiceForm.contractId,
            contractAmount: selectedContract?.amount || Number(invoiceForm.contractAmount),
            customerName: selectedContract?.customerName || invoiceForm.customerName,
            invoiceType: invoiceForm.invoiceType,
            invoiceAmount: Number(invoiceForm.invoiceAmount),
            taxRate: Number(invoiceForm.taxRate),
            invoiceTitle: invoiceForm.invoiceTitle,
            taxNumber: invoiceForm.taxNumber,
            bankAccount: invoiceForm.bankAccount || '',
            address: invoiceForm.address || '',
            invoiceDate: new Date().toISOString().split('T')[0],
            status: '待开票',
            invoiceNumber: '',
            applicantId: currentUser?.userId || '',
            applicantName: currentUser?.name || currentUser?.nickName || '',
            remark: invoiceForm.remark || '',
            createdAt: new Date().toISOString()
          }
        }
      });
      toast({
        title: '发票申请提交成功',
        description: `发票编号：${invoiceId}`
      });
      setInvoiceDialogOpen(false);
      setInvoiceForm({
        contractId: '',
        contractAmount: '',
        customerName: '',
        invoiceType: '增值税专用发票',
        invoiceAmount: '',
        taxRate: '0.06',
        invoiceTitle: '',
        taxNumber: '',
        bankAccount: '',
        address: '',
        remark: ''
      });
      loadData();
    } catch (error) {
      toast({
        title: '提交失败',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  // 提交回款确认
  const handleSubmitPayment = async () => {
    if (!paymentForm.contractId || !paymentForm.currentPayment || !paymentForm.paymentDate) {
      toast({
        title: '请填写完整信息',
        description: '合同、本次回款和回款日期为必填项',
        variant: 'destructive'
      });
      return;
    }
    try {
      const paymentId = 'PAY' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + String(Date.now()).slice(-4);
      const currentUser = props.$w.auth.currentUser;
      const selectedContract = contracts.find(c => c.contractId === paymentForm.contractId);
      const contractAmount = selectedContract?.amount || Number(paymentForm.contractAmount);
      const currentPayment = Number(paymentForm.currentPayment);
      const paidAmount = Number(paymentForm.paidAmount) + currentPayment;
      const remainingAmount = contractAmount - paidAmount;
      await props.$w.cloud.callDataSource({
        dataSourceName: 'payment_records',
        methodName: 'wedaCreateV2',
        params: {
          data: {
            paymentId,
            contractId: paymentForm.contractId,
            contractAmount,
            customerName: selectedContract?.customerName || paymentForm.customerName,
            paidAmount,
            currentPayment,
            remainingAmount: remainingAmount > 0 ? remainingAmount : 0,
            paymentDate: paymentForm.paymentDate,
            paymentMethod: paymentForm.paymentMethod,
            bankAccount: paymentForm.bankAccount,
            payerName: paymentForm.payerName,
            remark: paymentForm.remark || '',
            confirmedBy: currentUser?.name || currentUser?.nickName || '',
            confirmedAt: new Date().toISOString(),
            isTailPayment: remainingAmount <= 0,
            createdAt: new Date().toISOString()
          }
        }
      });
      toast({
        title: '回款确认成功',
        description: `回款编号：${paymentId}`
      });
      setPaymentDialogOpen(false);
      setPaymentForm({
        contractId: '',
        contractAmount: '',
        customerName: '',
        paidAmount: '',
        currentPayment: '',
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMethod: '银行转账',
        bankAccount: '工商银行1234567890',
        payerName: '',
        remark: ''
      });
      loadData();
    } catch (error) {
      toast({
        title: '提交失败',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  // 选择合同
  const handleContractSelect = contractId => {
    const contract = contracts.find(c => c.contractId === contractId);
    if (contract) {
      if (activeTab === 'invoice') {
        setInvoiceForm({
          ...invoiceForm,
          contractId: contract.contractId,
          contractAmount: String(contract.amount),
          customerName: contract.customerName || '',
          invoiceAmount: String(contract.amount - (contract.paidAmount || 0))
        });
      } else if (activeTab === 'payment') {
        const paidAmount = paymentRecords.filter(p => p.contractId === contract.contractId).reduce((sum, p) => sum + p.currentPayment, 0);
        setPaymentForm({
          ...paymentForm,
          contractId: contract.contractId,
          contractAmount: String(contract.amount),
          customerName: contract.customerName || '',
          paidAmount: String(paidAmount)
        });
      }
    }
  };

  // 状态样式
  const getStatusStyle = status => {
    const statusMap = {
      '待审批': 'bg-amber-500',
      '已审批': 'bg-emerald-500',
      '已拒绝': 'bg-red-500',
      '待开票': 'bg-amber-500',
      '已开票': 'bg-emerald-500'
    };
    return statusMap[status] || 'bg-gray-500';
  };

  // 获取待审批数量
  const getPendingCount = () => {
    return expenseReports.filter(r => r.status === '待审批').length;
  };

  // 获取待开票数量
  const getPendingInvoiceCount = () => {
    return invoiceRequests.filter(r => r.status === '待开票').length;
  };

  // 获取尾款提醒
  const getTailPaymentReminders = () => {
    return paymentRecords.filter(p => {
      const contract = contracts.find(c => c.contractId === p.contractId);
      return p.remainingAmount > 0 && p.remainingAmount <= p.contractAmount * 0.2;
    });
  };
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-sky-50">
      <div className="max-w-7xl mx-auto px-4 py-6 pb-24">
        {/* 头部标题 */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-800" style={{
          fontFamily: 'Playfair Display, serif'
        }}>财务管理</h1>
          <p className="text-slate-600 mt-1">费用报销、发票申请、回款确认</p>
        </div>
        
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-2 border-[#003D79] shadow-lg bg-gradient-to-br from-[#003D79] to-[#0052a3]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-200 text-sm font-medium">待审批报销</p>
                  <p className="text-3xl font-bold text-white mt-1">{getPendingCount()}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <Receipt className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-[#D4AF37] shadow-lg bg-gradient-to-br from-[#D4AF37] to-[#f4c962]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-800 text-sm font-medium">待开票申请</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">{getPendingInvoiceCount()}</p>
                </div>
                <div className="bg-white/30 p-3 rounded-full">
                  <FileCheck className="h-6 w-6 text-slate-900" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-[#00A896] shadow-lg bg-gradient-to-br from-[#00A896] to-[#00c4b0]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-100 text-sm font-medium">本月回款</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    ¥{paymentRecords.filter(p => p.paymentDate && p.paymentDate.startsWith(new Date().toISOString().slice(0, 7))).reduce((sum, p) => sum + p.currentPayment, 0).toLocaleString('zh-CN')}
                  </p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <Wallet className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-red-500 shadow-lg bg-gradient-to-br from-red-500 to-red-600">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-100 text-sm font-medium">尾款提醒</p>
                  <p className="text-3xl font-bold text-white mt-1">{getTailPaymentReminders().length}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* 主内容区 */}
        <Card className="border-2 border-slate-200 shadow-xl">
          <CardContent className="p-6">
            {/* 标签页切换 */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="expense" className="data-[state=active]:bg-[#003D79] data-[state=active]:text-white">
                  <Receipt className="h-4 w-4 mr-2" />
                  费用报销
                </TabsTrigger>
                <TabsTrigger value="invoice" className="data-[state=active]:bg-[#003D79] data-[state=active]:text-white">
                  <FileText className="h-4 w-4 mr-2" />
                  发票申请
                </TabsTrigger>
                <TabsTrigger value="payment" className="data-[state=active]:bg-[#003D79] data-[state=active]:text-white">
                  <Wallet className="h-4 w-4 mr-2" />
                  回款确认
                </TabsTrigger>
              </TabsList>
              
              {/* 费用报销标签页 */}
              <TabsContent value="expense" className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Input placeholder="搜索报销单..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-64" />
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="状态" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部</SelectItem>
                        <SelectItem value="待审批">待审批</SelectItem>
                        <SelectItem value="已审批">已审批</SelectItem>
                        <SelectItem value="已拒绝">已拒绝</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Dialog open={expenseDialogOpen} onOpenChange={setExpenseDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-[#003D79] hover:bg-[#004a8c]">
                        <Plus className="h-4 w-4 mr-2" />
                        新增报销
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>新增费用报销</DialogTitle>
                        <DialogDescription>填写费用报销信息</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div>
                          <Label>费用类型 *</Label>
                          <Select value={expenseForm.expenseType} onValueChange={value => setExpenseForm({
                          ...expenseForm,
                          expenseType: value
                        })}>
                            <SelectTrigger className="w-full mt-1">
                              <SelectValue placeholder="选择费用类型" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="差旅费">差旅费</SelectItem>
                              <SelectItem value="招待费">招待费</SelectItem>
                              <SelectItem value="交通费">交通费</SelectItem>
                              <SelectItem value="住宿费">住宿费</SelectItem>
                              <SelectItem value="办公用品">办公用品</SelectItem>
                              <SelectItem value="培训费">培训费</SelectItem>
                              <SelectItem value="其他">其他</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>报销金额 *</Label>
                          <Input type="number" placeholder="请输入金额" value={expenseForm.amount} onChange={e => setExpenseForm({
                          ...expenseForm,
                          amount: e.target.value
                        })} className="mt-1" />
                        </div>
                        <div>
                          <Label>费用说明 *</Label>
                          <Textarea placeholder="请输入费用说明" value={expenseForm.description} onChange={e => setExpenseForm({
                          ...expenseForm,
                          description: e.target.value
                        })} className="mt-1" rows={3} />
                        </div>
                        <div>
                          <Label>部门</Label>
                          <Select value={expenseForm.department} onValueChange={value => setExpenseForm({
                          ...expenseForm,
                          department: value
                        })}>
                            <SelectTrigger className="w-full mt-1">
                              <SelectValue placeholder="选择部门" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="审核部">审核部</SelectItem>
                              <SelectItem value="市场部">市场部</SelectItem>
                              <SelectItem value="人力资源部">人力资源部</SelectItem>
                              <SelectItem value="综合管理部">综合管理部</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setExpenseDialogOpen(false)}>取消</Button>
                        <Button className="bg-[#003D79] hover:bg-[#004a8c]" onClick={handleSubmitExpense}>提交</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <div className="grid gap-4">
                  {expenseReports.filter(report => {
                  const matchSearch = report.reportId?.toLowerCase().includes(searchTerm.toLowerCase()) || report.applicantName?.toLowerCase().includes(searchTerm.toLowerCase()) || report.description?.toLowerCase().includes(searchTerm.toLowerCase());
                  const matchFilter = filterStatus === 'all' || report.status === filterStatus;
                  return matchSearch && matchFilter;
                }).map(report => <Card key={report.reportId} className="border-l-4 border-l-[#003D79] hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-slate-800">{report.reportId}</h3>
                                <Badge className={getStatusStyle(report.status)}>{report.status}</Badge>
                              </div>
                              <div className="space-y-1 text-sm">
                                <div className="flex items-center gap-2">
                                  <span className="text-slate-600">申请人：</span>
                                  <span className="font-medium">{report.applicantName}</span>
                                  <span className="text-slate-400 mx-2">|</span>
                                  <span className="text-slate-600">部门：</span>
                                  <span className="font-medium">{report.department}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-slate-600">费用类型：</span>
                                  <span className="font-medium">{report.expenseType}</span>
                                  <span className="text-slate-400 mx-2">|</span>
                                  <span className="text-slate-600">金额：</span>
                                  <span className="font-semibold text-[#003D79]">{formatAmount(report.amount, report.reportId)}</span>
                                  <button onClick={() => toggleAmountVisibility(report.reportId)} className="text-slate-500 hover:text-slate-700 ml-2">
                                    {showAmounts[report.reportId] ? '👁️' : '👁️‍🗨️'}
                                  </button>
                                </div>
                                <div className="flex items-start gap-2">
                                  <span className="text-slate-600">说明：</span>
                                  <span className="text-slate-800">{report.description}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-slate-600">提交日期：</span>
                                  <span className="font-medium">{report.submitDate}</span>
                                  {report.approveDate && <>
                                      <span className="text-slate-400 mx-2">|</span>
                                      <span className="text-slate-600">审批日期：</span>
                                      <span className="font-medium">{report.approveDate}</span>
                                    </>}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>)}
                </div>
              </TabsContent>
              
              {/* 发票申请标签页 */}
              <TabsContent value="invoice" className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Input placeholder="搜索发票申请..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-64" />
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="状态" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部</SelectItem>
                        <SelectItem value="待开票">待开票</SelectItem>
                        <SelectItem value="已开票">已开票</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Dialog open={invoiceDialogOpen} onOpenChange={setInvoiceDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-[#003D79] hover:bg-[#004a8c]">
                        <Plus className="h-4 w-4 mr-2" />
                        新增申请
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>新增发票申请</DialogTitle>
                        <DialogDescription>填写发票申请信息</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                        <div>
                          <Label>选择合同 *</Label>
                          <Select value={invoiceForm.contractId} onValueChange={handleContractSelect}>
                            <SelectTrigger className="w-full mt-1">
                              <SelectValue placeholder="选择合同" />
                            </SelectTrigger>
                            <SelectContent>
                              {contracts.map(contract => <SelectItem key={contract.contractId} value={contract.contractId}>
                                  {contract.contractId} - {contract.customerName} ({formatAmount(contract.amount, `contract-${contract.contractId}`)})
                                </SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>发票类型 *</Label>
                          <Select value={invoiceForm.invoiceType} onValueChange={value => setInvoiceForm({
                          ...invoiceForm,
                          invoiceType: value
                        })}>
                            <SelectTrigger className="w-full mt-1">
                              <SelectValue placeholder="选择发票类型" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="增值税专用发票">增值税专用发票</SelectItem>
                              <SelectItem value="增值税普通发票">增值税普通发票</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>开票金额 *</Label>
                          <Input type="number" placeholder="请输入开票金额" value={invoiceForm.invoiceAmount} onChange={e => setInvoiceForm({
                          ...invoiceForm,
                          invoiceAmount: e.target.value
                        })} className="mt-1" />
                        </div>
                        <div>
                          <Label>税率</Label>
                          <Select value={invoiceForm.taxRate} onValueChange={value => setInvoiceForm({
                          ...invoiceForm,
                          taxRate: value
                        })}>
                            <SelectTrigger className="w-full mt-1">
                              <SelectValue placeholder="选择税率" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0.06">6%</SelectItem>
                              <SelectItem value="0.13">13%</SelectItem>
                              <SelectItem value="0.03">3%</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>发票抬头 *</Label>
                          <Input placeholder="请输入发票抬头" value={invoiceForm.invoiceTitle} onChange={e => setInvoiceForm({
                          ...invoiceForm,
                          invoiceTitle: e.target.value
                        })} className="mt-1" />
                        </div>
                        <div>
                          <Label>纳税人识别号 *</Label>
                          <Input placeholder="请输入纳税人识别号" value={invoiceForm.taxNumber} onChange={e => setInvoiceForm({
                          ...invoiceForm,
                          invoiceTitle: e.target.value
                        })} className="mt-1" />
                        </div>
                        <div>
                          <Label>银行账号</Label>
                          <Input placeholder="请输入银行账号（专票必填）" value={invoiceForm.bankAccount} onChange={e => setInvoiceForm({
                          ...invoiceForm,
                          bankAccount: e.target.value
                        })} className="mt-1" />
                        </div>
                        <div>
                          <Label>地址电话</Label>
                          <Textarea placeholder="请输入地址电话（专票必填）" value={invoiceForm.address} onChange={e => setInvoiceForm({
                          ...invoiceForm,
                          address: e.target.value
                        })} className="mt-1" rows={2} />
                        </div>
                        <div>
                          <Label>备注</Label>
                          <Textarea placeholder="请输入备注" value={invoiceForm.remark} onChange={e => setInvoiceForm({
                          ...invoiceForm,
                          remark: e.target.value
                        })} className="mt-1" rows={2} />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setInvoiceDialogOpen(false)}>取消</Button>
                        <Button className="bg-[#003D79] hover:bg-[#004a8c]" onClick={handleSubmitInvoice}>提交</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <div className="grid gap-4">
                  {invoiceRequests.filter(request => {
                  const matchSearch = request.invoiceId?.toLowerCase().includes(searchTerm.toLowerCase()) || request.customerName?.toLowerCase().includes(searchTerm.toLowerCase());
                  const matchFilter = filterStatus === 'all' || request.status === filterStatus;
                  return matchSearch && matchFilter;
                }).map(request => <Card key={request.invoiceId} className="border-l-4 border-l-[#D4AF37] hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-slate-800">{request.invoiceId}</h3>
                                <Badge className={getStatusStyle(request.status)}>{request.status}</Badge>
                              </div>
                              <div className="space-y-1 text-sm">
                                <div className="flex items-center gap-2">
                                  <span className="text-slate-600">客户名称：</span>
                                  <span className="font-medium">{request.customerName}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-slate-600">合同编号：</span>
                                  <span className="font-medium">{request.contractId}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-slate-600">发票类型：</span>
                                  <span className="font-medium">{request.invoiceType}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-slate-600">开票金额：</span>
                                  <span className="font-semibold text-[#D4AF37]">{formatAmount(request.invoiceAmount, request.invoiceId)}</span>
                                  <button onClick={() => toggleAmountVisibility(request.invoiceId)} className="text-slate-500 hover:text-slate-700 ml-2">
                                    {showAmounts[request.invoiceId] ? '👁️' : '👁️‍🗨️'}
                                  </button>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-slate-600">发票抬头：</span>
                                  <span className="font-medium">{request.invoiceTitle}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-slate-600">开票日期：</span>
                                  <span className="font-medium">{request.invoiceDate}</span>
                                  {request.invoiceNumber && <>
                                      <span className="text-slate-400 mx-2">|</span>
                                      <span className="text-slate-600">发票号码：</span>
                                      <span className="font-medium">{request.invoiceNumber}</span>
                                    </>}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>)}
                </div>
              </TabsContent>
              
              {/* 回款确认标签页 */}
              <TabsContent value="payment" className="space-y-4">
                {/* 尾款提醒 */}
                {getTailPaymentReminders().length > 0 && <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                      <h3 className="font-semibold text-red-800">尾款提醒</h3>
                    </div>
                    <div className="space-y-2">
                      {getTailPaymentReminders().map((payment, index) => <div key={index} className="flex items-center justify-between bg-white rounded p-2 text-sm">
                          <div>
                            <span className="font-medium">{payment.customerName}</span>
                            <span className="text-slate-600 mx-2">|</span>
                            <span>剩余：{formatAmount(payment.remainingAmount, payment.paymentId)}</span>
                          </div>
                          <button onClick={() => toggleAmountVisibility(payment.paymentId)} className="text-slate-500 hover:text-slate-700">
                            {showAmounts[payment.paymentId] ? '👁️' : '👁️‍🗨️'}
                          </button>
                        </div>)}
                    </div>
                  </div>}
                
                <div className="flex items-center justify-between mb-4">
                  <Input placeholder="搜索回款记录..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-64" />
                  <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-[#003D79] hover:bg-[#004a8c]">
                        <Plus className="h-4 w-4 mr-2" />
                        确认回款
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>确认回款</DialogTitle>
                        <DialogDescription>填写回款确认信息</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div>
                          <Label>选择合同 *</Label>
                          <Select value={paymentForm.contractId} onValueChange={handleContractSelect}>
                            <SelectTrigger className="w-full mt-1">
                              <SelectValue placeholder="选择合同" />
                            </SelectTrigger>
                            <SelectContent>
                              {contracts.map(contract => <SelectItem key={contract.contractId} value={contract.contractId}>
                                  {contract.contractId} - {contract.customerName}
                                </SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>合同金额</Label>
                          <Input disabled value={paymentForm.contractAmount} className="mt-1 bg-slate-50" />
                        </div>
                        <div>
                          <Label>已收金额</Label>
                          <Input disabled value={paymentForm.paidAmount} className="mt-1 bg-slate-50" />
                        </div>
                        <div>
                          <Label>本次回款 *</Label>
                          <Input type="number" placeholder="请输入本次回款金额" value={paymentForm.currentPayment} onChange={e => setPaymentForm({
                          ...paymentForm,
                          currentPayment: e.target.value
                        })} className="mt-1" />
                        </div>
                        <div>
                          <Label>回款日期 *</Label>
                          <Input type="date" value={paymentForm.paymentDate} onChange={e => setPaymentForm({
                          ...paymentForm,
                          paymentDate: e.target.value
                        })} className="mt-1" />
                        </div>
                        <div>
                          <Label>付款方式 *</Label>
                          <Select value={paymentForm.paymentMethod} onValueChange={value => setPaymentForm({
                          ...paymentForm,
                          paymentMethod: value
                        })}>
                            <SelectTrigger className="w-full mt-1">
                              <SelectValue placeholder="选择付款方式" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="银行转账">银行转账</SelectItem>
                              <SelectItem value="现金">现金</SelectItem>
                              <SelectItem value="支票">支票</SelectItem>
                              <SelectItem value="其他">其他</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>收款账号 *</Label>
                          <Input placeholder="请输入收款账号" value={paymentForm.bankAccount} onChange={e => setPaymentForm({
                          ...paymentForm,
                          bankAccount: e.target.value
                        })} className="mt-1" />
                        </div>
                        <div>
                          <Label>付款单位 *</Label>
                          <Input placeholder="请输入付款单位" value={paymentForm.payerName} onChange={e => setPaymentForm({
                          ...paymentForm,
                          payerName: e.target.value
                        })} className="mt-1" />
                        </div>
                        <div>
                          <Label>备注</Label>
                          <Textarea placeholder="请输入备注" value={paymentForm.remark} onChange={e => setPaymentForm({
                          ...paymentForm,
                          remark: e.target.value
                        })} className="mt-1" rows={2} />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>取消</Button>
                        <Button className="bg-[#003D79] hover:bg-[#004a8c]" onClick={handleSubmitPayment}>提交</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <div className="grid gap-4">
                  {paymentRecords.filter(record => {
                  return record.paymentId?.toLowerCase().includes(searchTerm.toLowerCase()) || record.customerName?.toLowerCase().includes(searchTerm.toLowerCase());
                }).map(record => <Card key={record.paymentId} className={`border-l-4 hover:shadow-lg transition-shadow ${record.remainingAmount > 0 && record.remainingAmount <= record.contractAmount * 0.2 ? 'border-l-red-500' : 'border-l-[#00A896]'}`}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-slate-800">{record.paymentId}</h3>
                                {record.isTailPayment && <Badge className="bg-emerald-500">尾款已清</Badge>}
                                {record.remainingAmount > 0 && record.remainingAmount <= record.contractAmount * 0.2 && <Badge className="bg-red-500">尾款提醒</Badge>}
                              </div>
                              <div className="space-y-1 text-sm">
                                <div className="flex items-center gap-2">
                                  <span className="text-slate-600">客户名称：</span>
                                  <span className="font-medium">{record.customerName}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-slate-600">合同编号：</span>
                                  <span className="font-medium">{record.contractId}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-slate-600">合同金额：</span>
                                  <span className="font-medium">{formatAmount(record.contractAmount, record.paymentId)}</span>
                                  <span className="text-slate-400 mx-2">|</span>
                                  <span className="text-slate-600">已收金额：</span>
                                  <span className="font-medium text-emerald-600">{formatAmount(record.paidAmount, `${record.paymentId}-paid`)}</span>
                                  <span className="text-slate-400 mx-2">|</span>
                                  <span className="text-slate-600">剩余金额：</span>
                                  <span className={`font-semibold ${record.remainingAmount > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                                    {formatAmount(record.remainingAmount, `${record.paymentId}-remaining`)}
                                  </span>
                                  <button onClick={() => toggleAmountVisibility(record.paymentId)} className="text-slate-500 hover:text-slate-700 ml-2">
                                    {showAmounts[record.paymentId] ? '👁️' : '👁️‍🗨️'}
                                  </button>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-slate-600">本次回款：</span>
                                  <span className="font-semibold text-[#00A896]">{formatAmount(record.currentPayment, `${record.paymentId}-current`)}</span>
                                  <span className="text-slate-400 mx-2">|</span>
                                  <span className="text-slate-600">回款日期：</span>
                                  <span className="font-medium">{record.paymentDate}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-slate-600">付款方式：</span>
                                  <span className="font-medium">{record.paymentMethod}</span>
                                  <span className="text-slate-400 mx-2">|</span>
                                  <span className="text-slate-600">确认人：</span>
                                  <span className="font-medium">{record.confirmedBy}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>)}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      <TabBar />
    </div>;
}