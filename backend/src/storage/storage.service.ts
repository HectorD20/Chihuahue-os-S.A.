import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { extname } from 'path';

@Injectable()
export class StorageService {
  private readonly s3Client: S3Client;
  private readonly bucket: string;
  private readonly endpointUrl: string;

  constructor() {
    this.bucket = process.env.MINIO_BUCKET ?? 'identificaciones';
    this.endpointUrl = this.resolveEndpointUrl();

    this.s3Client = new S3Client({
      region: 'us-east-1',
      endpoint: this.endpointUrl,
      credentials: {
        accessKeyId: process.env.MINIO_ACCESS_KEY ?? '',
        secretAccessKey: process.env.MINIO_SECRET_KEY ?? '',
      },
      forcePathStyle: true,
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const extension =
      extname(file.originalname).toLowerCase() ||
      this.extensionFromMime(file.mimetype);
    const key = `id-${randomUUID()}${extension}`;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return `${this.endpointUrl}/${this.bucket}/${key}`;
  }

  private resolveEndpointUrl(): string {
    const endpoint = process.env.MINIO_ENDPOINT ?? 'localhost';

    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      return endpoint.replace(/\/$/, '');
    }

    const useSsl = process.env.MINIO_USE_SSL === 'true';
    const port = process.env.MINIO_PORT ?? '9000';
    const protocol = useSsl ? 'https' : 'http';

    return `${protocol}://${endpoint}:${port}`;
  }

  private extensionFromMime(mimetype: string): string {
    const mimeToExtension: Record<string, string> = {
      'application/pdf': '.pdf',
      'image/png': '.png',
      'image/jpeg': '.jpg',
    };

    return mimeToExtension[mimetype] ?? '';
  }
}
