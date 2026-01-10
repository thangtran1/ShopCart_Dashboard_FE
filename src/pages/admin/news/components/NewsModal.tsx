"use client";

import { useState, useEffect } from "react";
import { Label } from "@/ui/label";
import { Button, Input, Select, Switch, Tabs, Badge as AntBadge } from "antd";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/ui/dialog";
import { Textarea } from "@/ui/textarea";
import { toast } from "sonner";
import {
  Newspaper,
  Image as ImageIcon,
  Eye,
  PenTool,
  Globe,
  Settings2,
  Send,
} from "lucide-react";
import { useNews } from "@/hooks/useNews";
import { INews } from "@/api/services/newsApi";
import { Badge } from "@/ui/badge";
import Title from "@/ui/title";
import RenderHtml from "./render-html";

const { Option } = Select;
interface NewsModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  news?: INews | null;
}

export default function NewsModal({
  open,
  onClose,
  onSuccess,
  news,
}: NewsModalProps) {
  const { createNews, updateNews } = useNews();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("edit");

  const [formData, setFormData] = useState<Partial<INews>>({
    title: "",
    thumbnail: "",
    shortDescription: "",
    content: "",
    category: "General",
    tags: [],
    isPublished: true,
  });

  useEffect(() => {
    if (news) {
      setFormData({
        title: news.title || "",
        thumbnail: news.thumbnail || "",
        shortDescription: news.shortDescription || "",
        content: news.content || "",
        category: news.category || "General",
        tags: news.tags || [],
        isPublished: news.isPublished ?? true,
      });
    } else {
      setFormData({
        title: "",
        thumbnail: "",
        shortDescription: "",
        content: "",
        category: "General",
        tags: [],
        isPublished: true,
      });
    }
  }, [news, open]);

  const updateField = (field: keyof INews, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.title?.trim())
      return toast.error("Tiêu đề không được để trống");
    if (!formData.content?.trim())
      return toast.error("Nội dung không được để trống");

    setLoading(true);
    try {
      const payload = {
        title: formData.title,
        thumbnail: formData.thumbnail,
        shortDescription: formData.shortDescription,
        content: formData.content,
        category: formData.category,
        tags: formData.tags,
        isPublished: formData.isPublished,
      };

      const result = news?._id
        ? await updateNews(news._id, payload)
        : await createNews(payload);

      if (result) {
        onSuccess?.();
        onClose();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="!max-w-5xl h-[85vh] flex flex-col p-0 border-none shadow-2xl rounded-2xl overflow-hidden">
        <div className="bg-primary/5 p-6 border-b border-primary/40 flex items-center justify-between">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-primary">
              <Newspaper className="w-8 h-8" />
              {news ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center mr-6">
            <div
              className={`flex items-center border border-primary/60 gap-2 px-3 py-1.5 rounded-full transition
                ${formData.isPublished
                  ? "bg-emerald-500/20 text-emerald-300"
                  : ""
                }`}
            >
              <span className="text-[11px] text-foreground font-bold uppercase tracking-widest">
                {formData.isPublished ? "Xuất bản" : "Nháp"}
              </span>

              <Switch
                checked={formData.isPublished}
                onChange={(v) => updateField("isPublished", v)}
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex">
          <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              className="news-tabs"
              items={[
                {
                  key: "edit",
                  label: (
                    <span className="flex items-center gap-2 px-4 py-1 font-bold uppercase text-[12px]">
                      <PenTool size={16} /> Soạn thảo nội dung
                    </span>
                  ),
                  children: (
                    <div className="space-y-6 animate-in fade-in duration-500 mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <div className="md:col-span-2 space-y-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-bold text-foreground uppercase ml-1">
                              Tiêu đề bài viết
                            </Label>
                            <Input
                              size="large"
                              placeholder="VD: Bí quyết mua sắm Tết 2026..."
                              value={formData.title}
                              onChange={(e) =>
                                updateField("title", e.target.value)
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-bold text-foreground uppercase ml-1">
                              Mô tả ngắn
                            </Label>
                            <Textarea
                              placeholder="Viết một đoạn giới thiệu ngắn gọn..."
                              value={formData.shortDescription}
                              onChange={(e) =>
                                updateField("shortDescription", e.target.value)
                              }
                              className="resize-none h-24 rounded-xl border-border"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-bold text-foreground uppercase ml-1">
                            Ảnh đại diện (URL)
                          </Label>
                          <Input
                            size="large"
                            placeholder="Dán link ảnh tại đây..."
                            value={formData.thumbnail}
                            onChange={(e) =>
                              updateField("thumbnail", e.target.value)
                            }
                            className="rounded-xl"
                          />
                          <div className="aspect-[4/3] mt-3 rounded-2xl border-2 border-dashed border-primary/30 overflow-hidden flex items-center justify-center relative group">
                            {formData.thumbnail ? (
                              <img
                                src={formData.thumbnail}
                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                              />
                            ) : (
                              <div className="text-center p-4">
                                <ImageIcon className="w-10 h-10 text-foreground mx-auto" />
                                <p className="text-[10px] text-foreground mt-2 italic font-medium">
                                  Chưa có ảnh xem trước
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4 py-3">
                        <Label className="flex items-center justify-between text-sm font-bold text-foreground uppercase ml-1">
                          Nội dung chi tiết (HTML)
                          <span className="text-[10px] text-foreground font-mono">
                            Support: p, h2, ul, li, img, blockquote
                          </span>
                        </Label>
                        <Textarea
                          value={formData.content}
                          onChange={(e) =>
                            updateField("content", e.target.value)
                          }
                          placeholder="Sử dụng thẻ HTML để định dạng bài viết chuyên nghiệp hơn..."
                          className="min-h-[400px] font-mono text-sm leading-relaxed rounded-2xl border-border transition-all"
                        />
                      </div>
                    </div>
                  ),
                },
                {
                  key: "preview",
                  label: (
                    <span className="flex items-center gap-2 px-4 py-1 font-bold uppercase text-[12px]">
                      <Eye size={16} /> Xem trước bài đăng
                    </span>
                  ),
                  children: (
                    <div className="rounded-2xl p-4 shadow-inner border border-border min-h-[600px] mt-2 animate-in slide-in-from-bottom-4 duration-500">
                      <div className="max-w-2xl mx-auto">
                        <AntBadge.Ribbon text={formData.category} color="volcano">
                          <img
                            src={formData.thumbnail}
                            className="w-full h-[250px] object-cover rounded-3xl shadow-xl mb-8"
                          />
                        </AntBadge.Ribbon>
                  
                        <h1 className="text-4xl font-black text-foreground leading-tight mb-6">
                          {formData.title || "Tiêu đề chưa nhập..."}
                        </h1>
                  
                        <p className="text-lg text-foreground font-medium italic mb-10 border-l-4 border-border pl-6 leading-relaxed">
                          {formData.shortDescription || "Mô tả bài viết sẽ xuất hiện ở đây..."}
                        </p>
                  
                        <RenderHtml content={formData.content || ""} />
                  
                        <div className="mt-10 pt-8 border-t border-border flex items-center gap-2">
                          <span className="text-sm font-bold text-foreground uppercase">
                            Tags:
                          </span>
                          {formData.tags?.map((t) => (
                            <Badge
                              variant={"info"}
                              key={t}
                              className="px-3 py-1 text-foreground rounded-full text-xs font-bold"
                            >
                              #{t}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ),
                },
              ]}
            />
          </div>

          <div className="w-80 border-l border-border px-4 py-2 lg:flex flex-col h-full">
            <div className="space-y-4">
              <div className="space-y-4">
                <Title className="flex text-sm font-black items-center gap-2 text-foreground uppercase tracking-tighter">
                  <Settings2 size={14} /> Cấu hình bài viết
                </Title>

                <div className="space-y-2">
                  <Label className="text-[11px] font-bold text-foreground">
                    Danh mục bài viết
                  </Label>
                  <Select
                    className="w-full h-10"
                    value={formData.category}
                    onChange={(v) => updateField("category", v)}
                    size="large"
                    getPopupContainer={(trigger) => trigger.parentNode}
                  >
                    <Option value="Promotion">Khuyến mãi</Option>
                    <Option value="Technology">Công nghệ</Option>
                    <Option value="LifeStyle">Đời sống</Option>
                    <Option value="System">Hệ thống</Option>
                  </Select>
                </div>

                <div className="space-y-2 pt-2">
                  <Label className="text-[11px] font-bold text-foreground">
                    Thẻ từ khóa (Tags)
                  </Label>
                  <Select
                    size="large"
                    mode="tags"
                    className="w-full"
                    placeholder="Thêm tag..."
                    value={formData.tags}
                    onChange={(v) => updateField("tags", v)}
                  />
                  <p className="text-sm text-foreground mt-2">
                    Gợi ý: tet, sale, 2026...
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <div className="rounded-2xl p-4 border border-border">
                  <div className="flex items-center gap-2 text-foreground font-bold text-[11px] uppercase mb-2">
                    <Globe size={14} /> Xuất bản SEO
                  </div>
                  <p className="text-[10px] text-foreground leading-relaxed font-medium">
                    Bài viết của bạn sau khi đăng sẽ được tối ưu hóa đường dẫn
                    tự động để tốt cho tìm kiếm Google.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-auto mb-4">
              <Button
                size="large"
                type="primary"
                onClick={handleSubmit}
                loading={loading}
                className="w-full"
                icon={<Send className="w-4 h-4" />}
              >
                {news ? "Cập nhật" : "Đăng bài"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
