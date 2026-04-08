import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Icon } from "@/components/icon";
import { Button } from "@/ui/button";
import { Switch } from "@/ui/switch";
import { Input } from "@/ui/input";
import { Badge } from "@/ui/badge";
import { Progress } from "@/ui/progress";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from "@/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";
import { aiChatApi } from "@/api/services/aiChatApi";
import type { AiChatSettings } from "@/api/services/aiChatApi";

// ============ Tab Buttons ============
const TABS = [
  { key: "settings", icon: "lucide:settings" },
  { key: "usage", icon: "lucide:bar-chart-3" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

// ============ Settings Tab ============
function SettingsTab() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["ai-chat-settings"],
    queryFn: () => aiChatApi.getSettings() as Promise<AiChatSettings>,
  });

  const { data: availableModels = [] } = useQuery({
    queryKey: ["ai-chat-models"],
    queryFn: () => aiChatApi.getModels(),
  });

  const form = useForm<AiChatSettings>({
    defaultValues: {
      isEnabled: true,
      maxTokensPerUserPerDay: 50000,
      maxMessagesPerUserPerDay: 100,
      model: "llama-3.3-70b-versatile",
    },
  });

  useEffect(() => {
    if (settings) {
      form.reset(settings as AiChatSettings);
    }
  }, [settings, form]);

  const updateMutation = useMutation({
    mutationFn: (data: Partial<AiChatSettings>) =>
      aiChatApi.updateSettings(data),
    onSuccess: () => {
      toast.success(t("aiChat.settings.updateSuccess"));
      queryClient.invalidateQueries({ queryKey: ["ai-chat-settings"] });
    },
    onError: () => toast.error(t("aiChat.settings.updateFail")),
  });

  const onSubmit = (values: any) => {
    const { _id, __v, createdAt, updatedAt, ...cleanValues } = values;
    updateMutation.mutate(cleanValues);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Icon icon="lucide:loader-2" size={32} className="animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Enable/Disable */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Icon icon="lucide:power" size={16} className="text-purple-500" />
              {t("aiChat.settings.statusTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="isEnabled"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <div>
                    <FormLabel>{t("aiChat.settings.enableLabel")}</FormLabel>
                    <FormDescription>
                      {t("aiChat.settings.enableDesc")}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Limits */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Icon icon="lucide:gauge" size={16} className="text-purple-500" />
              {t("aiChat.settings.limitsTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="maxMessagesPerUserPerDay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("aiChat.settings.maxMsgsLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    {t("aiChat.settings.maxMsgsDesc")}
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maxTokensPerUserPerDay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("aiChat.settings.maxTokensLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1000}
                      step={1000}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    {t("aiChat.settings.maxTokensDesc")}
                  </FormDescription>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Model */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Icon icon="lucide:sparkles" size={16} className="text-purple-500" />
              {t("aiChat.settings.modelTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("aiChat.settings.modelLabel")}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t("aiChat.settings.modelPlaceholder")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableModels.length > 0 ? (
                        availableModels.map((m) => {
                          let limitsText = "";
                          if (m.id.includes("70b") || m.id.includes("90b") || m.id.includes("deepseek"))
                            limitsText = "~100 messages/day";
                          else
                            limitsText = "~500 messages/day";

                          return (
                            <SelectItem key={m.id} value={m.id}>
                              {m.id} ({m.owned_by} • {limitsText})
                            </SelectItem>
                          );
                        })
                      ) : (
                        <>
                          <SelectItem value="llama-3.3-70b-versatile">Llama 3.3 70B ({t("aiChat.settings.defaultModel")})</SelectItem>
                          <SelectItem value="llama-3.1-8b-instant">Llama 3.1 8B ({t("aiChat.settings.defaultModel")})</SelectItem>
                          <SelectItem value="gemma2-9b-it">Gemma 2 9B ({t("aiChat.settings.defaultModel")})</SelectItem>
                          <SelectItem value="mixtral-8x7b-32768">Mixtral 8x7B ({t("aiChat.settings.defaultModel")})</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {t("aiChat.settings.modelDesc")}
                  </FormDescription>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Button
          type="submit"
          disabled={updateMutation.isPending}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
        >
          {updateMutation.isPending ? (
            <Icon icon="lucide:loader-2" size={16} className="animate-spin mr-2" />
          ) : (
            <Icon icon="lucide:save" size={16} className="mr-2" />
          )}
          {t("aiChat.settings.saveBtn")}
        </Button>
      </form>
    </Form>
  );
}

// ============ Usage Tab ============
function UsageTab() {
  const { t } = useTranslation();
  const { data = { list: [], totalLifetimeTokens: 0, totalLifetimeUsers: 0 }, isLoading } = useQuery({
    queryKey: ["ai-chat-user-stats"],
    queryFn: () => aiChatApi.getUserStats(),
    refetchInterval: 30000,
  });

  const stats = data.list;
  const lifetimeTokens = data.totalLifetimeTokens;
  const lifetimeUsers = data.totalLifetimeUsers;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Icon icon="lucide:loader-2" size={32} className="animate-spin text-purple-500" />
      </div>
    );
  }



  // Summary stats
  const totalUsers = stats.length;
  const totalMsgs = stats.reduce((sum, s) => sum + s.totalMessages, 0);
  const totalTkns = stats.reduce((sum, s) => sum + s.totalTokens, 0);
  const overLimitCount = stats.filter((s) => s.isOverLimit).length;

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Row 1: Users */}
        <Card>
          <CardContent className="pt-4 pb-3 px-4 text-center">
            <p className="text-2xl font-bold text-purple-600">{totalUsers}</p>
            <p className="text-xs text-muted-foreground mt-1">{t("aiChat.usage.users")}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
          <CardContent className="pt-4 pb-3 px-4 text-center">
            <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {lifetimeUsers}
            </p>
            <p className="text-xs font-medium text-purple-700 dark:text-purple-300 mt-1">
              {t("aiChat.usage.lifetimeUsers")}
            </p>
          </CardContent>
        </Card>
        {/* Row 2: Messages and Overview */}
        <Card>
          <CardContent className="pt-4 pb-3 px-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{totalMsgs}</p>
            <p className="text-xs text-muted-foreground mt-1">{t("aiChat.usage.messages")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 px-4 text-center">
            <p className="text-2xl font-bold text-indigo-600">{totalTkns.toLocaleString("vi-VN")}</p>
            <p className="text-xs text-muted-foreground mt-1">{t("aiChat.usage.tokens")}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20">
          <CardContent className="pt-4 pb-3 px-4 text-center">
            <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              {lifetimeTokens.toLocaleString("vi-VN")}
            </p>
            <p className="text-xs font-medium text-indigo-700 dark:text-indigo-300 mt-1">
              {t("aiChat.usage.lifetimeTokens")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 px-4 text-center">
            <p className={`text-2xl font-bold ${overLimitCount > 0 ? "text-red-500" : "text-green-500"}`}>
              {overLimitCount}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{t("aiChat.usage.overLimit")}</p>
          </CardContent>
        </Card>
      </div>

      {/* User Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Icon icon="lucide:users" size={16} className="text-purple-500" />
            {t("aiChat.usage.tableTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">{t("aiChat.usage.table.user")}</TableHead>
                <TableHead className="text-center">{t("aiChat.usage.table.messages")}</TableHead>
                <TableHead className="text-center">{t("aiChat.usage.table.tokens")}</TableHead>
                <TableHead className="text-center w-[140px]">{t("aiChat.usage.table.usageLevel")}</TableHead>
                <TableHead className="text-center">{t("aiChat.usage.table.status")}</TableHead>
                <TableHead className="text-right">{t("aiChat.usage.table.lastActive")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-3">
                        <Icon icon="lucide:users" size={24} className="text-purple-500" />
                      </div>
                      <p className="text-base font-semibold">{t("aiChat.usage.emptyTitle")}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t("aiChat.usage.emptyDesc")}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                stats.map((user) => {
                const msgPercent = Math.min(
                  Math.round((user.totalMessages / user.maxMessages) * 100),
                  100
                );

                return (
                  <TableRow key={user.userId} className={user.isOverLimit ? "bg-red-50/50 dark:bg-red-950/10" : ""}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-xs font-bold text-purple-600">
                            {user.name?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{user.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {user.totalMessages}/{user.maxMessages}
                    </TableCell>
                    <TableCell className="text-center text-sm">
                      {user.totalTokens.toLocaleString("vi-VN")}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center gap-2">
                        <Progress value={msgPercent} className="h-2 flex-1" />
                        <span className="text-xs text-muted-foreground w-8">{msgPercent}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {user.isOverLimit ? (
                        <Badge variant="destructive" className="text-xs">{t("aiChat.usage.table.outOfQuota")}</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          {t("aiChat.usage.table.normal")}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">
                      {new Date(user.lastActive).toLocaleTimeString()}
                    </TableCell>
                  </TableRow>
                );
              }))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// ============ Main Page ============
export default function AiChatSettingsPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabKey>("settings");

  return (
    <div className="bg-card text-card-foreground p-4 rounded-xl border shadow-sm">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
            <Icon icon="lucide:bot" size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">{t("aiChat.title")}</h1>
            <p className="text-sm text-muted-foreground">
              {t("aiChat.description")}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${
                activeTab === tab.key
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon icon={tab.icon} size={15} />
              {t(`aiChat.tabs.${tab.key}`)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "settings" ? <SettingsTab /> : <UsageTab />}
        </div>
      </div>
    </div>
  );
}
