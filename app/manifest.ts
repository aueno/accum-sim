import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: '積立シミュレーション',
        short_name: '積立シミュレーション',
        description: '資産運用・積立のシミュレーションアプリ',
        start_url: '/',
        display: 'standalone',
        background_color: '#0529e1',
        theme_color: '#0529e1',
        icons: [
            {
                src: '/icon.svg',
                sizes: 'any',
                type: 'image/svg+xml',
            }
        ]
    }
}