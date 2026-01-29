import { Form, Input, Select, DatePicker, Button, Space, Row, Col, ConfigProvider } from "antd";
import { Icon } from "@/components/icon";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import dayjs from "dayjs";
import { useMutation } from "@tanstack/react-query";
import { FullPageLoading } from "@/components/common/loading";
import { CreateMaintenanceDto, maintenanceApi, MaintenanceType } from "@/api/services/maintenanceApi";
import { Badge } from "@/ui/badge";
const { Option } = Select;
const { TextArea } = Input;

export default function CreatedFormMaintenace() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const createMaintenanceMutation = useMutation({
    mutationFn: maintenanceApi.create,
    onSuccess: (res) => {
      if (res.data.success) {
        toast.success(t("maintenance.create-success"));
        form.resetFields();
        navigate("/admin/maintenance");
      } else {
        toast.error(res.data.message);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = async (values: any) => {
    const createData: CreateMaintenanceDto = {
      title: values.title,
      description: values.description,
      type: values.type,
      startTime: values.startTime.toISOString(),
      endTime: values.endTime.toISOString(),
    };
    createMaintenanceMutation.mutate(createData);
  };

  // Tính năng chọn nhanh (Presets)
  const timePresets = [
    { label: '1 Giờ tới', value: [dayjs().add(1, 'minute'), dayjs().add(1, 'hour').add(1, 'minute')] },
    { label: 'Ngày mai', value: [dayjs().add(1, 'day').startOf('day'), dayjs().add(1, 'day').endOf('day')] },
    { label: 'Cuối tuần', value: [dayjs().endOf('week').startOf('day'), dayjs().endOf('week').endOf('day')] },
  ];

  const applyPreset = (start: dayjs.Dayjs, end: dayjs.Dayjs) => {
    form.setFieldsValue({ startTime: start, endTime: end });
  };

  return (
    <ConfigProvider 
      theme={{
        token: {
          borderRadius: 12
        },
      }}
    >
      <div className="transition-colors duration-300">
        {createMaintenanceMutation.isPending && (
          <FullPageLoading message={t("maintenance.create-maintenance-loading")} />
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="space-y-6"
          initialValues={{
            type: MaintenanceType.SYSTEM,
            startTime: dayjs().add(15, 'minute'),
            endTime: dayjs().add(2, 'hour'),
          }}
        >
          <div className="border border-border bg-muted/40 rounded-[2rem] p-4 shadow-sm">
            <Form.Item
              name="title"
              label={<span className="font-bold">{t("maintenance.title")}</span>}
              rules={[{ required: true, message: t("maintenance.title-required") }]}
            >
              <Input
                size="large"
                placeholder={t("maintenance.title-placeholder")}
              />
            </Form.Item>

            <Form.Item
              name="type"
              label={<span className="font-bold">{t("maintenance.type")}</span>}
              rules={[{ required: true }]}
            >
              <Select size="large" className="w-full rounded-xl h-12">
                <Option value={MaintenanceType.DATABASE}>
                  <Space>{t("maintenance.type-database")}</Space>
                </Option>
                <Option value={MaintenanceType.SYSTEM}>
                  <Space>{t("maintenance.type-system")}</Space>
                </Option>
                <Option value={MaintenanceType.NETWORK}>
                  <Space>{t("maintenance.type-network")}</Space>
                </Option>
                <Option value={MaintenanceType.OTHER}>
                  <Space>{t("maintenance.type-other")}</Space>
                </Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="description"
              label={<span className="font-bold">{t("maintenance.description")}</span>}
            >
              <TextArea
                rows={4}
                placeholder={t("maintenance.description-placeholder")}
                className="rounded-xl p-4"
                showCount
                maxLength={500}
              />
            </Form.Item>
          </div>

          <div className="border border-border bg-muted/40 rounded-[2rem] p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2 text-foreground">
                <Icon icon="lucide:calendar-clock" className="text-primary" />
                {t("maintenance.time-config", "Cấu hình thời gian")}
              </h3>
              
              <div className="flex gap-2">
                {timePresets.map((preset, idx) => (
                  <Badge
                    key={idx}
                    variant="info"
                    className="cursor-pointer hover:opacity-80 transition-all active:scale-95 select-none"
                    onClick={(e) => {
                      e.preventDefault(); 
                      applyPreset(preset.value[0], preset.value[1]);
                    }}
                  >
                    {preset.label}
                  </Badge>
                ))}
              </div>
            </div>

            <Row gutter={[6, 6]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="startTime"
                  label={<span className="text-xs font-bold uppercase tracking-wider text-foreground">{t("maintenance.start-time")}</span>}
                  rules={[{ required: true }]}
                >
                  <DatePicker
                    showTime
                    size="large"
                    format="DD/MM/YYYY HH:mm"
                    className="w-full"
                    placeholder="Chọn ngày bắt đầu"
                    disabledDate={(current) => current && current < dayjs().startOf("day")}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="endTime"
                  label={<span className="text-xs font-bold uppercase tracking-wider text-foreground">{t("maintenance.end-time")}</span>}
                  rules={[
                    { required: true },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('startTime') < value) return Promise.resolve();
                        return Promise.reject(new Error(t("maintenance.end-time-after-start", "Phải sau bắt đầu")));
                      },
                    }),
                  ]}
                >
                  <DatePicker
                    size="large"
                    showTime
                    format="DD/MM/YYYY HH:mm"
                    className="w-full"
                    placeholder="Chọn ngày kết thúc"
                    disabledDate={(current) => current && current < dayjs().startOf("day")}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4">
            <Button
              size="large"
              type="text"
              color="danger" variant="outlined"
              onClick={() => navigate("/admin/maintenance")}
              disabled={createMaintenanceMutation.isPending}
            >
              {t("maintenance.cancel")}
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={createMaintenanceMutation.isPending}
            >
              {t("maintenance.create-maintenance")}
            </Button>
          </div>
        </Form>
      </div>
    </ConfigProvider>
  );
}