export default async function handler(req: any, res: any) {
  try {
    // Check database connection
    const { data, error } = await supabase
      .from('health_check')
      .select('count');

    if (error) throw error;

    res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ status: 'unhealthy', error: error.message });
  }
} 