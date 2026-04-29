export interface Design {
  id: string;
  user_id: string;
  title: string;
  image_url: string;
  paper_size: string;
  custom_width?: number;
  custom_height?: number;
  keywords: string;
  template_type: 'poster' | 'menu' | 'advertisement';
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  design_id: string;
  status: 'pending' | 'printing' | 'shipped' | 'delivered';
  address: Address;
  quantity: number;
  created_at: string;
  updated_at: string;
  design?: Design;
}

export interface Address {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detail: string;
  is_default: boolean;
  created_at: string;
}

export interface PaperSize {
  id: string;
  name: string;
  width: number;
  height: number;
  description: string;
}

export interface Template {
  id: string;
  name: string;
  type: 'poster' | 'menu' | 'advertisement';
  preview_url: string;
  category: string;
}

export const STANDARD_PAPER_SIZES: PaperSize[] = [
  { id: 'A3', name: 'A3', width: 297, height: 420, description: '大尺寸海报' },
  { id: 'A4', name: 'A4', width: 210, height: 297, description: '标准打印尺寸' },
  { id: 'A5', name: 'A5', width: 148, height: 210, description: '小册子、传单' },
  { id: 'B4', name: 'B4', width: 250, height: 353, description: '书籍封面' },
  { id: 'B5', name: 'B5', width: 176, height: 250, description: '笔记本、手册' },
];

export const TEMPLATES: Template[] = [
  { id: '1', name: '简约海报', type: 'poster', preview_url: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=minimalist%20poster%20design%20clean%20modern&image_size=landscape_4_3', category: '简约' },
  { id: '2', name: '商务海报', type: 'poster', preview_url: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=business%20corporate%20poster%20professional&image_size=landscape_4_3', category: '商务' },
  { id: '3', name: '活动海报', type: 'poster', preview_url: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=event%20party%20poster%20colorful%20festive&image_size=landscape_4_3', category: '活动' },
  { id: '4', name: '餐厅菜单', type: 'menu', preview_url: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=restaurant%20menu%20elegant%20food%20design&image_size=landscape_4_3', category: '餐饮' },
  { id: '5', name: '咖啡馆菜单', type: 'menu', preview_url: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=cafe%20menu%20cozy%20coffee%20shop&image_size=landscape_4_3', category: '餐饮' },
  { id: '6', name: '甜品菜单', type: 'menu', preview_url: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=dessert%20menu%20sweet%20pastry%20elegant&image_size=landscape_4_3', category: '餐饮' },
  { id: '7', name: '促销广告', type: 'advertisement', preview_url: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=sale%20promotion%20advertisement%20colorful&image_size=landscape_4_3', category: '促销' },
  { id: '8', name: '新品上市', type: 'advertisement', preview_url: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=new%20product%20launch%20advertisement%20modern&image_size=landscape_4_3', category: '新品' },
  { id: '9', name: '招聘广告', type: 'advertisement', preview_url: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=job%20recruitment%20advertisement%20professional&image_size=landscape_4_3', category: '招聘' },
];

export const ORDER_STATUS_MAP: Record<string, string> = {
  pending: '待打印',
  printing: '打印中',
  shipped: '已发货',
  delivered: '已送达',
};
