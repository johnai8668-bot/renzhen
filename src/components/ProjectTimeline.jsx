// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Send, Image as ImageIcon, Paperclip, User, Clock } from 'lucide-react';

export function ProjectTimeline({
  projectId,
  $w
}) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [showAttachment, setShowAttachment] = useState(false);
  useEffect(() => {
    loadMessages();
  }, [projectId]);
  const loadMessages = async () => {
    if (!projectId) return;
    try {
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'project_communications',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {
              projectId
            }
          },
          orderBy: [{
            sendTime: 'desc'
          }],
          select: {
            $master: true
          },
          pageSize: 50,
          pageNumber: 1
        }
      });
      if (result.records && result.records.length > 0) {
        setMessages(result.records);
      } else {
        // 默认数据
        const defaultMessages = [{
          projectId,
          messageContent: '项目启动会已安排，客户方张总确认参会时间为下周三上午10点',
          messageType: 'text',
          sender: '王经理',
          sendTime: new Date(Date.now() - 3600000).toISOString(),
          readStatus: 'read',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          updatedAt: new Date(Date.now() - 3600000).toISOString()
        }, {
          projectId,
          messageContent: '收到，已通知审核组准备启动会议材料',
          messageType: 'text',
          sender: '李审核',
          sendTime: new Date(Date.now() - 7200000).toISOString(),
          readStatus: 'read',
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          updatedAt: new Date(Date.now() - 7200000).toISOString()
        }, {
          projectId,
          messageContent: '客户反馈需要补充环保验收报告，正在跟进',
          messageType: 'text',
          sender: '王经理',
          sendTime: new Date(Date.now() - 86400000).toISOString(),
          readStatus: 'read',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date(Date.now() - 86400000).toISOString()
        }];
        setMessages(defaultMessages);
      }
    } catch (error) {
      console.error('加载留言失败:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      const currentUser = $w.auth.currentUser || {
        name: '当前用户'
      };
      const messageData = {
        projectId,
        messageContent: newMessage,
        messageType: 'text',
        sender: currentUser.name,
        sendTime: new Date().toISOString(),
        readStatus: 'unread',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await $w.cloud.callDataSource({
        dataSourceName: 'project_communications',
        methodName: 'wedaCreateV2',
        params: {
          data: messageData
        }
      });
      setMessages([messageData, ...messages]);
      setNewMessage('');
      setShowAttachment(false);
    } catch (error) {
      console.error('发送消息失败:', error);
    }
  };
  const formatTime = timeString => {
    const date = new Date(timeString);
    const now = new Date();
    const diff = now - date;
    if (diff < 60000) return '刚刚';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前`;
    return date.toLocaleDateString('zh-CN');
  };
  return <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-white rounded-xl border border-gray-200 shadow-sm">
      {/* 标题栏 */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
        <h3 className="text-lg font-semibold text-gray-800">项目沟通记录</h3>
        <p className="text-xs text-gray-500 mt-1">共 {messages.length} 条消息</p>
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? <div className="flex items-center justify-center h-full text-gray-500">
            加载中...
          </div> : messages.length === 0 ? <div className="flex items-center justify-center h-full text-gray-400">
            暂无消息记录
          </div> : messages.map((msg, index) => <div key={index} className={`flex flex-col ${msg.sender === ($w.auth.currentUser?.name || '当前用户') ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[80%] rounded-lg px-3 py-2 ${msg.messageType === 'text' ? 'bg-white border border-gray-200' : 'bg-gray-100 border border-gray-200'} shadow-sm`}>
              {/* 发送人信息 */}
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${msg.sender === ($w.auth.currentUser?.name || '当前用户') ? 'bg-blue-500 text-white' : 'bg-gray-400 text-white'}`}>
                  <User className="w-3 h-3" />
                </div>
                <span className="text-xs font-medium text-gray-700">{msg.sender}</span>
              </div>
              
              {/* 消息内容 */}
              <div className={`text-sm ${msg.sender === ($w.auth.currentUser?.name || '当前用户') ? 'text-gray-800' : 'text-gray-700'}`}>
                {msg.messageContent}
              </div>
              
              {/* 附件展示 */}
              {msg.attachments && msg.attachments.length > 0 && <div className="mt-2 pt-2 border-t border-gray-100">
                  {msg.attachments.map((attach, idx) => <div key={idx} className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-800 cursor-pointer">
                      {msg.messageType === 'image' ? <ImageIcon className="w-4 h-4" /> : <Paperclip className="w-4 h-4" />}
                      <span>{attach.fileName}</span>
                    </div>)}
                </div>}
              
              {/* 发送时间 */}
              <div className={`flex items-center gap-1 mt-1 text-xs text-gray-400 ${msg.sender === ($w.auth.currentUser?.name || '当前用户') ? 'justify-end' : 'justify-start'}`}>
                <Clock className="w-3 h-3" />
                <span>{formatTime(msg.sendTime)}</span>
              </div>
            </div>
          </div>)}
      </div>

      {/* 输入框区域 */}
      <div className="p-3 border-t border-gray-200 bg-white rounded-b-xl">
        <div className="flex gap-2 items-end">
          <button onClick={() => setShowAttachment(!showAttachment)} className={`p-2 rounded-lg transition-colors ${showAttachment ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-600'}`}>
            <Paperclip className="w-5 h-5" />
          </button>
          <div className="flex-1 relative">
            <textarea value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="输入消息内容..." className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm" rows={2} onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }} />
          </div>
          <button onClick={handleSendMessage} disabled={!newMessage.trim()} className={`p-2 rounded-lg transition-colors ${newMessage.trim() ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
            <Send className="w-5 h-5" />
          </button>
        </div>
        
        {/* 附件快捷操作 */}
        {showAttachment && <div className="mt-2 flex gap-2">
            <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs text-gray-700 transition-colors">
              <ImageIcon className="w-4 h-4" />
              <span>图片</span>
            </button>
            <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs text-gray-700 transition-colors">
              <Paperclip className="w-4 h-4" />
              <span>文件</span>
            </button>
          </div>}
      </div>
    </div>;
}
export default ProjectTimeline;