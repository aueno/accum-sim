import type { MetadataRoute } from 'next'
export const dynamic = "force-static";
export default function manifest(): MetadataRoute.Manifest {
    return {
        name: '資産形成シミュレーション',
        short_name: '資産形成シミュレーション',
        description: '資産運用・積立のシミュレーションアプリ',
        start_url: '/accum-sim/',
        scope: "/accum-sim/",
        display: 'standalone',
        background_color: '#0529e1',
        theme_color: '#0529e1',
        icons: [
            {
                src: '/accum-sim/icon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/accum-sim/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ]
    }
}
