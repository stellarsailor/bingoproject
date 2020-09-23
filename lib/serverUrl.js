const dev = process.env.NODE_ENV !== 'production';

export const serverUrl = dev ? 'http://192.168.0.108:3000' : 'https://selfbingo.com';