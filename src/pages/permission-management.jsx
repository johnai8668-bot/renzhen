// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Button, Card, Badge, Input, useToast } from '@/components/ui';
// @ts-ignore;
import { Search, Shield, Download, Edit2, Trash2, Share2, Eye, UserPlus } from 'lucide-react';

export default function PermissionManagement(props) {
  const {
    toast
  } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const departments = ['全部', '认证部', '项目一部', '项目二部', '财务部', '技术部'];
  const permissionConfig = [{
    key: 'view',
    label: '查看',
    icon: Eye,
    color: 'blue'
  }, {
    key: 'edit',
    label: '编辑',
    icon: Edit2,
    color: 'green'
  }, {
    key: 'modify',
    label: '修改',
    icon: Edit2,
    color: 'blue'
  }, {
    key: 'download',
    label: '下载',
    icon: Download,
    color: 'amber'
  }, {
    key: 'forward',
    label: '转发',
    icon: Share2,
    color: 'purple'
  }, {
    key: 'delete',
    label: '删除',
    icon: Trash2,
    color: 'red'
  }];
  const loadEmployees = async () => {
    try {
      setLoading(true);
      const result = await props.$w.cloud.callDataSource({
        dataSourceName: 'employee_permissions',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {
              status: 'active'
            }
          },
          orderBy: [{
            updatedAt: 'desc'
          }],
          select: {
            $master: true
          },
          pageSize: 100,
          pageNumber: 1
        }
      });
      if (result.records && result.records.length > 0) {
        setEmployees(result.records);
      }
    } catch (error) {
      console.error('加载员工数据失败:', error);
      toast({
        title: '加载失败',
        description: '员工数据加载失败，请稍后重试',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadEmployees();
  }, []);
  const handleTogglePermission = async (employeeId, permissionKey) => {
    try {
      setEmployees(prevEmployees => prevEmployees.map(emp => emp._openid === employeeId ? {
        ...emp,
        permissions: {
          ...emp.permissions,
          [permissionKey]: !emp.permissions[permissionKey]
        },
        updatedAt: new Date().toISOString()
      } : emp));
      const updatedEmployee = employees.find(emp => emp._openid === employeeId);
      if (updatedEmployee) {
        await props.$w.cloud.callDataSource({
          dataSourceName: 'employee_permissions',
          methodName: 'wedaUpdateV2',
          params: {
            data: {
              ...updatedEmployee,
              permissions: {
                ...updatedEmployee.permissions,
                [permissionKey]: !updatedEmployee.permissions[permissionKey]
              },
              updatedAt: new Date().toISOString()
            }
          }
        });
      }
      toast({
        title: '权限更新成功',
        description: '权限设置已保存'
      });
    } catch (error) {
      console.error('更新权限失败:', error);
      toast({
        title: '权限更新失败',
        description: error.message || '更新权限时发生错误',
        variant: 'destructive'
      });
      loadEmployees();
    }
  };
  const handleBatchPermission = async (permissionKey, enabled) => {
    try {
      const filteredEmployees = employees.filter(emp => {
        const matchesDepartment = selectedDepartment === 'all' || emp.department === selectedDepartment;
        const matchesSearch = emp.name.includes(searchTerm) || emp.phone.includes(searchTerm);
        return matchesDepartment && matchesSearch;
      });
      for (const employee of filteredEmployees) {
        await props.$w.cloud.callDataSource({
          dataSourceName: 'employee_permissions',
          methodName: 'wedaUpdateV2',
          params: {
            data: {
              ...employee,
              permissions: {
                ...employee.permissions,
                [permissionKey]: enabled
              },
              updatedAt: new Date().toISOString()
            }
          }
        });
      }
      await loadEmployees();
      toast({
        title: '批量权限更新成功',
        description: `${enabled ? '已启用' : '已禁用'} ${permissionKey} 权限`
      });
    } catch (error) {
      console.error('批量更新权限失败:', error);
      toast({
        title: '批量权限更新失败',
        description: error.message || '更新权限时发生错误',
        variant: 'destructive'
      });
    }
  };
  const filteredEmployees = employees.filter(emp => {
    const matchesDepartment = selectedDepartment === 'all' || emp.department === selectedDepartment;
    const matchesSearch = emp.name.includes(searchTerm) || emp.phone.includes(searchTerm) || emp.email.includes(searchTerm);
    return matchesDepartment && matchesSearch;
  });
  if (loading && employees.length === 0) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">加载中...</div>
      </div>;
  }
  return <div className="min-h-screen bg-slate-50">
      <header className="bg-blue-800 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-700 rounded-full">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">权限管理</h1>
                <p className="text-blue-200 text-sm">管理各部门员工的系统权限</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button onClick={() => setShowAddDialog(true)} className="bg-blue-700 hover:bg-blue-600 text-white">
                <UserPlus className="w-4 h-4 mr-2" />
                添加员工
              </Button>
              <Button onClick={() => props.$w.utils.navigateTo({
              pageId: 'home',
              params: {}
            })} className="bg-white text-blue-800 hover:bg-blue-50">
                返回首页
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="搜索姓名、手机号、邮箱..." value={searchTerm} onChange={e => {
              if (e && e.target) {
                setSearchTerm(e.target.value);
              }
            }} className="pl-10" />
            </div>
            <div className="flex gap-2 flex-wrap">
              {departments.map(dept => <Button key={dept} variant={selectedDepartment === (dept === '全部' ? 'all' : dept) ? 'default' : 'outline'} onClick={() => setSelectedDepartment(dept === '全部' ? 'all' : dept)} className={selectedDepartment === (dept === '全部' ? 'all' : dept) ? 'bg-blue-600' : 'border-blue-200 text-blue-600 hover:bg-blue-50'}>
                  {dept}
                </Button>)}
            </div>
          </div>
        </div>

        <Card className="bg-white shadow-sm mb-6">
          <div className="p-4">
            <h3 className="text-sm font-medium text-slate-600 mb-3">批量权限设置</h3>
            <div className="flex flex-wrap gap-2">
              {permissionConfig.map(perm => <div key={perm.key} className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleBatchPermission(perm.key, true)} className="border-green-200 text-green-600 hover:bg-green-50">
                    批量启用 {perm.label}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleBatchPermission(perm.key, false)} className="border-red-200 text-red-600 hover:bg-red-50">
                    批量禁用 {perm.label}
                  </Button>
                </div>)}
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">员工列表</h2>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              共 {filteredEmployees.length} 名员工
            </Badge>
          </div>

          {filteredEmployees.length === 0 ? <Card className="bg-white shadow-sm p-8 text-center">
              <p className="text-slate-600">暂无符合条件的员工</p>
            </Card> : filteredEmployees.map(employee => <Card key={employee._openid} className="bg-white shadow-sm">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
                        {employee.name?.[0] || 'U'}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800">{employee.name}</h3>
                        <div className="flex items-center space-x-3 text-sm text-slate-600">
                          <span>{employee.department}</span>
                          <span>•</span>
                          <span>{employee.position}</span>
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {employee.phone} • {employee.email}
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700">在职</Badge>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-slate-700 mb-3">权限配置</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                      {permissionConfig.map(perm => {
                  const isEnabled = employee.permissions?.[perm.key];
                  return <Button key={perm.key} variant={isEnabled ? 'default' : 'outline'} size="sm" onClick={() => handleTogglePermission(employee._openid, perm.key)} className={isEnabled ? `bg-${perm.color}-600 hover:bg-${perm.color}-700 text-white` : 'border-slate-200 text-slate-600 hover:bg-slate-50'}>
                            <perm.icon className="w-3 h-3 mr-1" />
                            {perm.label}
                          </Button>;
                })}
                    </div>
                  </div>
                </div>
              </Card>)}
        </div>
      </main>
    </div>;
}