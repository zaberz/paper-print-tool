import { createFileRoute, Link } from '@tanstack/react-router';
import { TEMPLATES } from '../types';
import { Image, Menu, FileText, Megaphone, ArrowRight, Sparkles } from 'lucide-react';

export const Route = createFileRoute('/')({ component: Home });

function Home() {
  const designTypes = [
    {
      id: 'poster',
      name: '海报设计',
      description: '创建精美海报，适用于活动宣传、产品推广等',
      icon: FileText,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      id: 'menu',
      name: '菜单制作',
      description: '设计餐厅、咖啡馆菜单，展现美食魅力',
      icon: Menu,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
    },
    {
      id: 'advertisement',
      name: '广告单页',
      description: '制作促销广告、招聘启事等宣传物料',
      icon: Megaphone,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
    },
  ];

  const filteredTemplates = TEMPLATES.slice(0, 6);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10" />
        <div className="container mx-auto max-w-6xl relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6 shadow-sm">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span className="text-sm text-gray-600">AI 智能设计，一键生成精美印刷品</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              创意设计，轻松打印
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              输入关键词，AI帮您生成专业设计稿。选择模板、定制尺寸，一站式完成海报、菜单、广告的设计与打印。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {designTypes.map((type) => {
              const Icon = type.icon;
              return (
                <Link
                  key={type.id}
                  to={`/design?type=${type.id}`}
                  className={`group relative rounded-2xl p-8 ${type.bgColor} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
                >
                  <div className={`w-14 h-14 ${type.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {type.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{type.description}</p>
                  <div className="flex items-center gap-2 text-gray-500 group-hover:text-gray-900 transition-colors">
                    <span className="text-sm">开始设计</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">精选模板</h2>
            <p className="text-gray-600">选择您喜欢的模板，快速开始设计</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <Link
                key={template.id}
                to={`/design?type=${template.type}&template=${template.id}`}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={template.preview_url}
                    alt={template.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="inline-block bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm text-gray-700">
                      {template.category}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900">{template.name}</h3>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/design"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              查看全部模板
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="w-16 h-16 bg-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-cyan-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI智能生成</h3>
              <p className="text-gray-600">输入关键词，AI自动生成专业设计稿</p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">多种尺寸</h3>
              <p className="text-gray-600">支持A3、A4、A5等标准尺寸及自定义尺寸</p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Megaphone className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">专业打印</h3>
              <p className="text-gray-600">高品质打印，全国配送，让创意落地</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
