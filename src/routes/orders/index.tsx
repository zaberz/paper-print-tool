import { createFileRoute, Link } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { getOrdersByUserId } from '../../lib/api';
import { supabase } from '../../lib/supabase';
import { ORDER_STATUS_MAP, type Order } from '../../types';
import { Package, ChevronRight, Clock, Truck, CheckCircle, FileText, MapPin } from 'lucide-react';

export const Route = createFileRoute('/orders/')({ component: OrdersPage });

function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const fetchOrders = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const userOrders = await getOrdersByUserId(user.id);
      setOrders(userOrders);
      setLoading(false);
    };

    fetchOrders();
  }, []);

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'printing':
        return <FileText className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-secondary text-muted-foreground';
      case 'printing':
        return 'bg-secondary text-foreground';
      case 'shipped':
        return 'bg-secondary text-foreground';
      case 'delivered':
        return 'bg-foreground text-background';
      default:
        return 'bg-secondary text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto max-w-4xl px-6 py-10">
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-6 py-10">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">我的订单</h1>
            <p className="text-muted-foreground mt-1 text-sm">查看和管理您的打印订单</p>
          </div>
          <Link
            to="/design"
            className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors text-sm font-medium"
          >
            <Package className="w-4 h-4" />
            新建设计
          </Link>
        </div>

        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors text-sm font-medium ${statusFilter === 'all' ? 'bg-foreground text-background' : 'bg-card border border-border text-muted-foreground hover:text-foreground'}`}
          >
            全部
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors text-sm font-medium ${statusFilter === 'pending' ? 'bg-foreground text-background' : 'bg-card border border-border text-muted-foreground hover:text-foreground'}`}
          >
            待打印
          </button>
          <button
            onClick={() => setStatusFilter('printing')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors text-sm font-medium ${statusFilter === 'printing' ? 'bg-foreground text-background' : 'bg-card border border-border text-muted-foreground hover:text-foreground'}`}
          >
            打印中
          </button>
          <button
            onClick={() => setStatusFilter('shipped')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors text-sm font-medium ${statusFilter === 'shipped' ? 'bg-foreground text-background' : 'bg-card border border-border text-muted-foreground hover:text-foreground'}`}
          >
            已发货
          </button>
          <button
            onClick={() => setStatusFilter('delivered')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors text-sm font-medium ${statusFilter === 'delivered' ? 'bg-foreground text-background' : 'bg-card border border-border text-muted-foreground hover:text-foreground'}`}
          >
            已送达
          </button>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 border border-border rounded-xl bg-card">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">暂无订单</h3>
            <p className="text-muted-foreground mb-6 text-sm">您还没有任何订单，快去设计一个吧！</p>
            <Link
              to="/design"
              className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors text-sm font-medium"
            >
              开始设计
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-card rounded-xl border border-border overflow-hidden hover:border-foreground/20 transition-colors"
              >
                <div className="p-6">
                  <div className="flex items-start gap-6">
                    {order.design && (
                      <div className="w-24 h-24 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                        <img
                          src={order.design.image_url}
                          alt={order.design.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-foreground truncate">
                          {order.design?.title || '未命名设计'}
                        </h3>
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {ORDER_STATUS_MAP[order.status]}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span>尺寸: {order.design?.paper_size === 'custom' ? `${order.design?.custom_width}×${order.design?.custom_height}mm` : order.design?.paper_size}</span>
                        <span>数量: {order.quantity}份</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">
                          {order.address.province} {order.address.city} {order.address.district} {order.address.detail}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-sm text-muted-foreground">下单时间: {new Date(order.created_at).toLocaleDateString()}</span>
                        <button className="text-foreground hover:text-foreground/80 text-sm font-medium transition-colors">
                          查看详情
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
