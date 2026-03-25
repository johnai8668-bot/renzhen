// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { useToast, Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Avatar, AvatarFallback, AvatarImage, Badge, Input, Textarea, Label, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
// @ts-ignore;
import { User, Building2, Phone, Mail, MapPin, Share2, Edit3, Save, X, ThumbsUp, Eye, Download, QrCode } from 'lucide-react';

import TabBar from '@/components/TabBar';
export default function BusinessCard(props) {
  const {
    toast
  } = useToast();
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [personalCard, setPersonalCard] = useState({
    name: '张经理',
    title: '高级认证顾问',
    company: '华夏认证机构',
    phone: '138-0000-0000',
    email: 'zhang@cert.com',
    address: '北京市朝阳区认证大厦',
    avatar: '',
    wechat: 'zhang_cert',
    intro: '专业从事ISO认证服务10年，服务客户超过500家',
    stats: {
      views: 128,
      likes: 45,
      shares: 23
    }
  });

  // 示例名片数据
  const [sampleCards, setSampleCards] = useState([{
    id: 1,
    name: '李总监',
    title: '认证部总监',
    company: '华夏认证机构',
    phone: '139-1111-1111',
    email: 'li@cert.com',
    address: '北京市朝阳区认证大厦20层',
    avatar: '',
    wechat: 'li_director',
    intro: '专注认证行业15年，资深认证专家',
    stats: {
      views: 89,
      likes: 32,
      shares: 18
    }
  }, {
    id: 2,
    name: '王顾问',
    title: 'ISO体系顾问',
    company: '华夏认证机构',
    phone: '137-2222-2222',
    email: 'wang@cert.com',
    address: '北京市朝阳区认证大厦15层',
    avatar: '',
    wechat: 'wang_consultant',
    intro: 'ISO9001/14001/45001体系认证专家',
    stats: {
      views: 156,
      likes: 67,
      shares: 34
    }
  }, {
    id: 3,
    name: '赵经理',
    title: '客户经理',
    company: '华夏认证机构',
    phone: '136-3333-3333',
    email: 'zhao@cert.com',
    address: '北京市朝阳区认证大厦12层',
    avatar: '',
    wechat: 'zhao_manager',
    intro: '负责客户关系维护，提供专业的认证咨询服务',
    stats: {
      views: 203,
      likes: 89,
      shares: 45
    }
  }]);
  const [companyCard, setCompanyCard] = useState({
    companyName: '华夏认证机构有限公司',
    legalPerson: '李总',
    registeredCapital: '1000万元',
    establishedDate: '2010-01-01',
    businessScope: 'ISO认证、产品认证、体系认证等',
    address: '北京市朝阳区认证大厦18层',
    phone: '400-123-4567',
    email: 'info@huaxia-cert.com',
    website: 'www.huaxia-cert.com',
    intro: '专业的认证服务机构，拥有国家认可资质，服务全国客户',
    stats: {
      views: 256,
      likes: 89,
      shares: 67
    }
  });
  const [editData, setEditData] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [cardCanvasRef, setCardCanvasRef] = useState(null);

  // 保存名片为图片
  const handleSaveImage = async (type, cardId = null) => {
    try {
      const cardData = type === 'personal' ? personalCard : type === 'company' ? companyCard : null;
      if (!cardData) return;

      // 创建一个临时的名片元素用于截图
      const cardElement = document.createElement('div');
      cardElement.style.position = 'absolute';
      cardElement.style.left = '-9999px';
      cardElement.style.width = '400px';
      cardElement.style.padding = '24px';
      cardElement.style.background = 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)';
      cardElement.style.borderRadius = '16px';
      cardElement.style.color = 'white';
      cardElement.style.fontFamily = 'sans-serif';
      const cardName = cardData.name || cardData.companyName;
      const cardTitle = cardData.title || '';
      const cardPhone = cardData.phone || '';
      const cardEmail = cardData.email || '';
      const cardAddress = cardData.address || '';
      const cardIntro = cardData.intro || '';
      const cardCompany = cardData.company || '';
      const cardAvatar = cardData.avatar || cardData.logo || '';
      cardElement.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
          ${cardAvatar ? `<img src="${cardAvatar}" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 4px solid rgba(255,255,255,0.3); margin-bottom: 12px;" />` : ''}
          <h2 style="margin: 0 0 8px 0; font-size: 28px; font-weight: bold;">${cardName}</h2>
          ${cardTitle ? `<p style="margin: 0 0 8px 0; font-size: 16px; opacity: 0.9;">${cardTitle}</p>` : ''}
          ${cardCompany ? `<p style="margin: 0; font-size: 14px; opacity: 0.8;">${cardCompany}</p>` : ''}
        </div>
        <div style="background: rgba(255,255,255,0.1); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
          ${cardPhone ? `<p style="margin: 0 0 8px 0; font-size: 14px;">📱 ${cardPhone}</p>` : ''}
          ${cardEmail ? `<p style="margin: 0 0 8px 0; font-size: 14px;">✉️ ${cardEmail}</p>` : ''}
          ${cardAddress ? `<p style="margin: 0; font-size: 14px;">📍 ${cardAddress}</p>` : ''}
        </div>
        ${cardIntro ? `<div style="font-size: 12px; opacity: 0.8; line-height: 1.6;">${cardIntro}</div>` : ''}
      `;
      document.body.appendChild(cardElement);

      // 使用 canvas 绘制并下载
      try {
        const canvas = await html2canvas(cardElement, {
          scale: 2,
          useCORS: true,
          allowTaint: true
        });
        const link = document.createElement('a');
        link.download = `名片_${cardName}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        toast({
          title: '保存成功',
          description: '名片图片已保存到本地'
        });
      } catch (canvasError) {
        // 如果 html2canvas 不可用，使用降级方案
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 500;
        const ctx = canvas.getContext('2d');

        // 绘制背景
        const gradient = ctx.createLinearGradient(0, 0, 400, 500);
        gradient.addColorStop(0, '#1e3a8a');
        gradient.addColorStop(1, '#3b82f6');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 400, 500);

        // 绘制文字
        ctx.fillStyle = 'white';
        ctx.font = 'bold 24px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(cardName, 200, 100);
        if (cardTitle) {
          ctx.font = '16px sans-serif';
          ctx.fillText(cardTitle, 200, 130);
        }
        if (cardCompany) {
          ctx.font = '14px sans-serif';
          ctx.globalAlpha = 0.8;
          ctx.fillText(cardCompany, 200, 155);
          ctx.globalAlpha = 1;
        }

        // 绘制联系信息
        ctx.textAlign = 'left';
        const startY = 220;
        const lineHeight = 30;
        let currentY = startY;
        if (cardPhone) {
          ctx.font = '14px sans-serif';
          ctx.fillText(`📱 ${cardPhone}`, 40, currentY);
          currentY += lineHeight;
        }
        if (cardEmail) {
          ctx.fillText(`✉️ ${cardEmail}`, 40, currentY);
          currentY += lineHeight;
        }
        if (cardAddress) {
          ctx.fillText(`📍 ${cardAddress}`, 40, currentY);
          currentY += lineHeight;
        }

        // 绘制简介
        if (cardIntro) {
          ctx.font = '12px sans-serif';
          ctx.globalAlpha = 0.8;
          ctx.fillStyle = 'rgba(255,255,255,0.9)';
          const maxWidth = 320;
          const words = cardIntro;
          let line = '';
          const startY = startY + 80;
          ctx.fillText(words.substring(0, 40), 40, startY);
          ctx.globalAlpha = 1;
        }
        const link = document.createElement('a');
        link.download = `名片_${cardName}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        toast({
          title: '保存成功',
          description: '名片图片已保存到本地'
        });
      }
      document.body.removeChild(cardElement);
    } catch (error) {
      console.error('保存图片失败:', error);
      toast({
        title: '保存失败',
        description: error.message || '保存图片时发生错误',
        variant: 'destructive'
      });
    }
  };

  // 生成二维码
  const handleQrCode = async (type, cardId = null) => {
    try {
      const cardData = type === 'personal' ? personalCard : type === 'company' ? companyCard : null;
      if (!cardData) return;

      // 生成名片分享链接
      const cardName = cardData.name || cardData.companyName;
      const shareUrl = `${window.location.origin}/business-card?cardId=${cardData._id}`;

      // 使用免费的二维码 API
      const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(shareUrl)}`;
      setQrCodeUrl(qrCodeApiUrl);
      setShowQrModal(true);

      // 更新浏览统计
      if (type === 'personal' && personalCard._id) {
        await props.$w.cloud.callDataSource({
          dataSourceName: 'business_cards',
          methodName: 'wedaUpdateV2',
          params: {
            data: {
              _id: personalCard._id,
              views: personalCard.views + 1
            }
          }
        });
        setPersonalCard(prev => ({
          ...prev,
          views: prev.views + 1
        }));
      } else if (type === 'company' && companyCard._id) {
        await props.$w.cloud.callDataSource({
          dataSourceName: 'business_cards',
          methodName: 'wedaUpdateV2',
          params: {
            data: {
              _id: companyCard._id,
              views: companyCard.views + 1
            }
          }
        });
        setCompanyCard(prev => ({
          ...prev,
          views: prev.views + 1
        }));
      } else if (cardId) {
        await props.$w.cloud.callDataSource({
          dataSourceName: 'business_cards',
          methodName: 'wedaUpdateV2',
          params: {
            data: {
              _id: cardId,
              views: (cardData.views || 0) + 1
            }
          }
        });
        setSampleCards(prev => prev.map(card => card.id === cardId ? {
          ...card,
          stats: {
            ...card.stats,
            views: card.stats.views + 1
          }
        } : card));
      }
    } catch (error) {
      console.error('生成二维码失败:', error);
      toast({
        title: '生成二维码失败',
        description: error.message || '生成二维码时发生错误',
        variant: 'destructive'
      });
    }
  };
  const [newCardData, setNewCardData] = useState({
    name: '',
    title: '',
    company: '',
    phone: '',
    email: '',
    address: '',
    avatar: '',
    wechat: '',
    intro: '',
    logo: ''
  });
  const handleEdit = () => {
    setEditData(activeTab === 'personal' ? personalCard : companyCard);
    setIsEditing(true);
  };
  const handleSave = async () => {
    try {
      // 保存到数据库
      const result = await props.$w.cloud.callFunction({
        name: 'updateBusinessCard',
        data: {
          type: activeTab,
          data: editData,
          userId: props.$w.auth.currentUser?.userId
        }
      });
      if (result.success) {
        if (activeTab === 'personal') {
          setPersonalCard(editData);
        } else {
          setCompanyCard(editData);
        }
        toast({
          title: '保存成功',
          description: '名片信息已更新'
        });
        setIsEditing(false);
      }
    } catch (error) {
      toast({
        title: '保存失败',
        description: error.message,
        variant: 'destructive'
      });
    }
  };
  const handleCancel = () => {
    setIsEditing(false);
    setEditData({});
  };
  const handleAddNewCard = () => {
    setShowAddForm(true);
  };
  const handleSubmitNewCard = async () => {
    if (!newCardData.name || !newCardData.phone) {
      toast({
        title: '提示',
        description: '姓名和手机号不能为空',
        variant: 'destructive'
      });
      return;
    }
    try {
      // 上传到数据模型
      const result = await props.$w.cloud.callDataSource({
        dataSourceName: 'business_cards',
        methodName: 'wedaCreate',
        params: {
          data: {
            cardType: 'personal',
            name: newCardData.name,
            title: newCardData.title || '',
            company: newCardData.company || '',
            phone: newCardData.phone,
            email: newCardData.email || '',
            address: newCardData.address || '',
            avatar: newCardData.avatar || '',
            wechat: newCardData.wechat || '',
            intro: newCardData.intro || '',
            website: '',
            logo: '',
            views: 0,
            likes: 0,
            shares: 0
          }
        }
      });
      if (result && result._id) {
        toast({
          title: '成功',
          description: '名片添加成功',
          variant: 'success'
        });
        setShowAddForm(false);
        setNewCardData({
          name: '',
          title: '',
          company: '',
          phone: '',
          email: '',
          address: '',
          avatar: '',
          wechat: '',
          intro: ''
        });

        // 刷新名片数据
        await loadBusinessCards();
      } else {
        throw new Error('添加失败：未返回名片ID');
      }
    } catch (error) {
      console.error('添加名片失败:', error);
      toast({
        title: '添加失败',
        description: '名片添加失败，请稍后重试',
        variant: 'destructive'
      });
    }
  };

  // 保存别人转发的名片
  const handleSaveReceivedCard = async cardData => {
    try {
      const result = await props.$w.cloud.callDataSource({
        dataSourceName: 'business_cards',
        methodName: 'wedaCreate',
        params: {
          data: {
            cardType: 'received',
            name: cardData.name || '',
            title: cardData.title || '',
            company: cardData.companyName || cardData.company || '',
            phone: cardData.phone || '',
            email: cardData.email || '',
            address: cardData.address || '',
            avatar: cardData.logoUrl || cardData.avatar || '',
            wechat: cardData.wechat || '',
            intro: cardData.description || cardData.intro || '',
            website: cardData.website || '',
            logo: '',
            views: 0,
            likes: 0,
            shares: 0
          }
        }
      });
      if (result && result._id) {
        toast({
          title: '保存成功',
          description: '名片已保存到您的名片夹'
        });

        // 刷新名片数据
        await loadBusinessCards();
      }
    } catch (error) {
      console.error('保存名片失败:', error);
      toast({
        title: '保存失败',
        description: error.message || '名片保存失败，请重试',
        variant: 'destructive'
      });
    }
  };
  const handleCancelAddForm = () => {
    setShowAddForm(false);
    setNewCardData({
      name: '',
      title: '',
      company: '',
      phone: '',
      email: '',
      address: '',
      avatar: '',
      wechat: '',
      intro: ''
    });
  };

  // 加载名片数据
  const loadBusinessCards = async () => {
    try {
      const result = await props.$w.cloud.callDataSource({
        dataSourceName: 'business_cards',
        methodName: 'wedaGetRecordsV2',
        params: {
          pageSize: 100,
          pageNumber: 1
        }
      });
      if (result && result.records) {
        const cards = result.records.map(record => ({
          id: record._id,
          cardType: record.cardType || 'personal',
          name: record.name || '',
          title: record.title || '',
          company: record.company || '',
          phone: record.phone || '',
          email: record.email || '',
          address: record.address || '',
          avatar: record.avatar || '',
          wechat: record.wechat || '',
          intro: record.intro || '',
          website: record.website || '',
          stats: {
            views: record.views || 0,
            likes: record.likes || 0,
            shares: record.shares || 0
          }
        }));
        setSampleCards(cards);
      }
    } catch (error) {
      console.error('加载名片失败:', error);
    }
  };

  // 组件加载时加载数据
  useEffect(() => {
    loadBusinessCards();
  }, []);

  // 加载收到的名片
  const loadReceivedCards = async () => {
    try {
      const result = await props.$w.cloud.callDataSource({
        dataSourceName: 'business_cards',
        methodName: 'wedaGetRecordsV2',
        params: {
          pageSize: 100,
          pageNumber: 1
        }
      });
      if (result && result.records) {
        // 过滤出收到的名片（非自己创建的）
        const userId = props.$w.auth.currentUser?.userId;
        const receivedCards = result.records.filter(record => record._openid !== userId);
        setSampleCards(receivedCards);
      }
    } catch (error) {
      console.error('加载收到的名片失败:', error);
      toast({
        title: '加载失败',
        description: '收到的名片加载失败',
        variant: 'destructive'
      });
    }
  };
  const handleShare = async (type, cardId = null) => {
    try {
      const cardData = type === 'personal' ? personalCard : type === 'company' ? companyCard : null;
      if (!cardData) return;

      // 在小程序环境中，调用微信分享功能
      if (typeof wx !== 'undefined') {
        wx.shareAppMessage({
          title: `${cardData.name || cardData.companyName} 的电子名片`,
          path: `/pages/business-card?cardId=${cardId}`,
          imageUrl: cardData.avatar || cardData.logo
        });
      } else {
        // Web 环境下，生成分享链接
        const shareUrl = `${window.location.origin}/business-card?cardId=${cardId}`;
        if (navigator.share) {
          await navigator.share({
            title: `${cardData.name || cardData.companyName} 的电子名片`,
            text: cardData.intro || cardData.intro,
            url: shareUrl
          });
        } else {
          // 复制链接到剪贴板
          await navigator.clipboard.writeText(shareUrl);
          toast({
            title: '分享链接已复制',
            description: '链接已复制到剪贴板，可以粘贴分享'
          });
        }
      }

      // 更新分享统计到数据模型
      if (type === 'personal' && personalCard._id) {
        await props.$w.cloud.callDataSource({
          dataSourceName: 'business_cards',
          methodName: 'wedaUpdateV2',
          params: {
            data: {
              _id: personalCard._id,
              shares: personalCard.shares + 1
            }
          }
        });
        setPersonalCard(prev => ({
          ...prev,
          shares: prev.shares + 1
        }));
      } else if (type === 'company' && companyCard._id) {
        await props.$w.cloud.callDataSource({
          dataSourceName: 'business_cards',
          methodName: 'wedaUpdateV2',
          params: {
            data: {
              _id: companyCard._id,
              shares: companyCard.shares + 1
            }
          }
        });
        setCompanyCard(prev => ({
          ...prev,
          shares: prev.shares + 1
        }));
      } else if (cardId) {
        // 更新收到的名片的分享数
        await props.$w.cloud.callDataSource({
          dataSourceName: 'business_cards',
          methodName: 'wedaUpdateV2',
          params: {
            data: {
              _id: cardId,
              shares: (cardData.shares || 0) + 1
            }
          }
        });
        setSampleCards(prev => prev.map(card => card.id === cardId ? {
          ...card,
          stats: {
            ...card.stats,
            shares: card.stats.shares + 1
          }
        } : card));
      }
      toast({
        title: '分享成功',
        description: '名片分享成功'
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
  const [likedCards, setLikedCards] = useState(new Set()); // 记录已点赞的名片ID

  const handleLike = async (type, cardId = null) => {
    try {
      const cardData = type === 'personal' ? personalCard : type === 'company' ? companyCard : null;
      const likeKey = type === 'personal' ? 'personal' : type === 'company' ? 'company' : cardId;

      // 检查是否已经点赞
      if (likedCards.has(likeKey)) {
        toast({
          title: '已经点赞过了',
          description: '您已经为这张名片点赞过了'
        });
        return;
      }

      // 更新点赞统计到数据模型
      if (type === 'personal' && personalCard._id) {
        await props.$w.cloud.callDataSource({
          dataSourceName: 'business_cards',
          methodName: 'wedaUpdateV2',
          params: {
            data: {
              _id: personalCard._id,
              likes: personalCard.likes + 1
            }
          }
        });
        setPersonalCard(prev => ({
          ...prev,
          likes: prev.likes + 1
        }));
      } else if (type === 'company' && companyCard._id) {
        await props.$w.cloud.callDataSource({
          dataSourceName: 'business_cards',
          methodName: 'wedaUpdateV2',
          params: {
            data: {
              _id: companyCard._id,
              likes: companyCard.likes + 1
            }
          }
        });
        setCompanyCard(prev => ({
          ...prev,
          likes: prev.likes + 1
        }));
      } else if (cardId) {
        await props.$w.cloud.callDataSource({
          dataSourceName: 'business_cards',
          methodName: 'wedaUpdateV2',
          params: {
            data: {
              _id: cardId,
              likes: (cardData.likes || 0) + 1
            }
          }
        });
        setSampleCards(prev => prev.map(card => card.id === cardId ? {
          ...card,
          stats: {
            ...card.stats,
            likes: card.stats.likes + 1
          }
        } : card));
      }

      // 记录已点赞
      setLikedCards(prev => new Set([...prev, likeKey]));
      toast({
        title: '点赞成功',
        description: '感谢您的支持'
      });
    } catch (error) {
      console.error('点赞失败:', error);
      toast({
        title: '点赞失败',
        description: error.message || '点赞时发生错误',
        variant: 'destructive'
      });
    }
  };
  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const renderPersonalCard = () => <div className="space-y-6">
      {/* 个人头像和基本信息 */}
      <Card className="bg-slate-50 border-slate-200">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={personalCard.avatar} />
              <AvatarFallback className="bg-blue-500 text-white text-xl">
                {personalCard.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800">{personalCard.name}</h3>
              <p className="text-gray-600">{personalCard.title}</p>
              <p className="text-gray-500">{personalCard.company}</p>
            </div>
            <div className="text-right">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                认证专家
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 联系方式 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Phone className="h-5 w-5" />
            <span>联系方式</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3">
            <Phone className="h-4 w-4 text-gray-500" />
            <span>{personalCard.phone}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Mail className="h-4 w-4 text-gray-500" />
            <span>{personalCard.email}</span>
          </div>
          <div className="flex items-center space-x-3">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span>{personalCard.address}</span>
          </div>
        </CardContent>
      </Card>

      {/* 个人简介 */}
      <Card>
        <CardHeader>
          <CardTitle>个人简介</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{personalCard.intro}</p>
        </CardContent>
      </Card>

      {/* 统计信息 */}
      <Card>
        <CardHeader>
          <CardTitle>数据统计</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Eye className="h-4 w-4 text-blue-500" />
                <span className="text-2xl font-bold text-blue-600">{personalCard.stats.views}</span>
              </div>
              <p className="text-sm text-gray-600">浏览</p>
            </div>
            <div>
              <div className="flex items-center justify-center space-x-1 mb-1">
                <ThumbsUp className="h-4 w-4 text-green-500" />
                <span className="text-2xl font-bold text-green-600">{personalCard.stats.likes}</span>
              </div>
              <p className="text-sm text-gray-600">点赞</p>
            </div>
            <div>
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Share2 className="h-4 w-4 text-purple-500" />
                <span className="text-2xl font-bold text-purple-600">{personalCard.stats.shares}</span>
              </div>
              <p className="text-sm text-gray-600">转发</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>;
  const renderReceivedCards = () => <div className="space-y-4">
      {sampleCards.filter(card => card.cardType === 'received').length === 0 ? <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-400">
              <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>暂无收到的名片</p>
            </div>
          </CardContent>
        </Card> : sampleCards.filter(card => card.cardType === 'received').map((card, index) => <Card key={index} className="bg-slate-50 border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16 border-2 border-gray-200">
                    <AvatarImage src={card.avatar} alt={card.name} />
                    <AvatarFallback className="bg-blue-600 text-white text-xl">{card.name?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{card.name}</h3>
                    <p className="text-gray-600">{card.title}</p>
                    <p className="text-gray-500 text-sm">{card.company}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                  收到的名片
                </Badge>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center space-x-2 text-gray-600 text-sm">
                  <Phone className="h-4 w-4" />
                  <span>{card.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 text-sm">
                  <Mail className="h-4 w-4" />
                  <span>{card.email}</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-white rounded-lg">
                <p className="text-gray-700 text-sm">{card.intro}</p>
              </div>

              <div className="mt-4">
                {/* 统计信息 */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{card.stats?.views || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{card.stats?.likes || 0}</span>
                    </div>
                  </div>
                  <Button size="sm" onClick={() => handleSaveReceivedCard(card)} className="bg-blue-600 hover:bg-blue-700">
                    <Save className="h-4 w-4 mr-1" />
                    保存到名片夹
                  </Button>
                </div>

                {/* 操作按钮 */}
                <div className="grid grid-cols-4 gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleShare('received', card.id)} className="border-blue-200 text-blue-600 hover:bg-blue-50">
                    <Share2 className="h-3 w-3 mr-1" />
                    转发
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleLike('received', card.id)} className={`border-green-200 text-green-600 hover:bg-green-50 ${likedCards.has(card.id) ? 'bg-green-50' : ''}`}>
                    <ThumbsUp className="h-3 w-3 mr-1" />
                    {likedCards.has(card.id) ? '已赞' : '点赞'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleSaveImage('received', card.id)} className="border-amber-200 text-amber-600 hover:bg-amber-50">
                    <Download className="h-3 w-3 mr-1" />
                    保存图片
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleQrCode('received', card.id)} className="border-purple-200 text-purple-600 hover:bg-purple-50">
                    <QrCode className="h-3 w-3 mr-1" />
                    二维码
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>)}
    </div>;
  const renderCompanyCard = () => <div className="space-y-6">
      {/* 企业信息 */}
      <Card className="bg-slate-50 border-slate-200">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-green-500 p-4 rounded-lg">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800">{companyCard.companyName}</h3>
              <p className="text-gray-600">法人代表: {companyCard.legalPerson}</p>
              <p className="text-gray-500">注册资本: {companyCard.registeredCapital}</p>
            </div>
            <div className="text-right">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                认证机构
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 企业详情 */}
      <Card>
        <CardHeader>
          <CardTitle>企业信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-gray-500">成立时间</Label>
              <p className="font-medium">{companyCard.establishedDate}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-500">注册资本</Label>
              <p className="font-medium">{companyCard.registeredCapital}</p>
            </div>
          </div>
          <div>
            <Label className="text-sm text-gray-500">经营范围</Label>
            <p className="font-medium">{companyCard.businessScope}</p>
          </div>
          <div>
            <Label className="text-sm text-gray-500">注册地址</Label>
            <p className="font-medium">{companyCard.address}</p>
          </div>
        </CardContent>
      </Card>

      {/* 联系方式 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Phone className="h-5 w-5" />
            <span>联系方式</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3">
            <Phone className="h-4 w-4 text-gray-500" />
            <span>{companyCard.phone}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Mail className="h-4 w-4 text-gray-500" />
            <span>{companyCard.email}</span>
          </div>
          <div className="flex items-center space-x-3">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span>{companyCard.address}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Building2 className="h-4 w-4 text-gray-500" />
            <span>{companyCard.website}</span>
          </div>
        </CardContent>
      </Card>

      {/* 企业简介 */}
      <Card>
        <CardHeader>
          <CardTitle>企业简介</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{companyCard.intro}</p>
        </CardContent>
      </Card>

      {/* 统计信息 */}
      <Card>
        <CardHeader>
          <CardTitle>数据统计</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Eye className="h-4 w-4 text-blue-500" />
                <span className="text-2xl font-bold text-blue-600">{companyCard.stats.views}</span>
              </div>
              <p className="text-sm text-gray-600">浏览</p>
            </div>
            <div>
              <div className="flex items-center justify-center space-x-1 mb-1">
                <ThumbsUp className="h-4 w-4 text-green-500" />
                <span className="text-2xl font-bold text-green-600">{companyCard.stats.likes}</span>
              </div>
              <p className="text-sm text-gray-600">点赞</p>
            </div>
            <div>
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Share2 className="h-4 w-4 text-purple-500" />
                <span className="text-2xl font-bold text-purple-600">{companyCard.stats.shares}</span>
              </div>
              <p className="text-sm text-gray-600">转发</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>;
  const renderEditForm = () => <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>编辑信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeTab === 'personal' ? <>
              <div>
                <Label>姓名</Label>
                <Input value={editData.name || ''} onChange={e => handleInputChange('name', e.target.value)} placeholder="请输入姓名" />
              </div>
              <div>
                <Label>职位</Label>
                <Input value={editData.title || ''} onChange={e => handleInputChange('title', e.target.value)} placeholder="请输入职位" />
              </div>
              <div>
                <Label>公司</Label>
                <Input value={editData.company || ''} onChange={e => handleInputChange('company', e.target.value)} placeholder="请输入公司名称" />
              </div>
              <div>
                <Label>电话</Label>
                <Input value={editData.phone || ''} onChange={e => handleInputChange('phone', e.target.value)} placeholder="请输入电话号码" />
              </div>
              <div>
                <Label>邮箱</Label>
                <Input value={editData.email || ''} onChange={e => handleInputChange('email', e.target.value)} placeholder="请输入邮箱地址" />
              </div>
              <div>
                <Label>个人简介</Label>
                <Textarea value={editData.intro || ''} onChange={e => handleInputChange('intro', e.target.value)} placeholder="请输入个人简介" rows={4} />
              </div>
            </> : <>
              <div>
                <Label>公司名称</Label>
                <Input value={editData.companyName || ''} onChange={e => handleInputChange('companyName', e.target.value)} placeholder="请输入公司名称" />
              </div>
              <div>
                <Label>法人代表</Label>
                <Input value={editData.legalPerson || ''} onChange={e => handleInputChange('legalPerson', e.target.value)} placeholder="请输入法人代表" />
              </div>
              <div>
                <Label>注册资本</Label>
                <Input value={editData.registeredCapital || ''} onChange={e => handleInputChange('registeredCapital', e.target.value)} placeholder="请输入注册资本" />
              </div>
              <div>
                <Label>成立时间</Label>
                <Input type="date" value={editData.establishedDate || ''} onChange={e => handleInputChange('establishedDate', e.target.value)} />
              </div>
              <div>
                <Label>经营范围</Label>
                <Textarea value={editData.businessScope || ''} onChange={e => handleInputChange('businessScope', e.target.value)} placeholder="请输入经营范围" rows={3} />
              </div>
              <div>
                <Label>企业简介</Label>
                <Textarea value={editData.intro || ''} onChange={e => handleInputChange('intro', e.target.value)} placeholder="请输入企业简介" rows={4} />
              </div>
            </>}
          
          <div className="flex space-x-3 pt-4">
            <Button onClick={handleSave} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              保存
            </Button>
            <Button variant="outline" onClick={handleCancel} className="flex-1">
              <X className="h-4 w-4 mr-2" />
              取消
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>;
  return <div className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部导航栏 */}
      <div className="bg-blue-800 text-white p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">电子名片</h1>
          <div className="flex items-center space-x-2">
            {!isEditing ? <>
              <Button variant="ghost" size="sm" className="text-white hover:text-blue-100" onClick={handleAddNewCard}>
                <User className="h-4 w-4 mr-1" />
                新增
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:text-blue-100" onClick={handleEdit}>
                <Edit3 className="h-4 w-4 mr-1" />
                编辑
              </Button>
            </> : null}
          </div>
        </div>
      </div>

      <div className="p-4">
        {!isEditing ? <>
            {/* 标签页 */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal">个人名片</TabsTrigger>
                <TabsTrigger value="company">企业名片</TabsTrigger>
                <TabsTrigger value="received">收到的名片</TabsTrigger>
              </TabsList>
              
              <TabsContent value="personal">
                {renderPersonalCard()}
              </TabsContent>
              
              <TabsContent value="company">
                {renderCompanyCard()}
              </TabsContent>

              <TabsContent value="received">
                {renderReceivedCards()}
              </TabsContent>
            </Tabs>

            {/* 操作按钮 */}
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={() => handleShare(activeTab)} className="bg-blue-600 hover:bg-blue-700">
                <Share2 className="h-4 w-4 mr-2" />
                转发名片
              </Button>
              <Button variant="outline" onClick={() => handleLike(activeTab)} className="border-green-600 text-green-600 hover:bg-green-50">
                <ThumbsUp className="h-4 w-4 mr-2" />
                点赞 ({activeTab === 'personal' ? personalCard.stats.likes : companyCard.stats.likes})
              </Button>
              <Button variant="outline" onClick={() => handleSaveImage(activeTab)}>
                <Download className="h-4 w-4 mr-2" />
                保存图片
              </Button>
              <Button variant="outline" onClick={() => handleQrCode(activeTab)}>
                <QrCode className="h-4 w-4 mr-2" />
                生成二维码
              </Button>
            </div>
          </> : renderEditForm()}
      </div>

      {/* 新增名片弹层 */}
      {showAddForm && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>新增名片</CardTitle>
              <CardDescription>填写新的名片信息</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">姓名 *</Label>
                <Input id="name" value={newCardData.name} onChange={e => {
              if (e && e.target) {
                setNewCardData(prev => ({
                  ...prev,
                  name: e.target.value
                }));
              }
            }} placeholder="请输入姓名" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">职位</Label>
                <Input id="title" value={newCardData.title} onChange={e => {
              if (e && e.target) {
                setNewCardData(prev => ({
                  ...prev,
                  title: e.target.value
                }));
              }
            }} placeholder="请输入职位" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">公司</Label>
                <Input id="company" value={newCardData.company} onChange={e => {
              if (e && e.target) {
                setNewCardData(prev => ({
                  ...prev,
                  company: e.target.value
                }));
              }
            }} placeholder="请输入公司名称" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">手机号 *</Label>
                <Input id="phone" value={newCardData.phone} onChange={e => {
              if (e && e.target) {
                setNewCardData(prev => ({
                  ...prev,
                  phone: e.target.value
                }));
              }
            }} placeholder="请输入手机号" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">邮箱</Label>
                <Input id="email" type="email" value={newCardData.email} onChange={e => {
              if (e && e.target) {
                setNewCardData(prev => ({
                  ...prev,
                  email: e.target.value
                }));
              }
            }} placeholder="请输入邮箱地址" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">地址</Label>
                <Input id="address" value={newCardData.address} onChange={e => {
              if (e && e.target) {
                setNewCardData(prev => ({
                  ...prev,
                  address: e.target.value
                }));
              }
            }} placeholder="请输入地址" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wechat">微信号</Label>
                <Input id="wechat" value={newCardData.wechat} onChange={e => {
              if (e && e.target) {
                setNewCardData(prev => ({
                  ...prev,
                  wechat: e.target.value
                }));
              }
            }} placeholder="请输入微信号" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="intro">个人简介</Label>
                <Textarea id="intro" value={newCardData.intro} onChange={e => {
              if (e && e.target) {
                setNewCardData(prev => ({
                  ...prev,
                  intro: e.target.value
                }));
              }
            }} placeholder="请输入个人简介" rows={3} />
              </div>
            </CardContent>
            <div className="p-6 pt-0 flex space-x-3">
              <Button onClick={handleSubmitNewCard} className="flex-1 bg-blue-600 hover:bg-blue-700">
                <Save className="h-4 w-4 mr-2" />
                保存
              </Button>
              <Button variant="outline" onClick={handleCancelAddForm} className="flex-1">
                <X className="h-4 w-4 mr-2" />
                取消
              </Button>
            </div>
          </Card>
        </div>}

      {/* 二维码弹窗 */}
      {showQrModal && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>二维码</span>
                <Button variant="ghost" size="sm" onClick={() => setShowQrModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
              <CardDescription>扫描二维码查看名片详情</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {qrCodeUrl && <div className="flex flex-col items-center space-y-4">
                  <img src={qrCodeUrl} alt="二维码" className="w-64 h-64 object-contain border-2 border-gray-200 rounded-lg" />
                  <p className="text-sm text-gray-600 text-center">
                    使用微信或手机相机扫描二维码，查看完整名片信息
                  </p>
                </div>}
            </CardContent>
          </Card>
        </div>}

      {/* 底部导航栏 */}
      <TabBar currentPage="business-card" $w={$w} />
    </div>;
}