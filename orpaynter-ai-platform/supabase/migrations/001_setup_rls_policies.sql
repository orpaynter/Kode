-- Enable Row Level Security on all tables
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE damage_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for leads table
-- Homeowners can only see their own leads
CREATE POLICY "Homeowners can view their own leads" ON leads
  FOR SELECT USING (auth.uid() = homeowner_id);

CREATE POLICY "Homeowners can create leads" ON leads
  FOR INSERT WITH CHECK (auth.uid() = homeowner_id);

CREATE POLICY "Homeowners can update their own leads" ON leads
  FOR UPDATE USING (auth.uid() = homeowner_id);

-- Contractors can view leads in their service areas
CREATE POLICY "Contractors can view leads in service areas" ON leads
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM contractors 
      WHERE contractors.user_id = auth.uid() 
      AND contractors.service_areas @> ARRAY[leads.location]
    )
  );

-- RLS Policies for contractors table
-- Users can view all contractors (public directory)
CREATE POLICY "Anyone can view contractors" ON contractors
  FOR SELECT USING (true);

-- Only the contractor can update their own profile
CREATE POLICY "Contractors can update own profile" ON contractors
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can create contractor profile" ON contractors
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for damage_assessments table
-- Only the homeowner who owns the assessment can view/modify it
CREATE POLICY "Homeowners can view own assessments" ON damage_assessments
  FOR SELECT USING (auth.uid() = homeowner_id);

CREATE POLICY "Homeowners can create assessments" ON damage_assessments
  FOR INSERT WITH CHECK (auth.uid() = homeowner_id);

CREATE POLICY "Homeowners can update own assessments" ON damage_assessments
  FOR UPDATE USING (auth.uid() = homeowner_id);

-- Contractors can view assessments for projects they're assigned to
CREATE POLICY "Contractors can view project assessments" ON damage_assessments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.assessment_id = damage_assessments.id 
      AND projects.contractor_id = (
        SELECT id FROM contractors WHERE user_id = auth.uid()
      )
    )
  );

-- RLS Policies for projects table
-- Homeowners can view their own projects
CREATE POLICY "Homeowners can view own projects" ON projects
  FOR SELECT USING (auth.uid() = homeowner_id);

CREATE POLICY "Homeowners can create projects" ON projects
  FOR INSERT WITH CHECK (auth.uid() = homeowner_id);

CREATE POLICY "Homeowners can update own projects" ON projects
  FOR UPDATE USING (auth.uid() = homeowner_id);

-- Contractors can view and update projects they're assigned to
CREATE POLICY "Contractors can view assigned projects" ON projects
  FOR SELECT USING (
    contractor_id = (
      SELECT id FROM contractors WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Contractors can update assigned projects" ON projects
  FOR UPDATE USING (
    contractor_id = (
      SELECT id FROM contractors WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for project_milestones table
-- Homeowners can view milestones for their projects
CREATE POLICY "Homeowners can view project milestones" ON project_milestones
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = project_milestones.project_id 
      AND projects.homeowner_id = auth.uid()
    )
  );

-- Contractors can view and update milestones for their projects
CREATE POLICY "Contractors can view assigned project milestones" ON project_milestones
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = project_milestones.project_id 
      AND projects.contractor_id = (
        SELECT id FROM contractors WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Contractors can update assigned project milestones" ON project_milestones
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = project_milestones.project_id 
      AND projects.contractor_id = (
        SELECT id FROM contractors WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Contractors can create project milestones" ON project_milestones
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = project_milestones.project_id 
      AND projects.contractor_id = (
        SELECT id FROM contractors WHERE user_id = auth.uid()
      )
    )
  );

-- RLS Policies for project_documents table
-- Homeowners can view documents for their projects
CREATE POLICY "Homeowners can view project documents" ON project_documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = project_documents.project_id 
      AND projects.homeowner_id = auth.uid()
    )
  );

-- Contractors can view and manage documents for their projects
CREATE POLICY "Contractors can view assigned project documents" ON project_documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = project_documents.project_id 
      AND projects.contractor_id = (
        SELECT id FROM contractors WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Contractors can upload project documents" ON project_documents
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = project_documents.project_id 
      AND projects.contractor_id = (
        SELECT id FROM contractors WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Contractors can update project documents" ON project_documents
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = project_documents.project_id 
      AND projects.contractor_id = (
        SELECT id FROM contractors WHERE user_id = auth.uid()
      )
    )
  );

-- RLS Policies for project_images table
-- Homeowners can view images for their projects
CREATE POLICY "Homeowners can view project images" ON project_images
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = project_images.project_id 
      AND projects.homeowner_id = auth.uid()
    )
  );

-- Contractors can view and manage images for their projects
CREATE POLICY "Contractors can view assigned project images" ON project_images
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = project_images.project_id 
      AND projects.contractor_id = (
        SELECT id FROM contractors WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Contractors can upload project images" ON project_images
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = project_images.project_id 
      AND projects.contractor_id = (
        SELECT id FROM contractors WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Contractors can update project images" ON project_images
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = project_images.project_id 
      AND projects.contractor_id = (
        SELECT id FROM contractors WHERE user_id = auth.uid()
      )
    )
  );

-- RLS Policies for notifications table
-- Users can only view their own notifications
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- System can create notifications for users
CREATE POLICY "System can create notifications" ON notifications
  FOR INSERT WITH CHECK (true);

-- RLS Policies for subscriptions table
-- Users can view their own subscriptions
CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create subscriptions" ON subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions" ON subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for subscription_plans table
-- Anyone can view subscription plans (public)
CREATE POLICY "Anyone can view subscription plans" ON subscription_plans
  FOR SELECT USING (true);

-- RLS Policies for user_profiles table
-- Users can view and update their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can create own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Grant permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant limited permissions to anonymous users
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON contractors TO anon;
GRANT SELECT ON subscription_plans TO anon;