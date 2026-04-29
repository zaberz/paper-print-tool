import { createFileRoute, Link, useRouter } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { createOrder, getAddressesByUserId, createAddress } from '../../lib/api';
import { supabase } from '../../lib/supabase';
import { type Order, type Address } from '../../types';
import { Package, MapPin, Plus, Minus, Check, ArrowLeft, Save } from 'lucide-react';

export const Route = createFileRoute('/orders/new')({ component: NewOrderPage });

function NewOrderPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    detail: '',
    is_default: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [savedDesign, setSavedDesign] = useState<{
    imageUrl: string;
    title: string;
    paperSize: string;
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.navigate({ to: '/login' });
        return;
      }

      const userAddresses = await getAddressesByUserId(user.id);
      setAddresses(userAddresses);
      if (userAddresses.length > 0) {
        setSelectedAddress(userAddresses[0]);
      }
    };

    fetchAddresses();
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const imageUrl = searchParams.get('image');
    const title = searchParams.get('title') || '未命名设计';
    const paperSize = searchParams.get('size') || 'A4';
    const width = parseInt(searchParams.get('width') || '210');
    const height = parseInt(searchParams.get('height') || '297');

    if (imageUrl) {
      setSavedDesign({ imageUrl, title, paperSize, width, height });
    } else {
      setSavedDesign({
        imageUrl: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=sample%20design%20preview&image_size=landscape_4_3',
        title: '示例设计',
        paperSize: 'A4',
        width: 210,
        height: 297,
      });
    }
  }, []);

  const handleSubmitOrder = async () => {
    if (!selectedAddress || !savedDesign) return;

    setSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setSubmitting(false);
      return;
    }

    const orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'> = {
      user_id: user.id,
      design_id: 'temp-design-id',
      status: 'pending',
      address: selectedAddress,
      quantity: quantity,
    };

    const order = await createOrder(orderData);
    if (order) {
      router.navigate({ to: '/orders' });
    }
    setSubmitting(false);
  };

  const handleAddNewAddress = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const addressData: Omit<Address, 'id' | 'created_at'> = {
      user_id: user.id,
      ...newAddress,
    };

    const address = await createAddress(addressData);
    if (address) {
      setAddresses([address, ...addresses]);
      setSelectedAddress(address);
      setShowNewAddressForm(false);
      setNewAddress({
        name: '',
        phone: '',
        province: '',
        city: '',
        district: '',
        detail: '',
        is_default: false,
      });
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/design" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">提交订单</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                设计预览
              </h3>
              {savedDesign && (
                <div className="flex gap-6">
                  <div className="w-32 h-44 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={savedDesign.imageUrl}
                      alt={savedDesign.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-2">{savedDesign.title}</h4>
                    <div className="space-y-1 text-sm text-gray-500">
                      <p>尺寸: {savedDesign.paperSize === 'custom' ? `${savedDesign.width}×${savedDesign.height}mm` : savedDesign.paperSize}</p>
                      <p>关键词: 示例设计</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                收货地址
              </h3>

              {addresses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">暂无收货地址，请添加一个</p>
                  <button
                    onClick={() => setShowNewAddressForm(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    添加收货地址
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-4">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        onClick={() => setSelectedAddress(address)}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedAddress?.id === address.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-medium text-gray-900">
                              {address.name} {address.phone}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              {address.province} {address.city} {address.district} {address.detail}
                            </div>
                          </div>
                          {selectedAddress?.id === address.id && (
                            <Check className="w-5 h-5 text-blue-500" />
                          )}
                        </div>
                        {address.is_default && (
                          <span className="inline-block mt-2 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                            默认地址
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowNewAddressForm(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    添加新地址
                  </button>
                </>
              )}

              {showNewAddressForm && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">添加新地址</h4>
                    <button
                      onClick={() => setShowNewAddressForm(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">收件人姓名</label>
                      <input
                        type="text"
                        value={newAddress.name}
                        onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">联系电话</label>
                      <input
                        type="tel"
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">省份</label>
                      <input
                        type="text"
                        value={newAddress.province}
                        onChange={(e) => setNewAddress({ ...newAddress, province: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">城市</label>
                      <input
                        type="text"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">区县</label>
                      <input
                        type="text"
                        value={newAddress.district}
                        onChange={(e) => setNewAddress({ ...newAddress, district: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">详细地址</label>
                      <input
                        type="text"
                        value={newAddress.detail}
                        onChange={(e) => setNewAddress({ ...newAddress, detail: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <input
                      type="checkbox"
                      checked={newAddress.is_default}
                      onChange={(e) => setNewAddress({ ...newAddress, is_default: e.target.checked })}
                      id="default-address"
                    />
                    <label htmlFor="default-address" className="text-sm text-gray-600">
                      设置为默认地址
                    </label>
                  </div>
                  <button
                    onClick={handleAddNewAddress}
                    className="mt-4 w-full flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    保存地址
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-8">
              <h3 className="font-semibold text-gray-900 mb-4">订单信息</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">打印数量</label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-xl font-semibold text-gray-900 w-12 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-gray-500">份</span>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>设计费用</span>
                    <span>免费</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>打印费用</span>
                    <span>¥{(quantity * 2).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>运费</span>
                    <span>¥10.00</span>
                  </div>
                </div>

                <div className="border-t pt-4 flex justify-between">
                  <span className="font-semibold text-gray-900">总计</span>
                  <span className="font-semibold text-xl text-blue-600">¥{(quantity * 2 + 10).toFixed(2)}</span>
                </div>

                <button
                  onClick={handleSubmitOrder}
                  disabled={!selectedAddress || submitting}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? '提交中...' : '提交订单'}
                </button>

                <p className="text-center text-sm text-gray-500">
                  订单提交后，我们会在24小时内完成打印
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
