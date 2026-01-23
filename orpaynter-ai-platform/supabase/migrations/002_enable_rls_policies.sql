-- Enable Row Level Security (RLS) for all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE cost_estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Users table policies
-- Users can view and update their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Allow users to insert their own profile during registration
CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Contractors can view other users for project collaboration
CREATE POLICY "Contractors can view users for collaboration" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = auth.uid() 
      AND u.role = 'contractor'
    )
  );

-- Assessments table policies
-- Users can view and manage their own assessments
CREATE POLICY "Users can view own assessments" ON assessments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own assessments" ON assessments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own assessments" ON assessments
  FOR UPDATE USING (auth.uid() = user_id);

-- Contractors can view assessments for projects they're involved in
CREATE POLICY "Contractors can view project assessments" ON assessments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = auth.uid() 
      AND u.role = 'contractor'
    ) AND EXISTS (
      SELECT 1 FROM projects p 
      WHERE p.assessment_id = assessments.id
    )
  );

-- Projects table policies
-- Users can view and manage their own projects
CREATE POLICY "Users can view own projects" ON projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects" ON projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON projects
  FOR UPDATE USING (auth.uid() = user_id);

-- Contractors can view projects they're assigned to
CREATE POLICY "Contractors can view assigned projects" ON projects
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM project_tasks pt
      JOIN users u ON u.id = auth.uid()
      WHERE pt.project_id = projects.id 
      AND pt.assigned_to = auth.uid()
      AND u.role = 'contractor'
    )
  );

-- AI Reports table policies
-- Users can view AI reports for their assessments
CREATE POLICY "Users can view own assessment reports" ON ai_reports
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM assessments a 
      WHERE a.id = ai_reports.assessment_id 
      AND a.user_id = auth.uid()
    )
  );

-- System can insert AI reports
CREATE POLICY "System can insert AI reports" ON ai_reports
  FOR INSERT WITH CHECK (true);

-- Contractors can view AI reports for projects they're involved in
CREATE POLICY "Contractors can view project AI reports" ON ai_reports
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = auth.uid() 
      AND u.role = 'contractor'
    ) AND EXISTS (
      SELECT 1 FROM projects p 
      JOIN assessments a ON a.id = p.assessment_id
      WHERE a.id = ai_reports.assessment_id
    )
  );

-- Project Tasks table policies
-- Users can view tasks for their projects
CREATE POLICY "Users can view own project tasks" ON project_tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects p 
      WHERE p.id = project_tasks.project_id 
      AND p.user_id = auth.uid()
    )
  );

-- Project owners can manage tasks
CREATE POLICY "Project owners can manage tasks" ON project_tasks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM projects p 
      WHERE p.id = project_tasks.project_id 
      AND p.user_id = auth.uid()
    )
  );

-- Assigned contractors can view and update their tasks
CREATE POLICY "Contractors can view assigned tasks" ON project_tasks
  FOR SELECT USING (auth.uid() = assigned_to);

CREATE POLICY "Contractors can update assigned tasks" ON project_tasks
  FOR UPDATE USING (
    auth.uid() = assigned_to AND 
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = auth.uid() 
      AND u.role = 'contractor'
    )
  );

-- Cost Estimates table policies
-- Users can view estimates for their projects
CREATE POLICY "Users can view own project estimates" ON cost_estimates
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects p 
      WHERE p.id = cost_estimates.project_id 
      AND p.user_id = auth.uid()
    )
  );

-- Contractors can create and manage estimates for assigned projects
CREATE POLICY "Contractors can manage project estimates" ON cost_estimates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = auth.uid() 
      AND u.role = 'contractor'
    ) AND EXISTS (
      SELECT 1 FROM project_tasks pt
      WHERE pt.project_id = cost_estimates.project_id 
      AND pt.assigned_to = auth.uid()
    )
  );

-- Subscriptions table policies
-- Users can view and manage their own subscriptions
CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions" ON subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions" ON subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Grant necessary permissions to authenticated users
GRANT SELECT, INSERT, UPDATE ON users TO authenticated;
GRANT SELECT, INSERT, UPDATE ON assessments TO authenticated;
GRANT SELECT, INSERT, UPDATE ON projects TO authenticated;
GRANT SELECT, INSERT ON ai_reports TO authenticated;
GRANT SELECT, INSERT, UPDATE ON project_tasks TO authenticated;
GRANT SELECT, INSERT, UPDATE ON cost_estimates TO authenticated;
GRANT SELECT, INSERT, UPDATE ON subscriptions TO authenticated;

-- Grant basic read access to anonymous users for public data
GRANT SELECT ON users TO anon;

-- Create function to handle user creation trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'role', 'homeowner')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();