import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-sm flex-col items-center gap-6 p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          智能家庭保单管家
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          系统正在初始化，准备进入【战役 2: 鉴权页】...
        </p>
      </main>
    </div>
  );
}
