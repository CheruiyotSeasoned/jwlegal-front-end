CREATE DATABASE legalai_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE legalai_system;

-- =====================================================
-- 1. CORE USER MANAGEMENT & AUTHENTICATION
-- =====================================================

-- Users table
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'lawyer', 'client', 'judicial') NOT NULL,
    status ENUM('active', 'inactive', 'suspended', 'pending', 'verified') DEFAULT 'pending',
    avatar_url VARCHAR(500),
    phone VARCHAR(20),
    address TEXT,
    date_of_birth DATE,
    national_id VARCHAR(20),
    lsk_number VARCHAR(50), -- For lawyers
    specialization TEXT, -- For lawyers
    years_of_experience INT, -- For lawyers
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    email_verified_at TIMESTAMP NULL,
    phone_verified_at TIMESTAMP NULL,
    profile_completed BOOLEAN DEFAULT FALSE,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_status (status),
    INDEX idx_lsk_number (lsk_number)
);

-- User profiles (additional user information)
CREATE TABLE user_profiles (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    bio TEXT,
    education TEXT,
    certifications JSON,
    languages JSON,
    hourly_rate DECIMAL(10,2),
    availability JSON,
    office_address TEXT,
    practice_areas JSON, -- For lawyers
    client_types JSON, -- For lawyers
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
);

-- User sessions
CREATE TABLE user_sessions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    device_type ENUM('desktop', 'mobile', 'tablet') DEFAULT 'desktop',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_token (token),
    INDEX idx_expires_at (expires_at)
);

-- =====================================================
-- 2. CASE MANAGEMENT SYSTEM
-- =====================================================

-- Cases table
CREATE TABLE cases (
    id VARCHAR(36) PRIMARY KEY,
    case_number VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category ENUM('family', 'criminal', 'civil', 'business', 'real-estate', 'employment', 'personal-injury', 'immigration', 'intellectual-property', 'bankruptcy', 'traffic', 'constitutional', 'other') NOT NULL,
    subcategory VARCHAR(100),
    status ENUM('draft', 'submitted', 'reviewing', 'assigned', 'in-progress', 'completed', 'closed', 'cancelled', 'on-hold') DEFAULT 'draft',
    urgency ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    
    -- Client information
    client_id VARCHAR(36) NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    client_phone VARCHAR(20),
    client_address TEXT,
    
    -- Case details
    estimated_budget DECIMAL(12,2),
    actual_cost DECIMAL(12,2),
    court_name VARCHAR(255),
    court_case_number VARCHAR(100),
    filing_date DATE,
    hearing_date DATE,
    deadline_date DATE,
    
    -- Case metadata
    tags JSON,
    keywords TEXT,
    complexity_level ENUM('simple', 'moderate', 'complex', 'very_complex') DEFAULT 'moderate',
    
    -- Timestamps
    submitted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_date TIMESTAMP NULL,
    completed_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_case_number (case_number),
    INDEX idx_client_id (client_id),
    INDEX idx_status (status),
    INDEX idx_category (category),
    INDEX idx_urgency (urgency),
    INDEX idx_submitted_date (submitted_date)
);

-- Case assignments (lawyers assigned to cases)
CREATE TABLE case_assignments (
    id VARCHAR(36) PRIMARY KEY,
    case_id VARCHAR(36) NOT NULL,
    lawyer_id VARCHAR(36) NOT NULL,
    role ENUM('primary', 'secondary', 'consultant', 'associate') DEFAULT 'primary',
    assigned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    removed_date TIMESTAMP NULL,
    notes TEXT,
    hourly_rate DECIMAL(10,2),
    FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE,
    FOREIGN KEY (lawyer_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_case_lawyer (case_id, lawyer_id),
    INDEX idx_case_id (case_id),
    INDEX idx_lawyer_id (lawyer_id)
);

-- Case updates/notes
CREATE TABLE case_updates (
    id VARCHAR(36) PRIMARY KEY,
    case_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    type ENUM('note', 'update', 'milestone', 'deadline', 'hearing', 'filing', 'correspondence') DEFAULT 'note',
    is_private BOOLEAN DEFAULT FALSE,
    attachments JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_case_id (case_id),
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
);

-- Case milestones
CREATE TABLE case_milestones (
    id VARCHAR(36) PRIMARY KEY,
    case_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    milestone_type ENUM('filing', 'hearing', 'settlement', 'judgment', 'appeal', 'other') NOT NULL,
    due_date DATE,
    completed_date DATE NULL,
    status ENUM('pending', 'in_progress', 'completed', 'overdue', 'cancelled') DEFAULT 'pending',
    assigned_to VARCHAR(36) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_case_id (case_id),
    INDEX idx_due_date (due_date),
    INDEX idx_status (status)
);

-- =====================================================
-- 3. DOCUMENT MANAGEMENT SYSTEM
-- =====================================================

-- Documents table
CREATE TABLE documents (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_extension VARCHAR(10) NOT NULL,
    
    -- Document metadata
    category ENUM('contract', 'evidence', 'correspondence', 'court-filing', 'billing', 'research', 'legal-brief', 'affidavit', 'pleading', 'other') NOT NULL,
    subcategory VARCHAR(100),
    status ENUM('draft', 'final', 'archived', 'deleted') DEFAULT 'draft',
    visibility ENUM('private', 'shared', 'public') DEFAULT 'private',
    
    -- Relationships
    case_id VARCHAR(36) NULL,
    uploaded_by VARCHAR(36) NOT NULL,
    shared_with JSON, -- Array of user IDs
    
    -- Document details
    description TEXT,
    tags JSON,
    version INT DEFAULT 1,
    parent_document_id VARCHAR(36) NULL, -- For document versions
    
    -- Security
    is_encrypted BOOLEAN DEFAULT TRUE,
    encryption_key_id VARCHAR(100),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE SET NULL,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_document_id) REFERENCES documents(id) ON DELETE SET NULL,
    INDEX idx_case_id (case_id),
    INDEX idx_uploaded_by (uploaded_by),
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- Document sharing permissions
CREATE TABLE document_permissions (
    id VARCHAR(36) PRIMARY KEY,
    document_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    permission ENUM('read', 'write', 'admin') DEFAULT 'read',
    granted_by VARCHAR(36) NOT NULL,
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (granted_by) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_document_user (document_id, user_id),
    INDEX idx_document_id (document_id),
    INDEX idx_user_id (user_id)
);

-- Document templates
CREATE TABLE document_templates (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    template_content TEXT NOT NULL,
    variables JSON, -- Template variables
    is_active BOOLEAN DEFAULT TRUE,
    created_by VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_category (category),
    INDEX idx_is_active (is_active)
);

-- =====================================================
-- 4. MESSAGING & COMMUNICATION SYSTEM
-- =====================================================

-- Conversations
CREATE TABLE conversations (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255),
    type ENUM('direct', 'group', 'case') DEFAULT 'direct',
    case_id VARCHAR(36) NULL,
    created_by VARCHAR(36) NOT NULL,
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_case_id (case_id),
    INDEX idx_created_by (created_by)
);

-- Conversation participants
CREATE TABLE conversation_participants (
    id VARCHAR(36) PRIMARY KEY,
    conversation_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    role ENUM('participant', 'admin') DEFAULT 'participant',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    left_at TIMESTAMP NULL,
    is_muted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_conversation_user (conversation_id, user_id),
    INDEX idx_conversation_id (conversation_id),
    INDEX idx_user_id (user_id)
);

-- Messages
CREATE TABLE messages (
    id VARCHAR(36) PRIMARY KEY,
    conversation_id VARCHAR(36) NOT NULL,
    sender_id VARCHAR(36) NOT NULL,
    content TEXT NOT NULL,
    message_type ENUM('text', 'file', 'image', 'audio', 'video', 'system') DEFAULT 'text',
    file_url VARCHAR(500) NULL,
    file_name VARCHAR(255) NULL,
    file_size BIGINT NULL,
    
    -- Message status
    is_edited BOOLEAN DEFAULT FALSE,
    edited_at TIMESTAMP NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP NULL,
    deleted_by VARCHAR(36) NULL,
    
    -- Message metadata
    reply_to_message_id VARCHAR(36) NULL,
    forwarded_from_message_id VARCHAR(36) NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (deleted_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (reply_to_message_id) REFERENCES messages(id) ON DELETE SET NULL,
    FOREIGN KEY (forwarded_from_message_id) REFERENCES messages(id) ON DELETE SET NULL,
    INDEX idx_conversation_id (conversation_id),
    INDEX idx_sender_id (sender_id),
    INDEX idx_created_at (created_at)
);

-- Message read receipts
CREATE TABLE message_reads (
    id VARCHAR(36) PRIMARY KEY,
    message_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_message_user (message_id, user_id),
    INDEX idx_message_id (message_id),
    INDEX idx_user_id (user_id)
);

-- =====================================================
-- 5. APPOINTMENTS & CALENDAR SYSTEM
-- =====================================================

-- Appointments
CREATE TABLE appointments (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    case_id VARCHAR(36) NULL,
    
    -- Participants
    organizer_id VARCHAR(36) NOT NULL,
    attendees JSON, -- Array of user IDs
    
    -- Time and location
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    timezone VARCHAR(50) DEFAULT 'Africa/Nairobi',
    location VARCHAR(255),
    is_virtual BOOLEAN DEFAULT FALSE,
    meeting_url VARCHAR(500),
    meeting_id VARCHAR(100), -- For virtual meetings
    
    -- Appointment details
    type ENUM('consultation', 'meeting', 'court', 'follow-up', 'mediation', 'arbitration', 'other') DEFAULT 'meeting',
    status ENUM('scheduled', 'confirmed', 'completed', 'cancelled', 'rescheduled', 'no_show') DEFAULT 'scheduled',
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    
    -- Reminders
    reminder_sent BOOLEAN DEFAULT FALSE,
    reminder_sent_at TIMESTAMP NULL,
    reminder_minutes_before INT DEFAULT 15,
    
    -- Notes
    notes TEXT,
    outcome TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE SET NULL,
    FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_case_id (case_id),
    INDEX idx_organizer_id (organizer_id),
    INDEX idx_start_time (start_time),
    INDEX idx_status (status),
    INDEX idx_type (type)
);

-- Calendar events (for recurring appointments)
CREATE TABLE calendar_events (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_rule VARCHAR(255), -- RRULE format
    user_id VARCHAR(36) NOT NULL,
    event_type ENUM('appointment', 'deadline', 'hearing', 'personal', 'other') DEFAULT 'appointment',
    color VARCHAR(7) DEFAULT '#3B82F6',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_start_time (start_time)
);

-- =====================================================
-- 6. BILLING & PAYMENTS SYSTEM
-- =====================================================

-- Invoices
CREATE TABLE invoices (
    id VARCHAR(36) PRIMARY KEY,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    case_id VARCHAR(36) NOT NULL,
    client_id VARCHAR(36) NOT NULL,
    lawyer_id VARCHAR(36) NOT NULL,
    
    -- Invoice details
    title VARCHAR(255) NOT NULL,
    description TEXT,
    subtotal DECIMAL(12,2) NOT NULL,
    tax_amount DECIMAL(12,2) DEFAULT 0,
    discount_amount DECIMAL(12,2) DEFAULT 0,
    total_amount DECIMAL(12,2) NOT NULL,
    
    -- Status and dates
    status ENUM('draft', 'sent', 'paid', 'overdue', 'cancelled', 'partially_paid') DEFAULT 'draft',
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    paid_date DATE NULL,
    
    -- Payment details
    payment_method VARCHAR(50),
    payment_reference VARCHAR(100),
    transaction_id VARCHAR(100),
    
    -- Currency
    currency VARCHAR(3) DEFAULT 'KES',
    exchange_rate DECIMAL(10,6) DEFAULT 1.0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (lawyer_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_invoice_number (invoice_number),
    INDEX idx_case_id (case_id),
    INDEX idx_client_id (client_id),
    INDEX idx_lawyer_id (lawyer_id),
    INDEX idx_status (status),
    INDEX idx_due_date (due_date)
);

-- Invoice items
CREATE TABLE invoice_items (
    id VARCHAR(36) PRIMARY KEY,
    invoice_id VARCHAR(36) NOT NULL,
    description VARCHAR(255) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(12,2) NOT NULL,
    tax_rate DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
    INDEX idx_invoice_id (invoice_id)
);

-- Time entries (for billing)
CREATE TABLE time_entries (
    id VARCHAR(36) PRIMARY KEY,
    case_id VARCHAR(36) NOT NULL,
    lawyer_id VARCHAR(36) NOT NULL,
    description VARCHAR(255) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    duration_minutes INT NOT NULL,
    hourly_rate DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    is_billable BOOLEAN DEFAULT TRUE,
    invoice_id VARCHAR(36) NULL,
    
    -- Time entry details
    activity_type ENUM('research', 'consultation', 'court_appearance', 'document_preparation', 'correspondence', 'other') DEFAULT 'other',
    billable_status ENUM('billable', 'non_billable', 'write_off') DEFAULT 'billable',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE,
    FOREIGN KEY (lawyer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE SET NULL,
    INDEX idx_case_id (case_id),
    INDEX idx_lawyer_id (lawyer_id),
    INDEX idx_invoice_id (invoice_id),
    INDEX idx_start_time (start_time)
);

-- Payments
CREATE TABLE payments (
    id VARCHAR(36) PRIMARY KEY,
    invoice_id VARCHAR(36) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    payment_method ENUM('cash', 'bank_transfer', 'credit_card', 'mobile_money', 'mpesa', 'airtel_money', 'check', 'other') NOT NULL,
    payment_reference VARCHAR(100),
    transaction_id VARCHAR(100),
    status ENUM('pending', 'completed', 'failed', 'refunded', 'cancelled') DEFAULT 'pending',
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_by VARCHAR(36) NULL,
    
    -- Payment details
    currency VARCHAR(3) DEFAULT 'KES',
    exchange_rate DECIMAL(10,6) DEFAULT 1.0,
    processing_fee DECIMAL(10,2) DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
    FOREIGN KEY (processed_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_invoice_id (invoice_id),
    INDEX idx_status (status),
    INDEX idx_payment_date (payment_date)
);

-- =====================================================
-- 7. RESEARCH & AI SYSTEM
-- =====================================================

-- Research submissions
CREATE TABLE research_submissions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    type ENUM('research', 'brief', 'question', 'analysis', 'precedent_search', 'statute_interpretation') NOT NULL,
    area_of_law VARCHAR(100),
    
    -- Status and priority
    status ENUM('pending', 'in_progress', 'completed', 'cancelled', 'rejected') DEFAULT 'pending',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    
    -- Dates
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deadline DATE,
    completed_at TIMESTAMP NULL,
    
    -- Assignment
    assigned_to VARCHAR(36) NULL,
    assigned_at TIMESTAMP NULL,
    
    -- Additional info
    attachments JSON,
    notes TEXT,
    keywords JSON,
    
    -- AI processing
    ai_processed BOOLEAN DEFAULT FALSE,
    ai_confidence_score DECIMAL(3,2) NULL,
    human_review_required BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_assigned_to (assigned_to),
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    INDEX idx_submitted_at (submitted_at)
);

-- Research responses
CREATE TABLE research_responses (
    id VARCHAR(36) PRIMARY KEY,
    submission_id VARCHAR(36) NOT NULL,
    responder_id VARCHAR(36) NOT NULL,
    content TEXT NOT NULL,
    attachments JSON,
    is_final BOOLEAN DEFAULT FALSE,
    
    -- Response metadata
    response_type ENUM('ai_generated', 'human_reviewed', 'human_written') DEFAULT 'ai_generated',
    confidence_score DECIMAL(3,2) NULL,
    sources_cited JSON,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (submission_id) REFERENCES research_submissions(id) ON DELETE CASCADE,
    FOREIGN KEY (responder_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_submission_id (submission_id),
    INDEX idx_responder_id (responder_id)
);

-- AI model usage tracking
CREATE TABLE ai_usage_logs (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    model_version VARCHAR(50) NOT NULL,
    request_type VARCHAR(100) NOT NULL,
    input_tokens INT,
    output_tokens INT,
    response_time_ms INT,
    confidence_score DECIMAL(3,2),
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT,
    cost DECIMAL(10,4),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_model_version (model_version),
    INDEX idx_created_at (created_at)
);

-- Legal precedents database
CREATE TABLE legal_precedents (
    id VARCHAR(36) PRIMARY KEY,
    case_name VARCHAR(255) NOT NULL,
    case_number VARCHAR(100),
    court VARCHAR(255),
    judge VARCHAR(255),
    decision_date DATE,
    area_of_law VARCHAR(100),
    summary TEXT,
    full_text TEXT,
    key_holdings JSON,
    citations JSON,
    tags JSON,
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_case_name (case_name),
    INDEX idx_area_of_law (area_of_law),
    INDEX idx_decision_date (decision_date)
);

-- =====================================================
-- 8. NOTIFICATIONS & ALERTS SYSTEM
-- =====================================================

-- Notifications
CREATE TABLE notifications (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('info', 'success', 'warning', 'error', 'reminder', 'alert') DEFAULT 'info',
    category ENUM('case', 'message', 'appointment', 'billing', 'research', 'system', 'security') DEFAULT 'system',
    
    -- Related entities
    related_case_id VARCHAR(36) NULL,
    related_message_id VARCHAR(36) NULL,
    related_appointment_id VARCHAR(36) NULL,
    related_invoice_id VARCHAR(36) NULL,
    
    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    is_sent BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP NULL,
    
    -- Delivery
    delivery_methods JSON, -- ['email', 'sms', 'push', 'in_app']
    email_sent BOOLEAN DEFAULT FALSE,
    sms_sent BOOLEAN DEFAULT FALSE,
    push_sent BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (related_case_id) REFERENCES cases(id) ON DELETE CASCADE,
    FOREIGN KEY (related_message_id) REFERENCES messages(id) ON DELETE CASCADE,
    FOREIGN KEY (related_appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
    FOREIGN KEY (related_invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at),
    INDEX idx_category (category)
);

-- Notification templates
CREATE TABLE notification_templates (
    id VARCHAR(36) PRIMARY KEY,
    template_key VARCHAR(100) UNIQUE NOT NULL,
    title_template VARCHAR(255) NOT NULL,
    message_template TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    delivery_methods JSON,
    variables JSON, -- Template variables
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_template_key (template_key),
    INDEX idx_category (category)
);

-- =====================================================
-- 9. ANALYTICS & REPORTING SYSTEM
-- =====================================================

-- Analytics data
CREATE TABLE analytics_data (
    id VARCHAR(36) PRIMARY KEY,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15,4) NOT NULL,
    metric_date DATE NOT NULL,
    entity_type VARCHAR(50) NULL, -- 'user', 'case', 'system'
    entity_id VARCHAR(36) NULL,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_metric_name (metric_name),
    INDEX idx_metric_date (metric_date),
    INDEX idx_entity_type (entity_type)
);

-- Dashboard widgets
CREATE TABLE dashboard_widgets (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    widget_type VARCHAR(100) NOT NULL,
    widget_config JSON,
    position_x INT DEFAULT 0,
    position_y INT DEFAULT 0,
    width INT DEFAULT 1,
    height INT DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_widget_type (widget_type)
);

-- Reports
CREATE TABLE reports (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    report_type VARCHAR(100) NOT NULL,
    parameters JSON,
    created_by VARCHAR(36) NOT NULL,
    is_scheduled BOOLEAN DEFAULT FALSE,
    schedule_cron VARCHAR(100),
    last_generated TIMESTAMP NULL,
    next_generation TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_report_type (report_type),
    INDEX idx_created_by (created_by)
);

-- =====================================================
-- 10. SYSTEM SETTINGS & CONFIGURATION
-- =====================================================

-- System settings (global configuration)
CREATE TABLE system_settings (
    id VARCHAR(36) PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    category VARCHAR(50) NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    is_editable BOOLEAN DEFAULT TRUE,
    requires_restart BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by VARCHAR(36) NULL,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_setting_key (setting_key),
    INDEX idx_category (category)
);

-- User preferences (individual user settings)
CREATE TABLE user_preferences (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    preference_key VARCHAR(100) NOT NULL,
    preference_value TEXT,
    preference_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_preference (user_id, preference_key),
    INDEX idx_user_id (user_id)
);

-- User notification preferences
CREATE TABLE user_notification_preferences (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    
    -- Email notifications
    email_enabled BOOLEAN DEFAULT TRUE,
    email_case_updates BOOLEAN DEFAULT TRUE,
    email_messages BOOLEAN DEFAULT TRUE,
    email_appointments BOOLEAN DEFAULT TRUE,
    email_billing BOOLEAN DEFAULT TRUE,
    email_research BOOLEAN DEFAULT TRUE,
    email_system_alerts BOOLEAN DEFAULT TRUE,
    
    -- SMS notifications
    sms_enabled BOOLEAN DEFAULT FALSE,
    sms_case_updates BOOLEAN DEFAULT FALSE,
    sms_appointments BOOLEAN DEFAULT TRUE,
    sms_urgent_alerts BOOLEAN DEFAULT TRUE,
    
    -- Push notifications
    push_enabled BOOLEAN DEFAULT TRUE,
    push_case_updates BOOLEAN DEFAULT TRUE,
    push_messages BOOLEAN DEFAULT TRUE,
    push_appointments BOOLEAN DEFAULT TRUE,
    
    -- Frequency settings
    notification_frequency ENUM('immediate', 'hourly', 'daily', 'weekly') DEFAULT 'immediate',
    quiet_hours_start TIME DEFAULT '22:00:00',
    quiet_hours_end TIME DEFAULT '08:00:00',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_notification (user_id),
    INDEX idx_user_id (user_id)
);

-- User interface preferences
CREATE TABLE user_interface_preferences (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    
    -- Theme settings
    theme ENUM('light', 'dark', 'auto') DEFAULT 'auto',
    color_scheme VARCHAR(50) DEFAULT 'default',
    font_size ENUM('small', 'medium', 'large') DEFAULT 'medium',
    
    -- Layout preferences
    sidebar_collapsed BOOLEAN DEFAULT FALSE,
    compact_mode BOOLEAN DEFAULT FALSE,
    show_animations BOOLEAN DEFAULT TRUE,
    
    -- Language and localization
    language VARCHAR(10) DEFAULT 'en',
    timezone VARCHAR(50) DEFAULT 'Africa/Nairobi',
    date_format VARCHAR(20) DEFAULT 'YYYY-MM-DD',
    time_format ENUM('12h', '24h') DEFAULT '24h',
    currency VARCHAR(3) DEFAULT 'KES',
    
    -- Dashboard preferences
    dashboard_layout JSON,
    default_page VARCHAR(100) DEFAULT 'dashboard',
    show_welcome_message BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_interface (user_id),
    INDEX idx_user_id (user_id)
);

-- =====================================================
-- 11. COMPLIANCE & LEGAL SETTINGS
-- =====================================================

-- DPA Compliance settings
CREATE TABLE dpa_compliance_settings (
    id VARCHAR(36) PRIMARY KEY,
    enabled BOOLEAN DEFAULT TRUE,
    registration_number VARCHAR(50),
    data_controller VARCHAR(255),
    data_protection_officer VARCHAR(255),
    last_audit_date DATE,
    next_audit_date DATE,
    audit_frequency ENUM('monthly', 'quarterly', 'biannual', 'annual') DEFAULT 'annual',
    
    -- Data retention
    data_retention_period INT DEFAULT 2555, -- 7 years in days
    auto_delete_enabled BOOLEAN DEFAULT TRUE,
    backup_retention_period INT DEFAULT 2555,
    
    -- Consent management
    require_explicit_consent BOOLEAN DEFAULT TRUE,
    consent_expiry_days INT DEFAULT 365,
    allow_withdrawal BOOLEAN DEFAULT TRUE,
    
    -- Data processing
    data_processing_purposes JSON,
    third_party_sharing_rules JSON,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by VARCHAR(36) NULL,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
);

-- LSK Compliance settings
CREATE TABLE lsk_compliance_settings (
    id VARCHAR(36) PRIMARY KEY,
    enabled BOOLEAN DEFAULT TRUE,
    lsk_registration_number VARCHAR(50),
    compliance_officer VARCHAR(255),
    
    -- Code adherence
    code_adherence_enabled BOOLEAN DEFAULT TRUE,
    marketing_guidelines_enabled BOOLEAN DEFAULT TRUE,
    professional_standards_enabled BOOLEAN DEFAULT TRUE,
    
    -- Professional conduct
    conflict_check_enabled BOOLEAN DEFAULT TRUE,
    client_confidentiality_enforced BOOLEAN DEFAULT TRUE,
    fee_transparency_required BOOLEAN DEFAULT TRUE,
    
    -- Continuing education
    cle_requirements JSON,
    cle_tracking_enabled BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by VARCHAR(36) NULL,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
);

-- =====================================================
-- 12. SECURITY & AUDIT SYSTEM
-- =====================================================

-- Activity logs
CREATE TABLE activity_logs (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(36) NULL,
    description TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    session_id VARCHAR(100),
    severity ENUM('low', 'medium', 'high', 'critical') DEFAULT 'low',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_entity_type (entity_type),
    INDEX idx_created_at (created_at),
    INDEX idx_severity (severity)
);

-- Security events
CREATE TABLE security_events (
    id VARCHAR(36) PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    user_id VARCHAR(36) NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    description TEXT,
    severity ENUM('low', 'medium', 'high', 'critical') DEFAULT 'low',
    is_resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMP NULL,
    resolved_by VARCHAR(36) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (resolved_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_event_type (event_type),
    INDEX idx_severity (severity),
    INDEX idx_is_resolved (is_resolved),
    INDEX idx_created_at (created_at)
);

-- API access logs
CREATE TABLE api_access_logs (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NULL,
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    status_code INT NOT NULL,
    response_time_ms INT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    request_body TEXT,
    response_body TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_endpoint (endpoint),
    INDEX idx_status_code (status_code),
    INDEX idx_created_at (created_at)
);

-- =====================================================
-- 13. INTEGRATION & EXTERNAL SERVICES
-- =====================================================

-- External integrations
CREATE TABLE external_integrations (
    id VARCHAR(36) PRIMARY KEY,
    integration_name VARCHAR(100) NOT NULL,
    integration_type ENUM('api', 'webhook', 'oauth', 'sso') NOT NULL,
    provider VARCHAR(100) NOT NULL,
    
    -- Configuration
    api_key_encrypted TEXT,
    api_secret_encrypted TEXT,
    endpoint_url VARCHAR(255),
    webhook_url VARCHAR(255),
    
    -- Settings
    is_active BOOLEAN DEFAULT FALSE,
    is_test_mode BOOLEAN DEFAULT TRUE,
    auto_sync_enabled BOOLEAN DEFAULT FALSE,
    sync_frequency ENUM('realtime', 'hourly', 'daily') DEFAULT 'daily',
    
    -- Permissions
    permissions JSON,
    rate_limits JSON,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by VARCHAR(36) NULL,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_integration_name (integration_name),
    INDEX idx_provider (provider)
);

-- Integration logs
CREATE TABLE integration_logs (
    id VARCHAR(36) PRIMARY KEY,
    integration_id VARCHAR(36) NOT NULL,
    operation VARCHAR(100) NOT NULL,
    status ENUM('success', 'failed', 'pending') NOT NULL,
    request_data JSON,
    response_data JSON,
    error_message TEXT,
    duration_ms INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (integration_id) REFERENCES external_integrations(id) ON DELETE CASCADE,
    INDEX idx_integration_id (integration_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- =====================================================
-- 14. FRONTEND COMPONENTS & UI STATE
-- =====================================================

-- UI state management
CREATE TABLE ui_state (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    component_name VARCHAR(100) NOT NULL,
    state_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_component (user_id, component_name),
    INDEX idx_user_id (user_id),
    INDEX idx_component_name (component_name)
);

-- User sessions (frontend)
CREATE TABLE frontend_sessions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    device_info JSON,
    browser_info JSON,
    location_info JSON,
    is_active BOOLEAN DEFAULT TRUE,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_session_token (session_token),
    INDEX idx_is_active (is_active)
);

-- =====================================================
-- 15. DASHBOARD SPECIFIC TABLES
-- =====================================================

-- Dashboard widgets configuration
CREATE TABLE dashboard_widgets_config (
    id VARCHAR(36) PRIMARY KEY,
    widget_type VARCHAR(100) NOT NULL,
    widget_name VARCHAR(255) NOT NULL,
    description TEXT,
    default_config JSON,
    allowed_roles JSON,
    is_system_widget BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_widget_type (widget_type),
    INDEX idx_allowed_roles (allowed_roles(100))
);

-- User dashboard layouts
CREATE TABLE user_dashboard_layouts (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    layout_name VARCHAR(255) NOT NULL,
    layout_config JSON,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_default (is_default)
);

-- =====================================================
-- INITIAL DATA & CONFIGURATION
-- =====================================================

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, category, description, is_public) VALUES
-- General Settings
('system_name', 'LegalAI Platform', 'string', 'general', 'System display name', TRUE),
('system_version', '1.0.0', 'string', 'general', 'Current system version', TRUE),
('maintenance_mode', 'false', 'boolean', 'general', 'System maintenance mode', TRUE),
('default_language', 'en', 'string', 'general', 'Default system language', TRUE),
('default_timezone', 'Africa/Nairobi', 'string', 'general', 'Default system timezone', TRUE),
('default_currency', 'KES', 'string', 'general', 'Default system currency', TRUE),

-- File Upload Settings
('file_upload_max_size', '10485760', 'number', 'general', 'Maximum file upload size in bytes', TRUE),
-- Continue from previous section...

-- File Upload Settings (continued)
('allowed_file_types', '["pdf","doc","docx","jpg","jpeg","png","txt","rtf"]', 'json', 'general', 'Allowed file types for upload', TRUE),
('file_storage_path', '/uploads', 'string', 'general', 'File storage directory', FALSE),

-- AI Settings
('ai_model_version', 'legal-ai-v2.1', 'string', 'ai', 'Current AI model version', TRUE),
('ai_confidence_threshold', '0.85', 'number', 'ai', 'AI confidence threshold', FALSE),
('ai_max_response_time', '300', 'number', 'ai', 'Maximum AI response time in seconds', FALSE),
('ai_human_review_required', 'true', 'boolean', 'ai', 'Require human review for AI responses', FALSE),

-- Security Settings
('password_min_length', '8', 'number', 'security', 'Minimum password length', TRUE),
('session_timeout', '480', 'number', 'security', 'Session timeout in minutes', TRUE),
('two_factor_enabled', 'true', 'boolean', 'security', 'Enable two-factor authentication', TRUE),
('max_login_attempts', '5', 'number', 'security', 'Maximum login attempts before lockout', TRUE),

-- Notification Settings
('email_notifications_enabled', 'true', 'boolean', 'notifications', 'Enable email notifications', TRUE),
('sms_notifications_enabled', 'false', 'boolean', 'notifications', 'Enable SMS notifications', TRUE),
('push_notifications_enabled', 'true', 'boolean', 'notifications', 'Enable push notifications', TRUE),

-- Compliance Settings
('dpa_compliance_enabled', 'true', 'boolean', 'compliance', 'Enable DPA compliance', TRUE),
('lsk_compliance_enabled', 'true', 'boolean', 'compliance', 'Enable LSK compliance', TRUE),
('kenya_ip_restriction', 'true', 'boolean', 'compliance', 'Restrict access to Kenya IPs', TRUE),

-- Billing Settings
('default_hourly_rate', '2500', 'number', 'billing', 'Default hourly rate for lawyers', FALSE),
('tax_rate', '16.0', 'number', 'billing', 'Default tax rate percentage', TRUE),
('invoice_prefix', 'INV', 'string', 'billing', 'Invoice number prefix', FALSE);

-- Insert default notification templates
INSERT INTO notification_templates (template_key, title_template, message_template, category, delivery_methods, variables) VALUES
('case_assigned', 'Case Assignment: {case_title}', 'You have been assigned to case {case_number}. Please review the details and take necessary action.', 'case', '["email", "push", "in_app"]', '["case_title", "case_number", "client_name"]'),
('appointment_reminder', 'Appointment Reminder: {appointment_title}', 'You have an upcoming appointment in {time_until} minutes: {appointment_title}', 'appointment', '["email", "sms", "push", "in_app"]', '["appointment_title", "time_until", "location"]'),
('message_received', 'New Message from {sender_name}', 'You have received a new message in {conversation_title}', 'message', '["email", "push", "in_app"]', '["sender_name", "conversation_title", "message_preview"]'),
('invoice_sent', 'Invoice Sent: {invoice_number}', 'Invoice {invoice_number} for {amount} has been sent to {client_name}', 'billing', '["email", "in_app"]', '["invoice_number", "amount", "client_name"]'),
('research_completed', 'Research Completed: {research_title}', 'Your research request "{research_title}" has been completed and is ready for review.', 'research', '["email", "push", "in_app"]', '["research_title", "completion_date"]'),
('system_maintenance', 'System Maintenance Notice', 'Scheduled maintenance will occur on {maintenance_date} from {start_time} to {end_time}.', 'system', '["email", "push", "in_app"]', '["maintenance_date", "start_time", "end_time"]');

-- Insert default dashboard widgets configuration
INSERT INTO dashboard_widgets_config (widget_type, widget_name, description, default_config, allowed_roles, is_system_widget) VALUES
('stats_overview', 'Statistics Overview', 'Display key statistics and metrics', '{"columns": 4, "height": 1}', '["admin", "lawyer", "client", "judicial"]', TRUE),
('recent_cases', 'Recent Cases', 'Show recently updated cases', '{"columns": 2, "height": 2}', '["admin", "lawyer", "client"]', TRUE),
('upcoming_appointments', 'Upcoming Appointments', 'Display upcoming appointments and meetings', '{"columns": 2, "height": 2}', '["admin", "lawyer", "client"]', TRUE),
('recent_messages', 'Recent Messages', 'Show recent messages and communications', '{"columns": 2, "height": 2}', '["admin", "lawyer", "client"]', TRUE),
('case_progress', 'Case Progress', 'Track case progress and milestones', '{"columns": 3, "height": 2}', '["admin", "lawyer", "client"]', TRUE),
('billing_summary', 'Billing Summary', 'Display billing and payment information', '{"columns": 2, "height": 1}', '["admin", "lawyer"]', TRUE),
('ai_performance', 'AI Performance', 'Show AI model performance metrics', '{"columns": 2, "height": 2}', '["admin"]', TRUE),
('system_health', 'System Health', 'Display system performance and health metrics', '{"columns": 2, "height": 1}', '["admin"]', TRUE),
('compliance_status', 'Compliance Status', 'Show compliance and regulatory status', '{"columns": 2, "height": 1}', '["admin"]', TRUE),
('user_activity', 'User Activity', 'Display recent user activity and actions', '{"columns": 3, "height": 2}', '["admin"]', TRUE);

-- =====================================================
-- STORED PROCEDURES FOR DASHBOARD OPERATIONS
-- =====================================================

DELIMITER //

-- Procedure to get dashboard statistics for a user
CREATE PROCEDURE GetDashboardStats(IN p_user_id VARCHAR(36), IN p_user_role VARCHAR(20))
BEGIN
    DECLARE user_stats JSON;
    
    -- Get role-specific statistics
    CASE p_user_role
        WHEN 'admin' THEN
            SELECT JSON_OBJECT(
                'total_users', (SELECT COUNT(*) FROM users),
                'active_cases', (SELECT COUNT(*) FROM cases WHERE status IN ('submitted', 'reviewing', 'assigned', 'in-progress')),
                'total_lawyers', (SELECT COUNT(*) FROM users WHERE role = 'lawyer' AND status = 'active'),
                'total_clients', (SELECT COUNT(*) FROM users WHERE role = 'client' AND status = 'active'),
                'pending_research', (SELECT COUNT(*) FROM research_submissions WHERE status = 'pending'),
                'system_health', JSON_OBJECT(
                    'uptime', '99.9%',
                    'active_sessions', (SELECT COUNT(*) FROM user_sessions WHERE expires_at > NOW()),
                    'storage_used', '67%'
                )
            ) INTO user_stats;
            
        WHEN 'lawyer' THEN
            SELECT JSON_OBJECT(
                'active_cases', (SELECT COUNT(*) FROM case_assignments ca JOIN cases c ON ca.case_id = c.id WHERE ca.lawyer_id = p_user_id AND c.status IN ('assigned', 'in-progress')),
                'pending_reviews', (SELECT COUNT(*) FROM cases c JOIN case_assignments ca ON c.id = ca.case_id WHERE ca.lawyer_id = p_user_id AND c.status = 'reviewing'),
                'completed_today', (SELECT COUNT(*) FROM cases c JOIN case_assignments ca ON c.id = ca.case_id WHERE ca.lawyer_id = p_user_id AND c.status = 'completed' AND DATE(c.completed_date) = CURDATE()),
                'revenue_month', (SELECT COALESCE(SUM(total_amount), 0) FROM invoices WHERE lawyer_id = p_user_id AND MONTH(issue_date) = MONTH(CURDATE()) AND YEAR(issue_date) = YEAR(CURDATE())),
                'upcoming_appointments', (SELECT COUNT(*) FROM appointments WHERE organizer_id = p_user_id AND start_time > NOW() AND start_time < DATE_ADD(NOW(), INTERVAL 7 DAY)),
                'unread_messages', (SELECT COUNT(*) FROM messages m JOIN conversation_participants cp ON m.conversation_id = cp.conversation_id WHERE cp.user_id = p_user_id AND m.created_at > (SELECT COALESCE(MAX(read_at), '1970-01-01') FROM message_reads mr WHERE mr.message_id = m.id AND mr.user_id = p_user_id))
            ) INTO user_stats;
            
        WHEN 'client' THEN
            SELECT JSON_OBJECT(
                'my_cases', (SELECT COUNT(*) FROM cases WHERE client_id = p_user_id),
                'active_cases', (SELECT COUNT(*) FROM cases WHERE client_id = p_user_id AND status IN ('submitted', 'reviewing', 'assigned', 'in-progress')),
                'upcoming_appointments', (SELECT COUNT(*) FROM appointments WHERE JSON_CONTAINS(attendees, CAST(p_user_id AS JSON)) AND start_time > NOW() AND start_time < DATE_ADD(NOW(), INTERVAL 7 DAY)),
                'unread_messages', (SELECT COUNT(*) FROM messages m JOIN conversation_participants cp ON m.conversation_id = cp.conversation_id WHERE cp.user_id = p_user_id AND m.created_at > (SELECT COALESCE(MAX(read_at), '1970-01-01') FROM message_reads mr WHERE mr.message_id = m.id AND mr.user_id = p_user_id)),
                'pending_documents', (SELECT COUNT(*) FROM documents WHERE uploaded_by = p_user_id AND status = 'draft'),
                'total_billed', (SELECT COALESCE(SUM(total_amount), 0) FROM invoices WHERE client_id = p_user_id)
            ) INTO user_stats;
            
        WHEN 'judicial' THEN
            SELECT JSON_OBJECT(
                'cases_reviewed', (SELECT COUNT(*) FROM cases WHERE status = 'completed' AND updated_at > DATE_SUB(NOW(), INTERVAL 30 DAY)),
                'pending_reviews', (SELECT COUNT(*) FROM research_submissions WHERE status = 'pending' AND type IN ('brief', 'analysis')),
                'research_requests', (SELECT COUNT(*) FROM research_submissions WHERE status = 'in_progress'),
                'compliance_checks', (SELECT COUNT(*) FROM activity_logs WHERE action = 'compliance_check' AND created_at > DATE_SUB(NOW(), INTERVAL 30 DAY))
            ) INTO user_stats;
    END CASE;
    
    SELECT user_stats AS dashboard_stats;
END //

-- Procedure to get recent activity for dashboard
CREATE PROCEDURE GetRecentActivity(IN p_user_id VARCHAR(36), IN p_limit INT DEFAULT 10)
BEGIN
    SELECT 
        al.action,
        al.description,
        al.entity_type,
        al.entity_id,
        al.created_at,
        u.name as user_name,
        u.avatar_url
    FROM activity_logs al
    LEFT JOIN users u ON al.user_id = u.id
    WHERE al.user_id = p_user_id
    ORDER BY al.created_at DESC
    LIMIT p_limit;
END //

-- Procedure to get case analytics
CREATE PROCEDURE GetCaseAnalytics(IN p_user_id VARCHAR(36), IN p_time_period VARCHAR(20) DEFAULT '30d')
BEGIN
    DECLARE start_date DATE;
    
    SET start_date = CASE p_time_period
        WHEN '7d' THEN DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        WHEN '30d' THEN DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        WHEN '90d' THEN DATE_SUB(CURDATE(), INTERVAL 90 DAY)
        WHEN '1y' THEN DATE_SUB(CURDATE(), INTERVAL 1 YEAR)
        ELSE DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    END;
    
    SELECT 
        c.category,
        COUNT(*) as total_cases,
        SUM(CASE WHEN c.status = 'completed' THEN 1 ELSE 0 END) as completed_cases,
        SUM(CASE WHEN c.status IN ('submitted', 'reviewing', 'assigned', 'in-progress') THEN 1 ELSE 0 END) as active_cases,
        AVG(CASE WHEN c.completed_date IS NOT NULL THEN DATEDIFF(c.completed_date, c.submitted_date) END) as avg_completion_days
    FROM cases c
    WHERE c.client_id = p_user_id OR c.id IN (SELECT case_id FROM case_assignments WHERE lawyer_id = p_user_id)
    AND c.created_at >= start_date
    GROUP BY c.category
    ORDER BY total_cases DESC;
END //

-- Procedure to get AI performance metrics
CREATE PROCEDURE GetAIPerformanceMetrics(IN p_time_period VARCHAR(20) DEFAULT '30d')
BEGIN
    DECLARE start_date DATE;
    
    SET start_date = CASE p_time_period
        WHEN '7d' THEN DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        WHEN '30d' THEN DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        WHEN '90d' THEN DATE_SUB(CURDATE(), INTERVAL 90 DAY)
        ELSE DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    END;
    
    SELECT 
        model_version,
        COUNT(*) as total_requests,
        AVG(response_time_ms) as avg_response_time,
        AVG(confidence_score) as avg_confidence,
        SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) / COUNT(*) * 100 as success_rate,
        SUM(cost) as total_cost
    FROM ai_usage_logs
    WHERE created_at >= start_date
    GROUP BY model_version
    ORDER BY total_requests DESC;
END //

-- Procedure to get billing analytics
CREATE PROCEDURE GetBillingAnalytics(IN p_user_id VARCHAR(36), IN p_time_period VARCHAR(20) DEFAULT '30d')
BEGIN
    DECLARE start_date DATE;
    
    SET start_date = CASE p_time_period
        WHEN '7d' THEN DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        WHEN '30d' THEN DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        WHEN '90d' THEN DATE_SUB(CURDATE(), INTERVAL 90 DAY)
        WHEN '1y' THEN DATE_SUB(CURDATE(), INTERVAL 1 YEAR)
        ELSE DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    END;
    
    SELECT 
        DATE_FORMAT(issue_date, '%Y-%m') as month,
        COUNT(*) as total_invoices,
        SUM(total_amount) as total_billed,
        SUM(CASE WHEN status = 'paid' THEN total_amount ELSE 0 END) as total_paid,
        SUM(CASE WHEN status = 'overdue' THEN total_amount ELSE 0 END) as total_overdue,
        AVG(total_amount) as avg_invoice_amount
    FROM invoices
    WHERE (lawyer_id = p_user_id OR client_id = p_user_id)
    AND issue_date >= start_date
    GROUP BY DATE_FORMAT(issue_date, '%Y-%m')
    ORDER BY month DESC;
END //

DELIMITER ;

-- =====================================================
-- VIEWS FOR DASHBOARD DATA
-- =====================================================

-- Dashboard overview view
CREATE VIEW dashboard_overview AS
SELECT 
    u.id,
    u.name,
    u.role,
    u.status,
    COUNT(DISTINCT c.id) as total_cases,
    COUNT(DISTINCT CASE WHEN c.status IN ('submitted', 'reviewing', 'assigned', 'in-progress') THEN c.id END) as active_cases,
    COUNT(DISTINCT a.id) as total_appointments,
    COUNT(DISTINCT CASE WHEN a.start_time > NOW() THEN a.id END) as upcoming_appointments,
    COUNT(DISTINCT m.id) as total_messages,
    COUNT(DISTINCT CASE WHEN mr.id IS NULL THEN m.id END) as unread_messages,
    COUNT(DISTINCT i.id) as total_invoices,
    COALESCE(SUM(CASE WHEN i.status = 'paid' THEN i.total_amount ELSE 0 END), 0) as total_paid,
    COALESCE(SUM(CASE WHEN i.status = 'overdue' THEN i.total_amount ELSE 0 END), 0) as total_overdue
FROM users u
LEFT JOIN cases c ON (u.id = c.client_id OR u.id IN (SELECT lawyer_id FROM case_assignments WHERE case_id = c.id))
LEFT JOIN appointments a ON (u.id = a.organizer_id OR JSON_CONTAINS(a.attendees, CAST(u.id AS JSON)))
LEFT JOIN conversation_participants cp ON u.id = cp.user_id
LEFT JOIN messages m ON cp.conversation_id = m.conversation_id
LEFT JOIN message_reads mr ON m.id = mr.message_id AND mr.user_id = u.id
LEFT JOIN invoices i ON (u.id = i.client_id OR u.id = i.lawyer_id)
GROUP BY u.id;

-- Case analytics view
CREATE VIEW case_analytics AS
SELECT 
    c.id,
    c.case_number,
    c.title,
    c.category,
    c.status,
    c.urgency,
    c.submitted_date,
    c.completed_date,
    c.client_id,
    c.client_name,
    DATEDIFF(COALESCE(c.completed_date, CURDATE()), c.submitted_date) as days_open,
    COUNT(cu.id) as updates_count,
    COUNT(d.id) as documents_count,
    COUNT(a.id) as appointments_count
FROM cases c
LEFT JOIN case_updates cu ON c.id = cu.case_id
LEFT JOIN documents d ON c.id = d.case_id
LEFT JOIN appointments a ON c.id = a.case_id
GROUP BY c.id;

-- User performance view
CREATE VIEW user_performance AS
SELECT 
    u.id,
    u.name,
    u.role,
    COUNT(DISTINCT c.id) as cases_handled,
    COUNT(DISTINCT CASE WHEN c.status = 'completed' THEN c.id END) as cases_completed,
    AVG(DATEDIFF(c.completed_date, c.submitted_date)) as avg_case_duration,
    COUNT(DISTINCT a.id) as appointments_conducted,
    COUNT(DISTINCT m.id) as messages_sent,
    COALESCE(SUM(i.total_amount), 0) as total_billed,
    COALESCE(SUM(CASE WHEN i.status = 'paid' THEN i.total_amount ELSE 0 END), 0) as total_collected
FROM users u
LEFT JOIN case_assignments ca ON u.id = ca.lawyer_id
LEFT JOIN cases c ON ca.case_id = c.id
LEFT JOIN appointments a ON u.id = a.organizer_id
LEFT JOIN messages m ON u.id = m.sender_id
LEFT JOIN invoices i ON u.id = i.lawyer_id
GROUP BY u.id;

-- System health view
CREATE VIEW system_health AS
SELECT 
    'users' as metric,
    COUNT(*) as total,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active,
    COUNT(CASE WHEN last_login > DATE_SUB(NOW(), INTERVAL 24 HOUR) THEN 1 END) as active_24h
FROM users
UNION ALL
SELECT 
    'cases' as metric,
    COUNT(*) as total,
    COUNT(CASE WHEN status IN ('submitted', 'reviewing', 'assigned', 'in-progress') THEN 1 END) as active,
    COUNT(CASE WHEN created_at > DATE_SUB(NOW(), INTERVAL 24 HOUR) THEN 1 END) as new_24h
FROM cases
UNION ALL
SELECT 
    'sessions' as metric,
    COUNT(*) as total,
    COUNT(CASE WHEN expires_at > NOW() THEN 1 END) as active,
    COUNT(CASE WHEN created_at > DATE_SUB(NOW(), INTERVAL 24 HOUR) THEN 1 END) as new_24h
FROM user_sessions
UNION ALL
SELECT 
    'ai_requests' as metric,
    COUNT(*) as total,
    COUNT(CASE WHEN success = 1 THEN 1 END) as successful,
    COUNT(CASE WHEN created_at > DATE_SUB(NOW(), INTERVAL 24 HOUR) THEN 1 END) as requests_24h
FROM ai_usage_logs;

-- =====================================================
-- TRIGGERS FOR DASHBOARD UPDATES
-- =====================================================

DELIMITER //

-- Trigger to update analytics when case status changes
CREATE TRIGGER after_case_status_update
AFTER UPDATE ON cases
FOR EACH ROW
BEGIN
    IF OLD.status != NEW.status THEN
        INSERT INTO analytics_data (id, metric_name, metric_value, metric_date, entity_type, entity_id, metadata)
        VALUES (
            UUID(),
            'case_status_change',
            1,
            CURDATE(),
            'case',
            NEW.id,
            JSON_OBJECT('old_status', OLD.status, 'new_status', NEW.status, 'category', NEW.category)
        );
    END IF;
END //

-- Trigger to log user activity for dashboard
CREATE TRIGGER after_user_activity
AFTER INSERT ON activity_logs
FOR EACH ROW
BEGIN
    -- Update user's last activity
    UPDATE users 
    SET last_login = NEW.created_at 
    WHERE id = NEW.user_id;
    
    -- Log dashboard-relevant activities
    IF NEW.entity_type IN ('case', 'appointment', 'message', 'invoice') THEN
        INSERT INTO analytics_data (id, metric_name, metric_value, metric_date, entity_type, entity_id)
        VALUES (
            UUID(),
            CONCAT(NEW.entity_type, '_', NEW.action),
            1,
            CURDATE(),
            'user',
            NEW.user_id
        );
    END IF;
END //

-- Trigger to update notification counts
CREATE TRIGGER after_notification_create
AFTER INSERT ON notifications
FOR EACH ROW
BEGIN
    -- Update user's unread notification count
    UPDATE user_preferences 
    SET preference_value = CAST(
        COALESCE(CAST(preference_value AS UNSIGNED), 0) + 1 AS CHAR
    )
    WHERE user_id = NEW.user_id AND preference_key = 'unread_notifications';
END //

DELIMITER ;

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Performance indexes for dashboard queries
CREATE INDEX idx_cases_status_created ON cases(status, created_at);
CREATE INDEX idx_cases_category_status ON cases(category, status);
CREATE INDEX idx_appointments_start_status ON appointments(start_time, status);
CREATE INDEX idx_messages_conversation_created ON messages(conversation_id, created_at);
CREATE INDEX idx_invoices_status_due ON invoices(status, due_date);
CREATE INDEX idx_activity_logs_user_created ON activity_logs(user_id, created_at);
CREATE INDEX idx_analytics_data_metric_date ON analytics_data(metric_name, metric_date);
CREATE INDEX idx_ai_usage_logs_created ON ai_usage_logs(created_at);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);

-- Composite indexes for complex queries
CREATE INDEX idx_case_assignments_lawyer_status ON case_assignments(lawyer_id, case_id);
CREATE INDEX idx_documents_case_category ON documents(case_id, category);
CREATE INDEX idx_time_entries_case_date ON time_entries(case_id, start_time);
CREATE INDEX idx_research_submissions_status_priority ON research_submissions(status, priority);

-- =====================================================
-- FINAL CONFIGURATION
-- =====================================================

-- Set up foreign key constraints
SET FOREIGN_KEY_CHECKS = 1;

-- Create database user for application
CREATE USER 'legalai_app'@'localhost' IDENTIFIED BY 'secure_password_here';
GRANT SELECT, INSERT, UPDATE, DELETE ON legalai_system.* TO 'legalai_app'@'localhost';
GRANT EXECUTE ON legalai_system.* TO 'legalai_app'@'localhost';

-- Create database user for read-only access (for analytics)
CREATE USER 'legalai_analytics'@'localhost' IDENTIFIED BY 'analytics_password_here';
GRANT SELECT ON legalai_system.* TO 'legalai_analytics'@'localhost';

-- Flush privileges
FLUSH PRIVILEGES;

-- =====================================================
-- SCHEMA COMPLETION SUMMARY
-- =====================================================

/*
COMPLETE LEGALAI SYSTEM SCHEMA

This schema includes:

1. CORE SYSTEM (15 main tables)
   - User management & authentication
   - Case management system
   - Document management
   - Messaging & communication
   - Appointments & calendar
   - Billing & payments
   - Research & AI system
   - Notifications & alerts
   - Analytics & reporting
   - System settings & configuration
   - Compliance & legal settings
   - Security & audit system
   - Integration & external services
   - Frontend components & UI state
   - Dashboard specific tables

2. FEATURES COVERED:
   - Multi-role authentication (admin, lawyer, client, judicial)
   - Complete case lifecycle management
   - Real-time messaging system
   - Appointment scheduling
   - Billing and payment processing
   - AI-powered legal research
   - Document management with permissions
   - Comprehensive analytics and reporting
   - Role-based dashboards
   - Compliance management (DPA, LSK)
   - Security and audit logging
   - External integrations
   - Mobile-responsive frontend support

3. PERFORMANCE OPTIMIZATIONS:
   - Strategic indexing for dashboard queries
   - Stored procedures for complex operations
   - Views for simplified data access
   - Triggers for real-time updates
   - Analytics data aggregation

4. SECURITY FEATURES:
   - Encrypted sensitive data
   - Role-based access control
   - Audit logging
   - Session management
   - Activity tracking

5. SCALABILITY CONSIDERATIONS:
   - Modular table design
   - Efficient query patterns
   - Partitioning-ready structure
   - Caching-friendly architecture

The schema is production-ready and supports all frontend components and dashboard functionality identified in the LegalAI system.
*/