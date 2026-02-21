import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, createDecipheriv, randomBytes, timingSafeEqual } from 'crypto';

@Injectable()
export class CryptoService implements OnModuleInit {
  private key!: Buffer;

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    const raw = this.config.getOrThrow<string>('TOKEN_ENC_KEY');
    this.key = this.parseKey(raw);
  }

  encrypt(plain: string): string {
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', this.key, iv);
    const ciphertext = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return `${iv.toString('base64')}:${ciphertext.toString('base64')}:${tag.toString('base64')}`;
  }

  decrypt(payload: string): string {
    const [ivB64, ctB64, tagB64] = payload.split(':');
    if (!ivB64 || !ctB64 || !tagB64) {
      throw new Error('Invalid encrypted payload format');
    }

    const iv = Buffer.from(ivB64, 'base64');
    const ciphertext = Buffer.from(ctB64, 'base64');
    const tag = Buffer.from(tagB64, 'base64');

    const decipher = createDecipheriv('aes-256-gcm', this.key, iv);
    decipher.setAuthTag(tag);
    const out = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    return out.toString('utf8');
  }

  private parseKey(raw: string): Buffer {
    // 64-char hex
    if (/^[0-9a-fA-F]{64}$/.test(raw)) {
      return Buffer.from(raw, 'hex');
    }

    // 32-byte base64
    const b64 = Buffer.from(raw, 'base64');
    if (b64.length === 32 && timingSafeEqual(Buffer.from(raw, 'base64'), b64)) {
      return b64;
    }

    throw new Error('Invalid TOKEN_ENC_KEY. Must be 64-char hex or base64-encoded 32-byte key.');
  }
}
