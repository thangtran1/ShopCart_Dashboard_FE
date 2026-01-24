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

export default function NewsModal({ open, onClose, onSuccess, news }: NewsModalProps) {
  const { createNews, updateNews, isActionLoading } = useNews();
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
    if (open) {
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
    }
  }, [news, open]);

  const updateField = (field: keyof INews, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.title?.trim()) return toast.error("Tiêu đề không được để trống");
    if (!formData.content?.trim()) return toast.error("Nội dung không được để trống");

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

      if (news?._id) {
        await updateNews({ id: news._id, data: payload });
      } else {
        await createNews(payload);
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Submit Error:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="!max-w-5xl h-[85vh] flex flex-col p-0 border-none shadow-2xl rounded-2xl overflow-hidden bg-background">
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
                ${formData.isPublished ? "bg-emerald-500/20 text-emerald-600" : "bg-muted text-muted-foreground"}`}
            >
              <span className="text-[11px] font-bold uppercase tracking-widest">
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
              className="news-tabs mt-2"
              items={[
                {
                  key: "edit",
                  label: (
                    <span className="flex items-center gap-2 px-4 py-1 font-bold uppercase text-[12px]">
                      <PenTool size={16} /> Soạn thảo nội dung
                    </span>
                  ),
                  children: (
                    <div className="space-y-6 animate-in fade-in duration-500 mt-4 pb-10">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-bold uppercase ml-1">Tiêu đề bài viết</Label>
                            <Input
                              size="large"
                              placeholder="VD: Bí quyết mua sắm Tết 2026..."
                              value={formData.title}
                              onChange={(e) => updateField("title", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-bold uppercase ml-1">Mô tả ngắn</Label>
                            <Textarea
                              placeholder="Viết một đoạn giới thiệu ngắn gọn..."
                              value={formData.shortDescription}
                              onChange={(e) => updateField("shortDescription", e.target.value)}
                              className="resize-none h-24 rounded-xl border-border"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-bold uppercase ml-1">Ảnh đại diện (URL)</Label>
                          <Input
                            size="large"
                            placeholder="Dán link ảnh..."
                            value={formData.thumbnail}
                            onChange={(e) => updateField("thumbnail", e.target.value)}
                          />
                          <div className="aspect-[4/3] mt-3 rounded-2xl border-2 border-dashed border-primary/30 overflow-hidden flex items-center justify-center relative group bg-muted/50">
                            {formData.thumbnail ? (
                              <img
                                src={formData.thumbnail}
                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                alt="Thumbnail"
                              />
                            ) : (
                              <div className="text-center p-4">
                                <ImageIcon className="w-10 h-10 text-muted-foreground mx-auto" />
                                <p className="text-[10px] text-muted-foreground mt-2 italic font-medium">Chưa có ảnh xem trước</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <Label className="flex items-center justify-between text-sm font-bold uppercase ml-1">
                          Nội dung chi tiết (HTML)
                          <span className="text-[10px] font-mono text-muted-foreground">Support: p, h2, ul, li, img, blockquote</span>
                        </Label>
                        <Textarea
                          value={formData.content}
                          onChange={(e) => updateField("content", e.target.value)}
                          placeholder="Sử dụng thẻ HTML để định dạng bài viết..."
                          className="min-h-[400px] font-mono text-sm leading-relaxed rounded-2xl border-border"
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
                    <div className="rounded-2xl p-6 shadow-inner border border-border min-h-[600px] mt-4 mb-10 animate-in slide-in-from-bottom-4 bg-white dark:bg-zinc-950">
                      <div className="max-w-2xl mx-auto">
                        <AntBadge.Ribbon text={formData.category} color="blue">
                          <img
                            src={formData.thumbnail}
                            className="w-full h-[280px] object-cover rounded-3xl shadow-xl mb-8"
                            alt="Preview"
                          />
                        </AntBadge.Ribbon>
                        <h1 className="text-4xl font-black leading-tight mb-6">{formData.title || "Tiêu đề chưa nhập..."}</h1>
                        <p className="text-lg font-medium italic mb-10 border-l-4 border-primary pl-6 leading-relaxed text-muted-foreground">
                          {formData.shortDescription || "Mô tả bài viết sẽ xuất hiện ở đây..."}
                        </p>
                        <RenderHtml content={formData.content || ""} />
                        <div className="mt-10 pt-8 border-t border-border flex flex-wrap gap-2">
                          <span className="text-sm font-bold uppercase w-full mb-1">Tags:</span>
                          {formData.tags?.map((t) => (
                            <Badge key={t} variant="info" className="px-3 py-1 rounded-full text-xs font-bold">#{t}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ),
                },
              ]}
            />
          </div>

          <div className="w-80 border-l border-border px-5 py-6 flex flex-col bg-muted/20">
            <div className="space-y-6">
              <Title className="flex text-xs font-black items-center gap-2 uppercase tracking-widest text-primary">
                <Settings2 size={16} /> Cấu hình bài viết
              </Title>

              <div className="space-y-2">
                <Label className="text-[11px] font-bold text-foreground uppercase">Danh mục bài viết</Label>
                <Select
                  className="w-full"
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

              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase text-foreground">Thẻ từ khóa (Tags)</Label>
                <Select
                  size="large"
                  mode="tags"
                  className="w-full"
                  placeholder="Thêm tag..."
                  value={formData.tags}
                  onChange={(v) => updateField("tags", v)}
                />
              </div>

              <div className="pt-6 border-t border-border">
                <div className="rounded-xl p-4 border border-primary/20 bg-primary/5">
                  <div className="flex items-center gap-2 font-bold text-[11px] uppercase text-primary mb-2">
                    <Globe size={14} /> Xuất bản SEO
                  </div>
                  <p className="text-[10px] leading-relaxed text-muted-foreground">
                    Hệ thống tự động tối ưu hóa đường dẫn thân thiện với Google Search.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-4">
              <Button
                size="large"
                type="primary"
                onClick={handleSubmit}
                loading={isActionLoading}
                className="w-full h-12 font-bold"
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