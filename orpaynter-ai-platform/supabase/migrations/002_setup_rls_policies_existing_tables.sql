-- Enable Row Level Security (RLS) on all existing tables
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE damage_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE orpaynter_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE orpaynter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE roof_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE qualified_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_scoring_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE cost_estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurance_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE fraud_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

-- RLS Policies for leads table
CREATE POLICY "Homeowners can view their own leads" ON leads
  FOR SELECT USING (auth.uid() = homeowner_id);

CREATE POLICY "Contractors can view leads in their service areas" ON leads
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM contractors 
      WHERE contractors.user_id = auth.uid() 
      AND contractors.service_areas @> ARRAY[leads.location]
    )
  );

CREATE POLICY "Homeowners can create their own leads" ON leads
  FOR INSERT WITH CHECK (auth.uid() = homeowner_id);

CREATE POLICY "Homeowners can update their own leads" ON leads
  FOR UPDATE USING (auth.uid() = homeowner_id);

-- RLS Policies for contractors table
CREATE POLICY "Contractors can view their own profile" ON contractors
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Contractors can update their own profile" ON contractors
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view verified contractors" ON contractors
  FOR SELECT USING (verified = true);

-- RLS Policies for projects table
CREATE POLICY "Homeowners can view their own projects" ON projects
  FOR SELECT USING (auth.uid() = homeowner_id);

CREATE POLICY "Contractors can view their assigned projects" ON projects
  FOR SELECT USING (auth.uid() = contractor_id);

CREATE POLICY "Project participants can update projects" ON projects
  FOR UPDATE USING (auth.uid() = homeowner_id OR auth.uid() = contractor_id);

-- RLS Policies for assessments table
CREATE POLICY "Users can view their own assessments" ON assessments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own assessments" ON assessments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assessments" ON assessments
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for damage_assessments table
CREATE POLICY "Users can view their own damage assessments" ON damage_assessments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own damage assessments" ON damage_assessments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for appointments table
CREATE POLICY "Homeowners can view their own appointments" ON appointments
  FOR SELECT USING (auth.uid() = homeowner_id);

CREATE POLICY "Contractors can view their own appointments" ON appointments
  FOR SELECT USING (auth.uid() = contractor_id);

CREATE POLICY "Appointment participants can update appointments" ON appointments
  FOR UPDATE USING (auth.uid() = homeowner_id OR auth.uid() = contractor_id);

-- RLS Policies for chat_conversations table
CREATE POLICY "Users can view their own conversations" ON chat_conversations
  FOR SELECT USING (auth.uid() = homeowner_id OR auth.uid() = contractor_id);

CREATE POLICY "Users can create conversations they participate in" ON chat_conversations
  FOR INSERT WITH CHECK (auth.uid() = homeowner_id OR auth.uid() = contractor_id);

-- RLS Policies for chat_messages table
CREATE POLICY "Users can view messages in their conversations" ON chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chat_conversations 
      WHERE chat_conversations.id = chat_messages.conversation_id 
      AND (chat_conversations.homeowner_id = auth.uid() OR chat_conversations.contractor_id = auth.uid())
    )
  );

CREATE POLICY "Users can send messages in their conversations" ON chat_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_conversations 
      WHERE chat_conversations.id = chat_messages.conversation_id 
      AND (chat_conversations.homeowner_id = auth.uid() OR chat_conversations.contractor_id = auth.uid())
    )
  );

-- RLS Policies for profiles table
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for subscriptions table
CREATE POLICY "Users can view their own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own subscriptions" ON subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for support_tickets table
CREATE POLICY "Users can view their own support tickets" ON support_tickets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own support tickets" ON support_tickets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own support tickets" ON support_tickets
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for ai_reports table
CREATE POLICY "Users can view their own AI reports" ON ai_reports
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own AI reports" ON ai_reports
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for cost_estimates table
CREATE POLICY "Project participants can view cost estimates" ON cost_estimates
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = cost_estimates.project_id 
      AND (projects.homeowner_id = auth.uid() OR projects.contractor_id = auth.uid())
    )
  );

-- RLS Policies for insurance_claims table
CREATE POLICY "Users can view their own insurance claims" ON insurance_claims
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own insurance claims" ON insurance_claims
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Public read access for plans and subscription_plans
CREATE POLICY "Anyone can view plans" ON plans FOR SELECT USING (true);
CREATE POLICY "Anyone can view subscription plans" ON subscription_plans FOR SELECT USING (true);
CREATE POLICY "Anyone can view orpaynter plans" ON orpaynter_plans FOR SELECT USING (true);

-- Analytics policies (restricted to authenticated users)
CREATE POLICY "Authenticated users can view analytics" ON analytics
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view analytics events" ON analytics_events
  FOR SELECT USING (auth.role() = 'authenticated');