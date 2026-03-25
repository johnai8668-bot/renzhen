// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { useToast, Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
// @ts-ignore;
import { Heart, Share2, Edit, Trash2, Download, Eye, Plus } from 'lucide-react';

import TabBar from '@/components/TabBar';
export default function Index(props) {
  const {
    toast
  } = useToast();
  const [businessCards, setBusinessCards] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // 从数据模型加载电子名片数据
    const loadBusinessCards = async () => {
      try {
        const result = await props.$w.cloud.callDataSource({
          dataSourceName: 'business_cards',
          methodName: 'wedaGetRecordsV2',
          params: {
            filter: {
              where: {}
            },
            orderBy: [{
              createdAt: 'desc'
            }],
            select: {
              $master: true
            },
            pageSize: 10,
            pageNumber: 1
          }
        });
        if (result.records && result.records.length > 0) {
          setBusinessCards(result.records);
        } else {
          // 如果没有数据，创建默认数据
          const defaultCard = {
            companyName: '华夏认证有限公司',
            description: '专业的认证服务机构，提供ISO体系认证、产品认证等服务',
            address: '北京市朝阳区建国门外大街1号',
            phone: '010-12345678',
            email: 'info@huaxia-cert.com',
            website: 'www.huaxia-cert.com',
            logoUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop',
            likes: 128,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          const createResult = await props.$w.cloud.callDataSource({
            dataSourceName: 'business_cards',
            methodName: 'wedaCreateV2',
            params: {
              data: defaultCard
            }
          });
          setBusinessCards([createResult]);
        }
        setLoading(false);
      } catch (error) {
        console.error('加载电子名片失败:', error);
        toast({
          title: '加载失败',
          description: '电子名片数据加载失败，请稍后重试',
          variant: 'destructive'
        });
        setLoading(false);
      }
    };
    loadBusinessCards();
  }, []);
  const handleLike = async cardId => {
    try {
      // 先找到当前卡片
      const currentCard = businessCards.find(card => card._id === cardId);
      if (!currentCard) return;

      // 更新数据库中的点赞数
      // 更新数据库中的点赞数
      const updatedLikes = (currentCard.likes || 0) + 1;
      await props.$w.cloud.callDataSource({
        dataSourceName: 'business_cards',
        methodName: 'wedaUpdateV2',
        params: {
          data: {
            _id: cardId,
            likes: updatedLikes
          }
        }
      });

      // 更新本地状态
      // 更新本地状态
      setBusinessCards(prev => prev.map(card => card._id === cardId ? {
        ...card,
        likes: updatedLikes
      } : card));
      toast({
        title: '点赞成功',
        description: '感谢您的点赞支持！'
      });
    } catch (error) {
      console.error('点赞失败:', error);
      toast({
        title: '点赞失败',
        description: '请稍后重试',
        variant: 'destructive'
      });
    }
  };
  const handleShare = async card => {
    try {
      // 模拟分享功能
      if (navigator.share) {
        await navigator.share({
          title: card.companyName,
          text: card.description,
          url: window.location.href
        });
      } else {
        // 复制到剪贴板
        await navigator.clipboard.writeText(`${card.companyName} - ${card.description}`);
        toast({
          title: '分享成功',
          description: '名片信息已复制到剪贴板'
        });
      }
    } catch (error) {
      toast({
        title: '分享失败',
        description: '请稍后重试',
        variant: 'destructive'
      });
    }
  };
  const handleEdit = cardId => {
    toast({
      title: '编辑功能',
      description: '编辑功能开发中...'
    });
  };
  const handleDelete = cardId => {
    toast({
      title: '删除功能',
      description: '删除功能开发中...'
    });
  };
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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-serif font-bold text-center">标联国际认证</h1>
          <p className="text-center text-amber-100 mt-2">专业认证服务管理平台</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6 pb-24">
        <div className="mb-6">
          <h2 className="text-2xl font-serif font-bold text-amber-900 mb-4">电子名片</h2>
          <div className="grid gap-6">
            {businessCards.map(card => <Card key={card.id} className="bg-white/90 backdrop-blur-sm border-amber-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <img src={card.logoUrl} alt={card.companyName} className="w-16 h-16 rounded-full object-cover border-2 border-amber-200" />
                      <div>
                        <CardTitle className="text-xl font-serif text-amber-900">{card.companyName}</CardTitle>
                        <CardDescription className="text-amber-700">{card.description}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      认证机构
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-amber-800">
                    <div>
                      <p><strong>地址:</strong> {card.address}</p>
                      <p><strong>电话:</strong> {card.phone}</p>
                    </div>
                    <div>
                      <p><strong>邮箱:</strong> {card.email}</p>
                      <p><strong>官网:</strong> {card.website}</p>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-amber-100">
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleLike(card.id)} className="border-rose-200 text-rose-600 hover:bg-rose-50">
                        <Heart className="w-4 h-4 mr-1" />
                        {card.likes}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleShare(card)} className="border-blue-200 text-blue-600 hover:bg-blue-50">
                        <Share2 className="w-4 h-4 mr-1" />
                        转发
                      </Button>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(card.id)} className="text-blue-600 hover:bg-blue-50">
                        <Edit className="w-4 h-4 mr-1" />
                        编辑
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(card.id)} className="text-rose-600 hover:bg-rose-50">
                        <Trash2 className="w-4 h-4 mr-1" />
                        删除
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </div>

        {/* Add New Card Button */}
        <div className="text-center mt-8">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-serif" onClick={() => toast({
          title: '新增名片',
          description: '新增名片功能开发中...'
        })}>

            <Plus className="w-4 h-4 mr-2" />
            新增名片
          </Button>
        </div>
      </main>

      {/* Bottom Navigation */}
      <TabBar currentPage="home" $w={$w} />
    </div>;
}