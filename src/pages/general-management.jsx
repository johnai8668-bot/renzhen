// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { toast, Button, Input, Textarea, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, Tabs, TabsContent, TabsList, TabsTrigger, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Badge, Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui';
// @ts-ignore;
import { Bell, FileText, Calendar, Package, Plus, Search, Filter, Clock, MapPin, Users, CheckCircle, XCircle, Eye, Edit, Trash2, Printer, Download } from 'lucide-react';

import { useForm } from 'react-hook-form';
export default function GeneralManagement({
  className = '',
  style = {},
  $w
}) {
  const [activeTab, setActiveTab] = useState('announcements');
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState([]);
  const [sealRequests, setSealRequests] = useState([]);
  const [meetingReservations, setMeetingReservations] = useState([]);
  const [officeSupplies, setOfficeSupplies] = useState([]);

  // Dialog states
  const [announcementDialog, setAnnouncementDialog] = useState(false);
  const [sealDialog, setSealDialog] = useState(false);
  const [meetingDialog, setMeetingDialog] = useState(false);
  const [supplyDialog, setSupplyDialog] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Filter states
  const [announcementFilter, setAnnouncementFilter] = useState('all');
  const [sealFilter, setSealFilter] = useState('all');
  const [meetingFilter, setMeetingFilter] = useState('all');
  const [supplyFilter, setSupplyFilter] = useState('all');

  // Search states
  const [announcementSearch, setAnnouncementSearch] = useState('');
  const [sealSearch, setSealSearch] = useState('');
  const [meetingSearch, setMeetingSearch] = useState('');
  const [supplySearch, setSupplySearch] = useState('');

  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date());
  const formAnnouncement = useForm();
  const formSeal = useForm();
  const formMeeting = useForm();
  const formSupply = useForm();
  const currentUser = $w.auth.currentUser || {
    name: '管理员',
    userId: 'admin'
  };
  const rooms = [{
    roomId: 'R001',
    name: '大会议室',
    capacity: 30,
    equipment: ['投影仪', '音响', '白板']
  }, {
    roomId: 'R002',
    name: '小会议室',
    capacity: 10,
    equipment: ['投影仪', '音响']
  }, {
    roomId: 'R003',
    name: '培训室',
    capacity: 15,
    equipment: ['投影仪', '白板']
  }];
  const inventoryItems = [{
    itemName: 'A4纸',
    stock: 150,
    unit: '包',
    unitPrice: 25
  }, {
    itemName: '打印纸',
    stock: 120,
    unit: '包',
    unitPrice: 28
  }, {
    itemName: '签字笔',
    stock: 200,
    unit: '支',
    unitPrice: 2
  }, {
    itemName: '笔记本',
    stock: 80,
    unit: '本',
    unitPrice: 15
  }, {
    itemName: '文件夹',
    stock: 200,
    unit: '个',
    unitPrice: 8
  }, {
    itemName: '文件袋',
    stock: 100,
    unit: '个',
    unitPrice: 1.5
  }, {
    itemName: '计算器',
    stock: 15,
    unit: '个',
    unitPrice: 45
  }, {
    itemName: '回形针',
    stock: 50,
    unit: '盒',
    unitPrice: 5
  }, {
    itemName: 'U盘',
    stock: 45,
    unit: '个',
    unitPrice: 35
  }, {
    itemName: '马克笔',
    stock: 60,
    unit: '支',
    unitPrice: 8
  }, {
    itemName: '名片盒',
    stock: 80,
    unit: '个',
    unitPrice: 12
  }, {
    itemName: '胶水',
    stock: 40,
    unit: '瓶',
    unitPrice: 3
  }];
  useEffect(() => {
    loadData();
  }, []);
  const loadData = async () => {
    setLoading(true);
    try {
      const tcb = await $w.cloud.getCloudInstance();
      const db = tcb.database();
      const [announcementResult, sealResult, meetingResult, supplyResult] = await Promise.all([db.collection('announcements').get(), db.collection('seal_requests').get(), db.collection('meeting_reservations').get(), db.collection('office_supplies').get()]);
      setAnnouncements(announcementResult.data || []);
      setSealRequests(sealResult.data || []);
      setMeetingReservations(meetingResult.data || []);
      setOfficeSupplies(supplyResult.data || []);
    } catch (error) {
      console.error('加载数据失败:', error);
      toast({
        title: '加载数据失败',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  const handleAnnouncementSubmit = async data => {
    try {
      const tcb = await $w.cloud.getCloudInstance();
      const db = tcb.database();
      const newAnnouncement = {
        ...data,
        status: '草稿',
        publisher: {
          userId: currentUser.userId,
          name: currentUser.name
        },
        views: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await db.collection('announcements').add(newAnnouncement);
      toast({
        title: '公告发布成功',
        description: '公告已保存'
      });
      setAnnouncementDialog(false);
      formAnnouncement.reset();
      loadData();
    } catch (error) {
      console.error('发布公告失败:', error);
      toast({
        title: '发布公告失败',
        description: error.message,
        variant: 'destructive'
      });
    }
  };
  const handleSealSubmit = async data => {
    try {
      const tcb = await $w.cloud.getCloudInstance();
      const db = tcb.database();
      const requestId = 'SQ' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + String(Date.now()).slice(-3);
      const newRequest = {
        ...data,
        requestId,
        status: '待审批',
        applicant: {
          userId: currentUser.userId,
          name: currentUser.name,
          department: '综合管理部'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await db.collection('seal_requests').add(newRequest);
      toast({
        title: '印章申请提交成功',
        description: `申请编号: ${requestId}`
      });
      setSealDialog(false);
      formSeal.reset();
      loadData();
    } catch (error) {
      console.error('提交申请失败:', error);
      toast({
        title: '提交申请失败',
        description: error.message,
        variant: 'destructive'
      });
    }
  };
  const handleMeetingSubmit = async data => {
    try {
      const tcb = await $w.cloud.getCloudInstance();
      const db = tcb.database();
      const reservationId = 'MR' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + String(Date.now()).slice(-3);
      const selectedRoom = rooms.find(r => r.roomId === data.roomId);
      const newReservation = {
        reservationId,
        title: data.title,
        organizer: {
          userId: currentUser.userId,
          name: currentUser.name,
          department: '综合管理部'
        },
        room: selectedRoom,
        startDate: data.startDate,
        startTime: data.startTime,
        endDate: data.endDate,
        endTime: data.endTime,
        attendees: parseInt(data.attendees),
        description: data.description,
        status: '已预定',
        catering: data.catering || false,
        recurring: data.recurring || false,
        recurringPattern: data.recurringPattern || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await db.collection('meeting_reservations').add(newReservation);
      toast({
        title: '会议室预定成功',
        description: `预定编号: ${reservationId}`
      });
      setMeetingDialog(false);
      formMeeting.reset();
      loadData();
    } catch (error) {
      console.error('预定会议室失败:', error);
      toast({
        title: '预定会议室失败',
        description: error.message,
        variant: 'destructive'
      });
    }
  };
  const handleSupplySubmit = async data => {
    try {
      const tcb = await $w.cloud.getCloudInstance();
      const db = tcb.database();
      const supplyId = 'OS' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + String(Date.now()).slice(-3);
      const items = JSON.parse(data.items);
      const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
      const newSupply = {
        supplyId,
        applicant: {
          userId: currentUser.userId,
          name: currentUser.name,
          department: '综合管理部'
        },
        items,
        totalAmount,
        reason: data.reason,
        status: '待审批',
        inventory: inventoryItems.filter(item => items.some(reqItem => reqItem.itemName === item.itemName)),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await db.collection('office_supplies').add(newSupply);
      toast({
        title: '办公用品申领成功',
        description: `申领编号: ${supplyId}`
      });
      setSupplyDialog(false);
      formSupply.reset();
      loadData();
    } catch (error) {
      console.error('申领失败:', error);
      toast({
        title: '申领失败',
        description: error.message,
        variant: 'destructive'
      });
    }
  };
  const getStatusColor = status => {
    const colors = {
      '草稿': 'bg-gray-500',
      '已发布': 'bg-[#00A896]',
      '已撤回': 'bg-red-500',
      '待审批': 'bg-[#D4AF37]',
      '已审批': 'bg-[#003D79]',
      '已拒绝': 'bg-red-500',
      '已使用': 'bg-[#00A896]',
      '已预定': 'bg-[#00A896]',
      '进行中': 'bg-blue-500',
      '已完成': 'bg-green-500',
      '已取消': 'bg-red-500',
      '已领取': 'bg-green-500'
    };
    return colors[status] || 'bg-gray-500';
  };
  const getPriorityColor = priority => {
    const colors = {
      '紧急': 'bg-red-500',
      '重要': 'bg-[#D4AF37]',
      '普通': 'bg-gray-500'
    };
    return colors[priority] || 'bg-gray-500';
  };
  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const calendarDays = [];

    // Weekday headers
    calendarDays.push(['日', '一', '二', '三', '四', '五', '六'].map(day => <div key={day} className="text-center text-sm font-medium py-2 text-gray-600">
          {day}
        </div>));

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="min-h-24 border border-gray-100 bg-gray-50"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayMeetings = meetingReservations.filter(m => m.startDate <= dateStr && m.endDate >= dateStr && m.status !== '已取消');
      const isToday = dateStr === new Date().toISOString().slice(0, 10);
      calendarDays.push(<div key={day} className={`min-h-24 border border-gray-100 p-2 ${isToday ? 'bg-blue-50 border-blue-200' : 'bg-white'}`}>
          <div className={`text-sm font-medium mb-1 ${isToday ? 'text-[#003D79]' : 'text-gray-900'}`}>
            {day}
          </div>
          <div className="space-y-1">
            {dayMeetings.slice(0, 2).map(meeting => <div key={meeting._id} className={`text-xs p-1 rounded cursor-pointer ${meeting.status === '进行中' ? 'bg-blue-100 text-blue-700' : meeting.status === '已完成' ? 'bg-green-100 text-green-700' : 'bg-[#D4AF37] text-white'}`} onClick={() => {
            setSelectedItem(meeting);
            setViewDialog(true);
          }}>
                {meeting.startTime} {meeting.title}
              </div>)}
            {dayMeetings.length > 2 && <div className="text-xs text-gray-500">
                +{dayMeetings.length - 2} 更多
              </div>}
          </div>
        </div>);
    }
    return calendarDays;
  };
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">加载中...</div>
      </div>;
  }
  return <div className={`${className} min-h-screen bg-gradient-to-br from-gray-50 to-gray-100`} style={style}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#003D79] mb-2">综合管理部</h1>
          <p className="text-gray-600">公告发布 · 印章申请 · 会议室预定 · 办公用品申领</p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 shadow-md border-l-4 border-[#003D79]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">已发布公告</p>
                <p className="text-2xl font-bold text-[#003D79]">
                  {announcements.filter(a => a.status === '已发布').length}
                </p>
              </div>
              <Bell className="w-10 h-10 text-[#003D79]" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-5 shadow-md border-l-4 border-[#D4AF37]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">待审批印章</p>
                <p className="text-2xl font-bold text-[#D4AF37]">
                  {sealRequests.filter(s => s.status === '待审批').length}
                </p>
              </div>
              <FileText className="w-10 h-10 text-[#D4AF37]" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-5 shadow-md border-l-4 border-[#00A896]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">今日会议</p>
                <p className="text-2xl font-bold text-[#00A896]">
                  {meetingReservations.filter(m => m.startDate === new Date().toISOString().slice(0, 10) && m.status !== '已取消').length}
                </p>
              </div>
              <Calendar className="w-10 h-10 text-[#00A896]" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-5 shadow-md border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">待领取物品</p>
                <p className="text-2xl font-bold text-purple-500">
                  {officeSupplies.filter(s => s.status === '已审批').length}
                </p>
              </div>
              <Package className="w-10 h-10 text-purple-500" />
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-md mb-6">
            <TabsTrigger value="announcements" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              公告发布
            </TabsTrigger>
            <TabsTrigger value="seals" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              印章申请
            </TabsTrigger>
            <TabsTrigger value="meetings" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              会议室预定
            </TabsTrigger>
            <TabsTrigger value="supplies" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              办公用品
            </TabsTrigger>
          </TabsList>
          
          {/* Announcements Tab */}
          <TabsContent value="announcements">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#003D79]">公告管理</h2>
                <Button onClick={() => setAnnouncementDialog(true)} className="bg-[#003D79] hover:bg-[#003D79]/90">
                  <Plus className="w-4 h-4 mr-2" />
                  发布公告
                </Button>
              </div>
              
              <div className="flex gap-4 mb-6">
                <Input placeholder="搜索公告标题..." value={announcementSearch} onChange={e => setAnnouncementSearch(e.target.value)} className="max-w-xs" />
                <Select value={announcementFilter} onValueChange={setAnnouncementFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="全部状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部状态</SelectItem>
                    <SelectItem value="已发布">已发布</SelectItem>
                    <SelectItem value="草稿">草稿</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-4">
                {announcements.filter(a => a.title.toLowerCase().includes(announcementSearch.toLowerCase()) && (announcementFilter === 'all' || a.status === announcementFilter)).map(announcement => <div key={announcement._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                          <Badge className={`${getPriorityColor(announcement.priority)} text-white`}>
                            {announcement.priority}
                          </Badge>
                          <Badge className={`${getStatusColor(announcement.status)} text-white`}>
                            {announcement.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="ghost" onClick={() => {
                      setSelectedItem(announcement);
                      setViewDialog(true);
                    }}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          {announcement.status === '草稿' && <Button size="sm" variant="ghost">
                              <Edit className="w-4 h-4" />
                            </Button>}
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {announcement.title}
                      </h3>
                      <p className="text-gray-600 line-clamp-2 mb-3">
                        {announcement.content.replace(/\n/g, ' ')}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-4">
                          <span>{announcement.publisher?.name}</span>
                          <span>{announcement.publishDate}</span>
                        </div>
                        <span>{announcement.views} 阅读</span>
                      </div>
                    </div>)}
              </div>
            </div>
          </TabsContent>
          
          {/* Seal Requests Tab */}
          <TabsContent value="seals">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#003D79]">印章申请</h2>
                <Button onClick={() => setSealDialog(true)} className="bg-[#003D79] hover:bg-[#003D79]/90">
                  <Plus className="w-4 h-4 mr-2" />
                  申请印章
                </Button>
              </div>
              
              <div className="flex gap-4 mb-6">
                <Input placeholder="搜索申请编号..." value={sealSearch} onChange={e => setSealSearch(e.target.value)} className="max-w-xs" />
                <Select value={sealFilter} onValueChange={setSealFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="全部状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部状态</SelectItem>
                    <SelectItem value="待审批">待审批</SelectItem>
                    <SelectItem value="已审批">已审批</SelectItem>
                    <SelectItem value="已使用">已使用</SelectItem>
                    <SelectItem value="已拒绝">已拒绝</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sealRequests.filter(s => s.requestId.toLowerCase().includes(sealSearch.toLowerCase()) && (sealFilter === 'all' || s.status === sealFilter)).map(request => <div key={request._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-sm text-gray-500">申请编号</p>
                          <p className="font-semibold text-[#003D79]">{request.requestId}</p>
                        </div>
                        <Badge className={`${getStatusColor(request.status)} text-white`}>
                          {request.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">印章类型：</span>
                          <span className="font-medium">{request.sealType}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">文件名称：</span>
                          <span className="font-medium">{request.documentName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">申请人：</span>
                          <span className="font-medium">{request.applicant?.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">申请时间：</span>
                          <span className="font-medium">
                            {request.createdAt ? new Date(request.createdAt).toLocaleDateString() : ''}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <Button size="sm" variant="outline" className="w-full" onClick={() => {
                    setSelectedItem(request);
                    setViewDialog(true);
                  }}>
                          查看详情
                        </Button>
                      </div>
                    </div>)}
              </div>
            </div>
          </TabsContent>
          
          {/* Meeting Reservations Tab */}
          <TabsContent value="meetings">
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-[#003D79]">会议室预定</h2>
                  <Button onClick={() => setMeetingDialog(true)} className="bg-[#003D79] hover:bg-[#003D79]/90">
                    <Plus className="w-4 h-4 mr-2" />
                    预定会议室
                  </Button>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}>
                    上个月
                  </Button>
                  <h3 className="text-lg font-semibold">
                    {currentDate.getFullYear()}年{currentDate.getMonth() + 1}月
                  </h3>
                  <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}>
                    下个月
                  </Button>
                </div>
                
                <div className="grid grid-cols-7 gap-0 border border-gray-200">
                  {renderCalendar()}
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold text-[#003D79] mb-4">会议列表</h3>
                <div className="space-y-3">
                  {meetingReservations.filter(m => m.status !== '已取消').sort((a, b) => new Date(b.startDate) - new Date(a.startDate)).slice(0, 5).map(meeting => <div key={meeting._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg ${meeting.status === '进行中' ? 'bg-blue-100' : meeting.status === '已完成' ? 'bg-green-100' : 'bg-[#D4AF37]'}`}>
                            <Calendar className={`w-5 h-5 ${meeting.status === '进行中' ? 'text-blue-600' : meeting.status === '已完成' ? 'text-green-600' : 'text-white'}`} />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{meeting.title}</h4>
                            <p className="text-sm text-gray-600">
                              {meeting.startDate} {meeting.startTime}-{meeting.endTime}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-sm text-gray-600">{meeting.room?.name}</p>
                            <p className="text-sm text-gray-500">{meeting.attendees}人</p>
                          </div>
                          <Badge className={`${getStatusColor(meeting.status)} text-white`}>
                            {meeting.status}
                          </Badge>
                        </div>
                      </div>)}
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Office Supplies Tab */}
          <TabsContent value="supplies">
            <div className="space-y-6">
              {/* Inventory */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-[#003D79]">库存展示</h2>
                  <Button variant="outline">
                    <Printer className="w-4 h-4 mr-2" />
                    打印清单
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {inventoryItems.map((item, index) => <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">{item.itemName}</h4>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">库存</span>
                        <span className={`font-semibold ${item.stock < 50 ? 'text-red-500' : 'text-green-600'}`}>
                          {item.stock} {item.unit}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-1">
                        <span className="text-gray-600">单价</span>
                        <span className="font-medium text-[#003D79]">
                          ¥{item.unitPrice}
                        </span>
                      </div>
                      {item.stock < 50 && <p className="text-xs text-red-500 mt-2">⚠️ 库存不足</p>}
                    </div>)}
                </div>
              </div>
              
              {/* Request List */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-[#003D79]">申领记录</h2>
                  <Button onClick={() => setSupplyDialog(true)} className="bg-[#003D79] hover:bg-[#003D79]/90">
                    <Plus className="w-4 h-4 mr-2" />
                    申领物品
                  </Button>
                </div>
                
                <div className="flex gap-4 mb-6">
                  <Input placeholder="搜索申领编号..." value={supplySearch} onChange={e => setSupplySearch(e.target.value)} className="max-w-xs" />
                  <Select value={supplyFilter} onValueChange={setSupplyFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="全部状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部状态</SelectItem>
                      <SelectItem value="待审批">待审批</SelectItem>
                      <SelectItem value="已审批">已审批</SelectItem>
                      <SelectItem value="已领取">已领取</SelectItem>
                      <SelectItem value="已拒绝">已拒绝</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-3">
                  {officeSupplies.filter(s => s.supplyId.toLowerCase().includes(supplySearch.toLowerCase()) && (supplyFilter === 'all' || s.status === supplyFilter)).map(supply => <div key={supply._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="text-sm text-gray-500">申领编号</p>
                            <p className="font-semibold text-[#003D79]">{supply.supplyId}</p>
                          </div>
                          <Badge className={`${getStatusColor(supply.status)} text-white`}>
                            {supply.status}
                          </Badge>
                        </div>
                        
                        <div className="mb-3">
                          <p className="text-sm text-gray-600 mb-2">物品清单</p>
                          <div className="flex flex-wrap gap-2">
                            {supply.items?.map((item, idx) => <span key={idx} className="inline-flex items-center px-2 py-1 bg-gray-100 rounded text-sm">
                                {item.itemName} x{item.quantity}
                              </span>)}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-4">
                            <span>{supply.applicant?.name}</span>
                            <span>¥{supply.totalAmount}</span>
                          </div>
                          <span className="text-gray-500">
                            {supply.createdAt ? new Date(supply.createdAt).toLocaleDateString() : ''}
                          </span>
                        </div>
                      </div>)}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Announcement Dialog */}
      <Dialog open={announcementDialog} onOpenChange={setAnnouncementDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>发布公告</DialogTitle>
          </DialogHeader>
          <Form {...formAnnouncement}>
            <form onSubmit={formAnnouncement.handleSubmit(handleAnnouncementSubmit)} className="space-y-4">
              <FormField control={formAnnouncement.control} name="title" render={({
              field
            }) => <FormItem>
                    <FormLabel>公告标题</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入公告标题" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />
              
              <FormField control={formAnnouncement.control} name="content" render={({
              field
            }) => <FormItem>
                    <FormLabel>公告内容</FormLabel>
                    <FormControl>
                      <Textarea placeholder="请输入公告内容" className="min-h-32" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField control={formAnnouncement.control} name="category" render={({
                field
              }) => <FormItem>
                      <FormLabel>公告类型</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="选择类型" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="通知公告">通知公告</SelectItem>
                          <SelectItem value="政策法规">政策法规</SelectItem>
                          <SelectItem value="活动通知">活动通知</SelectItem>
                          <SelectItem value="人事变动">人事变动</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>} />
                
                <FormField control={formAnnouncement.control} name="priority" render={({
                field
              }) => <FormItem>
                      <FormLabel>优先级</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="选择优先级" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="紧急">紧急</SelectItem>
                          <SelectItem value="重要">重要</SelectItem>
                          <SelectItem value="普通">普通</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>} />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setAnnouncementDialog(false)}>
                  取消
                </Button>
                <Button type="submit" className="bg-[#003D79] hover:bg-[#003D79]/90">
                  发布
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Seal Request Dialog */}
      <Dialog open={sealDialog} onOpenChange={setSealDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>申请印章</DialogTitle>
          </DialogHeader>
          <Form {...formSeal}>
            <form onSubmit={formSeal.handleSubmit(handleSealSubmit)} className="space-y-4">
              <FormField control={formSeal.control} name="sealType" render={({
              field
            }) => <FormItem>
                    <FormLabel>印章类型</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="选择印章类型" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="公章">公章</SelectItem>
                        <SelectItem value="合同专用章">合同专用章</SelectItem>
                        <SelectItem value="财务专用章">财务专用章</SelectItem>
                        <SelectItem value="法人章">法人章</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>} />
              
              <FormField control={formSeal.control} name="documentName" render={({
              field
            }) => <FormItem>
                    <FormLabel>文件名称</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入文件名称" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />
              
              <FormField control={formSeal.control} name="documentCount" render={({
              field
            }) => <FormItem>
                    <FormLabel>文件份数</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />
              
              <FormField control={formSeal.control} name="purpose" render={({
              field
            }) => <FormItem>
                    <FormLabel>用途说明</FormLabel>
                    <FormControl>
                      <Textarea placeholder="请说明印章用途" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setSealDialog(false)}>
                  取消
                </Button>
                <Button type="submit" className="bg-[#003D79] hover:bg-[#003D79]/90">
                  提交申请
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Meeting Dialog */}
      <Dialog open={meetingDialog} onOpenChange={setMeetingDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>预定会议室</DialogTitle>
          </DialogHeader>
          <Form {...formMeeting}>
            <form onSubmit={formMeeting.handleSubmit(handleMeetingSubmit)} className="space-y-4">
              <FormField control={formMeeting.control} name="title" render={({
              field
            }) => <FormItem>
                    <FormLabel>会议主题</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入会议主题" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />
              
              <FormField control={formMeeting.control} name="roomId" render={({
              field
            }) => <FormItem>
                    <FormLabel>会议室</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="选择会议室" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {rooms.map(room => <SelectItem key={room.roomId} value={room.roomId}>
                            {room.name} (容纳{room.capacity}人)
                          </SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>} />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField control={formMeeting.control} name="startDate" render={({
                field
              }) => <FormItem>
                      <FormLabel>开始日期</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />
                <FormField control={formMeeting.control} name="startTime" render={({
                field
              }) => <FormItem>
                      <FormLabel>开始时间</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField control={formMeeting.control} name="endDate" render={({
                field
              }) => <FormItem>
                      <FormLabel>结束日期</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />
                <FormField control={formMeeting.control} name="endTime" render={({
                field
              }) => <FormItem>
                      <FormLabel>结束时间</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />
              </div>
              
              <FormField control={formMeeting.control} name="attendees" render={({
              field
            }) => <FormItem>
                    <FormLabel>参会人数</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />
              
              <FormField control={formMeeting.control} name="description" render={({
              field
            }) => <FormItem>
                    <FormLabel>会议描述</FormLabel>
                    <FormControl>
                      <Textarea placeholder="请输入会议描述" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setMeetingDialog(false)}>
                  取消
                </Button>
                <Button type="submit" className="bg-[#003D79] hover:bg-[#003D79]/90">
                  提交预定
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Office Supply Dialog */}
      <Dialog open={supplyDialog} onOpenChange={setSupplyDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>申领物品</DialogTitle>
          </DialogHeader>
          <Form {...formSupply}>
            <form onSubmit={formSupply.handleSubmit(handleSupplySubmit)} className="space-y-4">
              <FormField control={formSupply.control} name="reason" render={({
              field
            }) => <FormItem>
                    <FormLabel>申领理由</FormLabel>
                    <FormControl>
                      <Textarea placeholder="请输入申领理由" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />
              
              <FormField control={formSupply.control} name="items" render={({
              field
            }) => <FormItem>
                    <FormLabel>物品清单（JSON格式）</FormLabel>
                    <FormControl>
                      <Textarea placeholder='例如：[{"itemName":"A4纸","quantity":5,"unit":"包","unitPrice":25}]' className="font-mono" {...field} />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-gray-500 mt-1">
                      格式：[{{
                  "itemName": "物品名",
                  "quantity": 数量,
                  "unit": "单位",
                  "unitPrice": 单价
                }}]
                    </p>
                  </FormItem>} />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setSupplyDialog(false)}>
                  取消
                </Button>
                <Button type="submit" className="bg-[#003D79] hover:bg-[#003D79]/90">
                  提交申领
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* View Dialog */}
      <Dialog open={viewDialog} onOpenChange={setViewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>详情</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedItem && <div className="space-y-2">
                {Object.entries(selectedItem).map(([key, value]) => {
              if (key === '_id' || key.startsWith('_')) return null;
              if (typeof value === 'object' && value !== null) {
                return <div key={key}>
                        <p className="font-medium text-gray-900 capitalize">{key}</p>
                        <pre className="text-sm text-gray-600 bg-gray-50 p-2 rounded overflow-auto">
                          {JSON.stringify(value, null, 2)}
                        </pre>
                      </div>;
              }
              return <div key={key} className="flex items-center justify-between">
                      <p className="text-gray-600 capitalize">{key}</p>
                      <p className="font-medium text-gray-900">
                        {typeof value === 'string' && value.length > 50 ? value.slice(0, 50) + '...' : String(value)}
                      </p>
                    </div>;
            })}
              </div>}
          </div>
        </DialogContent>
      </Dialog>
    </div>;
}