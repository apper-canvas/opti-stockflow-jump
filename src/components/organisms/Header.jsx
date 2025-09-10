import { useContext } from 'react';
import { useSelector } from 'react-redux';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { AuthContext } from '../../App';

export default function Header({ onMenuClick }) {
  const { logout } = useContext(AuthContext);
  const { user } = useSelector((state) => state.user);

  return (
    <header className="bg-white border-b border-slate-200">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            <ApperIcon name="Menu" size={20} />
          </button>
          <h1 className="text-xl font-semibold text-slate-900">
            StockFlow
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-medium text-slate-900">
                {user.firstName} {user.lastName}
              </span>
              <span className="text-xs text-slate-500">
                {user.emailAddress}
              </span>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="flex items-center gap-2"
          >
            <ApperIcon name="LogOut" size={16} />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}