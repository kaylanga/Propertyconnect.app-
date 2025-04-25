-- System logs table
CREATE TABLE system_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    level TEXT NOT NULL,
    message TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    action TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User activity tracking
CREATE TABLE user_activity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- API metrics tracking
CREATE TABLE api_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    endpoint TEXT NOT NULL,
    response_time INTEGER NOT NULL,
    status INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Failed login attempts tracking
CREATE TABLE login_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL,
    ip_address TEXT NOT NULL,
    attempt_count INTEGER DEFAULT 1,
    locked_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_system_logs_level ON system_logs(level);
CREATE INDEX idx_system_logs_user_id ON system_logs(user_id);
CREATE INDEX idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX idx_api_metrics_endpoint ON api_metrics(endpoint);
CREATE INDEX idx_login_attempts_email ON login_attempts(email);

-- Add RLS policies
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;

-- Only allow admins to view system logs
CREATE POLICY "Admin can view system logs"
    ON system_logs FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM user_profiles
        WHERE id = auth.uid() AND user_type = 'admin'
    ));

-- Users can view their own activity
CREATE POLICY "Users can view their own activity"
    ON user_activity FOR SELECT
    USING (user_id = auth.uid());

-- Only admins can view API metrics
CREATE POLICY "Admin can view API metrics"
    ON api_metrics FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM user_profiles
        WHERE id = auth.uid() AND user_type = 'admin'
    )); 