import { useAuthStore } from '../store/authStore';
import { type PermissionCode } from '../types/auth';

export const usePermission = () => {
  const userPermissions = useAuthStore((state) => state.permissions) || [];

  const hasPermission = (
    requiredPermissions: PermissionCode | PermissionCode[],
    strategy: 'AND' | 'OR' = 'OR'
  ): boolean => {
    if (!userPermissions.length) return false;

    const required = Array.isArray(requiredPermissions)
      ? requiredPermissions
      : [requiredPermissions];

    if (strategy === 'AND') {
      return required.every((perm) => userPermissions.includes(perm));
    } else {
      return required.some((perm) => userPermissions.includes(perm));
    }
  };

  return { hasPermission, userPermissions };
};