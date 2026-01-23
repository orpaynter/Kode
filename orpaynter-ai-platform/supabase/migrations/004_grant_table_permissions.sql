-- Grant permissions to anon and authenticated roles for all tables
-- This ensures that the frontend can access the database properly

-- Grant SELECT permissions to anon role (for public data)
GRANT SELECT ON plans TO anon;
GRANT SELECT ON subscription_plans TO anon;
GRANT SELECT ON orpaynter_plans TO anon;
GRANT SELECT ON contractors TO anon; -- For viewing verified contractors

-- Grant full permissions to authenticated role
GRANT ALL PRIVILEGES ON leads TO authenticated;
GRANT ALL PRIVILEGES ON contractors TO authenticated;
GRANT ALL PRIVILEGES ON damage_assessments TO authenticated;
GRANT ALL PRIVILEGES ON appointments TO authenticated;
GRANT ALL PRIVILEGES ON chat_sessions TO authenticated;
GRANT ALL PRIVILEGES ON analytics TO authenticated;
GRANT ALL PRIVILEGES ON profiles TO authenticated;
GRANT ALL PRIVILEGES ON projects TO authenticated;
GRANT ALL PRIVILEGES ON referrals TO authenticated;
GRANT ALL PRIVILEGES ON analytics_events TO authenticated;
GRANT ALL PRIVILEGES ON plans TO authenticated;
GRANT ALL PRIVILEGES ON subscriptions TO authenticated;
GRANT ALL PRIVILEGES ON orpaynter_plans TO authenticated;
GRANT ALL PRIVILEGES ON orpaynter_subscriptions TO authenticated;
GRANT ALL PRIVILEGES ON chat_conversations TO authenticated;
GRANT ALL PRIVILEGES ON chat_messages TO authenticated;
GRANT ALL PRIVILEGES ON roof_assessments TO authenticated;
GRANT ALL PRIVILEGES ON qualified_leads TO authenticated;
GRANT ALL PRIVILEGES ON lead_scoring_events TO authenticated;
GRANT ALL PRIVILEGES ON users TO authenticated;
GRANT ALL PRIVILEGES ON assessments TO authenticated;
GRANT ALL PRIVILEGES ON ai_reports TO authenticated;
GRANT ALL PRIVILEGES ON project_tasks TO authenticated;
GRANT ALL PRIVILEGES ON cost_estimates TO authenticated;
GRANT ALL PRIVILEGES ON insurance_claims TO authenticated;
GRANT ALL PRIVILEGES ON fraud_alerts TO authenticated;
GRANT ALL PRIVILEGES ON support_tickets TO authenticated;
GRANT ALL PRIVILEGES ON subscription_plans TO authenticated;

-- Grant usage on sequences (needed for INSERT operations)
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Grant execute permissions on functions
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon;