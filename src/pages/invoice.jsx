// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { useToast, Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge, Input, Label, Textarea, Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui';
// @ts-ignore;
import { Edit, Trash2, Share2, Copy, Plus, Building2, MapPin, Phone, Mail, CreditCard, Banknote } from 'lucide-react';

import TabBar from '@/components/TabBar';
export default function Invoice(props) {
  const {
    toast
  } = useToast();
  const [invoiceInfo, setInvoiceInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [invoiceText, setInvoiceText] = useState(''); // 单一文本内容

  // 将分字段数据格式化为单一文本
  const formatInvoiceText = data => {
    return `企业名称：${data.companyName || ''}
税号：${data.taxId || ''}
地址：${data.address || ''}
电话：${data.phone || ''}
开户银行：${data.bankName || ''}
银行账号：${data.bankAccount || ''}`;
  };

  // 从文本解析出分字段数据
  const parseInvoiceText = text => {
    const lines = text.split('\n').filter(line => line.trim());
    const data = {};
    lines.forEach(line => {
      if (line.includes('企业名称：')) {
        data.companyName = line.replace('企业名称：', '').trim();
      } else if (line.includes('税号：')) {
        data.taxId = line.replace('税号：', '').trim();
      } else if (line.includes('地址：')) {
        data.address = line.replace('地址：', '').trim();
      } else if (line.includes('电话：')) {
        data.phone = line.replace('电话：', '').trim();
      } else if (line.includes('开户银行：')) {
        data.bankName = line.replace('开户银行：', '').trim();
      } else if (line.includes('银行账号：')) {
        data.bankAccount = line.replace('银行账号：', '').trim();
      }
    });
    return data;
  };
  useEffect(() => {
    // 从数据模型加载开票信息
    const loadInvoiceInfo = async () => {
      try {
        const result = await props.$w.cloud.callDataSource({
          dataSourceName: 'invoice_info',
          methodName: 'wedaGetRecordsV2',
          params: {
            filter: {
              where: {}
            },
            orderBy: [{
              updatedAt: 'desc'
            }],
            select: {
              $master: true
            },
            pageSize: 1,
            pageNumber: 1
          }
        });
        if (result.records && result.records.length > 0) {
          const invoiceData = result.records[0];
          setInvoiceInfo(invoiceData);
          setEditForm(invoiceData);
          // 将分字段数据转换为单一文本格式
          const text = formatInvoiceText(invoiceData);
          setInvoiceText(text);
        } else {
          // 如果没有数据，创建默认数据
          const defaultInvoice = {
            companyName: '华夏认证有限公司',
            taxId: '91110000123456789A',
            address: '北京市朝阳区建国门外大街1号',
            phone: '010-12345678',
            bankName: '中国工商银行北京建国路支行',
            bankAccount: '0200 1234 5678 9012 345',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          const createResult = await props.$w.cloud.callDataSource({
            dataSourceName: 'invoice_info',
            methodName: 'wedaCreateV2',
            params: {
              data: defaultInvoice
            }
          });
          setInvoiceInfo(createResult);
          setEditForm(createResult);
          // 将分字段数据转换为单一文本格式
          const text = formatInvoiceText(createResult);
          setInvoiceText(text);
        }
        setLoading(false);
      } catch (error) {
        console.error('加载开票信息失败:', error);
        // 使用默认数据作为降级方案
        const defaultInvoice = {
          companyName: '华夏认证有限公司',
          taxId: '91110000123456789A',
          address: '北京市朝阳区建国门外大街1号',
          phone: '010-12345678',
          bankName: '中国工商银行北京建国路支行',
          bankAccount: '0200 1234 5678 9012 345',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setInvoiceInfo(defaultInvoice);
        setEditForm(defaultInvoice);
        const text = formatInvoiceText(defaultInvoice);
        setInvoiceText(text);
        setLoading(false);
      }
    };
    loadInvoiceInfo();
  }, []);
  const handleEdit = () => {
    setIsEditing(true);
    setEditForm(invoiceInfo);
    // 将当前数据转换为文本格式用于编辑
    const text = formatInvoiceText(invoiceInfo);
    setInvoiceText(text);
  };
  const handleSave = async () => {
    try {
      // 从文本解析出分字段数据
      const parsedData = parseInvoiceText(invoiceText);
      const updatedData = {
        ...invoiceInfo,
        ...parsedData,
        updatedAt: new Date().toISOString()
      };

      // 更新数据库中的开票信息
      await props.$w.cloud.callDataSource({
        dataSourceName: 'invoice_info',
        methodName: 'wedaUpdateV2',
        params: {
          data: {
            _id: invoiceInfo._id,
            ...updatedData
          }
        }
      });

      // 更新本地状态
      setInvoiceInfo(updatedData);
      setIsEditing(false);
      toast({
        title: '保存成功',
        description: '开票信息已更新'
      });
    } catch (error) {
      console.error('保存开票信息失败:', error);
      toast({
        title: '保存失败',
        description: '开票信息保存失败，请稍后重试',
        variant: 'destructive'
      });
    }
  };
  const handleCancel = () => {
    setIsEditing(false);
    setEditForm(invoiceInfo);
  };
  const handleShare = async () => {
    try {
      const infoText = `开票信息：\n${invoiceText}`.trim();
      await navigator.clipboard.writeText(infoText);
      toast({
        title: '分享成功',
        description: '开票信息已复制到剪贴板'
      });
    } catch (error) {
      toast({
        title: '分享失败',
        description: '请稍后重试',
        variant: 'destructive'
      });
    }
  };
  const handleCopy = field => {
    if (field === 'all') {
      navigator.clipboard.writeText(invoiceText);
      toast({
        title: '复制成功',
        description: '开票信息已复制到剪贴板'
      });
    } else {
      navigator.clipboard.writeText(invoiceInfo[field]);
      const fieldName = field === 'companyName' ? '企业名称' : field === 'taxId' ? '税号' : field === 'address' ? '地址' : field === 'phone' ? '电话' : field === 'bankName' ? '开户银行' : field === 'bankAccount' ? '银行账号' : field;
      toast({
        title: '复制成功',
        description: fieldName + '已复制到剪贴板'
      });
    }
  };
  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-amber-800 font-serif">加载中...</p>
        </div>
      </div>;
  }
  if (!invoiceInfo && !isEditing) {
    return <div className="min-h-screen bg-slate-50">
        <header className="bg-blue-800 text-white p-6 shadow-lg">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-serif font-bold text-center">开票信息管理</h1>
          </div>
        </header>
        
        <main className="max-w-4xl mx-auto p-6 pb-24">
          <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
            <CardContent className="p-12 text-center">
              <Building2 className="w-16 h-16 text-amber-400 mx-auto mb-4" />
              <h3 className="text-xl font-serif text-amber-900 mb-2">暂无开票信息</h3>
              <p className="text-amber-700 mb-6">请先添加企业开票信息</p>
              <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                添加开票信息
              </Button>
            </CardContent>
          </Card>
        </main>
        
        <TabBar currentPage="invoice" $w={$w} />
      </div>;
  }
  return <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-blue-800 text-white p-6 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-serif font-bold text-center">开票信息管理</h1>
          <p className="text-center text-amber-100 mt-2">企业开票信息展示与管理</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6 pb-24">
        <Card className="bg-white/90 backdrop-blur-sm border-amber-200 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
            <div>
              <CardTitle className="text-2xl font-serif text-amber-900">企业开票信息</CardTitle>
              <CardDescription className="text-amber-700">企业开票基本信息</CardDescription>
            </div>
            <div className="flex space-x-2">
              {!isEditing && <>
                  <Button variant="outline" size="sm" onClick={handleEdit} className="border-blue-200 text-blue-600 hover:bg-blue-50">
                    <Edit className="w-4 h-4 mr-1" />
                    编辑
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleShare} className="border-blue-200 text-blue-600 hover:bg-blue-50">
                    <Share2 className="w-4 h-4 mr-1" />
                    转发
                  </Button>
                </>}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {isEditing ?
          // 编辑模式
          <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <Label className="text-amber-900 font-medium mb-2 block">开票信息（直接编辑文本）</Label>
                  <Textarea value={invoiceText} onChange={e => {
                if (e && e.target) {
                  setInvoiceText(e.target.value);
                }
              }} className="border-amber-200 focus:border-amber-400 focus:ring-amber-400 font-mono text-sm" rows={10} placeholder="请输入开票信息，格式如下：
企业名称：
税号：
地址：
电话：
开户银行：
银行账号：" />
                  <p className="text-xs text-amber-600 mt-2">提示：按照标准格式填写，每行一个字段</p>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                    保存
                  </Button>
                  <Button variant="outline" onClick={handleCancel} className="border-blue-200 text-blue-600 hover:bg-blue-50">
                    取消
                  </Button>
                </div>
              </div> :
          // 查看模式
          <div className="space-y-6">
                <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-serif text-amber-900">开票信息</h3>
                    <Button variant="outline" size="sm" onClick={() => handleCopy('all')} className="border-blue-200 text-blue-600 hover:bg-blue-50">
                      <Copy className="w-4 h-4 mr-1" />
                      一键复制
                    </Button>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-amber-100">
                    <pre className="whitespace-pre-wrap text-amber-900 font-mono text-sm leading-relaxed">
                      {invoiceText}
                    </pre>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-amber-100">
                  <div className="flex items-center justify-between text-sm text-amber-600">
                    <span>最后更新: {new Date(invoiceInfo.updatedAt).toLocaleString()}</span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      当前版本
                    </Badge>
                  </div>
                </div>
              </div>}
          </CardContent>
        </Card>
      </main>

      {/* Bottom Navigation */}
      <TabBar currentPage="invoice" $w={$w} />
    </div>;
}