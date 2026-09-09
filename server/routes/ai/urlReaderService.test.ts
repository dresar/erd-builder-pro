import { describe, it, expect } from 'vitest';
import { readUrlToMarkdown } from './urlReaderService';

describe('urlReaderService', () => {
  it('rejects invalid protocol and localhost / private IP', async () => {
    await expect(readUrlToMarkdown('ftp://example.com')).rejects.toThrow('Hanya protokol HTTP dan HTTPS yang didukung.');
    await expect(readUrlToMarkdown('http://localhost:3000')).rejects.toThrow('Akses ke jaringan lokal atau privat diblokir');
    await expect(readUrlToMarkdown('http://127.0.0.1:8080')).rejects.toThrow('Akses ke jaringan lokal atau privat diblokir');
    await expect(readUrlToMarkdown('http://192.168.1.1')).rejects.toThrow('Akses ke jaringan lokal atau privat diblokir');
    await expect(readUrlToMarkdown('http://10.0.0.1')).rejects.toThrow('Akses ke jaringan lokal atau privat diblokir');
    await expect(readUrlToMarkdown('not-a-url')).rejects.toThrow('Format URL tidak valid');
  });
});
