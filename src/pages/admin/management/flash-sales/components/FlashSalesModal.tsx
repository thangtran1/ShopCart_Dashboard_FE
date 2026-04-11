"use client";

import { useEffect, useState } from "react";
import { Modal, Form, Input, DatePicker, Button, Select, InputNumber } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { toast } from "sonner";
import { useFlashSales } from "@/hooks/useFlashSales";
import { useProduct } from "@/hooks/useProducts";
import { numberToVietnameseText } from "@/utils/numberToWords";

import { Bolt } from "lucide-react";

interface FlashSalesModalProps {
  open: boolean;
  campaign: any | null;
  onClose: () => void;
}

export default function FlashSalesModal({ open, campaign, onClose }: FlashSalesModalProps) {
  const [form] = Form.useForm();
  const { createMutation, updateMutation } = useFlashSales();
  const { useActiveProducts } = useProduct();
  const { data: products = [] } = useActiveProducts();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      if (campaign) {
        form.setFieldsValue({
          name: campaign.name,
          dates: [dayjs(campaign.startTime), dayjs(campaign.endTime)],
          items: campaign.items?.map((item: any) => ({
            product: item.product?._id || item.product,
            flashPrice: item.flashPrice,
            stockLimit: item.stockLimit,
          })) || [],
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          items: [{}], // start with one empty item
        });
      }
    }
  }, [open, campaign, form]);

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const payload = {
        name: values.name,
        startTime: values.dates[0].toISOString(),
        endTime: values.dates[1].toISOString(),
        items: values.items.map((item: any) => ({
          product: item.product,
          flashPrice: Number(item.flashPrice),
          stockLimit: Number(item.stockLimit),
        })),
      };

      if (campaign) {
        await updateMutation.mutateAsync({ id: campaign._id, data: payload });
        toast.success("Đã cập nhật chiến dịch thành công!");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Đã tạo chiến dịch Flash Sale mới!");
      }
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Có lỗi xảy ra khi lưu chiến dịch!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 pb-3 mb-2 border-b border-slate-100">
          <div className="p-2 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg shadow-sm text-white">
            <Bolt className="w-5 h-5" />
          </div>
          <span className="text-xl font-black bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent uppercase tracking-wide">
            {campaign ? "Chỉnh sửa chiến dịch" : "Tạo nhanh Flash Sale"}
          </span>
        </div>
      }
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText={campaign ? "Cập nhật chiến dịch" : "Tạo mới ngay"}
      cancelText="Hủy bỏ"
      confirmLoading={loading}
      width={800}
      centered
      maskClosable={false}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="mt-4"
      >
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 mb-6 shadow-inner">
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="name"
              label={<span className="font-semibold text-slate-700">Tên chiến dịch</span>}
              rules={[{ required: true, message: "Vui lòng nhập tên chiến dịch" }]}
              className="mb-0"
            >
              <Input placeholder="VD: Flash Sale Nửa Đêm 11:11" size="large" className="rounded-xl" />
            </Form.Item>
            
            <Form.Item
              name="dates"
              label={<span className="font-semibold text-slate-700">Thời gian chạy (Bắt đầu - Kết thúc)</span>}
              rules={[{ required: true, message: "Vui lòng chọn khung thời gian" }]}
              className="mb-0"
            >
              <DatePicker.RangePicker 
                showTime 
                format="HH:mm DD/MM/YYYY" 
                size="large"
                className="w-full rounded-xl"
              />
            </Form.Item>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
           <div className="w-1 h-5 bg-indigo-500 rounded-full"></div>
           <h3 className="text-base font-bold text-slate-800 m-0">Danh sách sản phẩm giảm giá</h3>
        </div>

        <Form.List name="items">
          {(fields, { add, remove }) => (
            <>
              <div className="flex flex-col gap-3 max-h-[380px] overflow-y-auto pr-2 styled-scrollbar">
                {fields.map(({ key, name, ...restField }, index) => (
                  <div key={key} className="relative bg-white shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] rounded-2xl border border-slate-100 p-4 pb-5 transition-all hover:border-indigo-200 hover:shadow-md mt-2 ml-2">
                    <div className="absolute -top-3 -left-3 bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shadow-sm border border-white">
                      {index + 1}
                    </div>
                    <div className="flex gap-4 items-start w-full">
                      <div className="relative flex-1 min-w-[200px]">
                        <Form.Item
                          {...restField}
                          name={[name, 'product']}
                          label={<span className="font-medium text-slate-600 text-[11px] uppercase tracking-wider">Sản phẩm tham gia</span>}
                          rules={[{ required: true, message: "Chọn 1 sản phẩm" }]}
                          className="mb-0 w-full"
                        >
                          <Select
                            showSearch
                            optionFilterProp="children"
                            placeholder="Nhập tên sản phẩm..."
                            size="large"
                            className="rounded-xl"
                          >
                            {products.map((p: any) => {
                              const isOutOfStock = p.stock <= 0;
                              return (
                                <Select.Option key={p._id} value={p._id} disabled={isOutOfStock}>
                                  <div className={`flex justify-between items-center py-1 ${isOutOfStock ? 'opacity-50' : ''}`}>
                                    <span className="font-medium truncate max-w-[200px] gap-2 flex items-center">
                                      {p.name}
                                      {isOutOfStock && (
                                        <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-[9px] rounded-sm font-black tracking-widest whitespace-nowrap">HẾT HÀNG</span>
                                      )}
                                    </span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ml-2 shrink-0 ${isOutOfStock ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-500'}`}>
                                      Kho: {p.stock}
                                    </span>
                                  </div>
                                </Select.Option>
                              );
                            })}
                          </Select>
                        </Form.Item>

                        <Form.Item
                          noStyle
                          shouldUpdate={(prevValues, currentValues) => {
                            const prev = prevValues?.items?.[name] || {};
                            const curr = currentValues?.items?.[name] || {};
                            return prev.product !== curr.product || prev.flashPrice !== curr.flashPrice;
                          }}
                        >
                          {({ getFieldValue }) => {
                            const pId = getFieldValue(['items', name, 'product']);
                            const flashP = getFieldValue(['items', name, 'flashPrice']);
                            const pData = products.find((p: any) => p._id === pId);

                            if (!pData) return null;

                            const originPrice = pData.price || 0;
                            let percentComp = null;

                            if (flashP && flashP < originPrice) {
                              const pct = Math.round((1 - flashP / originPrice) * 100);
                              percentComp = <span className="text-red-500 font-black ml-1 not-italic">(-{pct}%)</span>;
                            }

                            return (
                              <div className="absolute top-[100%] left-1 -mt-[13px] text-[11px] text-slate-500 font-medium italic truncate w-full pointer-events-none">
                                Giá gốc: <span className="line-through decoration-slate-300">{new Intl.NumberFormat('vi-VN').format(originPrice)}đ</span>
                                {percentComp}
                              </div>
                            );
                          }}
                        </Form.Item>
                      </div>

                      <div className="relative flex-1 min-w-[200px]">
                        <Form.Item
                          {...restField}
                          name={[name, 'flashPrice']}
                          label={<span className="font-medium text-red-500 text-[11px] uppercase tracking-wider">Giá Bán Sale</span>}
                          rules={[{ required: true, message: "Nhập giá bán sale" }]}
                          className="mb-0 w-full"
                        >
                          <InputNumber
                            size="large"
                            style={{ width: '100%' }}
                            className="!rounded-xl overflow-hidden [&_input]:text-base [&_input]:font-black text-red-600"
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                            suffix={<span className="text-red-500 font-black text-sm ml-1">đ</span>}
                          />
                        </Form.Item>
                        <Form.Item
                          noStyle
                          shouldUpdate={(prevValues, currentValues) => {
                            const prev = prevValues?.items?.[name] || {};
                            const curr = currentValues?.items?.[name] || {};
                            return prev.flashPrice !== curr.flashPrice;
                          }}
                        >
                          {({ getFieldValue }) => {
                            const val = getFieldValue(['items', name, 'flashPrice']);
                            return (
                              <div className="absolute top-[100%] left-1 -mt-[13px] text-[11px] text-emerald-600 font-bold italic truncate w-full pointer-events-none" title={val ? numberToVietnameseText(val) : ''}>
                                {val ? numberToVietnameseText(val) : ''}
                              </div>
                            );
                          }}
                        </Form.Item>
                      </div>

                      <Form.Item
                        {...restField}
                        name={[name, 'stockLimit']}
                        label={<span className="font-medium text-slate-600 text-[11px] uppercase tracking-wider whitespace-nowrap">Giới hạn suất</span>}
                        rules={[{ required: true, message: "Bắt buộc" }]}
                        className="mb-0 w-[130px]"
                        tooltip="Số lượng tối đa được bán ở mức giá này."
                      >
                        <InputNumber min={1} size="large" style={{ width: '100%' }} className="!rounded-xl" />
                      </Form.Item>

                      <div className="pt-[28px]">
                        <Button
                          type="text"
                          danger
                          icon={<MinusCircleOutlined />}
                          onClick={() => remove(name)}
                          className="hover:bg-red-50 rounded-lg w-10 h-10"
                          title="Xóa sản phẩm này"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Form.Item className="mt-4">
                <Button 
                  type="dashed" 
                  onClick={() => add()} 
                  block 
                  icon={<PlusOutlined />}
                  className="border-indigo-300 text-indigo-600 font-bold bg-indigo-50/50 hover:bg-indigo-100 transition-all rounded-xl mt-2"
                  size="large"
                >
                  Thêm sản phẩm Flash Sale
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
}
