// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { useToast, Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge, Tabs, TabsContent, TabsList, TabsTrigger, Label, Input, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Textarea } from '@/components/ui';
// @ts-ignore;
import { FileText, Download, Share2, Edit, Trash2, Eye, Plus, Upload, Clock, FileCheck, Award, Calendar, X } from 'lucide-react';

import TabBar from '@/components/TabBar';
export default function Files(props) {
  const {
    toast
  } = useToast();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('contracts');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadFormData, setUploadFormData] = useState({
    fileName: '',
    fileType: '合同模板',
    description: '',
    expiryDate: ''
  });
  const [versionHistory, setVersionHistory] = useState({});
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  useEffect(() => {
    // 加载示例文件数据
    const loadSampleFiles = () => {
      const sampleFiles = {
        contracts: [{
          id: 1,
          fileName: 'ISO9001认证服务合同模板.docx',
          fileType: '合同模板',
          fileSize: '245 KB',
          description: 'ISO9001质量管理体系认证服务标准合同模板，包含服务条款和付款方式',
          uploadDate: new Date('2024-01-15').toISOString(),
          downloadCount: 156,
          fileUrl: 'https://example.com/files/iso9001-contract-template.docx'
        }, {
          id: 2,
          fileName: 'ISO14001环境管理体系合同模板.docx',
          fileType: '合同模板',
          fileSize: '238 KB',
          description: 'ISO14001环境管理体系认证服务合同模板',
          uploadDate: new Date('2024-02-20').toISOString(),
          downloadCount: 89,
          fileUrl: 'https://example.com/files/iso14001-contract-template.docx'
        }],
        certificates: [{
          id: 3,
          fileName: '营业执照副本.pdf',
          fileType: '资质证书',
          fileSize: '512 KB',
          description: '公司营业执照副本扫描件，有效期至2026年12月31日',
          uploadDate: new Date('2024-01-10').toISOString(),
          downloadCount: 234,
          fileUrl: 'https://example.com/files/business-license.pdf',
          expiryDate: '2026-12-31'
        }, {
          id: 4,
          fileName: 'ISO9001认证证书.pdf',
          fileType: '资质证书',
          fileSize: '1.2 MB',
          description: '公司ISO9001质量管理体系认证证书',
          uploadDate: new Date('2024-03-01').toISOString(),
          downloadCount: 178,
          fileUrl: 'https://example.com/files/iso9001-certificate.pdf',
          expiryDate: '2025-03-01'
        }],
        others: [{
          id: 5,
          fileName: '认证服务报价单.xlsx',
          fileType: '报价单',
          fileSize: '156 KB',
          description: '2024年度认证服务报价单，包含各类认证项目价格',
          uploadDate: new Date('2024-03-15').toISOString(),
          downloadCount: 312,
          fileUrl: 'https://example.com/files/price-list.xlsx'
        }]
      };
      setFiles(sampleFiles);
      setLoading(false);
    };

    // 从数据模型加载文件数据
    const loadFiles = async () => {
      try {
        const result = await props.$w.cloud.callDataSource({
          dataSourceName: 'file_management',
          methodName: 'wedaGetRecordsV2',
          params: {
            filter: {
              where: {}
            },
            orderBy: [{
              uploadDate: 'desc'
            }],
            select: {
              $master: true
            },
            pageSize: 50,
            pageNumber: 1
          }
        });
        if (result.records && result.records.length > 0) {
          // 按类型分组
          const groupedFiles = {
            contracts: [],
            certificates: [],
            others: []
          };
          result.records.forEach(file => {
            if (file.fileType === '合同模板') {
              groupedFiles.contracts.push(file);
            } else if (file.fileType === '资质证书') {
              groupedFiles.certificates.push(file);
            } else {
              groupedFiles.others.push(file);
            }
          });
          setFiles(groupedFiles);
        } else {
          // 如果没有数据，使用示例数据
          loadSampleFiles();
        }
        setLoading(false);
      } catch (error) {
        console.error('加载文件失败:', error);
        // 使用示例数据作为后备
        loadSampleFiles();
      }
    };
    loadFiles();
  }, []);
  const handleDownload = async file => {
    try {
      // 更新下载次数
      await props.$w.cloud.callDataSource({
        dataSourceName: 'file_management',
        methodName: 'wedaUpdateV2',
        params: {
          data: {
            _id: file._id,
            downloadCount: (file.downloadCount || 0) + 1
          }
        }
      });

      // 更新本地状态
      setFiles(prev => prev.map(f => f._id === file._id ? {
        ...f,
        downloadCount: (f.downloadCount || 0) + 1
      } : f));
      toast({
        title: '下载文件',
        description: `正在下载 ${file.fileName}...`
      });
    } catch (error) {
      console.error('下载失败:', error);
      toast({
        title: '下载失败',
        description: '文件下载失败，请稍后重试',
        variant: 'destructive'
      });
    }
  };
  const handleShare = file => {
    toast({
      title: '转发文件',
      description: `正在分享 ${file.fileName}...`
    });
  };
  const handleEdit = async file => {
    try {
      // 获取新的文件信息
      const newFileName = prompt('请输入新的文件名:', file.fileName);
      const newDescription = prompt('请输入新的描述:', file.description || '');
      if (newFileName === null) return; // 用户取消

      // 更新数据模型
      await props.$w.cloud.callDataSource({
        dataSourceName: 'file_management',
        methodName: 'wedaUpdateV2',
        params: {
          data: {
            _id: file._id,
            fileName: newFileName.trim() || file.fileName,
            description: newDescription !== null ? newDescription.trim() : file.description,
            version: (file.version || 1) + 1,
            updatedAt: new Date().toISOString()
          }
        }
      });

      // 重新加载文件列表
      await loadFiles();
      toast({
        title: '编辑成功',
        description: `文件 "${file.fileName}" 已更新（版本 ${(file.version || 1) + 1}）`,
        variant: 'success'
      });
    } catch (error) {
      console.error('编辑失败:', error);
      toast({
        title: '编辑失败',
        description: '文件编辑失败，请稍后重试',
        variant: 'destructive'
      });
    }
  };
  const handleDelete = async file => {
    try {
      // 确认删除
      const confirmed = window.confirm(`确定要删除文件 "${file.fileName}" 吗？`);
      if (!confirmed) return;

      // 从数据模型删除
      await props.$w.cloud.callDataSource({
        dataSourceName: 'file_management',
        methodName: 'wedaDeleteV2',
        params: {
          data: {
            _id: file._id
          }
        }
      });

      // 重新加载文件列表
      await loadFiles();
      toast({
        title: '删除成功',
        description: `文件 "${file.fileName}" 已删除`,
        variant: 'success'
      });
    } catch (error) {
      console.error('删除失败:', error);
      toast({
        title: '删除失败',
        description: '文件删除失败，请稍后重试',
        variant: 'destructive'
      });
    }
  };
  const handleUploadFile = () => {
    setShowUploadForm(true);
  };
  const handleFileSelect = event => {
    const file = event.target.files[0];
    if (file) {
      setUploadFile(file);
      setUploadFormData(prev => ({
        ...prev,
        fileName: file.name
      }));
    }
  };
  const handleSubmitUpload = async () => {
    if (!uploadFile || !uploadFormData.fileName) {
      toast({
        title: '提示',
        description: '请选择文件并填写文件名',
        variant: 'destructive'
      });
      return;
    }
    try {
      // 上传到数据模型
      const result = await props.$w.cloud.callDataSource({
        dataSourceName: 'file_management',
        methodName: 'wedaCreateV2',
        params: {
          data: {
            fileName: uploadFormData.fileName,
            fileType: uploadFormData.fileType,
            fileSize: `${(uploadFile.size / 1024).toFixed(1)} KB`,
            description: uploadFormData.description,
            uploadDate: new Date().toISOString(),
            downloadCount: 0,
            fileUrl: URL.createObjectURL(uploadFile),
            expiryDate: uploadFormData.expiryDate || null,
            status: 'active',
            version: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
      });
      if (result && result._id) {
        // 重新加载文件列表
        await loadFiles();
        toast({
          title: '成功',
          description: '文件上传成功',
          variant: 'success'
        });
        setShowUploadForm(false);
        setUploadFile(null);
        setUploadFormData({
          fileName: '',
          fileType: '合同模板',
          description: '',
          expiryDate: ''
        });
      } else {
        throw new Error('上传失败：未返回文件ID');
      }
    } catch (error) {
      console.error('上传失败:', error);
      toast({
        title: '上传失败',
        description: '文件上传失败，请稍后重试',
        variant: 'destructive'
      });
    }
  };
  const handleCancelUpload = () => {
    setShowUploadForm(false);
    setUploadFile(null);
    setUploadFormData({
      fileName: '',
      fileType: '合同模板',
      description: '',
      expiryDate: ''
    });
  };
  const handleView = file => {
    toast({
      title: '查看文件',
      description: `查看 ${file.fileName} 功能开发中...`
    });
  };
  const handleViewVersionHistory = async file => {
    try {
      // 查询该文件的所有版本记录
      const result = await props.$w.cloud.callDataSource({
        dataSourceName: 'file_management',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {
              fileName: file.fileName
            }
          },
          orderBy: [{
            version: 'desc'
          }],
          select: {
            $master: true
          }
        }
      });
      if (result.records && result.records.length > 0) {
        setVersionHistory({
          fileName: file.fileName,
          versions: result.records
        });
        setShowVersionHistory(true);
      } else {
        toast({
          title: '版本历史',
          description: '暂无版本历史记录',
          variant: 'info'
        });
      }
    } catch (error) {
      console.error('获取版本历史失败:', error);
      toast({
        title: '获取失败',
        description: '版本历史获取失败，请稍后重试',
        variant: 'destructive'
      });
    }
  };
  const handleCloseVersionHistory = () => {
    setShowVersionHistory(false);
    setVersionHistory({});
  };
  const getFileIcon = fileType => {
    switch (fileType) {
      case '合同模板':
        return <FileText className="w-8 h-8 text-blue-600" />;
      case '资质证书':
        return <Award className="w-8 h-8 text-green-600" />;
      default:
        return <FileText className="w-8 h-8 text-gray-600" />;
    }
  };
  const getFileTypeColor = fileType => {
    switch (fileType) {
      case '合同模板':
        return 'bg-blue-100 text-blue-800';
      case '资质证书':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const isExpiringSoon = expiryDate => {
    if (!expiryDate) return false;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };
  const isExpired = expiryDate => {
    if (!expiryDate) return false;
    const today = new Date();
    const expiry = new Date(expiryDate);
    return expiry < today;
  };
  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-amber-800 font-serif">加载文件中...</p>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-blue-800 text-white p-6 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-serif font-bold text-center">文件管理中心</h1>
          <p className="text-center text-amber-100 mt-2">合同模板、资质证书等文件管理</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6 pb-24">
        {/* File Upload Section */}
        <div className="mb-6">
          <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-serif text-amber-900 mb-2">上传新文件</h3>
                  <p className="text-amber-700 text-sm">支持合同模板、资质证书等文件上传</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleUploadFile}>
                  <Upload className="w-4 h-4 mr-2" />
                  上传文件
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* File Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white/90 backdrop-blur-sm border-amber-200 p-1">
            <TabsTrigger value="contracts" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900">
              <FileText className="w-4 h-4 mr-2" />
              合同模板 ({files.contracts?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="certificates" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-900">
              <Award className="w-4 h-4 mr-2" />
              资质证书 ({files.certificates?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="others" className="data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">
              <FileText className="w-4 h-4 mr-2" />
              其他文件 ({files.others?.length || 0})
            </TabsTrigger>
          </TabsList>

          {Object.keys(files).map(category => <TabsContent key={category} value={category} className="space-y-4">
              {files[category]?.length === 0 ? <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
                  <CardContent className="p-12 text-center">
                    <FileText className="w-16 h-16 text-amber-400 mx-auto mb-4" />
                    <h3 className="text-xl font-serif text-amber-900 mb-2">暂无文件</h3>
                    <p className="text-amber-700">该分类下还没有文件</p>
                  </CardContent>
                </Card> : <div className="grid gap-4">
                  {files[category]?.map(file => <Card key={file.id} className="bg-white/90 backdrop-blur-sm border-amber-200 hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            {getFileIcon(file.fileType)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="text-lg font-medium text-amber-900 truncate">{file.fileName}</h4>
                                <div className="flex items-center space-x-2 mt-1">
                                  <Badge className={getFileTypeColor(file.fileType)}>
                                    {file.fileType}
                                  </Badge>
                                  <span className="text-sm text-amber-600">{file.fileSize}</span>
                                  {file.expiryDate && <>
                                      {isExpired(file.expiryDate) ? <Badge variant="destructive" className="bg-red-100 text-red-800">
                                          已过期
                                        </Badge> : isExpiringSoon(file.expiryDate) ? <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                                          即将过期
                                        </Badge> : <Badge variant="secondary" className="bg-green-100 text-green-800">
                                          有效
                                        </Badge>}
                                    </>}
                                </div>
                                <p className="text-sm text-amber-700 mt-2">{file.description}</p>
                                <div className="flex items-center space-x-4 mt-3 text-xs text-amber-600">
                                  <span className="flex items-center">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {new Date(file.uploadDate).toLocaleDateString()}
                                  </span>
                                  <span className="flex items-center">
                                    <Download className="w-3 h-3 mr-1" />
                                    {file.downloadCount} 次下载
                                  </span>
                                  {file.expiryDate && <span className="flex items-center">
                                      <Clock className="w-3 h-3 mr-1" />
                                      有效期至: {new Date(file.expiryDate).toLocaleDateString()}
                                    </span>}
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2 ml-4">
                                <Button variant="ghost" size="sm" onClick={() => handleView(file)} className="text-blue-600 hover:bg-blue-50">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDownload(file)} className="text-blue-600 hover:bg-blue-50">
                                  <Download className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleShare(file)} className="text-green-600 hover:bg-green-50">
                                  <Share2 className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleEdit(file)} className="text-blue-600 hover:bg-blue-50">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDelete(file)} className="text-rose-600 hover:bg-rose-50">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>)}
                </div>}
            </TabsContent>)}
        </Tabs>
      </main>

      {/* 文件上传弹层 */}
      {showUploadForm && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>上传文件</CardTitle>
              <CardDescription>选择并上传新文件</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file">选择文件</Label>
                <Input id="file" type="file" onChange={handleFileSelect} className="cursor-pointer" />
                {uploadFile && <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                    <p>文件名: {uploadFile.name}</p>
                    <p>大小: {(uploadFile.size / 1024).toFixed(1)} KB</p>
                    <p>类型: {uploadFile.type}</p>
                  </div>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fileName">文件名</Label>
                <Input id="fileName" value={uploadFormData.fileName} onChange={e => setUploadFormData(prev => ({
              ...prev,
              fileName: e.target ? e.target.value : ''
            }))} placeholder="请输入文件名" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fileType">文件类型</Label>
                <Select value={uploadFormData.fileType} onValueChange={value => setUploadFormData(prev => ({
              ...prev,
              fileType: value
            }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择文件类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="合同模板">合同模板</SelectItem>
                    <SelectItem value="资质证书">资质证书</SelectItem>
                    <SelectItem value="报价单">报价单</SelectItem>
                    <SelectItem value="认证文件">认证文件</SelectItem>
                    <SelectItem value="其他文件">其他文件</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">文件描述</Label>
                <Textarea id="description" value={uploadFormData.description} onChange={e => setUploadFormData(prev => ({
              ...prev,
              description: e.target ? e.target.value : ''
            }))} placeholder="请输入文件描述" rows={3} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expiryDate">有效期（可选）</Label>
                <Input id="expiryDate" type="date" value={uploadFormData.expiryDate} onChange={e => setUploadFormData(prev => ({
              ...prev,
              expiryDate: e.target ? e.target.value : ''
            }))} />
              </div>
            </CardContent>
            <div className="p-6 pt-0 flex space-x-3">
              <Button onClick={handleSubmitUpload} className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={!uploadFile}>
                <Upload className="h-4 w-4 mr-2" />
                上传
              </Button>
              <Button variant="outline" onClick={handleCancelUpload} className="flex-1">
                <X className="h-4 w-4 mr-2" />
                取消
              </Button>
            </div>
          </Card>
        </div>}

      {/* Bottom Navigation */}
      <TabBar currentPage="files" $w={$w} />
    </div>;
}