// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { useToast, Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Switch, Label, Input, Avatar, AvatarFallback, AvatarImage } from '@/components/ui';
// @ts-ignore;
import { User, Bell, Shield, HelpCircle, LogOut, ChevronRight, Eye, EyeOff, Download, Trash2, Phone, Mail, Lock } from 'lucide-react';

import TabBar from '@/components/TabBar';
export default function Settings(props) {
  const {
    toast
  } = useToast();
  const [userInfo, setUserInfo] = useState({
    name: props.$w.auth.currentUser?.name || '用户',
    email: props.$w.auth.currentUser?.email || '',
    phone: props.$w.auth.currentUser?.phone || '',
    avatar: props.$w.auth.currentUser?.avatarUrl || ''
  });

  // 确保 userInfo 始终有完整的属性
  const safeUserInfo = {
    name: userInfo.name || '',
    email: userInfo.email || '',
    phone: userInfo.phone || '',
    avatar: userInfo.avatar || ''
  };
  const [settings, setSettings] = useState({
    notifications: {
      certificateExpiry: true,
      newMessages: true,
      systemUpdates: true,
      marketing: false
    },
    privacy: {
      showProfile: true,
      allowMessages: true,
      dataAnalytics: true
    },
    security: {
      twoFactorAuth: false,
      biometricLogin: true
    }
  });
  const handleLogout = async () => {
    try {
      const tcb = await props.$w.cloud.getCloudInstance();
      await tcb.auth().signOut();
      toast({
        title: '退出成功',
        description: '已安全退出登录'
      });
      props.$w.utils.redirectTo({
        pageId: 'login',
        params: {}
      });
    } catch (error) {
      toast({
        title: '退出失败',
        description: error.message || '退出登录时发生错误',
        variant: 'destructive'
      });
    }
  };
  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
    saveSettings(category, key, value);
  };
  const saveSettings = async (category, key, value) => {
    try {
      await props.$w.cloud.callFunction({
        name: 'updateSettings',
        data: {
          category,
          key,
          value,
          userId: props.$w.auth.currentUser?.userId
        }
      });
      toast({
        title: '设置已保存',
        description: '您的设置已更新'
      });
    } catch (error) {
      toast({
        title: '保存失败',
        description: '设置保存失败，请重试',
        variant: 'destructive'
      });
    }
  };
  const handleDataExport = async () => {
    try {
      const result = await props.$w.cloud.callFunction({
        name: 'exportUserData',
        data: {
          userId: props.$w.auth.currentUser?.userId
        }
      });
      if (result.success) {
        toast({
          title: '导出成功',
          description: '数据导出完成，请查看下载文件'
        });
      }
    } catch (error) {
      toast({
        title: '导出失败',
        description: error.message,
        variant: 'destructive'
      });
    }
  };
  const handleDataDelete = async () => {
    if (confirm('确定要删除所有数据吗？此操作不可恢复。')) {
      try {
        const result = await props.$w.cloud.callFunction({
          name: 'deleteUserData',
          data: {
            userId: props.$w.auth.currentUser?.userId
          }
        });
        if (result.success) {
          toast({
            title: '删除成功',
            description: '所有数据已清除'
          });
        }
      } catch (error) {
        toast({
          title: '删除失败',
          description: error.message,
          variant: 'destructive'
        });
      }
    }
  };
  const menuItems = [{
    id: 'profile',
    title: '个人信息',
    icon: User,
    description: '管理您的个人资料'
  }, {
    id: 'notifications',
    title: '通知设置',
    icon: Bell,
    description: '设置消息提醒偏好'
  }, {
    id: 'privacy',
    title: '隐私设置',
    icon: Eye,
    description: '控制您的隐私选项'
  }, {
    id: 'security',
    title: '安全设置',
    icon: Shield,
    description: '保护您的账户安全'
  }, {
    id: 'data',
    title: '数据管理',
    icon: Download,
    description: '导出或删除您的数据'
  }, {
    id: 'help',
    title: '帮助中心',
    icon: HelpCircle,
    description: '获取使用帮助'
  }];
  const [activeSection, setActiveSection] = useState('profile');
  const renderProfileSection = () => <Card>
      <CardHeader>
        <CardTitle>个人信息</CardTitle>
        <CardDescription>管理您的个人资料信息</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={userInfo.avatar} />
            <AvatarFallback className="bg-blue-600 text-white text-xl">
              {userInfo.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-lg">{userInfo.name}</h3>
            <p className="text-gray-600">{userInfo.email}</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <Label>姓名</Label>
            <Input value={safeUserInfo.name || ''} onChange={e => {
            if (e && e.target) {
              setUserInfo(prev => ({
                ...prev,
                name: e.target.value
              }));
            }
          }} />
          </div>
          <div>
            <Label>邮箱</Label>
            <Input type="email" value={safeUserInfo.email || ''} onChange={e => {
            if (e && e.target) {
              setUserInfo(prev => ({
                ...prev,
                email: e.target.value
              }));
            }
          }} />
          </div>
          <div>
            <Label>手机号</Label>
            <Input type="tel" value={safeUserInfo.phone || ''} onChange={e => {
            if (e && e.target) {
              setUserInfo(prev => ({
                ...prev,
                phone: e.target.value
              }));
            }
          }} />
          </div>
        </div>
        
        <Button onClick={() => saveSettings('profile', 'info', userInfo)} className="w-full bg-blue-600 hover:bg-blue-700">
          保存修改
        </Button>
      </CardContent>
    </Card>;
  const renderNotificationsSection = () => <Card>
      <CardHeader>
        <CardTitle>通知设置</CardTitle>
        <CardDescription>选择您希望接收的通知类型</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base">证书到期提醒</Label>
            <p className="text-sm text-gray-500">证书即将到期时提醒您</p>
          </div>
          <Switch checked={settings.notifications.certificateExpiry} onCheckedChange={checked => handleSettingChange('notifications', 'certificateExpiry', checked)} />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base">新消息通知</Label>
            <p className="text-sm text-gray-500">收到新消息时提醒您</p>
          </div>
          <Switch checked={settings.notifications.newMessages} onCheckedChange={checked => handleSettingChange('notifications', 'newMessages', checked)} />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base">系统更新通知</Label>
            <p className="text-sm text-gray-500">系统有新功能或更新时通知您</p>
          </div>
          <Switch checked={settings.notifications.systemUpdates} onCheckedChange={checked => handleSettingChange('notifications', 'systemUpdates', checked)} />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base">营销信息</Label>
            <p className="text-sm text-gray-500">接收产品更新和优惠信息</p>
          </div>
          <Switch checked={settings.notifications.marketing} onCheckedChange={checked => handleSettingChange('notifications', 'marketing', checked)} />
        </div>
      </CardContent>
    </Card>;
  const renderPrivacySection = () => <Card>
      <CardHeader>
        <CardTitle>隐私设置</CardTitle>
        <CardDescription>控制您的个人信息可见性</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base">公开个人资料</Label>
            <p className="text-sm text-gray-500">允许其他用户查看您的基本资料</p>
          </div>
          <Switch checked={settings.privacy.showProfile} onCheckedChange={checked => handleSettingChange('privacy', 'showProfile', checked)} />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base">允许消息</Label>
            <p className="text-sm text-gray-500">允许其他用户向您发送消息</p>
          </div>
          <Switch checked={settings.privacy.allowMessages} onCheckedChange={checked => handleSettingChange('privacy', 'allowMessages', checked)} />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base">数据分析</Label>
            <p className="text-sm text-gray-500">允许收集使用数据以改善服务</p>
          </div>
          <Switch checked={settings.privacy.dataAnalytics} onCheckedChange={checked => handleSettingChange('privacy', 'dataAnalytics', checked)} />
        </div>
      </CardContent>
    </Card>;
  const renderSecuritySection = () => <Card>
      <CardHeader>
        <CardTitle>安全设置</CardTitle>
        <CardDescription>保护您的账户安全</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base">双重认证</Label>
            <p className="text-sm text-gray-500">启用双重认证提高账户安全性</p>
          </div>
          <Switch checked={settings.security.twoFactorAuth} onCheckedChange={checked => handleSettingChange('security', 'twoFactorAuth', checked)} />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base">生物识别登录</Label>
            <p className="text-sm text-gray-500">使用指纹或面部识别登录</p>
          </div>
          <Switch checked={settings.security.biometricLogin} onCheckedChange={checked => handleSettingChange('security', 'biometricLogin', checked)} />
        </div>
        
        <div className="space-y-3 pt-4 border-t">
          <Button variant="outline" className="w-full">
            <Lock className="h-4 w-4 mr-2" />
            修改密码
          </Button>
          <Button variant="outline" className="w-full">
            <Phone className="h-4 w-4 mr-2" />
            绑定手机
          </Button>
          <Button variant="outline" className="w-full">
            <Mail className="h-4 w-4 mr-2" />
            绑定邮箱
          </Button>
        </div>
      </CardContent>
    </Card>;
  const renderDataSection = () => <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>数据导出</CardTitle>
          <CardDescription>导出您的所有数据</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleDataExport} variant="outline" className="w-full">
            <Download className="h-4 w-4 mr-2" />
            导出数据
          </Button>
          <p className="text-sm text-gray-600 mt-2">
            导出包含您的名片、证书、项目、账单等所有数据
          </p>
        </CardContent>
      </Card>
      
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">危险操作</CardTitle>
          <CardDescription>删除所有数据（不可恢复）</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleDataDelete} variant="destructive" className="w-full">
            <Trash2 className="h-4 w-4 mr-2" />
            删除所有数据
          </Button>
          <p className="text-sm text-red-600 mt-2">
            此操作将永久删除您的所有数据，请谨慎操作
          </p>
        </CardContent>
      </Card>
    </div>;
  const renderHelpSection = () => <Card>
      <CardHeader>
        <CardTitle>帮助中心</CardTitle>
        <CardDescription>获取使用帮助和支持</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <HelpCircle className="h-4 w-4 mr-2" />
            使用指南
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Phone className="h-4 w-4 mr-2" />
            联系客服
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Mail className="h-4 w-4 mr-2" />
            意见反馈
          </Button>
        </div>
        
        <div className="pt-4 border-t">
          <p className="text-sm text-gray-600">
            客服热线：400-123-4567<br />
            工作时间：周一至周五 9:00-18:00
          </p>
        </div>
      </CardContent>
    </Card>;
  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfileSection();
      case 'notifications':
        return renderNotificationsSection();
      case 'privacy':
        return renderPrivacySection();
      case 'security':
        return renderSecuritySection();
      case 'data':
        return renderDataSection();
      case 'help':
        return renderHelpSection();
      default:
        return renderProfileSection();
    }
  };
  return <div className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部导航栏 */}
      <div className="bg-blue-800 text-white p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">设置</h1>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-white hover:text-gray-100" onClick={() => props.$w.utils.navigateTo({
            pageId: 'permission-management',
            params: {}
          })}>
              <Shield className="h-4 w-4 mr-2" />
              权限管理
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:text-gray-100" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              退出
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 侧边菜单 */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-0">
                {menuItems.map(item => {
                const IconComponent = item.icon;
                return <button key={item.id} onClick={() => setActiveSection(item.id)} className={`w-full flex items-center space-x-3 p-4 hover:bg-gray-50 transition-colors ${activeSection === item.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''}`}>
                      <IconComponent className={`h-5 w-5 ${activeSection === item.id ? 'text-blue-600' : 'text-gray-500'}`} />
                      <div className="flex-1 text-left">
                        <h3 className={`font-medium ${activeSection === item.id ? 'text-blue-600' : 'text-gray-800'}`}>
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </button>;
              })}
              </CardContent>
            </Card>
          </div>

          {/* 内容区域 */}
          <div className="lg:col-span-2">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* 底部导航栏 */}
      <TabBar currentPage="settings" $w={$w} />
    </div>;
}