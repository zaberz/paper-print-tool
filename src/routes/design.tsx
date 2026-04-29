import { createFileRoute, Link, useRouter } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { STANDARD_PAPER_SIZES, TEMPLATES, type Design, type PaperSize } from '../types';
import { generateImage, createDesign } from '../lib/api';
import { supabase } from '../lib/supabase';
import { Image, Sparkles, Download, ShoppingCart, RotateCcw, Check, ChevronDown, X } from 'lucide-react';

export const Route = createFileRoute('/design')({ component: DesignPage });

function DesignPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<'poster' | 'menu' | 'advertisement'>('poster');
  const [selectedSize, setSelectedSize] = useState<PaperSize>(STANDARD_PAPER_SIZES[1]);
  const [customWidth, setCustomWidth] = useState('');
  const [customHeight, setCustomHeight] = useState('');
  const [isCustomSize, setIsCustomSize] = useState(false);
  const [keywords, setKeywords] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [designSaved, setDesignSaved] = useState(false);
  const [title, setTitle] = useState('');
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);
  const [templates, setTemplates] = useState(TEMPLATES.filter(t => t.type === 'poster'));

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const type = searchParams.get('type') as 'poster' | 'menu' | 'advertisement';
    if (type) {
      setSelectedType(type);
    }
  }, []);

  useEffect(() => {
    setTemplates(TEMPLATES.filter(t => t.type === selectedType));
  }, [selectedType]);

  const handleGenerate = async () => {
    if (!keywords.trim()) return;
    
    setIsGenerating(true);
    const width = isCustomSize ? parseInt(customWidth) || 210 : selectedSize.width;
    const height = isCustomSize ? parseInt(customHeight) || 297 : selectedSize.height;
    
    const imageUrl = await generateImage(keywords, width, height);
    if (imageUrl) {
      setGeneratedImage(imageUrl);
      setDesignSaved(false);
    }
    setIsGenerating(false);
  };

  const handleSaveDesign = async () => {
    if (!generatedImage || !title.trim()) return;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.navigate({ to: '/login' });
      return;
    }

    const width = isCustomSize ? parseInt(customWidth) || 210 : selectedSize.width;
    const height = isCustomSize ? parseInt(customHeight) || 297 : selectedSize.height;

    const design: Omit<Design, 'id' | 'created_at'> = {
      user_id: user.id,
      title: title,
      image_url: generatedImage,
      paper_size: isCustomSize ? 'custom' : selectedSize.id,
      custom_width: isCustomSize ? width : undefined,
      custom_height: isCustomSize ? height : undefined,
      keywords: keywords,
      template_type: selectedType,
    };

    const savedDesign = await createDesign(design);
    if (savedDesign) {
      setDesignSaved(true);
      setTimeout(() => setDesignSaved(false), 3000);
    }
  };

  const handleOrder = () => {
    if (!generatedImage) return;
    router.navigate({ to: '/orders/new' });
  };

  const handleRegenerate = () => {
    if (!keywords.trim()) return;
    handleGenerate();
  };

  const getCanvasStyle = () => {
    const width = isCustomSize ? parseInt(customWidth) || 210 : selectedSize.width;
    const height = isCustomSize ? parseInt(customHeight) || 297 : selectedSize.height;
    const scale = Math.min(400 / width, 500 / height);
    return {
      width: `${width * scale}px`,
      height: `${height * scale}px`,
    };
  };

  const designTypeNames = {
    poster: '海报',
    menu: '菜单',
    advertisement: '广告',
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/" className="text-gray-600 hover:text-gray-900">
            ← 返回首页
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">设计制作</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">画布尺寸:</span>
                  <div className="relative">
                    <button
                      onClick={() => setShowSizeDropdown(!showSizeDropdown)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <span>{isCustomSize ? `自定义 ${customWidth} × ${customHeight}mm` : `${selectedSize.name} (${selectedSize.width} × ${selectedSize.height}mm)`}</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    {showSizeDropdown && (
                      <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border z-10">
                        <div className="p-2">
                          {STANDARD_PAPER_SIZES.map((size) => (
                            <button
                              key={size.id}
                              onClick={() => {
                                setSelectedSize(size);
                                setIsCustomSize(false);
                                setShowSizeDropdown(false);
                              }}
                              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${!isCustomSize && selectedSize.id === size.id ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}`}
                            >
                              <div className="font-medium">{size.name}</div>
                              <div className="text-sm text-gray-500">{size.width} × {size.height}mm - {size.description}</div>
                            </button>
                          ))}
                          <div className="border-t my-2" />
                          <button
                            onClick={() => {
                              setIsCustomSize(true);
                              setShowSizeDropdown(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${isCustomSize ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}`}
                          >
                            <div className="font-medium">自定义尺寸</div>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {designTypeNames[selectedType]}设计
                </div>
              </div>

              {isCustomSize && (
                <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">宽度 (mm)</label>
                    <input
                      type="number"
                      value={customWidth}
                      onChange={(e) => setCustomWidth(e.target.value)}
                      className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="210"
                    />
                  </div>
                  <div className="text-2xl text-gray-400">×</div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">高度 (mm)</label>
                    <input
                      type="number"
                      value={customHeight}
                      onChange={(e) => setCustomHeight(e.target.value)}
                      className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="297"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-center items-center bg-gray-100 rounded-xl min-h-[500px]">
                {generatedImage ? (
                  <div className="relative">
                    <div 
                      className="bg-white shadow-lg"
                      style={getCanvasStyle()}
                    >
                      <Image
                        src={generatedImage}
                        alt="Generated design"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-gray-900 text-white text-xs px-2 py-1 rounded">
                      {isCustomSize ? `${customWidth} × ${customHeight}mm` : `${selectedSize.width} × ${selectedSize.height}mm`}
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Image className="w-10 h-10 text-gray-400" />
                    </div>
                    <p className="text-gray-500">输入关键词，点击生成按钮开始设计</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              {generatedImage && (
                <>
                  <button
                    onClick={handleRegenerate}
                    className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    重新生成
                  </button>
                  <button
                    onClick={handleSaveDesign}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    {designSaved ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                    {designSaved ? '已保存' : '保存设计'}
                  </button>
                  <button
                    onClick={handleOrder}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    提交订单
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">设计类型</h3>
              <div className="space-y-2">
                {(['poster', 'menu', 'advertisement'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${selectedType === type ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'}`}
                  >
                    {designTypeNames[type]}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">关键词输入</h3>
              <div className="space-y-4">
                <textarea
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="输入您想要的设计关键词，例如：餐厅菜单 美食 简约风格"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={4}
                />
                <button
                  onClick={handleGenerate}
                  disabled={!keywords.trim() || isGenerating}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      AI生成图片
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">模板参考</h3>
              <div className="space-y-3">
                {templates.map((template) => (
                  <div key={template.id} className="relative rounded-lg overflow-hidden cursor-pointer group">
                    <Image
                      src={template.preview_url}
                      alt={template.name}
                      className="w-full h-24 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-sm">{template.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {generatedImage && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">保存设计</h3>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="输入设计名称"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
