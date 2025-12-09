import { useState } from 'react';
import { Shield, Plus, Edit2, Trash2, Save, X, Users, CheckCircle, User } from 'lucide-react';
import rolesData from '../../data/roles.json';
import usersData from '../../data/users.json';

interface Permission {
  id: string;
  name: string;
  description: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  system_role: boolean;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  adminRole?: string;
}

export default function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>(rolesData.roles);
  const [permissions] = useState<Permission[]>(rolesData.permissions);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [showCreateRole, setShowCreateRole] = useState(false);
  const [showAssignRole, setShowAssignRole] = useState(false);
  const [selectedAdminForRole, setSelectedAdminForRole] = useState<string>('');
  const [selectedRoleToAssign, setSelectedRoleToAssign] = useState<string>('');

  const [newRole, setNewRole] = useState<Role>({
    id: '',
    name: '',
    description: '',
    permissions: [],
    system_role: false
  });

  // Get admin users
  const adminUsers = usersData.users.filter(u => u.role === 'admin') as AdminUser[];

  // Get role name
  const getRoleName = (roleId?: string) => {
    const role = roles.find(r => r.id === roleId);
    return role?.name || 'No Role Assigned';
  };

  // Get users count by role
  const getUsersByRole = (roleId: string) => {
    return adminUsers.filter(u => u.adminRole === roleId).length;
  };

  const handleCreateRole = () => {
    if (!newRole.name || !newRole.description) {
      alert('Please fill in role name and description');
      return;
    }
    if (newRole.permissions.length === 0) {
      alert('Please select at least one permission');
      return;
    }

    const roleId = newRole.name.toLowerCase().replace(/\s+/g, '_');
    const role: Role = {
      ...newRole,
      id: roleId,
      system_role: false
    };

    // In production, this would make an API call
    setRoles([...roles, role]);
    alert(`Role "${role.name}" created successfully!`);
    setShowCreateRole(false);
    setNewRole({
      id: '',
      name: '',
      description: '',
      permissions: [],
      system_role: false
    });
  };

  const handleUpdateRole = () => {
    if (!editingRole) return;

    // In production, this would make an API call
    setRoles(roles.map(r => r.id === editingRole.id ? editingRole : r));
    alert(`Role "${editingRole.name}" updated successfully!`);
    setEditingRole(null);
  };

  const handleDeleteRole = (role: Role) => {
    if (role.system_role) {
      alert('Cannot delete system roles');
      return;
    }

    const usersWithRole = getUsersByRole(role.id);
    if (usersWithRole > 0) {
      alert(`Cannot delete role "${role.name}". ${usersWithRole} user(s) are assigned to this role.`);
      return;
    }

    if (confirm(`Are you sure you want to delete the role "${role.name}"?`)) {
      // In production, this would make an API call
      setRoles(roles.filter(r => r.id !== role.id));
      alert(`Role "${role.name}" deleted successfully!`);
    }
  };

  const togglePermission = (permissionId: string, role: Role, setter: (role: Role) => void) => {
    const newPermissions = role.permissions.includes(permissionId)
      ? role.permissions.filter(p => p !== permissionId)
      : [...role.permissions, permissionId];
    setter({ ...role, permissions: newPermissions });
  };

  const handleAssignRole = () => {
    if (!selectedAdminForRole || !selectedRoleToAssign) {
      alert('Please select both an admin user and a role');
      return;
    }

    const admin = adminUsers.find(u => u.id === selectedAdminForRole);
    const role = roles.find(r => r.id === selectedRoleToAssign);

    // In production, this would make an API call
    alert(`Assigned role "${role?.name}" to ${admin?.name}`);
    setShowAssignRole(false);
    setSelectedAdminForRole('');
    setSelectedRoleToAssign('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Role & Permission Management</h2>
          <p className="text-slate-600 mt-1">Configure roles and assign permissions to admin users</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowAssignRole(true)}
            className="flex items-center space-x-2 border-2 border-purple-600 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition-all font-semibold"
          >
            <Users className="w-5 h-5" />
            <span>Assign Role</span>
          </button>
          <button
            onClick={() => setShowCreateRole(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-red-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all font-semibold"
          >
            <Plus className="w-5 h-5" />
            <span>Create Role</span>
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <Shield className="w-8 h-8 text-purple-600" />
            <span className="text-3xl font-bold text-slate-900">{roles.length}</span>
          </div>
          <h3 className="text-slate-600 font-semibold">Total Roles</h3>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <span className="text-3xl font-bold text-slate-900">{roles.filter(r => r.system_role).length}</span>
          </div>
          <h3 className="text-slate-600 font-semibold">System Roles</h3>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-blue-600" />
            <span className="text-3xl font-bold text-slate-900">{adminUsers.length}</span>
          </div>
          <h3 className="text-slate-600 font-semibold">Admin Users</h3>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <Shield className="w-8 h-8 text-orange-600" />
            <span className="text-3xl font-bold text-slate-900">{permissions.length}</span>
          </div>
          <h3 className="text-slate-600 font-semibold">Permissions</h3>
        </div>
      </div>

      {/* Roles Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {roles.map((role) => (
          <div
            key={role.id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all border-2 border-slate-100"
          >
            <div className={`p-6 ${role.system_role ? 'bg-gradient-to-r from-purple-600 to-red-600' : 'bg-slate-700'} text-white`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{role.name}</h3>
                    {role.system_role && (
                      <span className="text-xs bg-white/20 px-2 py-1 rounded-full">System Role</span>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-white/90 text-sm">{role.description}</p>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold text-slate-700">Permissions ({role.permissions.length})</h4>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
                    {getUsersByRole(role.id)} users
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {role.permissions.slice(0, 3).map((permId) => {
                    const perm = permissions.find(p => p.id === permId);
                    return perm ? (
                      <span key={permId} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded flex items-center space-x-1">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        <span>{perm.name}</span>
                      </span>
                    ) : null;
                  })}
                  {role.permissions.length > 3 && (
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                      +{role.permissions.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div className="flex space-x-2 pt-3 border-t border-slate-200">
                <button
                  onClick={() => setEditingRole(role)}
                  className="flex-1 flex items-center justify-center space-x-1 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 transition-all text-sm font-semibold"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteRole(role)}
                  disabled={role.system_role}
                  className="flex items-center justify-center bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Admin Users by Role */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Admin Users by Role</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-100 border-b-2 border-slate-200">
                <th className="text-left p-4 font-bold text-slate-700">Name</th>
                <th className="text-left p-4 font-bold text-slate-700">Email</th>
                <th className="text-left p-4 font-bold text-slate-700">Assigned Role</th>
                <th className="text-left p-4 font-bold text-slate-700">Permissions</th>
              </tr>
            </thead>
            <tbody>
              {adminUsers.map((admin) => {
                const role = roles.find(r => r.id === admin.adminRole);
                return (
                  <tr key={admin.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="p-4 font-semibold text-slate-900">{admin.name}</td>
                    <td className="p-4 text-slate-600">{admin.email}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        role?.system_role
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {getRoleName(admin.adminRole)}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 text-sm">
                      {role ? `${role.permissions.length} permissions` : 'N/A'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Role Modal */}
      {(showCreateRole || editingRole) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8">
            <div className="bg-gradient-to-r from-purple-600 to-red-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">
                  {editingRole ? 'Edit Role' : 'Create New Role'}
                </h3>
                <button
                  onClick={() => {
                    setShowCreateRole(false);
                    setEditingRole(null);
                  }}
                  className="text-white/80 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Role Name *
                </label>
                <input
                  type="text"
                  value={editingRole?.name || newRole.name}
                  onChange={(e) => {
                    if (editingRole) {
                      setEditingRole({ ...editingRole, name: e.target.value });
                    } else {
                      setNewRole({ ...newRole, name: e.target.value });
                    }
                  }}
                  placeholder="e.g., Content Manager"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={editingRole?.description || newRole.description}
                  onChange={(e) => {
                    if (editingRole) {
                      setEditingRole({ ...editingRole, description: e.target.value });
                    } else {
                      setNewRole({ ...newRole, description: e.target.value });
                    }
                  }}
                  placeholder="Describe the role and its responsibilities..."
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">
                  Permissions * (Select at least one)
                </label>
                <div className="grid md:grid-cols-2 gap-3 max-h-96 overflow-y-auto p-2">
                  {permissions.map((perm) => {
                    const currentRole = editingRole || newRole;
                    const isChecked = currentRole.permissions.includes(perm.id);
                    return (
                      <label
                        key={perm.id}
                        className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-purple-50 border-purple-300'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (editingRole) {
                              togglePermission(perm.id, editingRole, setEditingRole);
                            } else {
                              togglePermission(perm.id, newRole, setNewRole);
                            }
                          }}
                          className="w-5 h-5 text-purple-600 rounded mt-0.5"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900 text-sm">{perm.name}</p>
                          <p className="text-xs text-slate-600 mt-1">{perm.description}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 p-6 bg-slate-50 flex space-x-3">
              <button
                onClick={() => {
                  setShowCreateRole(false);
                  setEditingRole(null);
                }}
                className="flex-1 px-6 py-2 border-2 border-slate-200 text-slate-700 rounded-lg hover:bg-white transition-all font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={editingRole ? handleUpdateRole : handleCreateRole}
                className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-red-600 text-white px-6 py-2 rounded-lg hover:opacity-90 transition-all font-semibold"
              >
                <Save className="w-4 h-4" />
                <span>{editingRole ? 'Update Role' : 'Create Role'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Role Modal */}
      {showAssignRole && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="bg-gradient-to-r from-purple-600 to-red-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">Assign Role to Admin</h3>
                <button
                  onClick={() => setShowAssignRole(false)}
                  className="text-white/80 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Select Admin User
                </label>
                <select
                  value={selectedAdminForRole}
                  onChange={(e) => setSelectedAdminForRole(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                >
                  <option value="">Choose an admin...</option>
                  {adminUsers.map(admin => (
                    <option key={admin.id} value={admin.id}>
                      {admin.name} ({admin.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Select Role
                </label>
                <select
                  value={selectedRoleToAssign}
                  onChange={(e) => setSelectedRoleToAssign(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                >
                  <option value="">Choose a role...</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>
                      {role.name} ({role.permissions.length} permissions)
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleAssignRole}
                className="w-full bg-gradient-to-r from-purple-600 to-red-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-all font-semibold"
              >
                Assign Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
