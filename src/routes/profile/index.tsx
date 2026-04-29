import { createFileRoute, Link } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { getAddressesByUserId, deleteAddress, getDesignsByUserId, deleteDesign } from '../../lib/api';
import { supabase } from '../../lib/supabase';
import { type Address, type Design } from '../../types';
import { User, MapPin, FileImage, Trash2, Edit2, Plus, ChevronRight, Package } from 'lucide-react';

export const Route = createFileRoute('/profile/')({ component: ProfilePage });

function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'addresses' | 'designs'>('addresses');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: string; email: string; name?: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) return;

      setUser({ id: currentUser.id, email: currentUser.email || '', name: currentUser.user_metadata?.name });

      const [userAddresses, userDesigns] = await Promise.all([
        getAddressesByUserId(currentUser.id),
        getDesignsByUserId(currentUser.id),
      ]);

      setAddresses(userAddresses);
      setDesigns(userDesigns);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleDeleteAddress = async (id: string) => {
    if (confirm('确定要删除这个地址吗？')) {
      const success = await deleteAddress(id);
      if (success) {
        setAddresses(addresses.filter(a => a.id !== id));
      }
    }
  };

  const handleDeleteDesign = async (id: string) => {
    if (confirm('确定要删除这个设计稿吗？')) {
      const success = await deleteDesign(id);
      if (success) {
        setDesigns(designs.filter(d => d.id !== id));
      }
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">用户中心</h1>
            <p className="text-gray-500 mt-1">管理您的个人信息和设计作品</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{user?.name || '用户'}</h2>
              <p className="text-gray-500">{user?.email}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('addresses')}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${activeTab === 'addresses' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            <MapPin className="w-5 h-5" />
            收货地址
          </button>
          <button
            onClick={() => setActiveTab('designs')}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${activeTab === 'designs' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            <FileImage className="w-5 h-5" />
            设计稿库
          </button>
        </div>

        {activeTab === 'addresses' && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            {addresses.length === 0 ? (
              <div className="text-center py-12">
                <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">暂无收货地址</h3>
                <p className="text-gray-500 mb-6">添加收货地址，方便您接收打印订单</p>
                <Link
                  to="/orders/new"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  添加地址
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {address.name} {address.phone}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {address.province} {address.city} {address.district} {address.detail}
                        </div>
                        {address.is_default && (
                          <span className="inline-block mt-2 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                            默认地址
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {}}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(address.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="border-t pt-4">
                  <Link
                    to="/orders/new"
                    className="inline-flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    添加新地址
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'designs' && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            {designs.length === 0 ? (
              <div className="text-center py-12">
                <FileImage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">暂无设计稿</h3>
                <p className="text-gray-500 mb-6">去设计页面创建您的第一个设计稿吧！</p>
                <Link
                  to="/design"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  开始设计
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {designs.map((design) => (
                    <div
                      key={design.id}
                      className="group relative rounded-xl overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      <div className="aspect-[3/4] bg-gray-100 overflow-hidden">
                        <img
                          src={design.image_url}
                          alt={design.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4">
                        <h4 className="font-medium text-gray-900 truncate">{design.title}</h4>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm text-gray-500">
                            {design.paper_size === 'custom' ? `${design.custom_width}×${design.custom_height}mm` : design.paper_size}
                          </span>
                          <button
                            onClick={() => handleDeleteDesign(design.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 text-center">
                  <Link
                    to="/design"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    创建设计
                  </Link>
                </div>
              </>
            )}
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <Package className="w-10 h-10 text-blue-500 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900">{designs.length}</div>
            <div className="text-sm text-gray-500">设计稿数量</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <MapPin className="w-10 h-10 text-green-500 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900">{addresses.length}</div>
            <div className="text-sm text-gray-500">收货地址</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <FileImage className="w-10 h-10 text-purple-500 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900">0</div>
            <div className="text-sm text-gray-500">打印订单</div>
          </div>
        </div>
      </div>
    </main>
  );
}
