import React, { useState, useEffect } from 'react';
import { X, ChevronDown, UserPlus, Settings, Check, AlertCircle } from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';
import { PermissionData, InviteAdminPayload } from '@/types/admin';

interface InviteNewAdminProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite?: (data: any) => void;
}

const InviteNewAdmin: React.FC<InviteNewAdminProps> = ({
  isOpen,
  onClose,
  onInvite,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'permissions'>('profile');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const [selectedPermissions, setSelectedPermissions] = useState<PermissionData[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const { roles, permissions, loading, error, fetchRoles, fetchPermissions, sendInvite, clearError } =
    useAdminStore();

  // Fetch roles and permissions on mount
  useEffect(() => {
    if (isOpen) {
      fetchRoles();
      fetchPermissions();
      clearError();
    }
  }, [isOpen, fetchRoles, fetchPermissions, clearError]);

  // Get unique modules for the UI
  const modules = Array.from(new Set(permissions.map((p) => p.module)));

  const isFormValid =
    fullName.trim() !== '' &&
    email.trim() !== '' &&
    selectedRole !== '' &&
    (activeTab === 'profile' || selectedPermissions.length > 0);

  const togglePermission = (module: string, action: string) => {
    setSelectedPermissions((prev) => {
      const exists = prev.some((p) => p.module === module && p.action === action);
      if (exists) {
        return prev.filter((p) => !(p.module === module && p.action === action));
      } else {
        return [...prev, { module, action }];
      }
    });
  };

  const toggleAllForModule = (module: string) => {
    const modulePermissions = permissions.filter((p) => p.module === module);
    const allSelected = modulePermissions.every((p) =>
      selectedPermissions.some((sp) => sp.module === p.module && sp.action === p.action)
    );

    if (allSelected) {
      setSelectedPermissions((prev) =>
        prev.filter((p) => p.module !== module)
      );
    } else {
      const newPermissions = modulePermissions.map((p) => ({
        module: p.module,
        action: p.action,
      }));
      setSelectedPermissions((prev) => [
        ...prev,
        ...newPermissions.filter(
          (np) => !prev.some((p) => p.module === np.module && p.action === np.action)
        ),
      ]);
    }
  };

  const handleProceed = async () => {
    if (!isFormValid) return;

    setIsSubmitting(true);
    setSuccessMessage('');

    try {
      const payload: InviteAdminPayload = {
        fullName,
        email,
        roleName: selectedRole,
        permissions: selectedPermissions,
      };

      const response = await sendInvite(payload);

      setSuccessMessage(response?.message || 'Admin invitation sent successfully!');
      
      // Reset form after success
      setTimeout(() => {
        setFullName('');
        setEmail('');
        setSelectedRole('');
        setSelectedPermissions([]);
        setActiveTab('profile');
        onInvite?.(response);
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Invitation failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-[80]" onClick={onClose} />

      {/* Modal */}
      <div
        className="fixed inset-0 z-[90] flex items-start md:items-center justify-center pt-4 md:pt-0 px-0 md:px-4 pb-0 md:pb-4 overflow-y-auto"
        style={{ contain: 'none' }}
      >
        <div
          className="w-full md:max-w-[603px] bg-white md:rounded-2xl rounded-t-2xl shadow-[-1px_8px_12px_0px_#0000001F] overflow-visible min-h-[calc(100vh-16px)] md:min-h-0 md:max-h-[90vh] overflow-y-auto"
          style={{ transform: 'translateZ(0)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Teal Header */}
          <div className="bg-[#E8FBF7] px-4 md:px-8 pt-8 pb-4 border-b border-[#E8E3E3] sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <h2 className="font-dm-sans font-bold text-[20px] leading-[140%] text-[#171417]">
                Invite New Admin
              </h2>
              <button
                onClick={onClose}
                className="p-0 hover:opacity-70 transition"
              >
                <X className="w-6 h-6 text-[#171417]" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-4 md:px-8 py-0 flex items-center gap-3 md:gap-5 overflow-x-auto sticky top-[88px] bg-white z-10 border-b border-[#E8E3E3]">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-1 py-1 border-b-2 transition whitespace-nowrap flex-shrink-0 ${
                activeTab === 'profile' ? 'border-[#454345]' : 'border-[#949394]'
              }`}
            >
              <UserPlus
                size={16}
                className={`flex-shrink-0 ${activeTab === 'profile' ? 'text-[#171417]' : 'text-[#949394]'}`}
              />
              <span
                className={`font-dm-sans text-sm md:text-base leading-[140%] ${
                  activeTab === 'profile' ? 'text-[#171417]' : 'text-[#949394]'
                }`}
              >
                Profile Information
              </span>
            </button>

            <button
              onClick={() => setActiveTab('permissions')}
              className={`flex items-center gap-2 px-1 py-1 border-b-2 transition whitespace-nowrap flex-shrink-0 ${
                activeTab === 'permissions' ? 'border-[#454345]' : 'border-[#949394]'
              }`}
            >
              <Settings
                size={16}
                className={`flex-shrink-0 ${activeTab === 'permissions' ? 'text-[#171417]' : 'text-[#949394]'}`}
              />
              <span
                className={`font-dm-sans text-sm md:text-base leading-[140%] ${
                  activeTab === 'permissions' ? 'text-[#171417]' : 'text-[#949394]'
                }`}
              >
                Permission Management
              </span>
            </button>
          </div>

          {/* Content */}
          <div className="px-4 md:px-8 py-5 flex flex-col gap-5">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-dm-sans font-medium text-red-900">{error}</p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="font-dm-sans font-medium text-green-900">{successMessage}</p>
              </div>
            )}

            {activeTab === 'profile' ? (
              <>
                {/* Full Name */}
                <div className="flex flex-col gap-2">
                  <label className="font-dm-sans font-medium text-base text-[#05060D]">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter admin's full name"
                    className="w-full h-[46px] rounded-xl border border-[#B2B2B4] px-4 py-3 font-dm-sans text-base text-[#171417] placeholder:text-[#B2B2B4] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                {/* Admin Email */}
                <div className="flex flex-col gap-2">
                  <label className="font-dm-sans font-medium text-base text-[#05060D]">
                    Admin Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter admin's email"
                    className="w-full h-[46px] rounded-xl border border-[#B2B2B4] px-4 py-3 font-dm-sans text-base text-[#171417] placeholder:text-[#B2B2B4] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                {/* Select Role */}
                <div className="flex flex-col gap-2">
                  <label className="font-dm-sans font-medium text-base text-[#05060D]">
                    Select Role
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                      className={`w-full h-[43px] rounded-xl px-4 py-3 flex items-center justify-between font-dm-sans text-base focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        selectedRole
                          ? 'border text-[#454345]'
                          : 'border border-[#B2B2B4] text-[#B2B2B4]'
                      }`}
                    >
                      <span className="truncate text-left">
                        {selectedRole || 'Select a role'}
                      </span>
                      <ChevronDown className="w-5 h-5 text-[#171417] flex-shrink-0 ml-2" />
                    </button>

                    {isRoleDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg overflow-hidden z-[100] max-h-64 overflow-y-auto">
                        {roles.map((role) => (
                          <button
                            key={role.id}
                            onClick={() => {
                              setSelectedRole(role.name);
                              setIsRoleDropdownOpen(false);
                            }}
                            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition border-b border-[#E5E5E5] last:border-b-0"
                          >
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                                selectedRole === role.name
                                  ? 'bg-[#E6E6E6] border-[#154751]'
                                  : 'bg-white border-[#757575]'
                              }`}
                            >
                              {selectedRole === role.name && (
                                <div className="w-2 h-2 rounded-full bg-[#154751]" />
                              )}
                            </div>
                            <div className="text-left">
                              <p className="font-dm-sans text-base text-[#171417]">
                                {role.name}
                              </p>
                              {role.description && (
                                <p className="font-dm-sans text-xs text-[#949394]">
                                  {role.description}
                                </p>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-4">
                {/* Permissions by Module */}
                {modules.map((module) => {
                  const modulePermissions = permissions.filter((p) => p.module === module);
                  const allSelected = modulePermissions.every((p) =>
                    selectedPermissions.some((sp) => sp.module === p.module && sp.action === p.action)
                  );

                  return (
                    <div key={module} className="border border-[#EAECF0] rounded-lg overflow-hidden">
                      {/* Module Header */}
                      <div className="bg-[#FFFCFC] px-4 py-3 border-b border-[#EAECF0] flex items-center justify-between">
                        <span className="font-dm-sans font-medium text-base text-[#171417]">
                          {module}
                        </span>
                        <button
                          onClick={() => toggleAllForModule(module)}
                          className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 transition"
                        >
                          <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                              allSelected
                                ? 'bg-[#154751] border-[#154751]'
                                : 'border-[#B2B2B4] bg-white'
                            }`}
                          >
                            {allSelected && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <span className="font-dm-sans text-xs text-[#171417]">
                            {allSelected ? 'Deselect' : 'Select'} All
                          </span>
                        </button>
                      </div>

                      {/* Permissions */}
                      <div className="flex flex-wrap gap-2 p-4">
                        {modulePermissions.map((perm) => {
                          const isSelected = selectedPermissions.some(
                            (sp) => sp.module === perm.module && sp.action === perm.action
                          );

                          return (
                            <button
                              key={perm.id}
                              onClick={() => togglePermission(perm.module, perm.action)}
                              className={`px-3 py-2 rounded-lg font-dm-sans text-sm font-medium transition flex items-center gap-2 ${
                                isSelected
                                  ? 'bg-[#154751] text-white border border-[#154751]'
                                  : 'bg-white border border-[#B2B2B4] text-[#171417] hover:border-[#154751]'
                              }`}
                            >
                              {isSelected && <Check className="w-4 h-4" />}
                              <span className="capitalize">{perm.action}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {/* Footer Note */}
                <div className="bg-[#F8F9FA] px-4 py-3 rounded-lg border border-[#EAECF0]">
                  <p className="font-dm-sans text-sm text-[#949394]">
                    Selected permissions ({selectedPermissions.length}): Assign specific access levels to this admin across different modules.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer Button */}
          <div className="px-4 md:px-8 pb-5 sticky bottom-0 bg-white border-t border-[#E8E3E3] pt-5">
            <button
              onClick={handleProceed}
              disabled={!isFormValid || isSubmitting || loading}
              className="w-full h-10 rounded-full font-dm-sans font-medium text-base text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{
                background: isFormValid && !isSubmitting && !loading
                  ? 'radial-gradient(50% 50% at 50% 50%, #154751 37%, #04171F 100%)'
                  : 'linear-gradient(0deg, #ACC5CF, #ACC5CF)',
              }}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                'Proceed'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default InviteNewAdmin;