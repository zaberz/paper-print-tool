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
    },
    {
      id: 'menu',
      name: '菜单制作',
      description: '设计餐厅、咖啡馆菜单，展现美食魅力',
      icon: Menu,
    },
    {
      id: 'advertisement',
      name: '广告单页',
      description: '制作促销广告、招聘启事等宣传物料',
      icon: Megaphone,
    },
  ];

  const filteredTemplates = TEMPLATES.slice(0, 6);

  return (
    <main className="min-h-screen bg-background">
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-secondary rounded-full px-4 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-foreground" />
              <span className="text-sm text-muted-foreground">AI 智能设计，一键生成精美印刷品</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-semibold text-foreground mb-6 tracking-tight">
              创意设计，轻松打印
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              输入关键词，AI帮您生成专业设计稿。选择模板、定制尺寸，一站式完成海报、菜单、广告的设计与打印。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {designTypes.map((type) => {
              const Icon = type.icon;
              return (
                <Link
                  key={type.id}
                  to={`/design?type=${type.id}`}
                  className="group relative rounded-xl p-8 border border-border bg-card hover:border-foreground/20 transition-all duration-200"
                >
                  <div className="w-12 h-12 bg-foreground rounded-lg flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5 text-background" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {type.name}
                  </h3>
                  <p className="text-muted-foreground mb-5 text-sm leading-relaxed">{type.description}</p>
                  <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors duration-150">
                    <span className="text-sm font-medium">开始设计</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 border-t border-border">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-semibold text-foreground mb-3 tracking-tight">精选模板</h2>
            <p className="text-muted-foreground">选择您喜欢的模板，快速开始设计</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <Link
                key={template.id}
                to={`/design?type=${template.type}&template=${template.id}`}
                className="group bg-card rounded-xl overflow-hidden border border-border hover:border-foreground/20 transition-all duration-200"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={template.preview_url}
                    alt={template.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="inline-block bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm text-foreground">
                      {template.category}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-foreground">{template.name}</h3>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/design"
              className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors duration-150 font-medium"
            >
              查看全部模板
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 border-t border-border">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="p-6">
              <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center mx-auto mb-5">
                <Sparkles className="w-6 h-6 text-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">AI智能生成</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">输入关键词，AI自动生成专业设计稿</p>
            </div>
            <div className="p-6">
              <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center mx-auto mb-5">
                <FileText className="w-6 h-6 text-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">多种尺寸</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">支持A3、A4、A5等标准尺寸及自定义尺寸</p>
            </div>
            <div className="p-6">
              <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center mx-auto mb-5">
                <Megaphone className="w-6 h-6 text-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">专业打印</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">高品质打印，全国配送，让创意落地</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
