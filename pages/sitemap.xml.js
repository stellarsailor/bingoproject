import React from 'react';
import { GetServerSideProps } from "next";
import { serverUrl } from '../lib/serverUrl'
import { appWithTranslation } from '../i18n'

const createSitemap = (bingos) => `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
            <loc>${`https://selfbingo.com/`}</loc>
        </url>
        <url>
            <loc>${`https://selfbingo.com/en/about`}</loc>
        </url>
        <url>
            <loc>${`https://selfbingo.com/ko/about`}</loc>
        </url>
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
//     static async getInitialProps({ res }) {
//         const request = await fetch(serverUrl + '/api/bingos/sitemap');
//         const bingos = await request.json();

//         res.setHeader('Content-Type', 'text/xml');
//         res.write(createSitemap(bingos));
//         res.end();
//     }
}

export default Sitemap;

export const getServerSideProps = async ({ res, req }) => {
    const request = await fetch(serverUrl + '/api/bingos/sitemap');
    const bingos = await request.json();

    res.setHeader('Content-Type', 'text/xml');
    res.write(createSitemap(bingos));
    res.end();

    return {
        props: {},
    };
} 