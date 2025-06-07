// types/web3.storage.d.ts
declare module 'web3.storage' {
  export class Web3Storage {
    constructor(config: { token: string })
    put(files: File[], options?: Record<string, unknown>): Promise<string>
  }

  export class File extends Blob {
    constructor(bits: BlobPart[], name: string, options?: FilePropertyBag)
    name: string
  }
}
