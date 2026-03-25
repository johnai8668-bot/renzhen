// @ts-ignore;
import React, { useEffect } from 'react';
// @ts-ignore;
import { Button, Card } from '@/components/ui';
// @ts-ignore;
import { Shield, Users, FileText, Lock } from 'lucide-react';

export default function Login(props) {
  const handleLogin = async () => {
    try {
      const tcb = await props.$w.cloud.getCloudInstance();
      tcb.auth().toDefaultLoginPage({
        config_version: "env",
        redirect_uri: window.location.origin + '/home',
        // 登录后跳转到首页
        query: {
          s_domain: window.location.hostname
        }
      });
    } catch (error) {
      console.error('跳转登录页失败:', error);
    }
  };
  return <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-white shadow-xl p-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* 左侧：登录表单 */}
          <div className="flex flex-col justify-center">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-800 rounded-full mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">华夏认证系统</h1>
              <p className="text-slate-600">专业认证服务管理平台</p>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">员工登录</p>
                    <p className="text-xs text-slate-600">使用手机号或邮箱登录</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-green-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">业务管理</p>
                    <p className="text-xs text-slate-600">项目、证书、知识库</p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Lock className="w-5 h-5 text-amber-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">权限控制</p>
                    <p className="text-xs text-slate-600">按角色和部门设置权限</p>
                  </div>
                </div>
              </div>
            </div>

            <Button onClick={handleLogin} className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-8 h-12 text-lg">
              立即登录
            </Button>
          </div>

          {/* 右侧：系统特性 */}
          <div className="bg-slate-50 rounded-lg p-6 flex flex-col justify-center">
            <h2 className="text-xl font-bold text-slate-800 mb-6">系统特性</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">1</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">项目全流程管理</p>
                  <p className="text-xs text-slate-600">从立项到交付的完整生命周期管理</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">2</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">资质证书管理</p>
                  <p className="text-xs text-slate-600">证书状态监控与过期提醒</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">3</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">知识库协作</p>
                  <p className="text-xs text-slate-600">团队知识共享与版本控制</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">4</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">精细权限控制</p>
                  <p className="text-xs text-slate-600">按部门、角色的灵活权限配置</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">5</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">移动端支持</p>
                  <p className="text-xs text-slate-600">随时随地访问业务数据</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>;
}