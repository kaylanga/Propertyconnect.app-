import { supabase } from '../lib/supabase';
import { hash, compare } from 'bcryptjs';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

export class SecurityService {
  private static readonly ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!;
  private static readonly ALGORITHM = 'aes-256-gcm';

  // Implement:
  // 1. Document verification
  // 2. Property ownership verification
  // 3. Fraud prevention
  // 4. Secure payments
  // 5. User verification

  // Two-Factor Authentication
  static async enable2FA(userId: string): Promise<string> {
    const secret = randomBytes(20).toString('hex');
    await supabase
      .from('user_security')
      .upsert({ user_id: userId, two_factor_secret: secret });
    return secret;
  }

  // Secure Document Storage
  static async encryptDocument(document: Buffer): Promise<{ encryptedData: Buffer; iv: Buffer }> {
    const iv = randomBytes(16);
    const cipher = createCipheriv(this.ALGORITHM, this.ENCRYPTION_KEY, iv);
    const encryptedData = Buffer.concat([cipher.update(document), cipher.final()]);
    return { encryptedData, iv };
  }

  // Activity Logging
  static async logActivity(userId: string, action: string, metadata: any) {
    await supabase.from('security_logs').insert({
      user_id: userId,
      action,
      metadata,
      ip_address: metadata.ip,
      user_agent: metadata.userAgent
    });
  }

  // Rate Limiting
  static async checkRateLimit(userId: string, action: string): Promise<boolean> {
    const { count } = await supabase
      .from('security_logs')
      .select('count', { count: 'exact' })
      .eq('user_id', userId)
      .eq('action', action)
      .gte('created_at', new Date(Date.now() - 3600000).toISOString());
    
    return count < 100; // Limit to 100 actions per hour
  }

  // Session Management
  static async validateSession(sessionId: string): Promise<boolean> {
    const { data: session } = await supabase
      .from('user_sessions')
      .select('expires_at')
      .eq('id', sessionId)
      .single();

    return session && new Date(session.expires_at) > new Date();
  }
} 