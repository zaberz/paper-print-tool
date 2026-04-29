import { supabase } from './supabase';
import { Design, Order, Address } from '../types';

export async function createDesign(data: Omit<Design, 'id' | 'created_at'>): Promise<Design | null> {
  const { data: design, error } = await supabase
    .from('designs')
    .insert(data)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating design:', error);
    return null;
  }
  
  return design;
}

export async function getDesignsByUserId(userId: string): Promise<Design[]> {
  const { data: designs, error } = await supabase
    .from('designs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching designs:', error);
    return [];
  }
  
  return designs;
}

export async function getDesignById(id: string): Promise<Design | null> {
  const { data: design, error } = await supabase
    .from('designs')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching design:', error);
    return null;
  }
  
  return design;
}

export async function updateDesign(id: string, data: Partial<Design>): Promise<Design | null> {
  const { data: design, error } = await supabase
    .from('designs')
    .update(data)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating design:', error);
    return null;
  }
  
  return design;
}

export async function deleteDesign(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('designs')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting design:', error);
    return false;
  }
  
  return true;
}

export async function createOrder(data: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<Order | null> {
  const { data: order, error } = await supabase
    .from('orders')
    .insert(data)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating order:', error);
    return null;
  }
  
  return order;
}

export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*, designs(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
  
  return orders;
}

export async function getOrderById(id: string): Promise<Order | null> {
  const { data: order, error } = await supabase
    .from('orders')
    .select('*, designs(*)')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching order:', error);
    return null;
  }
  
  return order;
}

export async function updateOrderStatus(id: string, status: Order['status']): Promise<Order | null> {
  const { data: order, error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating order status:', error);
    return null;
  }
  
  return order;
}

export async function createAddress(data: Omit<Address, 'id' | 'created_at'>): Promise<Address | null> {
  if (data.is_default) {
    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', data.user_id);
  }
  
  const { data: address, error } = await supabase
    .from('addresses')
    .insert(data)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating address:', error);
    return null;
  }
  
  return address;
}

export async function getAddressesByUserId(userId: string): Promise<Address[]> {
  const { data: addresses, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching addresses:', error);
    return [];
  }
  
  return addresses;
}

export async function getAddressById(id: string): Promise<Address | null> {
  const { data: address, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching address:', error);
    return null;
  }
  
  return address;
}

export async function updateAddress(id: string, data: Partial<Address>): Promise<Address | null> {
  if (data.is_default && data.user_id) {
    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', data.user_id);
  }
  
  const { data: address, error } = await supabase
    .from('addresses')
    .update(data)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating address:', error);
    return null;
  }
  
  return address;
}

export async function deleteAddress(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('addresses')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting address:', error);
    return false;
  }
  
  return true;
}

export async function generateImage(keywords: string, width: number, height: number): Promise<string | null> {
  const mockImageUrl = `https://neeko-copilot.bytedance.net/api/text2image?prompt=${encodeURIComponent(keywords)}&image_size=landscape_4_3`;
  return mockImageUrl;
}
