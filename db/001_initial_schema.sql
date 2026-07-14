-- ChipIn Kids — Database Schema
-- Migration: 001_initial_schema
-- Based on compliance report requirements for Michigan launch
-- Supports both Track A (Raffles for orgs) and Track B (Donation + Giveaway for parents)

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name     TEXT NOT NULL,
  phone         TEXT,
  address_line1 TEXT,
  address_city  TEXT,
  address_state TEXT,
  address_zip   TEXT,
  is_verified   BOOLEAN NOT NULL DEFAULT FALSE,
  is_admin      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_email ON users (email);

-- ============================================================
-- ORGANIZATIONS (Track A — verified nonprofits, schools, PTAs)
-- ============================================================
CREATE TABLE IF NOT EXISTS organizations (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                TEXT NOT NULL,
  org_type            TEXT NOT NULL CHECK (org_type IN (
    'school', 'pta', 'pto', 'booster_club', 'nonprofit', 'youth_sports', 'other'
  )),
  ein                 TEXT, -- IRS EIN / Tax ID
  is_501c3            BOOLEAN NOT NULL DEFAULT FALSE,
  mgcb_license_number TEXT, -- MGCB charitable gaming license number
  mgcb_license_expiry DATE, -- When the MGCB license expires
  mgcb_license_status TEXT CHECK (mgcb_license_status IN ('active', 'pending', 'expired', 'revoked')),
  org_established_at  DATE, -- Date org was established (must be 2+ years ago for MGCB)
  stripe_account_id   TEXT, -- Connected Stripe account for payouts
  verified_at         TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_organizations_mgcb ON organizations (mgcb_license_status);

-- Link users to organizations (officers, admins)
CREATE TABLE IF NOT EXISTS organization_members (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role            TEXT NOT NULL CHECK (role IN ('admin', 'officer', 'member')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (organization_id, user_id)
);

-- ============================================================
-- CAMPAIGNS (raffles + donation fundraisers)
-- ============================================================
CREATE TABLE IF NOT EXISTS campaigns (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Organizer: either an individual user (Track B) or an organization (Track A)
  organizer_user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
  organizer_organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  -- Exactly one of the above must be set; the other is NULL
  campaign_type     TEXT NOT NULL CHECK (campaign_type IN ('raffle', 'donation_giveaway')),
  title             TEXT NOT NULL,
  description       TEXT,
  goal_amount       INTEGER NOT NULL, -- in cents (e.g., $500 = 50000)
  raised_amount     INTEGER NOT NULL DEFAULT 0, -- in cents
  -- Raffle-specific (Track A)
  ticket_price      INTEGER, -- in cents (NULL for Track B)
  max_tickets       INTEGER, -- maximum tickets available (NULL = unlimited)
  -- Giveaway-specific (Track B)
  has_free_entry    BOOLEAN NOT NULL DEFAULT TRUE, -- AMOE available
  free_entry_url    TEXT, -- URL for the free entry method
  -- Status
  status            TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
    'draft', 'pending_approval', 'active', 'paused', 'completed', 'cancelled'
  )),
  -- Compliance (from compliance report)
  requires_mgcb_license BOOLEAN NOT NULL DEFAULT FALSE,
  mgcb_license_provided  BOOLEAN NOT NULL DEFAULT FALSE,
  geolocation_required   BOOLEAN NOT NULL DEFAULT TRUE,
  age_restriction        INTEGER NOT NULL DEFAULT 18, -- minimum age
  -- Stripe integration
  stripe_payment_link_id TEXT, -- Stripe payment link for donations/tickets
  -- Timing
  starts_at         TIMESTAMPTZ,
  ends_at           TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Ensure at least one organizer
  CONSTRAINT campaigns_has_organizer CHECK (
    (organizer_user_id IS NOT NULL) OR (organizer_organization_id IS NOT NULL)
  )
);

CREATE INDEX idx_campaigns_status ON campaigns (status);
CREATE INDEX idx_campaigns_organizer ON campaigns (organizer_user_id);
CREATE INDEX idx_campaigns_org ON campaigns (organizer_organization_id);
CREATE INDEX idx_campaigns_type ON campaigns (campaign_type);

-- ============================================================
-- PRIZES (for raffles and giveaways)
-- ============================================================
CREATE TABLE IF NOT EXISTS prizes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  description TEXT,
  value_cents INTEGER NOT NULL, -- prize value in cents (for IRS reporting)
  quantity    INTEGER NOT NULL DEFAULT 1, -- number of identical prizes
  image_url   TEXT,
  -- Winner selection
  drawn_at    TIMESTAMPTZ, -- when the winner was drawn
  winner_id   UUID REFERENCES users(id) ON DELETE SET NULL,
  notified_at TIMESTAMPTZ, -- when winner was notified
  claimed_at  TIMESTAMPTZ, -- when prize was claimed
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_prizes_campaign ON prizes (campaign_id);
CREATE INDEX idx_prizes_winner ON prizes (winner_id);

-- ============================================================
-- TRANSACTIONS (Stripe payment records)
-- ============================================================
CREATE TABLE IF NOT EXISTS transactions (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id         UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  donor_id            UUID REFERENCES users(id) ON DELETE SET NULL,
  -- Stripe identifiers
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_charge_id         TEXT,
  -- Amounts in cents
  amount_cents        INTEGER NOT NULL, -- gross amount paid
  platform_fee_cents  INTEGER NOT NULL DEFAULT 0, -- ChipIn Kids fee
  net_amount_cents    INTEGER NOT NULL, -- amount to campaign after fees
  -- Type
  transaction_type    TEXT NOT NULL CHECK (transaction_type IN (
    'donation', 'raffle_ticket_purchase', 'platform_fee'
  )),
  -- Status
  status              TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending', 'succeeded', 'failed', 'refunded', 'disputed'
  )),
  -- Geolocation (compliance requirement)
  ip_address          TEXT,
  geo_country         TEXT,
  geo_state           TEXT,
  -- Timestamps
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  settled_at          TIMESTAMPTZ -- when funds were settled/available
);

CREATE INDEX idx_transactions_campaign ON transactions (campaign_id);
CREATE INDEX idx_transactions_donor ON transactions (donor_id);
CREATE INDEX idx_transactions_stripe ON transactions (stripe_payment_intent_id);

-- ============================================================
-- ENTRIES (raffle tickets + giveaway entries)
-- ============================================================
CREATE TABLE IF NOT EXISTS entries (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id     UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
  -- Entry type
  entry_type      TEXT NOT NULL CHECK (entry_type IN (
    'purchased_ticket',   -- Track A: bought a raffle ticket
    'donation_entry',     -- Track B: donor receives entry as "thank you"
    'free_entry_amoe'     -- Track B: no-purchase-necessary AMOE entry
  )),
  transaction_id  UUID REFERENCES transactions(id) ON DELETE SET NULL, -- NULL for AMOE
  -- Raffle-specific
  ticket_number    INTEGER, -- sequential ticket number
  -- Geolocation (compliance)
  ip_address       TEXT,
  geo_state        TEXT,
  -- Winner
  is_winner        BOOLEAN NOT NULL DEFAULT FALSE,
  prize_id         UUID REFERENCES prizes(id) ON DELETE SET NULL,
  -- Timestamps
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- One entry per user per campaign per type (prevent abuse)
  UNIQUE (campaign_id, user_id, entry_type)
);

CREATE INDEX idx_entries_campaign ON entries (campaign_id);
CREATE INDEX idx_entries_user ON entries (user_id);
CREATE INDEX idx_entries_winner ON entries (campaign_id, is_winner);

-- ============================================================
-- COMPLIANCE RECORDS (MGCB reporting, audit trail)
-- ============================================================
CREATE TABLE IF NOT EXISTS compliance_records (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id         UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  record_type         TEXT NOT NULL CHECK (record_type IN (
    'mgcb_license', 'mgcb_report', 'age_verification',
    'geolocation_check', 'ameo_disclosure', 'tos_acceptance',
    'prize_report', 'audit_log'
  )),
  -- For MGCB reports
  tickets_sold        INTEGER,
  gross_revenue_cents INTEGER,
  prize_payout_cents  INTEGER,
  expenses_cents      INTEGER,
  net_proceeds_cents  INTEGER,
  -- For audit
  notes               TEXT,
  filed_at            TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by          UUID REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_compliance_campaign ON compliance_records (campaign_id);
CREATE INDEX idx_compliance_type ON compliance_records (record_type);