// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { useToast, Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge, Alert, AlertDescription, Label, Input, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Textarea } from '@/components/ui';
// @ts-ignore;
import { Award, Clock, AlertTriangle, CheckCircle, Share2, Edit, Trash2, Eye, Plus, Calendar, FileText, Download, X, History } from 'lucide-react';

import TabBar from '@/components/TabBar';
export default function Certificates(props) {
  const {
    toast
  } = useToast();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, expiring, expired
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCertificateData, setNewCertificateData] = useState({
    certificateName: '',
    certificateNumber: '',
    issueDate: '',
    expiryDate: '',
    issuingAuthority: '',
    certificateType: '认证资质',
    certificateUrl: '',
    description: ''
  });
  useEffect(() => {
    const loadCertificates = async () => {
      try {
        const result = await props.$w.cloud.callDataSource({
          dataSourceName: 'qualification_certificates',
          methodName: 'wedaGetRecordsV2',
          params: {
            filter: {
              where: {}
            },
            orderBy: [{
              expiryDate: 'asc'
            }],
            select: {
              $master: true
            },
            pageSize: 50,
            pageNumber: 1
          }
        });
        if (result.records && result.records.length > 0) {
          // 计算证书状态
          const certificatesWithStatus = result.records.map(cert => {
            const today = new Date();
            const expiryDate = new Date(cert.expiryDate);
            const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
            let status = 'valid';
            if (daysUntilExpiry <= 0) {
              status = 'expired';
            } else if (daysUntilExpiry <= 30) {
              status = 'expiring';
            }
            return {
              ...cert,
              status
            };
          });
          setCertificates(certificatesWithStatus);
        } else {
          // 如果没有数据，使用示例数据
          const sampleCertificates = [{
            id: 1,
            certificateName: 'ISO9001质量管理体系认证',
            certificateNumber: 'ISO9001-2024-001',
            issueDate: '2024-01-15',
            expiryDate: '2025-01-15',
            issuingAuthority: '中国质量认证中心',
            certificateType: '认证资质',
            certificateUrl: 'https://example.com/files/iso9001-certificate.pdf',
            description: 'ISO9001质量管理体系认证证书，认证范围：认证服务',
            status: 'expiring'
          }, {
            id: 2,
            certificateName: '特种设备检验检测机构核准证',
            certificateNumber: 'TS2024-TS-002',
            issueDate: '2024-03-01',
            expiryDate: '2025-03-01',
            issuingAuthority: '国家市场监督管理总局',
            certificateType: '特种设备',
            certificateUrl: 'https://example.com/files/special-equipment-cert.pdf',
            description: '特种设备检验检测机构核准证书',
            status: 'valid'
          }];
          setCertificates(sampleCertificates);
        }
        setLoading(false);
      } catch (error) {
        console.error('加载资质证书失败:', error);
        // 使用示例数据作为降级方案
        const sampleCertificates = [{
          id: 1,
          certificateName: 'ISO9001质量管理体系认证',
          certificateNumber: 'ISO9001-2024-001',
          issueDate: '2024-01-15',
          expiryDate: '2025-01-15',
          issuingAuthority: '中国质量认证中心',
          certificateType: '认证资质',
          certificateUrl: 'https://example.com/files/iso9001-certificate.pdf',
          description: 'ISO9001质量管理体系认证证书，认证范围：认证服务',
          status: 'expiring'
        }, {
          id: 2,
          certificateName: '特种设备检验检测机构核准证',
          certificateNumber: 'TS2024-TS-002',
          issueDate: '2024-03-01',
          expiryDate: '2025-03-01',
          issuingAuthority: '国家市场监督管理总局',
          certificateType: '特种设备',
          certificateUrl: 'https://example.com/files/special-equipment-cert.pdf',
          description: '特种设备检验检测机构核准证书',
          status: 'valid'
        }, {
          id: 3,
          certificateName: '营业执照',
          certificateNumber: '91110000123456789A',
          issueDate: '2020-05-20',
          expiryDate: '2030-05-20',
          issuingAuthority: '北京市市场监督管理局',
          certificateType: '营业执照',
          certificateUrl: 'https://example.com/files/business-license.pdf',
          description: '企业法人营业执照',
          status: 'valid'
        }, {
          id: 4,
          certificateName: '发明专利证书',
          certificateNumber: 'ZL202310123456.7',
          issueDate: '2023-08-10',
          expiryDate: '2024-12-01',
          issuingAuthority: '国家知识产权局',
          certificateType: '专利证书',
          certificateUrl: 'https://example.com/files/patent-certificate.pdf',
          description: '发明专利证书，专利名称：一种智能认证管理系统',
          status: 'valid'
        }];
        setCertificates(sampleCertificates);
        setLoading(false);
      }
    };
    loadCertificates();
  }, []);
  const calculateDaysUntilExpiry = expiryDate => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  const getCertificateStatus = expiryDate => {
    const daysUntilExpiry = calculateDaysUntilExpiry(expiryDate);
    if (daysUntilExpiry < 0) return 'expired';
    if (daysUntilExpiry <= 30) return 'expiring';
    return 'valid';
  };
  const getStatusBadge = status => {
    switch (status) {
      case 'valid':
        return {
          color: 'bg-green-100 text-green-800',
          icon: <CheckCircle className="w-4 h-4" />
        };
      case 'expiring':
        return {
          color: 'bg-orange-100 text-orange-800',
          icon: <AlertTriangle className="w-4 h-4" />
        };
      case 'expired':
        return {
          color: 'bg-red-100 text-red-800',
          icon: <AlertTriangle className="w-4 h-4" />
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: <Clock className="w-4 h-4" />
        };
    }
  };
  const filteredCertificates = certificates.filter(cert => {
    if (filter === 'all') return true;
    return cert.status === filter;
  });
  const expiringCertificates = certificates.filter(cert => cert.status === 'expiring');
  const expiredCertificates = certificates.filter(cert => cert.status === 'expired');
  const handleShare = certificate => {
    const shareText = `
资质证书信息：
证书名称：${certificate.certificateName}
证书编号：${certificate.certificateNumber}
发证机构：${certificate.issuingAuthority}
有效期至：${certificate.expiryDate}
    `.trim();
    navigator.clipboard.writeText(shareText);
    toast({
      title: '分享成功',
      description: '证书信息已复制到剪贴板'
    });
  };
  const handleView = certificate => {
    toast({
      title: '查看证书',
      description: `查看 ${certificate.certificateName} 功能开发中...`
    });
  };
  const handleEdit = certificate => {
    toast({
      title: '编辑证书',
      description: `编辑 ${certificate.certificateName} 功能开发中...`
    });
  };
  const handleDelete = certificate => {
    toast({
      title: '删除证书',
      description: `删除 ${certificate.certificateName} 功能开发中...`
    });
  };
  const handleAddNewCertificate = () => {
    setShowAddForm(true);
  };
  const handleSubmitNewCertificate = async () => {
    if (!newCertificateData.certificateName || !newCertificateData.certificateNumber || !newCertificateData.expiryDate) {
      toast({
        title: '提示',
        description: '证书名称、编号和有效期不能为空',
        variant: 'destructive'
      });
      return;
    }
    try {
      // 上传到数据模型
      const result = await props.$w.cloud.callDataSource({
        dataSourceName: 'qualification_certificates',
        methodName: 'wedaCreateV2',
        params: {
          data: {
            certificateName: newCertificateData.certificateName,
            certificateNumber: newCertificateData.certificateNumber,
            issueDate: newCertificateData.issueDate,
            expiryDate: newCertificateData.expiryDate,
            issuingAuthority: newCertificateData.issuingAuthority,
            certificateType: newCertificateData.certificateType,
            certificateUrl: newCertificateData.certificateUrl,
            description: newCertificateData.description,
            status: getCertificateStatus(newCertificateData.expiryDate),
            version: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
      });
      if (result && result._id) {
        // 重新加载证书列表
        await loadCertificates();
        toast({
          title: '成功',
          description: '证书添加成功',
          variant: 'success'
        });
        setShowAddForm(false);
        setNewCertificateData({
          certificateName: '',
          certificateNumber: '',
          issueDate: '',
          expiryDate: '',
          issuingAuthority: '',
          certificateType: '认证资质',
          certificateUrl: '',
          description: ''
        });
      } else {
        throw new Error('添加失败：未返回证书ID');
      }
    } catch (error) {
      console.error('添加证书失败:', error);
      toast({
        title: '添加失败',
        description: '证书添加失败，请稍后重试',
        variant: 'destructive'
      });
    }
  };
  const handleCancelAddForm = () => {
    setShowAddForm(false);
    setNewCertificateData({
      certificateName: '',
      certificateNumber: '',
      issueDate: '',
      expiryDate: '',
      issuingAuthority: '',
      certificateType: '认证资质',
      certificateUrl: '',
      description: ''
    });
  };
  const handleDownload = certificate => {
    toast({
      title: '下载证书',
      description: `下载 ${certificate.certificateName} 功能开发中...`
    });
  };
  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-amber-800 font-serif">加载证书中...</p>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-blue-800 text-white p-6 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-serif font-bold text-center">资质证书管理</h1>
              <p className="text-center text-amber-100 mt-2">证书有效期提醒与管理</p>
            </div>
            <Button onClick={handleAddNewCertificate} className="bg-blue-600 hover:bg-blue-700 ml-4">
              <Plus className="h-4 w-4 mr-2" />
              新增证书
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6 pb-24">
        {/* Expiring Soon Alert */}
        {expiringCertificates.length > 0 && <Alert className="mb-6 bg-orange-50 border-orange-200">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>提醒：</strong> 有 {expiringCertificates.length} 个证书即将在30天内过期，请及时处理续期事宜。
            </AlertDescription>
          </Alert>}

        {/* Expired Alert */}
        {expiredCertificates.length > 0 && <Alert className="mb-6 bg-red-50 border-red-200">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>警告：</strong> 有 {expiredCertificates.length} 个证书已过期，请立即处理续期事宜。
            </AlertDescription>
          </Alert>}

        {/* Filter Buttons */}
        <div className="mb-6">
          <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-2">
                <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')} className={filter === 'all' ? 'bg-blue-600' : 'border-blue-200 text-blue-600 hover:bg-blue-50'}>
                  全部证书 ({certificates.length})
                </Button>
                <Button variant={filter === 'valid' ? 'default' : 'outline'} onClick={() => setFilter('valid')} className={filter === 'valid' ? 'bg-blue-600' : 'border-blue-200 text-blue-600 hover:bg-blue-50'}>
                  有效证书 ({certificates.filter(c => c.status === 'valid').length})
                </Button>
                <Button variant={filter === 'expiring' ? 'default' : 'outline'} onClick={() => setFilter('expiring')} className={filter === 'expiring' ? 'bg-amber-500' : 'border-amber-200 text-amber-600 hover:bg-amber-50'}>
                  即将过期 ({expiringCertificates.length})
                </Button>
                <Button variant={filter === 'expired' ? 'default' : 'outline'} onClick={() => setFilter('expired')} className={filter === 'expired' ? 'bg-slate-600' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}>
                  已过期 ({expiredCertificates.length})
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Certificates List */}
        <div className="grid gap-4">
          {filteredCertificates.map(certificate => {
          const statusBadge = getStatusBadge(certificate.status);
          const daysUntilExpiry = calculateDaysUntilExpiry(certificate.expiryDate);
          return <Card key={certificate.id} className="bg-white/90 backdrop-blur-sm border-amber-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <Award className="w-8 h-8 text-amber-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-medium text-amber-900">{certificate.certificateName}</h3>
                            <Badge className={statusBadge.color}>
                              {statusBadge.icon}
                              <span className="ml-1">
                                {certificate.status === 'valid' && '有效'}
                                {certificate.status === 'expiring' && '即将过期'}
                                {certificate.status === 'expired' && '已过期'}
                              </span>
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div>
                              <p className="text-amber-700 font-medium">证书编号</p>
                              <p className="text-amber-900 font-mono">{certificate.certificateNumber}</p>
                            </div>
                            <div>
                              <p className="text-amber-700 font-medium">发证机构</p>
                              <p className="text-amber-900">{certificate.issuingAuthority}</p>
                            </div>
                            <div>
                              <p className="text-amber-700 font-medium">发证日期</p>
                              <p className="text-amber-900">{new Date(certificate.issueDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="text-amber-700 font-medium">有效期至</p>
                              <p className="text-amber-900">
                                {new Date(certificate.expiryDate).toLocaleDateString()}
                                {certificate.status === 'expiring' && <span className="ml-2 text-orange-600 font-medium">
                                    ({daysUntilExpiry} 天后过期)
                                  </span>}
                                {certificate.status === 'expired' && <span className="ml-2 text-red-600 font-medium">
                                    (已过期 {Math.abs(daysUntilExpiry)} 天)
                                  </span>}
                              </p>
                            </div>
                          </div>
                          
                          <p className="text-amber-700 text-sm mt-2">{certificate.description}</p>
                          
                          <div className="flex items-center space-x-2 mt-3">
                            <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                              {certificate.certificateType}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <Button variant="ghost" size="sm" onClick={() => handleView(certificate)} className="text-blue-600 hover:bg-blue-50">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDownload(certificate)} className="text-blue-600 hover:bg-blue-50">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleShare(certificate)} className="text-green-600 hover:bg-green-50">
                            <Share2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(certificate)} className="text-blue-600 hover:bg-blue-50">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleViewVersionHistory(certificate)} className="text-purple-600 hover:bg-purple-50">
                            <History className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(certificate)} className="text-rose-600 hover:bg-rose-50">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>;
        })}
        </div>

        {filteredCertificates.length === 0 && <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
            <CardContent className="p-12 text-center">
              <Award className="w-16 h-16 text-amber-400 mx-auto mb-4" />
              <h3 className="text-xl font-serif text-amber-900 mb-2">暂无证书</h3>
              <p className="text-amber-700">
                {filter === 'all' ? '还没有添加任何证书' : filter === 'expiring' ? '没有即将过期的证书' : filter === 'expired' ? '没有已过期的证书' : '没有有效的证书'}
              </p>
            </CardContent>
          </Card>}
      </main>

      {/* 新增证书弹层 */}
      {showAddForm && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>新增证书</CardTitle>
              <CardDescription>添加新的资质证书信息</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="certificateName">证书名称 *</Label>
                <Input id="certificateName" value={newCertificateData.certificateName} onChange={e => {
              if (e && e.target) {
                setNewCertificateData(prev => ({
                  ...prev,
                  certificateName: e.target.value
                }));
              }
            }} placeholder="请输入证书名称" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="certificateNumber">证书编号 *</Label>
                <Input id="certificateNumber" value={newCertificateData.certificateNumber} onChange={e => {
              if (e && e.target) {
                setNewCertificateData(prev => ({
                  ...prev,
                  certificateNumber: e.target.value
                }));
              }
            }} placeholder="请输入证书编号" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="certificateType">证书类型</Label>
                <Select value={newCertificateData.certificateType} onValueChange={value => setNewCertificateData(prev => ({
              ...prev,
              certificateType: value
            }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择证书类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="认证资质">认证资质</SelectItem>
                    <SelectItem value="营业执照">营业执照</SelectItem>
                    <SelectItem value="特种设备">特种设备</SelectItem>
                    <SelectItem value="专利证书">专利证书</SelectItem>
                    <SelectItem value="其他证书">其他证书</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="issuingAuthority">发证机构</Label>
                <Input id="issuingAuthority" value={newCertificateData.issuingAuthority} onChange={e => {
              if (e && e.target) {
                setNewCertificateData(prev => ({
                  ...prev,
                  issuingAuthority: e.target.value
                }));
              }
            }} placeholder="请输入发证机构" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="issueDate">发证日期</Label>
                <Input id="issueDate" type="date" value={newCertificateData.issueDate} onChange={e => {
              if (e && e.target) {
                setNewCertificateData(prev => ({
                  ...prev,
                  issueDate: e.target.value
                }));
              }
            }} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expiryDate">有效期 *</Label>
                <Input id="expiryDate" type="date" value={newCertificateData.expiryDate} onChange={e => {
              if (e && e.target) {
                setNewCertificateData(prev => ({
                  ...prev,
                  expiryDate: e.target.value
                }));
              }
            }} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="certificateUrl">证书链接（可选）</Label>
                <Input id="certificateUrl" value={newCertificateData.certificateUrl} onChange={e => {
              if (e && e.target) {
                setNewCertificateData(prev => ({
                  ...prev,
                  certificateUrl: e.target.value
                }));
              }
            }} placeholder="请输入证书链接地址" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">证书描述</Label>
                <Textarea id="description" value={newCertificateData.description} onChange={e => {
              if (e && e.target) {
                setNewCertificateData(prev => ({
                  ...prev,
                  description: e.target.value
                }));
              }
            }} placeholder="请输入证书描述" rows={3} />
              </div>
            </CardContent>
            <div className="p-6 pt-0 flex space-x-3">
              <Button onClick={handleSubmitNewCertificate} className="flex-1 bg-blue-600 hover:bg-blue-700">
                <Award className="h-4 w-4 mr-2" />
                保存
              </Button>
              <Button variant="outline" onClick={handleCancelAddForm} className="flex-1">
                <X className="h-4 w-4 mr-2" />
                取消
              </Button>
            </div>
          </Card>
        </div>}

      {/* Bottom Navigation */}
      <TabBar currentPage="certificates" $w={$w} />
    </div>;
}