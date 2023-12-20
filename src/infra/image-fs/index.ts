import * as fs from 'fs'
import path from 'node:path'

export interface ImageFileSystem {
  read(filename: string): Promise<Buffer>

  write(filename: string, buffer: Buffer): Promise<void>
}

export function makeImageFileSystem(): ImageFileSystem {
  return {
    read(filename: string) {
      return new Promise((resolve, reject) => {
        fs.readFile(path.resolve('images', filename), (err, data) => {
          if (err) {
            reject(err)
          }
          resolve(data)
        })
      })
    },
    write(filename: string, buffer: Buffer) {
      return new Promise((resolve, reject) => {
        fs.writeFile(`${path.resolve('images')}/${filename}`, buffer, (err) => {
          if (err) {
            reject(err)
          }
          resolve()
        })
      })
    },
  }
}
