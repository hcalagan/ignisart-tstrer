import { Web3Storage, File as Web3File } from 'web3.storage'

function getAccessToken(): string {
  const token = process.env.WEB3_STORAGE_TOKEN
  if (!token) {
    throw new Error('WEB3_STORAGE_TOKEN tidak ditemukan di .env')
  }
  return token
}

function makeStorageClient(): Web3Storage {
  return new Web3Storage({ token: getAccessToken() })
}

// Upload File atau Blob ke IPFS
export async function uploadToIPFS(file: File | Blob): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const name = file instanceof File && file.name ? file.name : 'file.dat'
  const blob = new Blob([arrayBuffer], { type: file.type || 'application/octet-stream' })
  const web3File = new Web3File([blob], name)
  const client = makeStorageClient()
  const cid = await client.put([web3File])
  return `ipfs://${cid}`
}

// Upload JSON ke IPFS
export async function uploadJSONToIPFS(data: object): Promise<string> {
  const json = JSON.stringify(data)
  const blob = new Blob([json], { type: 'application/json' })
  const web3File = new Web3File([blob], 'data.json')
  const client = makeStorageClient()
  const cid = await client.put([web3File])
  return `ipfs://${cid}`
}
