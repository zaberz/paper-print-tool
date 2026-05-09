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
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-6 py-10">
        <div className="flex items-center gap-4 mb-10">
          <Link to="/design" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">提交订单</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2 text-sm">
                <Package className="w-4 h-4" />
                设计预览
              </h3>
              {savedDesign && (
                <div className="flex gap-6">
                  <div className="w-32 h-44 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                    <img
                      src={savedDesign.imageUrl}
                      alt={savedDesign.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground mb-2">{savedDesign.title}</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>尺寸: {savedDesign.paperSize === 'custom' ? `${savedDesign.width}×${savedDesign.height}mm` : savedDesign.paperSize}</p>
                      <p>关键词: 示例设计</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4" />
                收货地址
              </h3>

              {addresses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4 text-sm">暂无收货地址，请添加一个</p>
                  <button
                    onClick={() => setShowNewAddressForm(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors text-sm font-medium"
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
                            ? 'border-foreground bg-secondary'
                            : 'border-border hover:border-foreground/20'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-medium text-foreground text-sm">
                              {address.name} {address.phone}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {address.province} {address.city} {address.district} {address.detail}
                            </div>
                          </div>
                          {selectedAddress?.id === address.id && (
                            <Check className="w-5 h-5 text-foreground" />
                          )}
                        </div>
                        {address.is_default && (
                          <span className="inline-block mt-2 text-xs text-foreground bg-secondary px-2 py-1 rounded">
                            默认地址
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowNewAddressForm(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-border rounded-lg text-muted-foreground hover:border-foreground/30 hover:text-foreground transition-colors text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    添加新地址
                  </button>
                </>
              )}

              {showNewAddressForm && (
                <div className="mt-6 p-4 bg-secondary rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-foreground text-sm">添加新地址</h4>
                    <button
                      onClick={() => setShowNewAddressForm(false)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      ×
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-muted-foreground mb-1">收件人姓名</label>
                      <input
                        type="text"
                        value={newAddress.name}
                        onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground/20 bg-background text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-1">联系电话</label>
                      <input
                        type="tel"
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground/20 bg-background text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-1">省份</label>
                      <input
                        type="text"
                        value={newAddress.province}
                        onChange={(e) => setNewAddress({ ...newAddress, province: e.target.value })}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground/20 bg-background text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-1">城市</label>
                      <input
                        type="text"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground/20 bg-background text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-1">区县</label>
                      <input
                        type="text"
                        value={newAddress.district}
                        onChange={(e) => setNewAddress({ ...newAddress, district: e.target.value })}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground/20 bg-background text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-1">详细地址</label>
                      <input
                        type="text"
                        value={newAddress.detail}
                        onChange={(e) => setNewAddress({ ...newAddress, detail: e.target.value })}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground/20 bg-background text-sm"
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
                    <label htmlFor="default-address" className="text-sm text-muted-foreground">
                      设置为默认地址
                    </label>
                  </div>
                  <button
                    onClick={handleAddNewAddress}
                    className="mt-4 w-full flex items-center justify-center gap-2 py-3 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors text-sm font-medium"
                  >
                    <Save className="w-4 h-4" />
                    保存地址
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
              <h3 className="font-semibold text-foreground mb-4 text-sm">订单信息</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">打印数量</label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center rounded-lg border border-border hover:bg-secondary transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-xl font-semibold text-foreground w-12 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center rounded-lg border border-border hover:bg-secondary transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-muted-foreground">份</span>
                  </div>
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-muted-foreground text-sm">
                    <span>设计费用</span>
                    <span>免费</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground text-sm">
                    <span>打印费用</span>
                    <span>¥{(quantity * 2).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground text-sm">
                    <span>运费</span>
                    <span>¥10.00</span>
                  </div>
                </div>

                <div className="border-t border-border pt-4 flex justify-between">
                  <span className="font-semibold text-foreground">总计</span>
                  <span className="font-semibold text-xl text-foreground">¥{(quantity * 2 + 10).toFixed(2)}</span>
                </div>

                <button
                  onClick={handleSubmitOrder}
                  disabled={!selectedAddress || submitting}
                  className="w-full py-3 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  {submitting ? '提交中...' : '提交订单'}
                </button>

                <p className="text-center text-sm text-muted-foreground">
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
