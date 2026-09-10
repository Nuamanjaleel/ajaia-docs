import { describe, it, expect } from 'vitest';
import { parseUploadedFile } from './fileParser';

describe('fileParser utility', () => {
  it('parses markdown headings and bold text correctly', async () => {
    const mockFile = new File(['# Title\n**Bold text**'], 'test.md', { type: 'text/markdown' });
    const result = await parseUploadedFile(mockFile);

    expect(result.title).toBe('test');
    expect(result.content).toContain('<h1>Title</h1>');
    expect(result.content).toContain('<strong>Bold text</strong>');
  });

  it('throws an error for unsupported file extensions', async () => {
    const mockFile = new File(['data'], 'test.pdf', { type: 'application/pdf' });
    await expect(parseUploadedFile(mockFile)).rejects.toThrow('Unsupported file type');
  });
});