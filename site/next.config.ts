import type { NextConfig } from "next";

// Стейджинг живёт по пути `/rundumshaus/` на сервере CEO, прод — в корне
// домена клиента. Если путь не объявлен и Next, ссылки на `/_next/...`
// уходят от корня и на стейджинге отдают 404 — стили и скрипты не грузятся.
// Переменная пуста в прод-сборке, поэтому прод не меняется вовсе.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
