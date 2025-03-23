import '@testing-library/jest-dom';

class MockTextEncoder {
  encode(input?: string): Uint8Array {
    return new Uint8Array(Buffer.from(input || ''));
  }
}

class MockTextDecoder {
  decode(input?: Uint8Array): string {
    return input ? Buffer.from(input).toString() : '';
  }
}

Object.defineProperty(global, 'TextEncoder', {
  value: MockTextEncoder
});

Object.defineProperty(global, 'TextDecoder', {
  value: MockTextDecoder
}); 