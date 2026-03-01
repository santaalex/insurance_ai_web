"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { request } from "@/lib/request";
import { ShieldCheck, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { token, setAuth } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  // Fix hydration mismatch
  useEffect(() => {
    setMounted(true);
    // If the user already has a token in their local storage, redirect immediately
    if (useAuthStore.getState().token) {
      router.push("/dashboard");
    }
  }, [router]);

  if (!mounted) return null; // Avoid rendering until hydration completes

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 11) {
      toast.error("请输入有效的 11 位手机号码");
      return;
    }

    setLoading(true);
    try {
      // Direct call to FastAPI login backend (proxied via Next.js rewrites)
      const res = await request.post("/auth/login", {
        phone: phone,
        code: "123456",
      });

      if (res.data.access_token) {
        setAuth(res.data.access_token, phone);
        toast.success("验证成功", {
          description: "正在进入家庭保单总控中心...",
        });
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      }
    } catch (error) {
      toast.error("登录异常", {
        description: "请检查网络或确认手机号是否在系统白名单内",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
      <Card className="w-full max-w-sm shadow-xl border-zinc-200 dark:border-zinc-800">
        <CardHeader className="space-y-2 pb-6 text-center">
          <div className="flex justify-center mb-2">
            <div className="p-3 bg-zinc-900 dark:bg-zinc-100 rounded-full text-white dark:text-black">
              <ShieldCheck className="w-8 h-8" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            家庭保单管家
          </CardTitle>
          <CardDescription className="text-zinc-500">
            仅限受邀家庭主理人登录访问
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">主理人手机号</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="请输入 11 位手机号码"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={11}
                className="h-11"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code" className="text-zinc-500">
                短信验证码 (开发阶段默认为 123456)
              </Label>
              <Input
                id="code"
                type="text"
                placeholder="123456"
                disabled
                className="h-11 bg-zinc-100 text-zinc-400 dark:bg-zinc-900"
                value="123456"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-11 text-base font-medium mt-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  验证中...
                </>
              ) : (
                "安全登录"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t py-4 text-xs text-zinc-500">
          受明道云 HAP V3 企业级数据安全协议保护
        </CardFooter>
      </Card>
    </div>
  );
}
