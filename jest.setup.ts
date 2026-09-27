/* eslint-disable @typescript-eslint/no-explicit-any */
import '@testing-library/jest-dom';

import { webcrypto } from 'crypto';
import { TextDecoder, TextEncoder } from 'util';
import { TransformStream, ReadableStream, WritableStream } from 'stream/web';
globalThis.TextEncoder = TextEncoder;
globalThis.TextDecoder = TextDecoder;
if (!globalThis.crypto) {
  (globalThis as any).crypto = webcrypto;
}
if (!globalThis.TransformStream) {
  (globalThis as any).TransformStream = TransformStream;
}
if (!globalThis.ReadableStream) {
  (globalThis as any).ReadableStream = ReadableStream;
}
if (!globalThis.WritableStream) {
  (globalThis as any).WritableStream = WritableStream;
}
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

expect.extend({});
