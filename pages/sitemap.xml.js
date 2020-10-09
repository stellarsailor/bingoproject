import React from 'react';
import { serverUrl } from '../lib/serverUrl'

const createSitemap = (bingos) => `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${bingos.map(({ id, lang }) => {
            return `
                <url>
                    <loc>${`https://selfbingo.com/${lang}/bingo/${id}`}</loc>
                </url>
            `;
        })
        .join('')}
    </urlset>
    `;

class Sitemap extends React.Component {
    static async getInitialProps({ res }) {
        const request = await fetch(serverUrl + '/api/bingos/sitemap');
        const bingos = await request.json();

        res.setHeader('Content-Type', 'text/xml');
        res.write(createSitemap(bingos));
        res.end();
    }
}

export default Sitemap;