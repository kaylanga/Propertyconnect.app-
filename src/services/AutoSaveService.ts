import { supabase } from '../lib/supabase';
import { LoggingService } from './LoggingService';

class AutoSaveService {
  private saveInterval: NodeJS.Timeout | null = null;
  private pendingChanges: Map<string, any> = new Map();

  startAutoSave(intervalMs: number = 5000) {
    if (this.saveInterval) {
      clearInterval(this.saveInterval);
    }

    this.saveInterval = setInterval(async () => {
      await this.saveChanges();
    }, intervalMs);
  }

  async trackChange(key: string, data: any) {
    this.pendingChanges.set(key, data);
    await LoggingService.log({
      level: 'info',
      message: `Change tracked: ${key}`,
      metadata: { data }
    });
  }

  private async saveChanges() {
    if (this.pendingChanges.size === 0) return;

    try {
      for (const [key, data] of this.pendingChanges.entries()) {
        const [table, id] = key.split(':');
        
        const { error } = await supabase
          .from(table)
          .upsert(data);

        if (error) throw error;
      }

      this.pendingChanges.clear();
      
      await LoggingService.log({
        level: 'info',
        message: 'Auto-save completed successfully'
      });
    } catch (error) {
      await LoggingService.log({
        level: 'error',
        message: 'Auto-save failed',
        metadata: { error }
      });
    }
  }

  stopAutoSave() {
    if (this.saveInterval) {
      clearInterval(this.saveInterval);
      this.saveInterval = null;
    }
  }
}

export const autoSaveService = new AutoSaveService(); 