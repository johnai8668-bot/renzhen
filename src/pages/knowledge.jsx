// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Input, Button, Badge, Textarea, Card, Tabs, TabsContent, TabsList, TabsTrigger, Avatar, AvatarFallback, AvatarImage, useToast } from '@/components/ui';
// @ts-ignore;
import { Search, FileText, Image, File, Download, Plus, Filter, MessageSquare, Paperclip, Trash2, X, Share2, Edit2, Eye } from 'lucide-react';

import { CommentBoard } from '@/components/CommentBoard';
import TabBar from '@/components/TabBar';
export default function KnowledgeBase(props) {
  const {
    toast
  } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [newDocument, setNewDocument] = useState({
    title: '',
    content: '',
    type: '知识文档',
    category: '',
    author: props.$w.auth.currentUser?.name || '管理员',
    authorId: props.$w.auth.currentUser?.userId || '',
    description: '',
    tags: [],
    attachments: [],
    comments: []
  });
  const [editingDocument, setEditingDocument] = useState(null);
  const [activeDocumentId, setActiveDocumentId] = useState(null);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [userDepartment, setUserDepartment] = useState(''); // 用户所属部门
  const [departments] = useState(['全部', '技术部', '市场部', '认证部', '客服部']); // 部门列表
  const [selectedDepartment, setSelectedDepartment] = useState('全部'); // 当前选择的部门

  // 判断是否是作者（用于权限控制）
  const isAuthor = document => {
    const currentUserId = props.$w.auth.currentUser?.userId;
    return document.authorId === currentUserId || document.author === props.$w.auth.currentUser?.name;
  };

  // 判断是否是管理员（可以根据实际情况调整判断逻辑）
  const isAdmin = () => {
    // 可以根据用户角色、特定用户ID等判断
    // 这里暂时假设所有用户都有管理员权限，实际需要根据业务逻辑调整
    return true;
  };

  // 加载文档数据（部门权限过滤）
  const loadDocuments = async () => {
    try {
      setLoading(true);
      let filter = {
        isDeleted: {
          $ne: true
        }
      };

      // 部门权限控制：非管理员只能看本部门内容
      if (!isAdmin() && userDepartment) {
        filter.department = userDepartment;
      }
      const result = await props.$w.cloud.callDataSource({
        dataSourceName: 'knowledge_base',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: filter
          },
          orderBy: [{
            updatedAt: 'desc'
          }],
          select: {
            $master: true
          },
          pageSize: 50,
          pageNumber: 1
        }
      });
      if (result.records && result.records.length > 0) {
        setDocuments(result.records);
      } else {
        // 使用示例数据
        const sampleDocuments = [{
          id: 1,
          title: 'ISO9001质量管理体系认证案例分享',
          content: '详细介绍某制造企业通过ISO9001认证的全过程，包括前期准备、体系建立、内部审核、管理评审等关键环节...',
          type: '案例',
          category: '项目案例',
          tags: ['ISO9001', '质量管理', '制造业'],
          currentVersion: 'v2.1',
          author: '张经理',
          authorId: 'user1',
          status: '已发布',
          versionCount: 2,
          attachments: [],
          comments: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }, {
          id: 2,
          title: '认证机构审核流程规范',
          content: '认证机构进行审核工作的标准流程，包括审核准备、现场审核、不符合项整改、证书颁发等各个环节的详细要求...',
          type: '知识文档',
          category: '管理制度',
          tags: ['审核流程', '规范', '管理'],
          currentVersion: 'v1.0',
          author: '李主任',
          authorId: 'user2',
          status: '已发布',
          versionCount: 1,
          attachments: [],
          comments: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }, {
          id: 3,
          title: '认证项目风险管理指南',
          content: '认证项目实施过程中的风险识别、评估和控制方法，帮助企业有效降低认证风险...',
          type: '案例',
          category: '项目案例',
          tags: ['风险管理', '项目实施', '认证'],
          currentVersion: 'v3.0',
          author: '王总监',
          authorId: 'user3',
          status: '已发布',
          versionCount: 3,
          attachments: [],
          comments: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }];
        setDocuments(sampleDocuments);
      }
    } catch (error) {
      console.error('加载知识库失败:', error);
      // 使用示例数据作为降级方案
      const defaultDocuments = [{
        id: 1,
        title: 'ISO9001质量管理体系认证案例分享',
        content: '详细介绍某制造企业通过ISO9001认证的全过程，包括前期准备、体系建立、内部审核、管理评审等关键环节...',
        type: '案例',
        category: '项目案例',
        tags: ['ISO9001', '质量管理', '制造业'],
        currentVersion: 'v2.1',
        author: '张经理',
        authorId: 'user1',
        status: '已发布',
        versionCount: 2,
        attachments: [],
        comments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, {
        id: 2,
        title: '认证机构审核流程规范',
        content: '认证机构进行审核工作的标准流程，包括审核准备、现场审核、不符合项整改、证书颁发等各个环节的详细要求...',
        type: '知识文档',
        category: '管理制度',
        tags: ['审核流程', '规范', '管理'],
        currentVersion: 'v1.0',
        author: '李主任',
        authorId: 'user2',
        status: '已发布',
        versionCount: 1,
        attachments: [],
        comments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, {
        id: 3,
        title: '认证项目风险管理指南',
        content: '认证项目实施过程中的风险识别、评估和控制方法，帮助企业有效降低认证风险...',
        type: '案例',
        category: '项目案例',
        tags: ['风险管理', '项目实施', '认证'],
        currentVersion: 'v3.0',
        author: '王总监',
        authorId: 'user3',
        status: '已发布',
        versionCount: 3,
        attachments: [],
        comments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }];
      setDocuments(defaultDocuments);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadDocuments();
  }, []);

  // 文件处理
  const handleFileSelect = e => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles([...selectedFiles, ...files]);
  };
  const handleRemoveFile = index => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };
  // 处理文件上传（支持多种来源）
  const handleUploadFiles = async () => {
    if (selectedFiles.length === 0) return;
    setUploadingFiles(true);
    try {
      const tcb = await props.$w.cloud.getCloudInstance();
      const uploadedFiles = [];
      for (const file of selectedFiles) {
        const result = await tcb.uploadFile({
          cloudPath: `knowledge_base/${Date.now()}_${file.name}`,
          fileContent: file
        });
        uploadedFiles.push({
          name: file.name,
          url: result.fileID,
          type: file.type,
          size: file.size,
          uploadTime: new Date().toISOString()
        });
      }

      // 更新当前文档的附件列表
      setNewDocument(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...uploadedFiles]
      }));
      setSelectedFiles([]);
      toast({
        title: '上传成功',
        description: `成功上传 ${uploadedFiles.length} 个文件`
      });
    } catch (error) {
      console.error('上传文件失败:', error);
      toast({
        title: '上传失败',
        description: error.message || '上传文件时发生错误',
        variant: 'destructive'
      });
    } finally {
      setUploadingFiles(false);
    }
  };

  // 从微信聊天记录导入文件
  const handleImportFromWeChat = async () => {
    try {
      // 创建文件输入元素
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = true;
      input.accept = '.jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.xls,.xlsx,.txt';
      input.onchange = async e => {
        if (e.target.files && e.target.files.length > 0) {
          const files = Array.from(e.target.files).map(file => ({
            ...file,
            weChatImport: true,
            importTime: new Date().toISOString()
          }));
          setSelectedFiles(prev => [...prev, ...files]);
          toast({
            title: '导入成功',
            description: `已从微信导入 ${files.length} 个文件`
          });
        }
      };
      input.click();
    } catch (error) {
      console.error('从微信导入文件时发生错误:', error);
      toast({
        title: '导入失败',
        description: error.message || '从微信导入文件时发生错误',
        variant: 'destructive'
      });
    }
  };

  // 评论处理
  const handleAddComment = async (documentId, commentData) => {
    try {
      const newComment = {
        id: `${Date.now()}`,
        content: commentData.content,
        author: {
          userId: props.$w.auth.currentUser?.userId,
          name: props.$w.auth.currentUser?.name || '匿名用户',
          avatar: props.$w.auth.currentUser?.avatarUrl
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      const updatedComments = [...(selectedDocument?.comments || []), newComment];
      await props.$w.cloud.callDataSource({
        dataSourceName: 'knowledge_base',
        methodName: 'wedaUpdateV2',
        params: {
          data: {
            _id: documentId,
            comments: updatedComments,
            updatedAt: new Date().toISOString()
          }
        }
      });
      setSelectedDocument(prev => ({
        ...prev,
        comments: updatedComments
      }));
      setDocuments(prev => prev.map(doc => doc._id === documentId || doc.id === documentId ? {
        ...doc,
        comments: updatedComments
      } : doc));
    } catch (error) {
      console.error('添加评论失败:', error);
      toast({
        title: '添加评论失败',
        description: error.message || '添加评论时发生错误',
        variant: 'destructive'
      });
    }
  };
  const handleEditComment = async (documentId, commentId, commentData) => {
    try {
      const updatedComments = selectedDocument.comments.map(comment => comment.id === commentId ? {
        ...comment,
        content: commentData.content,
        updatedAt: new Date().toISOString()
      } : comment);
      await props.$w.cloud.callDataSource({
        dataSourceName: 'knowledge_base',
        methodName: 'wedaUpdateV2',
        params: {
          data: {
            _id: documentId,
            comments: updatedComments,
            updatedAt: new Date().toISOString()
          }
        }
      });
      setSelectedDocument(prev => ({
        ...prev,
        comments: updatedComments
      }));
      setDocuments(prev => prev.map(doc => doc._id === documentId || doc.id === documentId ? {
        ...doc,
        comments: updatedComments
      } : doc));
    } catch (error) {
      console.error('编辑评论失败:', error);
      toast({
        title: '编辑评论失败',
        description: error.message || '编辑评论时发生错误',
        variant: 'destructive'
      });
    }
  };
  const handleDeleteComment = async (documentId, commentId) => {
    try {
      const updatedComments = selectedDocument.comments.filter(comment => comment.id !== commentId);
      await props.$w.cloud.callDataSource({
        dataSourceName: 'knowledge_base',
        methodName: 'wedaUpdateV2',
        params: {
          data: {
            _id: documentId,
            comments: updatedComments,
            updatedAt: new Date().toISOString()
          }
        }
      });
      setSelectedDocument(prev => ({
        ...prev,
        comments: updatedComments
      }));
      setDocuments(prev => prev.map(doc => doc._id === documentId || doc.id === documentId ? {
        ...doc,
        comments: updatedComments
      } : doc));
    } catch (error) {
      console.error('删除评论失败:', error);
      toast({
        title: '删除评论失败',
        description: error.message || '删除评论时发生错误',
        variant: 'destructive'
      });
    }
  };

  // 处理转发
  const handleShare = async document => {
    try {
      const shareUrl = `${window.location.origin}/knowledge?docId=${document.id}`;
      if (navigator.share) {
        await navigator.share({
          title: document.title,
          text: document.description || document.content,
          url: shareUrl
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
      }
      toast({
        title: '分享成功',
        description: navigator.share ? '分享已发送' : '链接已复制到剪贴板'
      });
    } catch (error) {
      console.error('分享失败:', error);
      toast({
        title: '分享失败',
        description: error.message || '分享时发生错误',
        variant: 'destructive'
      });
    }
  };

  // 处理编辑
  const handleEditDocument = document => {
    if (!isAuthor(document) && !isAdmin()) {
      toast({
        title: '权限不足',
        description: '只能编辑自己创建的知识/案例',
        variant: 'destructive'
      });
      return;
    }
    setEditingDocument(document);
    setShowEditDialog(true);
  };

  // 处理删除
  const handleDelete = async document => {
    // 权限检查：管理员或作者才能删除
    if (!isAuthor(document) && !isAdmin()) {
      toast({
        title: '权限不足',
        description: '只能删除自己创建的知识/案例',
        variant: 'destructive'
      });
      return;
    }
    if (!confirm('确定要删除这条知识/案例吗？')) {
      return;
    }
    try {
      await props.$w.cloud.callDataSource({
        dataSourceName: 'knowledge_base',
        methodName: 'wedaDeleteV2',
        params: {
          _id: document._id
        }
      });

      // 从列表中移除
      setDocuments(prev => prev.filter(doc => doc._id !== document._id));
      toast({
        title: '删除成功',
        description: '知识/案例已删除'
      });
    } catch (error) {
      console.error('删除失败:', error);
      toast({
        title: '删除失败',
        description: error.message || '删除时发生错误',
        variant: 'destructive'
      });
    }
  };

  // 处理新增文档
  const handleSubmitNewDocument = async () => {
    try {
      if (!newDocument.title || !newDocument.content) {
        toast({
          title: '请填写完整信息',
          description: '标题和内容为必填项',
          variant: 'destructive'
        });
        return;
      }
      const documentData = {
        ...newDocument,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: '已发布',
        versionCount: 1,
        currentVersion: 'v1.0'
      };
      await props.$w.cloud.callDataSource({
        dataSourceName: 'knowledge_base',
        methodName: 'wedaCreateV2',
        params: {
          data: documentData
        }
      });
      setDocuments(prev => [documentData, ...prev]);
      setShowAddDialog(false);
      setNewDocument({
        title: '',
        content: '',
        type: '知识文档',
        category: '',
        author: props.$w.auth.currentUser?.name || '管理员',
        authorId: props.$w.auth.currentUser?.userId || '',
        description: '',
        tags: [],
        attachments: [],
        comments: []
      });
      toast({
        title: '添加成功',
        description: '知识/案例已添加'
      });
    } catch (error) {
      console.error('添加文档失败:', error);
      toast({
        title: '添加失败',
        description: error.message || '添加文档时发生错误',
        variant: 'destructive'
      });
    }
  };

  // 过滤文档
  const filteredDocuments = documents.filter(doc => {
    const searchLower = searchTerm.toLowerCase();
    return doc.title?.toLowerCase().includes(searchLower) || doc.content?.toLowerCase().includes(searchLower) || doc.tags?.some(tag => tag.toLowerCase().includes(searchLower));
  });
  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">加载中...</div>
      </div>;
  }
  return <div className="min-h-screen bg-slate-50">
      <header className="bg-gradient-to-r from-[#003D79] via-[#003366] to-[#002952] text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">知识库</h1>
              <p className="text-[#d9e2ec] text-sm">企业知识共享与案例管理</p>
            </div>
            <Button onClick={() => setShowAddDialog(true)} className="bg-[#003D79] hover:bg-[#003366]">
              <Plus className="w-4 h-4 mr-2" />
              添加知识/案例
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {/* 搜索和筛选 */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input type="text" placeholder="搜索文档标题、内容或标签..." value={searchTerm} onChange={e => {
            if (e && e.target) {
              setSearchTerm(e.target.value);
            }
          }} className="pl-10 border-[#e0e0e0] focus:border-[#003D79] focus:ring-[#003D79]" />
          </div>
        </div>

        {/* 文档列表 */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#212121]">文档列表</h2>
            <Badge variant="secondary" className="bg-[#e3f2fd] text-[#1976d2]">
              共 {filteredDocuments.length} 篇
            </Badge>
          </div>
          
          {filteredDocuments.length === 0 ? <Card className="bg-[#fefefe] shadow-sm p-8 text-center">
                <p className="text-[#757575]">暂无文档</p>
              </Card> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocuments.map(document => <Card key={document.id || document._id} className="bg-[#fefefe] shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <Badge variant="secondary" className={`bg-[#e3f2fd] text-[#1976d2] ${document.type === '案例' ? 'bg-[#fff8e1] text-[#ffa000]' : ''}`}>
                          {document.type}
                        </Badge>
                        <span className="text-xs text-[#9e9e9e]">{document.currentVersion || 'v1.0'}</span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-[#212121] mb-2 line-clamp-2">
                        {document.title}
                      </h3>
                      
                      <p className="text-sm text-[#616161] mb-3 line-clamp-3">
                        {document.description || document.content?.substring(0, 100) + '...'}
                      </p>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {(document.tags || []).slice(0, 3).map(tag => <Badge key={tag} variant="outline" className="text-xs border-[#e0e0e0] text-[#757575]">
                            {tag}
                          </Badge>)}
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-[#9e9e9e]">
                        <span>作者: {document.author}</span>
                        <div className="flex items-center space-x-2">
                          {document.attachments?.length > 0 && <span className="flex items-center">
                              <Paperclip className="w-3 h-3 mr-1" />
                              {document.attachments.length}
                            </span>}
                          {document.comments?.length > 0 && <span className="flex items-center">
                              <MessageSquare className="w-3 h-3 mr-1" />
                              {document.comments.length}
                            </span>}
                        </div>
                      </div>
                      
                      {/* 操作按钮 */}
                      <div className="flex gap-2 mt-3 pt-3 border-t border-[#e0e0e0]">
                        <Button variant="outline" size="sm" className="flex-1 text-xs border-[#003D79] text-[#003D79] hover:bg-[#003D79]/10" onClick={e => {
                  e.stopPropagation();
                  setSelectedDocument(document);
                  setActiveDocumentId(document.id || document._id);
                }}>
                          <Eye className="w-3 h-3 mr-1" />
                          查看
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 text-xs border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10" onClick={e => {
                  e.stopPropagation();
                  handleShare(document);
                }}>
                          <Share2 className="w-3 h-3 mr-1" />
                          转发
                        </Button>
                        {(isAuthor(document) || isAdmin()) && <Button variant="outline" size="sm" className="flex-1 text-xs border-[#00A896] text-[#00A896] hover:bg-[#00A896]/10" onClick={e => {
                  e.stopPropagation();
                  handleEditDocument(document);
                }}>
                            <Edit2 className="w-3 h-3 mr-1" />
                            编辑
                          </Button>}
                        {(isAuthor(document) || isAdmin()) && <Button variant="outline" size="sm" className="flex-1 text-xs border-[#f44336] text-[#f44336] hover:bg-[#f44336]/10" onClick={e => {
                  e.stopPropagation();
                  handleDelete(document);
                }}>
                            <Trash2 className="w-3 h-3 mr-1" />
                            删除
                          </Button>}
                      </div>
                    </div>
                  </Card>)}
            </div>}
        </div>
      </main>

      {/* 文档详情弹窗 */}
      {selectedDocument && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">文档详情</h2>
                <Button variant="ghost" size="sm" onClick={() => setSelectedDocument(null)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className={`bg-blue-100 text-blue-700 ${selectedDocument.type === '案例' ? 'bg-amber-100 text-amber-700' : ''}`}>
                    {selectedDocument.type}
                  </Badge>
                  <span className="text-xs text-slate-500">{selectedDocument.currentVersion || 'v1.0'}</span>
                </div>
                
                <h1 className="text-2xl font-bold text-slate-800 mb-4">
                  {selectedDocument.title}
                </h1>
                
                {selectedDocument.description && <div className="bg-slate-50 p-4 rounded-lg mb-4">
                    <p className="text-slate-700">{selectedDocument.description}</p>
                  </div>}
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">文档内容</h3>
                <div className="prose prose-sm max-w-none text-slate-700 bg-slate-50 p-4 rounded-lg">
                  {selectedDocument.content}
                </div>
              </div>
              
              {selectedDocument.attachments && selectedDocument.attachments.length > 0 && <div className="mb-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">附件 ({selectedDocument.attachments.length})</h3>
                  <div className="space-y-2">
                    {selectedDocument.attachments.map((file, index) => <Card key={index} className="flex items-center justify-between p-3 bg-slate-50 border-slate-200">
                        <div className="flex items-center space-x-3">
                          {file.type?.startsWith('image/') ? <Image className="w-5 h-5 text-blue-600" /> : <FileText className="w-5 h-5 text-blue-600" />}
                          <div>
                            <p className="text-sm font-medium text-slate-800">{file.name}</p>
                            <p className="text-xs text-slate-500">
                              {(file.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => {
                  // 这里需要实现文件下载功能
                  toast({
                    title: '下载文件',
                    description: '文件下载功能正在开发中'
                  });
                }} className="text-blue-600 hover:bg-blue-50">
                          <Download className="w-4 h-4" />
                        </Button>
                      </Card>)}
                  </div>
                </div>}
              
              {selectedDocument.tags && selectedDocument.tags.length > 0 && <div className="mb-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">标签</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedDocument.tags.map(tag => <Badge key={tag} variant="outline" className="border-slate-200 text-slate-600">
                        {tag}
                      </Badge>)}
                  </div>
                </div>}
              
              {/* 评论板块 */}
              <CommentBoard comments={selectedDocument.comments || []} documentId={selectedDocument._id || selectedDocument.id} onAddComment={commentData => handleAddComment(selectedDocument._id || selectedDocument.id, commentData)} onEditComment={(commentId, commentData) => handleEditComment(selectedDocument._id || selectedDocument.id, commentId, commentData)} onDeleteComment={commentId => handleDeleteComment(selectedDocument._id || selectedDocument.id, commentId)} currentUser={props.$w.auth.currentUser} $w={props.$w} />
            </div>
          </div>
        </div>}

      {/* 新增文档弹窗 */}
      {showAddDialog && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">添加知识/案例</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowAddDialog(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  标题 <span className="text-red-500">*</span>
                </label>
                <Input value={newDocument.title} onChange={e => {
              if (e && e.target) {
                setNewDocument(prev => ({
                  ...prev,
                  title: e.target.value
                }));
              }
            }} placeholder="请输入标题" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  类型
                </label>
                <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={newDocument.type} onChange={e => {
              if (e && e.target) {
                setNewDocument(prev => ({
                  ...prev,
                  type: e.target.value
                }));
              }
            }}>
                  <option value="知识文档">知识文档</option>
                  <option value="案例">案例</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  分类
                </label>
                <Input value={newDocument.category} onChange={e => {
              if (e && e.target) {
                setNewDocument(prev => ({
                  ...prev,
                  category: e.target.value
                }));
              }
            }} placeholder="请输入分类" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  描述
                </label>
                <Textarea value={newDocument.description} onChange={e => {
              if (e && e.target) {
                setNewDocument(prev => ({
                  ...prev,
                  description: e.target.value
                }));
              }
            }} placeholder="请输入描述" rows={3} />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  内容 <span className="text-red-500">*</span>
                </label>
                <Textarea value={newDocument.content} onChange={e => {
              if (e && e.target) {
                setNewDocument(prev => ({
                  ...prev,
                  content: e.target.value
                }));
              }
            }} placeholder="请输入内容" rows={6} />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  标签
                </label>
                <Input value={newDocument.tags.join(', ')} onChange={e => {
              if (e && e.target) {
                setNewDocument(prev => ({
                  ...prev,
                  tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                }));
              }
            }} placeholder="请输入标签，用逗号分隔" />
              </div>
              
              {/* 文件上传 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  附件
                </label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Input type="file" multiple onChange={handleFileSelect} className="flex-1" />
                    <Button onClick={handleUploadFiles} disabled={selectedFiles.length === 0 || uploadingFiles} className="bg-blue-600 hover:bg-blue-700">
                      {uploadingFiles ? '上传中...' : '上传'}
                    </Button>
                  </div>
                  
                  {selectedFiles.length > 0 && <div className="space-y-2">
                      <p className="text-sm font-medium text-slate-700">待上传文件 ({selectedFiles.length})</p>
                      {selectedFiles.map((file, index) => <Card key={index} className="flex items-center justify-between p-3 bg-slate-50 border-slate-200">
                          <div className="flex items-center space-x-3">
                            {file.type?.startsWith('image/') ? <Image className="w-5 h-5 text-blue-600" /> : <FileText className="w-5 h-5 text-blue-600" />}
                            <div>
                              <p className="text-sm font-medium text-slate-800">{file.name}</p>
                              <p className="text-xs text-slate-500">
                                {(file.size / 1024).toFixed(2)} KB
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => handleRemoveFile(index)} className="text-red-600 hover:bg-red-50 h-8 px-2">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </Card>)}
                    </div>}
                  
                  {newDocument.attachments.length > 0 && <div className="space-y-2">
                      <p className="text-sm font-medium text-slate-700">已上传文件 ({newDocument.attachments.length})</p>
                      {newDocument.attachments.map((file, index) => <Card key={index} className="flex items-center justify-between p-3 bg-green-50 border-green-200">
                          <div className="flex items-center space-x-3">
                            {file.type?.startsWith('image/') ? <Image className="w-5 h-5 text-green-600" /> : <FileText className="w-5 h-5 text-green-600" />}
                            <div>
                              <p className="text-sm font-medium text-slate-800">{file.name}</p>
                              <p className="text-xs text-slate-500">
                                {(file.size / 1024).toFixed(2)} KB
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => {
                    setNewDocument(prev => ({
                      ...prev,
                      attachments: prev.attachments.filter((_, i) => i !== index)
                    }));
                  }} className="text-red-600 hover:bg-red-50 h-8 px-2">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </Card>)}
                    </div>}
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Button onClick={handleSubmitNewDocument} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  提交
                </Button>
                <Button variant="outline" onClick={() => {
              setShowAddDialog(false);
              setNewDocument({
                title: '',
                content: '',
                type: '知识文档',
                category: '',
                author: props.$w.auth.currentUser?.name || '管理员',
                authorId: props.$w.auth.currentUser?.userId || '',
                description: '',
                tags: [],
                attachments: [],
                comments: []
              });
            }}>
                  取消
                </Button>
              </div>
            </div>
          </div>
        </div>}
      {/* 底部导航栏 */}
      <TabBar currentPage="knowledge" $w={props.$w} />
    </div>;
}