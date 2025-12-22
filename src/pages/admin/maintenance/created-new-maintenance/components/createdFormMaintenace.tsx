import { Form, Input, Select, DatePicker, Button, Space } from "antd";
import { Icon } from "@/components/icon";

import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import dayjs from "dayjs";
import { useMutation } from "@tanstack/react-query";
import { FullPageLoading } from "@/components/common/loading";
import { CreateMaintenanceDto, maintenanceApi, MaintenanceType } from "@/api/services/maintenanceApi";
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

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
        navigate("/maintenance");
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
      startTime: values.timeRange[0].toISOString(),
      endTime: values.timeRange[1].toISOString(),
    };

    createMaintenanceMutation.mutate(createData);
  };

  return (
    <>
      {createMaintenanceMutation.isPending && (
        <FullPageLoading
          message={t("maintenance.create-maintenance-loading")}
        />
      )}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="p-8"
        initialValues={{
          type: MaintenanceType.SYSTEM,
        }}
      >
        <Form.Item
          name="title"
          label={
            <span className="text-base font-semibold flex items-center gap-2">
              {t("maintenance.title")}
            </span>
          }
          rules={[
            {
              required: true,
              message: t("maintenance.title-required"),
            },
            { min: 3, message: t("maintenance.title-min-length") },
          ]}
        >
          <Input
            size="large"
            placeholder={t("maintenance.title-placeholder")}
            className="rounded-lg"
          />
        </Form.Item>

        <Form.Item
          name="description"
          label={
            <span className="text-base font-semibold flex items-center gap-2">
              {t("maintenance.description")}
            </span>
          }
        >
          <TextArea
            rows={4}
            placeholder={t("maintenance.description-placeholder")}
            className="rounded-lg"
            showCount
            maxLength={500}
          />
        </Form.Item>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Form.Item
            name="type"
            label={
              <span className="text-base font-semibold flex items-center gap-2">
                {t("maintenance.type")}
              </span>
            }
            rules={[
              {
                required: true,
                message: t("maintenance.type-required"),
              },
            ]}
          >
            <Select
              size="large"
              placeholder={t("maintenance.select-type")}
              className="rounded-lg"
            >
              <Option value={MaintenanceType.DATABASE}>
                <Space>
                  <Icon
                    icon="lucide:database"
                    className="w-4 h-4 text-purple-500"
                  />
                  {t("maintenance.type-database")}
                </Space>
              </Option>
              <Option value={MaintenanceType.SYSTEM}>
                <Space>
                  <Icon
                    icon="lucide:settings"
                    className="w-4 h-4 text-cyan-500"
                  />
                  {t("maintenance.type-system")}
                </Space>
              </Option>
              <Option value={MaintenanceType.NETWORK}>
                <Space>
                  <Icon
                    icon="lucide:network"
                    className="w-4 h-4 text-blue-500"
                  />
                  {t("maintenance.type-network")}
                </Space>
              </Option>
              <Option value={MaintenanceType.OTHER}>
                <Space>
                  <Icon
                    icon="lucide:more-horizontal"
                    className="w-4 h-4 text-gray-500"
                  />
                  {t("maintenance.type-other")}
                </Space>
              </Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="timeRange"
            label={
              <span className="text-base font-semibold flex items-center gap-2">
                {t("maintenance.time-range")}
              </span>
            }
            rules={[
              {
                required: true,
                message: t("maintenance.time-range-required"),
              },
            ]}
          >
            <RangePicker
              size="large"
              showTime={{ format: "HH:mm" }}
              format="DD/MM/YYYY HH:mm"
              placeholder={[
                t("maintenance.start-time"),
                t("maintenance.end-time"),
              ]}
              className="w-full rounded-lg"
              disabledDate={(current) => {
                return current && current < dayjs().startOf("day");
              }}
            />
          </Form.Item>
        </div>

        <div className="flex gap-4 pt-6 justify-end border-t mt-8">
          <Button
            danger
            size="large"
            onClick={() => navigate("/maintenance")}
            disabled={createMaintenanceMutation.isPending}
            icon={<Icon icon="lucide:x-circle" className="h-5 w-5" />}
          >
            {t("maintenance.cancel")}
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={createMaintenanceMutation.isPending}
            icon={<Icon icon="lucide:check-circle" className="h-5 w-5" />}
          >
            {t("maintenance.create-maintenance")}
          </Button>
        </div>
      </Form>
    </>
  );
}
