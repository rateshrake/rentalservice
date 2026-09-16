const { createClient } = require('@libsql/client');
const path = require('path');
const fs = require('fs');

let client = null;

function getDb(userDataPath) {
  if (!client) {
    const dbDir = userDataPath || path.join(__dirname, '..');
    const dbPath = path.join(dbDir, 'rentalservice.db');
    client = createClient({
      url: `file:${dbPath.replace(/\\/g, '/')}`,
    });
  }
  return client;
}

async function initDatabase(userDataPath) {
  const db = getDb(userDataPath);

  // Drop old table to ensure clean schema update
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      value TEXT NOT NULL,
      trend_val TEXT NOT NULL,
      trend_label TEXT NOT NULL,
      trend_direction TEXT NOT NULL,
      badge_type TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS rentals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      rental_code TEXT UNIQUE NOT NULL,
      customer_name TEXT NOT NULL,
      customer_phone TEXT,
      equipment_name TEXT NOT NULL,
      pickup_date TEXT,
      return_time TEXT NOT NULL,
      amount REAL NOT NULL,
      payment_status TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS attention_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      code TEXT NOT NULL,
      party_name TEXT NOT NULL,
      detail TEXT NOT NULL,
      badge_text TEXT NOT NULL,
      is_resolved INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS top_equipment (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      rank INTEGER NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      rentals_count INTEGER NOT NULL,
      earnings REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS revenue_trend (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date_label TEXT NOT NULL,
      revenue REAL NOT NULL,
      is_current INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      primary_phone TEXT NOT NULL,
      alternate_phone TEXT,
      email TEXT,
      location TEXT,
      total_rentals INTEGER DEFAULT 0,
      active_rentals INTEGER DEFAULT 0,
      outstanding_amount REAL DEFAULT 0,
      last_rental TEXT,
      verification TEXT DEFAULT 'Verified',
      avatar_type TEXT DEFAULT 'initials',
      avatar_text TEXT,
      avatar_img TEXT,
      customer_since TEXT,
      id_proof_type TEXT,
      id_proof_masked TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS inventory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      subtitle TEXT,
      category TEXT NOT NULL,
      asset_id TEXT UNIQUE NOT NULL,
      serial_number TEXT NOT NULL,
      rental_rate REAL NOT NULL,
      status TEXT NOT NULL,
      current_customer TEXT DEFAULT '-',
      expected_return TEXT DEFAULT '-',
      condition TEXT NOT NULL,
      image_url TEXT,
      lifetime_revenue REAL DEFAULT 0,
      lifetime_rentals INTEGER DEFAULT 0,
      utilization_rate REAL DEFAULT 0,
      purchase_date TEXT,
      warranty TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      transaction_id TEXT UNIQUE NOT NULL,
      rental_id TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      amount REAL NOT NULL,
      mode TEXT NOT NULL,
      type TEXT NOT NULL,
      collected_by TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      status TEXT NOT NULL,
      utr_reference TEXT,
      notes TEXT,
      equipment_name TEXT,
      rental_period TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS message_templates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      badge TEXT NOT NULL,
      snippet TEXT NOT NULL,
      body TEXT NOT NULL,
      icon_type TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS message_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT NOT NULL,
      initials TEXT NOT NULL,
      subject TEXT NOT NULL,
      channel TEXT NOT NULL,
      status TEXT NOT NULL,
      time TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      document_name TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      rental_id TEXT NOT NULL,
      type TEXT NOT NULL,
      file_type TEXT NOT NULL,
      uploaded_on_date TEXT NOT NULL,
      uploaded_on_time TEXT NOT NULL,
      verified_by TEXT NOT NULL,
      status TEXT NOT NULL,
      file_size TEXT NOT NULL,
      security TEXT NOT NULL,
      preview_data TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS settings_kv (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      email TEXT NOT NULL,
      status TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT NOT NULL,
      user TEXT NOT NULL,
      action TEXT NOT NULL,
      details TEXT NOT NULL,
      ip_address TEXT NOT NULL
    );
  `);

  // Ensure columns exist on rentals table
  try {
    await db.execute("ALTER TABLE rentals ADD COLUMN customer_phone TEXT");
  } catch (e) {}
  try {
    await db.execute("ALTER TABLE rentals ADD COLUMN pickup_date TEXT");
  } catch (e) {}

  // Check if rentals, customers, inventory, payments, messages, documents, or employees count is low, seed
  try {
    const countRes = await db.execute("SELECT COUNT(*) as count FROM rentals");
    const custRes = await db.execute("SELECT COUNT(*) as count FROM customers");
    const invRes = await db.execute("SELECT COUNT(*) as count FROM inventory");
    const payRes = await db.execute("SELECT COUNT(*) as count FROM payments");
    const msgRes = await db.execute("SELECT COUNT(*) as count FROM message_templates");
    const docRes = await db.execute("SELECT COUNT(*) as count FROM documents");
    const empRes = await db.execute("SELECT COUNT(*) as count FROM employees");
    if (countRes.rows[0].count < 40 || custRes.rows[0].count < 10 || invRes.rows[0].count < 10 || payRes.rows[0].count < 10 || msgRes.rows[0].count < 5 || docRes.rows[0].count < 10 || empRes.rows[0].count < 4) {
      await seedDatabase(db);
    }
  } catch (e) {
    await seedDatabase(db);
  }
}

async function seedDatabase(db) {
  // Clear and reseed stats
  await db.execute("DELETE FROM stats");
  await db.executeMultiple(`
    INSERT INTO stats (key, title, value, trend_val, trend_label, trend_direction, badge_type) VALUES
    ('active_rentals', 'Active Rentals', '18', '↑ 2', 'vs. last week', 'up', 'emerald'),
    ('due_today', 'Due Today', '4', '→ 0', 'vs. yesterday', 'neutral', 'neutral'),
    ('overdue_rentals', 'Overdue Rentals', '3', '↑ 1', 'vs. yesterday', 'up', 'rose'),
    ('available_equipment', 'Available Equipment', '42', '↑ 3', 'vs. last week', 'up', 'emerald'),
    ('pending_payments', 'Pending Payments', '₹28,500', '↑ 2', 'in 5 invoices', 'up', 'rose'),
    ('revenue_today', 'Revenue Today', '₹12,800', '↑ 18%', 'vs. yesterday', 'up', 'emerald'),
    ('draft_rentals', 'Draft Rentals', '2', '↑ 1', 'vs. last week', 'up', 'emerald');
  `);

  // Clear and reseed rentals
  await db.execute("DELETE FROM rentals");
  
  const seedRentals = [
    { code: 'RNT-2025-021', name: 'Vikram Shah', phone: '+91 98765 43210', equip: 'Sony A7 IV', pickup: '24 May 2025 10:00 AM', returnTime: '27 May 2025 6:00 PM', amount: 4000, pay: 'Paid', status: 'Due Today' },
    { code: 'RNT-2025-022', name: 'Aditi Rao', phone: '+91 98123 45678', equip: 'Canon R6 Mark II + 24-70mm GM II', pickup: '25 May 2025 9:00 AM', returnTime: '27 May 2025 8:00 PM', amount: 6500, pay: 'Paid', status: 'Due Today' },
    { code: 'RNT-2025-023', name: 'Karan Films', phone: '+91 98200 11223', equip: 'DJI RS 4', pickup: '24 May 2025 11:00 AM', returnTime: '27 May 2025 9:00 PM', amount: 2800, pay: 'Pending', status: 'Due Today' },
    { code: 'RNT-2025-024', name: 'Neha Singh', phone: '+91 98987 65432', equip: 'Sigma 85mm F1.4', pickup: '26 May 2025 2:00 PM', returnTime: '26 May 2025 7:00 PM', amount: 2500, pay: 'Paid', status: 'Returned' },
    { code: 'RNT-2025-025', name: 'Arjun Mehta', phone: '+91 97654 32109', equip: 'Sony 24-70mm GM II', pickup: '22 May 2025 10:00 AM', returnTime: '26 May 2025 6:00 PM', amount: 4500, pay: 'Paid', status: 'Overdue' },
    { code: 'RNT-2025-026', name: 'Sneha Kapoor', phone: '+91 90011 22334', equip: 'Canon R5', pickup: '25 May 2025 1:00 PM', returnTime: '28 May 2025 6:00 PM', amount: 5000, pay: 'Paid', status: 'Active' },
    { code: 'RNT-2025-027', name: 'Rohit Verma', phone: '+91 98712 34567', equip: 'Godox SL60W (x2)', pickup: '27 May 2025 9:00 AM', returnTime: '29 May 2025 9:00 PM', amount: 1800, pay: 'Paid', status: 'Active' },
    { code: 'RNT-2025-028', name: 'Pixel Frame Studio', phone: '+91 99100 77665', equip: 'Canon R6 Mark II', pickup: '28 May 2025 10:00 AM', returnTime: '31 May 2025 6:00 PM', amount: 3500, pay: 'Unpaid', status: 'Reserved' },
    { code: 'RNT-2025-029', name: 'Tanvi Desai', phone: '+91 98213 44556', equip: 'DJI Mini 4 Pro', pickup: '28 May 2025 11:00 AM', returnTime: '30 May 2025 6:00 PM', amount: 2200, pay: 'Paid', status: 'Reserved' },
    { code: 'RNT-2025-030', name: 'Mumbai Creators', phone: '+91 99302 99887', equip: 'Complete Video Kit ( A7 IV + RS 4 )', pickup: '27 May 2025 8:00 AM', returnTime: '28 May 2025 8:00 PM', amount: 8000, pay: 'Paid', status: 'Active' },
    { code: 'RNT-2025-031', name: 'Rahul Sharma', phone: '+91 98451 22334', equip: 'Sony FX3 Cinema Line', pickup: '25 May 2025 11:00 AM', returnTime: '28 May 2025 5:00 PM', amount: 9000, pay: 'Paid', status: 'Active' },
    { code: 'RNT-2025-032', name: 'Deepak Patel', phone: '+91 98190 44556', equip: 'Aputure 300d II Light Kit', pickup: '26 May 2025 10:00 AM', returnTime: '29 May 2025 7:00 PM', amount: 3200, pay: 'Paid', status: 'Active' },
    { code: 'RNT-2025-033', name: 'Pooja Hegde Productions', phone: '+91 98211 77889', equip: 'Sony FE 70-200mm f/2.8 GM OSS II', pickup: '25 May 2025 2:00 PM', returnTime: '28 May 2025 8:00 PM', amount: 3800, pay: 'Pending', status: 'Active' },
    { code: 'RNT-2025-034', name: 'Ananya Roy', phone: '+91 97112 33445', equip: 'Rode Wireless PRO Mic Kit', pickup: '26 May 2025 1:00 PM', returnTime: '29 May 2025 6:00 PM', amount: 1500, pay: 'Paid', status: 'Active' },
    { code: 'RNT-2025-035', name: 'Cinematic Vibes Studio', phone: '+91 99201 55667', equip: 'Blackmagic Pocket 6K Pro', pickup: '25 May 2025 9:00 AM', returnTime: '28 May 2025 7:00 PM', amount: 6000, pay: 'Paid', status: 'Active' },
    { code: 'RNT-2025-036', name: 'Manish Malhotra Photography', phone: '+91 98334 11223', equip: 'Nikon Z8 + 24-70mm f/2.8', pickup: '26 May 2025 11:30 AM', returnTime: '29 May 2025 6:30 PM', amount: 7200, pay: 'Paid', status: 'Active' },
    { code: 'RNT-2025-037', name: 'Studio 99 Films', phone: '+91 99881 22334', equip: 'Sennheiser MKH 416 Boom Mic', pickup: '25 May 2025 10:00 AM', returnTime: '28 May 2025 8:00 PM', amount: 1800, pay: 'Paid', status: 'Active' },
    { code: 'RNT-2025-038', name: 'Gaurav Kulkarni', phone: '+91 98670 44556', equip: 'Fujifilm X-T5 + 16-55mm f/2.8', pickup: '26 May 2025 10:00 AM', returnTime: '29 May 2025 5:00 PM', amount: 3600, pay: 'Paid', status: 'Active' },
    { code: 'RNT-2025-039', name: 'Rohan Joshi', phone: '+91 98112 55667', equip: 'Nanlite Forza 500B II', pickup: '25 May 2025 2:00 PM', returnTime: '28 May 2025 9:00 PM', amount: 4200, pay: 'Paid', status: 'Active' },
    { code: 'RNT-2025-040', name: 'Urban Lens Agency', phone: '+91 99223 66778', equip: 'Sony FX6 Full-Frame Cinema', pickup: '26 May 2025 8:00 AM', returnTime: '29 May 2025 8:00 PM', amount: 11000, pay: 'Paid', status: 'Active' },
    { code: 'RNT-2025-041', name: 'Vikas Nanda', phone: '+91 98440 99887', equip: 'DJI RS 3 Pro Combo', pickup: '25 May 2025 11:00 AM', returnTime: '28 May 2025 7:00 PM', amount: 2500, pay: 'Paid', status: 'Active' },
    { code: 'RNT-2025-042', name: 'Shreya Ghoshal Studio', phone: '+91 98205 11223', equip: 'Canon RF 50mm f/1.2L USM', pickup: '26 May 2025 1:00 PM', returnTime: '29 May 2025 6:00 PM', amount: 2800, pay: 'Paid', status: 'Active' },
    { code: 'RNT-2025-043', name: 'Nitin Gadre', phone: '+91 98710 33445', equip: 'Atomos Ninja V+ Monitor', pickup: '25 May 2025 10:00 AM', returnTime: '28 May 2025 7:00 PM', amount: 1400, pay: 'Paid', status: 'Active' },
    { code: 'RNT-2025-044', name: 'Pixel Story Weddings', phone: '+91 99334 55667', equip: 'Sony A7R V + 35mm f/1.4 GM', pickup: '26 May 2025 9:00 AM', returnTime: '29 May 2025 9:00 PM', amount: 7500, pay: 'Paid', status: 'Active' },
    { code: 'RNT-2025-045', name: 'Amit Trivedi Media', phone: '+91 98119 77889', equip: 'Hollyland Mars 4K Wireless Video', pickup: '25 May 2025 12:00 PM', returnTime: '28 May 2025 6:00 PM', amount: 2000, pay: 'Paid', status: 'Active' },
    { code: 'RNT-2025-046', name: 'Siddharth Roy', phone: '+91 98901 22334', equip: 'Sony FX30 Cinema Camera', pickup: '25 May 2025 9:00 AM', returnTime: '27 May 2025 7:30 PM', amount: 3500, pay: 'Paid', status: 'Due Today' },
    { code: 'RNT-2025-014', name: 'Arjun Mehta', phone: '+91 97654 32109', equip: 'Sony A7 IV', pickup: '20 May 2025 10:00 AM', returnTime: '25 May 2025 6:00 PM', amount: 4000, pay: 'Paid', status: 'Overdue' },
    { code: 'RNT-2025-017', name: 'Sneha Kapoor', phone: '+91 90011 22334', equip: 'Canon R6 Mark II', pickup: '21 May 2025 11:00 AM', returnTime: '26 May 2025 7:00 PM', amount: 4500, pay: 'Paid', status: 'Overdue' },
    { code: 'RNT-2025-047', name: 'Meera Rajput', phone: '+91 98331 44556', equip: 'GoPro Hero 12 Black Bundle', pickup: '29 May 2025 10:00 AM', returnTime: '02 Jun 2025 6:00 PM', amount: 2400, pay: 'Paid', status: 'Reserved' },
    { code: 'RNT-2025-048', name: 'Visionary Films India', phone: '+91 99112 55667', equip: 'RED Komodo 6K Cinema Camera', pickup: '30 May 2025 9:00 AM', returnTime: '03 Jun 2025 8:00 PM', amount: 22000, pay: 'Unpaid', status: 'Reserved' },
    { code: 'RNT-2025-049', name: 'Anil Kapoor Photography', phone: '+91 98223 77889', equip: 'Sony 50mm f/1.2 GM Lens', pickup: '29 May 2025 1:00 PM', returnTime: '01 Jun 2025 7:00 PM', amount: 3000, pay: 'Paid', status: 'Reserved' },
    { code: 'RNT-2025-015', name: 'Prakash Rao', phone: '+91 98450 11223', equip: 'DJI Ronin-S Gimbal', pickup: '22 May 2025 10:00 AM', returnTime: '24 May 2025 6:00 PM', amount: 1800, pay: 'Paid', status: 'Returned' },
    { code: 'RNT-2025-016', name: 'Sunil Chhetri Media', phone: '+91 98110 33445', equip: 'Canon RF 70-200mm f/2.8L', pickup: '21 May 2025 9:00 AM', returnTime: '24 May 2025 8:00 PM', amount: 4200, pay: 'Paid', status: 'Returned' },
    { code: 'RNT-2025-018', name: 'Pooja Bhatt', phone: '+91 98201 44556', equip: 'Godox AD600 Pro Strobe', pickup: '22 May 2025 11:00 AM', returnTime: '25 May 2025 6:00 PM', amount: 2500, pay: 'Paid', status: 'Returned' },
    { code: 'RNT-2025-019', name: 'Manish Sisodia', phone: '+91 99119 66778', equip: 'Sony 16-35mm f/2.8 GM II', pickup: '22 May 2025 1:00 PM', returnTime: '25 May 2025 7:00 PM', amount: 3400, pay: 'Paid', status: 'Returned' },
    { code: 'RNT-2025-020', name: 'Creative Pulse Studio', phone: '+91 98330 88990', equip: 'Tilta Mirage Matte Box', pickup: '23 May 2025 10:00 AM', returnTime: '25 May 2025 8:00 PM', amount: 1200, pay: 'Paid', status: 'Returned' },
    { code: 'RNT-2025-011', name: 'Harsh Vardhan', phone: '+91 98451 99887', equip: 'Sony A7S III', pickup: '20 May 2025 10:00 AM', returnTime: '23 May 2025 6:00 PM', amount: 6000, pay: 'Paid', status: 'Returned' },
    { code: 'RNT-2025-012', name: 'Nisha Singhania', phone: '+91 98210 11223', equip: 'Sigma 24-70mm f/2.8 Art', pickup: '20 May 2025 11:00 AM', returnTime: '23 May 2025 7:00 PM', amount: 2200, pay: 'Paid', status: 'Returned' },
    { code: 'RNT-2025-013', name: 'Bombay Cinema Guild', phone: '+91 99880 33445', equip: 'Easyrig Vario 5 with Gimbal Rig Vest', pickup: '19 May 2025 9:00 AM', returnTime: '23 May 2025 8:00 PM', amount: 4500, pay: 'Paid', status: 'Returned' },
    { code: 'RNT-2025-008', name: 'Kabir Khan Docs', phone: '+91 98112 44556', equip: 'Zoom F8n Pro Field Recorder', pickup: '18 May 2025 10:00 AM', returnTime: '22 May 2025 6:00 PM', amount: 3000, pay: 'Paid', status: 'Returned' },
    { code: 'RNT-2025-009', name: 'Kriti Sanon Media', phone: '+91 98209 66778', equip: 'Sony FE 85mm f/1.4 GM', pickup: '18 May 2025 1:00 PM', returnTime: '22 May 2025 7:00 PM', amount: 2800, pay: 'Paid', status: 'Returned' },
    { code: 'RNT-2025-010', name: 'Apex Motion Pictures', phone: '+91 99331 88990', equip: 'Dana Dolly Portable Camera Kit', pickup: '18 May 2025 9:00 AM', returnTime: '22 May 2025 8:00 PM', amount: 2000, pay: 'Paid', status: 'Returned' },
  ];

  for (const r of seedRentals) {
    await db.execute({
      sql: `INSERT INTO rentals (rental_code, customer_name, customer_phone, equipment_name, pickup_date, return_time, amount, payment_status, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [r.code, r.name, r.phone, r.equip, r.pickup, r.returnTime, r.amount, r.pay, r.status]
    });
  }

  // Attention & top equipment
  await db.execute("DELETE FROM attention_items");
  await db.executeMultiple(`
    INSERT INTO attention_items (type, code, party_name, detail, badge_text) VALUES
    ('overdue', 'RNT-2025-014', 'Arjun Mehta', 'Sony A7 IV', '2 days overdue'),
    ('overdue', 'RNT-2025-017', 'Sneha Kapoor', 'Canon R6 Mark II', '1 day overdue'),
    ('payment', 'INV-2025-031', 'Karan Films', '₹12,000', '3 days old'),
    ('payment', 'INV-2025-028', 'Pixel Frame Studio', '₹8,500', '2 days old');
  `);

  await db.execute("DELETE FROM top_equipment");
  await db.executeMultiple(`
    INSERT INTO top_equipment (rank, name, category, rentals_count, earnings) VALUES
    (1, 'Sony A7 IV', 'camera', 28, 56000),
    (2, 'Canon R6 Mark II', 'camera', 24, 48000),
    (3, 'DJI RS 4', 'gimbal', 18, 27000),
    (4, 'Sony 24-70mm GM II', 'lens', 16, 24000),
    (5, 'Sigma 85mm F1.4', 'lens', 14, 18500);
  `);

  await db.execute("DELETE FROM revenue_trend");
  await db.executeMultiple(`
    INSERT INTO revenue_trend (date_label, revenue, is_current) VALUES
    ('21 May', 13000, 0),
    ('22 May', 17000, 0),
    ('23 May', 11000, 0),
    ('24 May', 19000, 0),
    ('25 May', 19500, 0),
    ('26 May', 28000, 0),
    ('27 May', 12800, 1);
  `);

  // Clear and reseed customers
  await db.execute("DELETE FROM customers");
  const seedCustomers = [
    { code: 'CUST-001', name: 'Vikram Shah', phone: '+91 98765 43210', alt: '+91 91234 56789', email: 'vikram.shah@gmail.com', loc: 'Mumbai, Maharashtra', rentals: 18, active: 2, out: 12800, last: '26 May 2025', ver: 'Verified', aType: 'photo', aImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', aText: '', since: '12 Jan 2024', idType: 'Identity Proof (Aadhaar)', idNum: '**** **** 1234', notes: 'Regular customer. Prefer Sony and Canon gear. Usually rents for wedding shoots. Good payment history.' },
    { code: 'CUST-002', name: 'Aditi Rao', phone: '+91 98765 11122', alt: '+91 98111 22334', email: 'aditi.rao@gmail.com', loc: 'Pune, Maharashtra', rentals: 12, active: 1, out: 6500, last: '24 May 2025', ver: 'Verified', aType: 'photo', aImg: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', aText: '', since: '05 Feb 2024', idType: 'Identity Proof (Aadhaar)', idNum: '**** **** 5678', notes: 'Fashion photographer. Prefers RF series primes and 24-70 GM zoom lenses.' },
    { code: 'CUST-003', name: 'Karan Films', phone: '+91 99887 66554', alt: '-', email: 'contact@karanfilms.in', loc: 'Mumbai, Maharashtra', rentals: 28, active: 0, out: 0, last: '20 May 2025', ver: 'Verified', aType: 'initials', aImg: '', aText: 'KF', since: '18 Nov 2023', idType: 'Identity Proof (GSTIN)', idNum: '**** **** 9012', notes: 'Full service commercial video production house. Reliable long-term corporate client.' },
    { code: 'CUST-004', name: 'Neha Singh', phone: '+91 98712 33456', alt: '+91 98998 77665', email: 'neha.singh@creator.in', loc: 'Navi Mumbai', rentals: 9, active: 1, out: 2500, last: '27 May 2025', ver: 'Pending', aType: 'initials', aImg: '', aText: 'NS', since: '14 Mar 2024', idType: 'Identity Proof (PAN)', idNum: '**** **** 3456', notes: 'Documentary creator. ID verification pending re-upload of address proof.' },
    { code: 'CUST-005', name: 'Rohit Mehta', phone: '+91 98123 44556', alt: '-', email: 'rohit.m@gmail.com', loc: 'Thane, Maharashtra', rentals: 6, active: 0, out: 0, last: '18 May 2025', ver: 'Verified', aType: 'photo', aImg: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', aText: '', since: '22 Apr 2024', idType: 'Identity Proof (Aadhaar)', idNum: '**** **** 7890', notes: 'Commercial portraits photographer.' },
    { code: 'CUST-006', name: 'Sneha Kapoor', phone: '+91 99999 12345', alt: '+91 98877 66554', email: 'sneha.k@kapoorproductions.com', loc: 'Mumbai, Maharashtra', rentals: 15, active: 3, out: 28000, last: '25 May 2025', ver: 'Verified', aType: 'photo', aImg: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', aText: '', since: '10 Oct 2023', idType: 'Identity Proof (Aadhaar)', idNum: '**** **** 2345', notes: 'Feature film director. High-value camera bodies and cinema zooms.' },
    { code: 'CUST-007', name: 'Arjun Verma', phone: '+91 98700 11223', alt: '-', email: 'arjun.v@gmail.com', loc: 'Mumbai, Maharashtra', rentals: 4, active: 0, out: 0, last: '15 May 2025', ver: 'Verified', aType: 'initials', aImg: '', aText: 'AV', since: '01 May 2024', idType: 'Identity Proof (Aadhaar)', idNum: '**** **** 6789', notes: 'Indie short filmmaker. Uses gimbal kits and prime packages.' },
    { code: 'CUST-008', name: 'Priya Nair', phone: '+91 98456 77890', alt: '+91 98765 44321', email: 'priya.nair@lensart.com', loc: 'Bengaluru, Karnataka', rentals: 11, active: 1, out: 4000, last: '22 May 2025', ver: 'Pending', aType: 'photo', aImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', aText: '', since: '19 Jan 2024', idType: 'Identity Proof (Passport)', idNum: '**** **** 0123', notes: 'Wildlife and travel documentary shooter.' },
    { code: 'CUST-009', name: 'Sameer Khan', phone: '+91 99123 55667', alt: '-', email: 'sameer.khan@motionlabs.io', loc: 'Mumbai, Maharashtra', rentals: 7, active: 0, out: 0, last: '19 May 2025', ver: 'Verified', aType: 'initials', aImg: '', aText: 'SK', since: '11 Dec 2023', idType: 'Identity Proof (Aadhaar)', idNum: '**** **** 4567', notes: 'Music video director. Rents high speed lighting and anamorphic lenses.' },
    { code: 'CUST-010', name: 'Ananya Das', phone: '+91 97654 33221', alt: '+91 98990 11223', email: 'ananya.das@studiodas.com', loc: 'Kolkata / Mumbai', rentals: 10, active: 1, out: 8500, last: '26 May 2025', ver: 'Verified', aType: 'photo', aImg: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', aText: '', since: '03 Feb 2024', idType: 'Identity Proof (Aadhaar)', idNum: '**** **** 8901', notes: 'Advertising producer. Rents camera packages for multi-day TV commercial sets.' }
  ];

  for (const c of seedCustomers) {
    await db.execute({
      sql: `INSERT INTO customers (code, name, primary_phone, alternate_phone, email, location, total_rentals, active_rentals, outstanding_amount, last_rental, verification, avatar_type, avatar_img, avatar_text, customer_since, id_proof_type, id_proof_masked, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [c.code, c.name, c.phone, c.alt, c.email, c.loc, c.rentals, c.active, c.out, c.last, c.ver, c.aType, c.aImg, c.aText, c.since, c.idType, c.idNum, c.notes]
    });
  }
  // Clear and reseed inventory
  await db.execute("DELETE FROM inventory");
  const seedInventory = [
    { name: 'Sony A7 IV', sub: 'Full Frame Mirrorless Camera', cat: 'Cameras', asset: 'CAM-001', serial: 'ILCE7M4-3281', rate: 4000, status: 'Rented Out', cust: 'Vikram Shah', retDate: '27 May 2025', cond: 'Excellent', img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&auto=format&fit=crop&q=80', rev: 124000, rentals: 31, util: 68, pDate: '12 Jan 2024', war: 'Valid till 12 Jan 2026' },
    { name: 'Canon R6 Mark II', sub: 'Full Frame Mirrorless Camera', cat: 'Cameras', asset: 'CAM-002', serial: '3C2A001234', rate: 3500, status: 'Available', cust: '-', retDate: '-', cond: 'Excellent', img: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&auto=format&fit=crop&q=80', rev: 98000, rentals: 28, util: 62, pDate: '20 Feb 2024', war: 'Valid till 20 Feb 2026' },
    { name: 'DJI RS 4', sub: '3-Axis Gimbal Stabilizer', cat: 'Gimbals', asset: 'GIM-001', serial: '6Y7DK3X512', rate: 1500, status: 'Reserved', cust: 'Neha Singh', retDate: '29 May 2025', cond: 'Good', img: 'https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?w=400&auto=format&fit=crop&q=80', rev: 45000, rentals: 30, util: 55, pDate: '15 Mar 2024', war: 'Valid till 15 Mar 2025' },
    { name: 'Canon RF 24-70mm GM II', sub: 'Standard Zoom Lens', cat: 'Lenses', asset: 'LEN-001', serial: 'RF2470GM2-981', rate: 1200, status: 'Available', cust: '-', retDate: '-', cond: 'Excellent', img: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=400&auto=format&fit=crop&q=80', rev: 36000, rentals: 30, util: 59, pDate: '10 Jan 2024', war: 'Valid till 10 Jan 2026' },
    { name: 'Sony 24-70mm GM II', sub: 'F2.8 G Master Standard Zoom', cat: 'Lenses', asset: 'LEN-002', serial: 'S2470GM2-776', rate: 1000, status: 'Maintenance', cust: '-', retDate: '-', cond: 'Good', img: 'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=400&auto=format&fit=crop&q=80', rev: 52000, rentals: 48, util: 70, pDate: '05 Jan 2024', war: 'Valid till 05 Jan 2026' },
    { name: 'DJI Mic 2', sub: 'Wireless Microphone System (2 TX + 1 RX)', cat: 'Audio', asset: 'AUD-001', serial: 'DMIC2-4456', rate: 800, status: 'Available', cust: '-', retDate: '-', cond: 'Excellent', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&auto=format&fit=crop&q=80', rev: 28000, rentals: 35, util: 64, pDate: '18 Feb 2024', war: 'Valid till 18 Feb 2025' },
    { name: 'Aputure 300D II', sub: 'Point-Source Daylight LED Light', cat: 'Lighting', asset: 'LGT-001', serial: 'AP300D2-1189', rate: 1800, status: 'Rented Out', cust: 'Karan Films', retDate: '30 May 2025', cond: 'Good', img: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400&auto=format&fit=crop&q=80', rev: 62000, rentals: 34, util: 58, pDate: '02 Dec 2023', war: 'Valid till 02 Dec 2025' },
    { name: 'Manfrotto 190X', sub: 'Aluminum 3-Section Video Tripod', cat: 'Tripods', asset: 'TRI-001', serial: 'MFT190X-2231', rate: 600, status: 'Available', cust: '-', retDate: '-', cond: 'Excellent', img: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&auto=format&fit=crop&q=80', rev: 19500, rentals: 32, util: 50, pDate: '14 Jan 2024', war: 'Valid till 14 Jan 2029' },
    { name: 'Sigma 85mm F1.4', sub: 'DG DN Art Prime Lens', cat: 'Lenses', asset: 'LEN-003', serial: 'SG8514-6678', rate: 900, status: 'Damaged', cust: '-', retDate: '-', cond: 'Needs Repair', img: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=400&auto=format&fit=crop&q=80', rev: 29000, rentals: 32, util: 45, pDate: '10 Feb 2024', war: 'Valid till 10 Feb 2026' },
    { name: 'Rode NTG5', sub: 'Broadcast Shotgun Microphone Kit', cat: 'Audio', asset: 'AUD-002', serial: 'RNTG5-9023', rate: 700, status: 'Available', cust: '-', retDate: '-', cond: 'Excellent', img: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&auto=format&fit=crop&q=80', rev: 24500, rentals: 35, util: 61, pDate: '08 Jan 2024', war: 'Valid till 08 Jan 2034' },
  ];

  for (const item of seedInventory) {
    await db.execute({
      sql: `INSERT INTO inventory (name, subtitle, category, asset_id, serial_number, rental_rate, status, current_customer, expected_return, condition, image_url, lifetime_revenue, lifetime_rentals, utilization_rate, purchase_date, warranty)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [item.name, item.sub, item.cat, item.asset, item.serial, item.rate, item.status, item.cust, item.retDate, item.cond, item.img, item.rev, item.rentals, item.util, item.pDate, item.war]
    });
  }

  // Clear and reseed payments
  await db.execute("DELETE FROM payments");
  const seedPayments = [
    { tx: 'PAY-2025-0542', rnt: 'RNT-2025-021', cust: 'Vikram Shah', amt: 4000, mode: 'UPI', type: 'Rental', col: 'Ravi Kumar', date: '27 May 2025', time: '06:00 PM', status: 'Paid', utr: 'UPI2874963201', notes: 'Payment received for Sony A7 IV rental (3 days).', eq: 'Sony A7 IV', period: '21 May – 24 May 2025' },
    { tx: 'PAY-2025-0541', rnt: 'RNT-2025-022', cust: 'Aditi Rao', amt: 6500, mode: 'Card', type: 'Rental', col: 'Priya Sharma', date: '27 May 2025', time: '04:20 PM', status: 'Pending', utr: 'CARD9842103', notes: 'Card payment authorization pending verification.', eq: 'Canon R6 Mark II + 24-70mm GM II', period: '25 May – 27 May 2025' },
    { tx: 'PAY-2025-0540', rnt: 'RNT-2025-020', cust: 'Karan Films', amt: 10000, mode: 'Bank Transfer', type: 'Deposit', col: 'Ravi Kumar', date: '27 May 2025', time: '01:15 PM', status: 'Deposit', utr: 'IMPS7729104', notes: 'Security deposit held for high-end cinema equipment.', eq: 'RED Komodo 6K Cinema Camera', period: '27 May – 30 May 2025' },
    { tx: 'PAY-2025-0539', rnt: 'RNT-2025-018', cust: 'Neha Singh', amt: 2800, mode: 'Cash', type: 'Rental', col: 'Amit Patel', date: '26 May 2025', time: '08:45 PM', status: 'Paid', utr: 'CASH-REC-091', notes: 'Cash received at reception counter.', eq: 'Sigma 85mm F1.4', period: '26 May – 27 May 2025' },
    { tx: 'PAY-2025-0538', rnt: 'RNT-2025-017', cust: 'Sneha Kapoor', amt: 12000, mode: 'UPI', type: 'Rental', col: 'Priya Sharma', date: '26 May 2025', time: '05:30 PM', status: 'Partial', utr: 'UPI99120482', notes: 'First installment of 24,000 received.', eq: 'Sony FX3 Cinema Line', period: '25 May – 28 May 2025' },
    { tx: 'PAY-2025-0537', rnt: 'RNT-2025-016', cust: 'Arjun Mehta', amt: 8000, mode: 'Card', type: 'Rental', col: 'Ravi Kumar', date: '26 May 2025', time: '12:10 PM', status: 'Paid', utr: 'CARD6619284', notes: 'Card payment processed successfully.', eq: 'Sony 24-70mm GM II', period: '22 May – 26 May 2025' },
    { tx: 'PAY-2025-0536', rnt: 'RNT-2025-015', cust: 'Pixel Frame Studio', amt: 5000, mode: 'Bank Transfer', type: 'Refund', col: 'Ravi Kumar', date: '25 May 2025', time: '04:00 PM', status: 'Refund', utr: 'NEFT3391024', notes: 'Deposit refund after equipment inspection cleared.', eq: 'Canon R6 Mark II', period: '20 May – 24 May 2025' },
    { tx: 'PAY-2025-0535', rnt: 'RNT-2025-014', cust: 'Rohit Malhotra', amt: 9000, mode: 'UPI', type: 'Rental', col: 'Amit Patel', date: '25 May 2025', time: '11:25 AM', status: 'Paid', utr: 'UPI66291045', notes: 'Full rental advance via Google Pay.', eq: 'Sony A7 IV', period: '20 May – 25 May 2025' },
    { tx: 'PAY-2025-0534', rnt: 'RNT-2025-013', cust: 'Simran Kaur', amt: 15000, mode: 'Card', type: 'Deposit', col: 'Priya Sharma', date: '24 May 2025', time: '07:10 PM', status: 'Deposit', utr: 'CARD1182903', notes: 'Caution deposit for lighting package.', eq: 'Aputure 300d II Light Kit', period: '24 May – 28 May 2025' },
    { tx: 'PAY-2025-0533', rnt: 'RNT-2025-012', cust: 'Design Hub', amt: 3500, mode: 'UPI', type: 'Rental', col: 'Ravi Kumar', date: '24 May 2025', time: '03:20 PM', status: 'Partial', utr: 'UPI33918274', notes: 'Partial advance paid online.', eq: 'DJI RS 4', period: '24 May – 27 May 2025' },
    { tx: 'PAY-2025-0532', rnt: 'RNT-2025-010', cust: 'Rahul Verma', amt: 4500, mode: 'Cash', type: 'Rental', col: 'Ravi Kumar', date: '24 May 2025', time: '11:00 AM', status: 'Paid', utr: 'CASH-REC-089', notes: 'Counter payment.', eq: 'Canon RF 50mm f/1.2L', period: '21 May – 23 May 2025' },
    { tx: 'PAY-2025-0531', rnt: 'RNT-2025-009', cust: 'Pooja Hegde', amt: 7200, mode: 'UPI', type: 'Rental', col: 'Priya Sharma', date: '23 May 2025', time: '06:15 PM', status: 'Paid', utr: 'UPI55192834', notes: 'Weekend commercial shoot.', eq: 'Sony FE 70-200mm f/2.8', period: '20 May – 23 May 2025' },
    { tx: 'PAY-2025-0530', rnt: 'RNT-2025-008', cust: 'Deepak Patel', amt: 3200, mode: 'Card', type: 'Rental', col: 'Amit Patel', date: '23 May 2025', time: '02:40 PM', status: 'Paid', utr: 'CARD7719203', notes: 'Swiped at studio.', eq: 'Aputure 300D II', period: '21 May – 23 May 2025' },
    { tx: 'PAY-2025-0529', rnt: 'RNT-2025-007', cust: 'Studio 99 Films', amt: 2500, mode: 'Bank Transfer', type: 'Refund', col: 'Ravi Kumar', date: '23 May 2025', time: '11:30 AM', status: 'Refund', utr: 'IMPS8829102', notes: 'Security deposit balance refund.', eq: 'Sennheiser MKH 416', period: '19 May – 22 May 2025' },
    { tx: 'PAY-2025-0528', rnt: 'RNT-2025-006', cust: 'Urban Lens Agency', amt: 22000, mode: 'Bank Transfer', type: 'Deposit', col: 'Ravi Kumar', date: '22 May 2025', time: '05:00 PM', status: 'Deposit', utr: 'NEFT9921045', notes: 'Corporate deposit for multi-camera production.', eq: 'Sony FX6 Full-Frame Cinema', period: '22 May – 29 May 2025' },
    { tx: 'PAY-2025-0527', rnt: 'RNT-2025-005', cust: 'Manish Sisodia', amt: 3400, mode: 'UPI', type: 'Rental', col: 'Priya Sharma', date: '22 May 2025', time: '01:20 PM', status: 'Paid', utr: 'UPI11928374', notes: 'Google Pay transfer.', eq: 'Sony 16-35mm f/2.8 GM II', period: '19 May – 22 May 2025' },
    { tx: 'PAY-2025-0526', rnt: 'RNT-2025-004', cust: 'Creative Pulse', amt: 8500, mode: 'UPI', type: 'Rental', col: 'Ravi Kumar', date: '22 May 2025', time: '10:15 AM', status: 'Pending', utr: 'UPI00928341', notes: 'Awaiting client approval for UPI link.', eq: 'Canon R5 + 24-70mm', period: '20 May – 23 May 2025' },
    { tx: 'PAY-2025-0525', rnt: 'RNT-2025-003', cust: 'Kabir Docs', amt: 3000, mode: 'Cash', type: 'Rental', col: 'Amit Patel', date: '21 May 2025', time: '04:50 PM', status: 'Paid', utr: 'CASH-REC-085', notes: 'Documentary shoot equipment fee.', eq: 'Zoom F8n Pro Field Recorder', period: '18 May – 21 May 2025' },
    { tx: 'PAY-2025-0524', rnt: 'RNT-2025-002', cust: 'Visionary Films', amt: 18000, mode: 'Bank Transfer', type: 'Deposit', col: 'Ravi Kumar', date: '21 May 2025', time: '12:00 PM', status: 'Deposit', utr: 'IMPS4491823', notes: 'Equipment caution deposit.', eq: 'RED Komodo 6K', period: '22 May – 26 May 2025' },
    { tx: 'PAY-2025-0523', rnt: 'RNT-2025-001', cust: 'Harsh Vardhan', amt: 6000, mode: 'Card', type: 'Rental', col: 'Priya Sharma', date: '20 May 2025', time: '06:30 PM', status: 'Paid', utr: 'CARD3381920', notes: 'Card transaction approved.', eq: 'Sony A7S III', period: '17 May – 20 May 2025' },
    { tx: 'PAY-2025-0522', rnt: 'RNT-2025-025', cust: 'Apex Motion', amt: 5000, mode: 'UPI', type: 'Rental', col: 'Ravi Kumar', date: '20 May 2025', time: '02:15 PM', status: 'Pending', utr: 'UPI66291834', notes: 'Follow up required with accountant.', eq: 'Dana Dolly Kit', period: '18 May – 21 May 2025' },
    { tx: 'PAY-2025-0521', rnt: 'RNT-2025-024', cust: 'Meera Rajput', amt: 1200, mode: 'UPI', type: 'Rental', col: 'Amit Patel', date: '19 May 2025', time: '05:40 PM', status: 'Paid', utr: 'UPI77281903', notes: 'GoPro bundle rental.', eq: 'GoPro Hero 12 Black Bundle', period: '17 May – 19 May 2025' },
    { tx: 'PAY-2025-0520', rnt: 'RNT-2025-023', cust: 'Anil Kapoor Photography', amt: 2500, mode: 'Card', type: 'Rental', col: 'Priya Sharma', date: '19 May 2025', time: '11:10 AM', status: 'Pending', utr: 'CARD9918274', notes: 'Pending card settlement.', eq: 'Sony 50mm f/1.2 GM Lens', period: '17 May – 19 May 2025' },
    { tx: 'PAY-2025-0519', rnt: 'RNT-2025-022', cust: 'Bombay Cinema Guild', amt: 4500, mode: 'Bank Transfer', type: 'Rental', col: 'Ravi Kumar', date: '18 May 2025', time: '03:30 PM', status: 'Pending', utr: 'NEFT1182938', notes: 'NEFT clearance expected tomorrow.', eq: 'Easyrig Vario 5', period: '16 May – 19 May 2025' },
  ];

  for (const p of seedPayments) {
    await db.execute({
      sql: `INSERT INTO payments (transaction_id, rental_id, customer_name, amount, mode, type, collected_by, date, time, status, utr_reference, notes, equipment_name, rental_period)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [p.tx, p.rnt, p.cust, p.amt, p.mode, p.type, p.col, p.date, p.time, p.status, p.utr, p.notes, p.eq, p.period]
    });
  }

  // Clear and reseed message_templates
  await db.execute("DELETE FROM message_templates");
  const seedTemplates = [
    {
      title: 'Rental Confirmation',
      badge: 'Booking',
      snippet: 'Hi {customer_name}, your rental for {equipment_name} is confirmed for {pickup_date}. Total: {amount}.',
      body: 'Hi {customer_name}, your rental for {equipment_name} has been confirmed starting {pickup_date}. Total rental amount is {amount}. Please carry an original government ID for verification during pickup. Thank you for choosing LensLedger!',
      icon_type: 'calendar'
    },
    {
      title: 'Due Reminder',
      badge: 'Reminder',
      snippet: 'Hi {customer_name}, your rental for {equipment_name} is due today by {return_time}. Please return on time.',
      body: 'Hi {customer_name}, this is a friendly reminder that your rental for {equipment_name} is due today by {return_time}. Please ensure the equipment is returned in good condition. Thank you!',
      icon_type: 'clock'
    },
    {
      title: 'Overdue Alert',
      badge: 'Overdue',
      snippet: 'URGENT: {customer_name}, your rental for {equipment_name} is overdue. Late fee of ₹500/day applies.',
      body: 'URGENT NOTICE: {customer_name}, your rental for {equipment_name} is overdue. Late return charges of ₹500 per day apply. Please return the equipment immediately or contact our support team to extend your booking.',
      icon_type: 'alert'
    },
    {
      title: 'Payment Reminder',
      badge: 'Payment',
      snippet: 'Hi {customer_name}, an outstanding balance of {amount} is pending for rental {rental_code}. Pay now: {link}.',
      body: 'Hi {customer_name}, an outstanding balance of {amount} is pending for rental {rental_code}. You can complete your payment securely via UPI or Card here: https://pay.lensledger.in/{rental_code}. Thank you!',
      icon_type: 'credit_card'
    },
    {
      title: 'Promotion',
      badge: 'Marketing',
      snippet: 'Special weekend offer! Get 20% off on all cinema camera rentals this Friday. Book now: {link}.',
      body: 'Exclusive Creator Offer! Get 20% off on all cinema camera packages this weekend at LensLedger. Use promo code WEEKEND20 during checkout. Reserve your kit now: https://lensledger.in/offers.',
      icon_type: 'megaphone'
    }
  ];

  for (const t of seedTemplates) {
    await db.execute({
      sql: `INSERT INTO message_templates (title, badge, snippet, body, icon_type) VALUES (?, ?, ?, ?, ?)`,
      args: [t.title, t.badge, t.snippet, t.body, t.icon_type]
    });
  }

  // Clear and reseed message_history
  await db.execute("DELETE FROM message_history");
  const seedHistory = [
    { customer_name: 'Vikram Shah', initials: 'VS', subject: 'Due Reminder', channel: 'whatsapp', status: 'Delivered', time: '10:30 AM' },
    { customer_name: 'Aditi Rao', initials: 'AR', subject: 'Rental Confirmation', channel: 'whatsapp', status: 'Read', time: '09:15 AM' },
    { customer_name: 'Karan Films', initials: 'KF', subject: 'Payment Reminder', channel: 'sms', status: 'Delivered', time: 'Yesterday' },
    { customer_name: 'Neha Singh', initials: 'NS', subject: 'Return Acknowledged', channel: 'whatsapp', status: 'Read', time: 'Yesterday' },
    { customer_name: 'Rahul Thakkar', initials: 'RT', subject: 'Overdue Alert', channel: 'sms', status: 'Delivered', time: '25 May' },
    { customer_name: 'Anjali Patel', initials: 'AP', subject: 'Booking Inquiry', channel: 'whatsapp', status: 'Read', time: '24 May' },
    { customer_name: 'Sameer Productions', initials: 'SP', subject: 'Payment Receipt', channel: 'whatsapp', status: 'Delivered', time: '24 May' },
    { customer_name: 'Priya Kapoor', initials: 'PK', subject: 'Due Reminder', channel: 'sms', status: 'Delivered', time: '23 May' },
    { customer_name: 'Delhi Media', initials: 'DM', subject: 'Equipment Ready', channel: 'whatsapp', status: 'Read', time: '22 May' },
    { customer_name: 'Rohit Sharma', initials: 'RS', subject: 'Rental Extension', channel: 'whatsapp', status: 'Delivered', time: '21 May' },
  ];

  for (const h of seedHistory) {
    await db.execute({
      sql: `INSERT INTO message_history (customer_name, initials, subject, channel, status, time) VALUES (?, ?, ?, ?, ?, ?)`,
      args: [h.customer_name, h.initials, h.subject, h.channel, h.status, h.time]
    });
  }

  // Clear and reseed documents
  await db.execute("DELETE FROM documents");
  const seedDocuments = [
    {
      name: 'Aadhaar_Card.pdf',
      cust: 'Vikram Shah',
      rnt: 'RNT-2025-021',
      type: 'Identity Proof',
      fileType: 'pdf',
      upDate: '27 May 2025',
      upTime: '10:24 AM',
      verBy: 'Ravi Kumar',
      status: 'Verified',
      size: '1.2 MB',
      security: 'Encrypted • Access Logged',
      preview: JSON.stringify({
        aadhaar_number: 'XXXX XXXX 1234',
        dob: '**/**/1995',
        gender: 'Male',
        is_masked: true
      })
    },
    {
      name: 'Camera_Receipt.jpg',
      cust: 'Aditi Rao',
      rnt: 'RNT-2025-022',
      type: 'Receipt',
      fileType: 'jpg',
      upDate: '26 May 2025',
      upTime: '08:15 PM',
      verBy: 'Neha Singh',
      status: 'Verified',
      size: '850 KB',
      security: 'Encrypted • Access Logged'
    },
    {
      name: 'Rental_Agreement.pdf',
      cust: 'Karan Films',
      rnt: 'RNT-2025-023',
      type: 'Agreement',
      fileType: 'pdf',
      upDate: '25 May 2025',
      upTime: '02:30 PM',
      verBy: 'Ravi Kumar',
      status: 'Verified',
      size: '2.4 MB',
      security: 'Encrypted • Access Logged'
    },
    {
      name: 'Damage_1.jpg',
      cust: 'Neha Singh',
      rnt: 'RNT-2025-024',
      type: 'Damage Photo',
      fileType: 'jpg',
      upDate: '24 May 2025',
      upTime: '11:10 AM',
      verBy: 'Arjun Mehta',
      status: 'Pending',
      size: '1.8 MB',
      security: 'Encrypted • Access Logged'
    },
    {
      name: 'PAN_Card.pdf',
      cust: 'Rohit Verma',
      rnt: 'RNT-2025-025',
      type: 'Identity Proof',
      fileType: 'pdf',
      upDate: '23 May 2025',
      upTime: '06:45 PM',
      verBy: 'Ravi Kumar',
      status: 'Verified',
      size: '980 KB',
      security: 'Encrypted • Access Logged'
    },
    {
      name: 'Return_Photo.jpg',
      cust: 'Sneha Kapoor',
      rnt: 'RNT-2025-017',
      type: 'Damage Photo',
      fileType: 'jpg',
      upDate: '22 May 2025',
      upTime: '04:20 PM',
      verBy: 'Neha Singh',
      status: 'Verified',
      size: '2.1 MB',
      security: 'Encrypted • Access Logged'
    },
    {
      name: 'Payment_Receipt.pdf',
      cust: 'Arjun Mehta',
      rnt: 'RNT-2025-014',
      type: 'Receipt',
      fileType: 'pdf',
      upDate: '21 May 2025',
      upTime: '01:15 PM',
      verBy: 'Karan Sharma',
      status: 'Verified',
      size: '720 KB',
      security: 'Encrypted • Access Logged'
    },
    {
      name: 'Driving_License.pdf',
      cust: 'Priya Nair',
      rnt: 'RNT-2025-018',
      type: 'Identity Proof',
      fileType: 'pdf',
      upDate: '20 May 2025',
      upTime: '09:40 AM',
      verBy: 'Ravi Kumar',
      status: 'Verified',
      size: '1.5 MB',
      security: 'Encrypted • Access Logged'
    },
    {
      name: 'Terms_Conditions.pdf',
      cust: 'Vikram Shah',
      rnt: 'RNT-2025-021',
      type: 'Agreement',
      fileType: 'pdf',
      upDate: '19 May 2025',
      upTime: '05:10 PM',
      verBy: 'Neha Singh',
      status: 'Verified',
      size: '1.1 MB',
      security: 'Encrypted • Access Logged'
    },
    {
      name: 'Equipment_Damage.jpg',
      cust: 'Karan Films',
      rnt: 'RNT-2025-019',
      type: 'Damage Photo',
      fileType: 'jpg',
      upDate: '18 May 2025',
      upTime: '03:25 PM',
      verBy: 'Arjun Mehta',
      status: 'Verified',
      size: '3.4 MB',
      security: 'Encrypted • Access Logged'
    }
  ];

  for (const d of seedDocuments) {
    await db.execute({
      sql: `INSERT INTO documents (document_name, customer_name, rental_id, type, file_type, uploaded_on_date, uploaded_on_time, verified_by, status, file_size, security, preview_data)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [d.name, d.cust, d.rnt, d.type, d.fileType, d.upDate, d.upTime, d.verBy, d.status, d.size, d.security, d.preview || null]
    });
  }

  // Clear and reseed employees
  await db.execute("DELETE FROM employees");
  const seedEmployees = [
    { name: 'Ravi Kumar', role: 'Owner', email: 'ravi@lensledger.in', status: 'Active' },
    { name: 'Aditi Rao', role: 'Manager', email: 'aditi@lensledger.in', status: 'Active' },
    { name: 'Vikram Shah', role: 'Staff', email: 'vikram@lensledger.in', status: 'Active' },
    { name: 'Neha Singh', role: 'Staff', email: 'neha@lensledger.in', status: 'Inactive' },
  ];

  for (const emp of seedEmployees) {
    await db.execute({
      sql: `INSERT INTO employees (name, role, email, status) VALUES (?, ?, ?, ?)`,
      args: [emp.name, emp.role, emp.email, emp.status]
    });
  }

  // Clear and reseed audit_logs
  await db.execute("DELETE FROM audit_logs");
  const seedAuditLogs = [
    { timestamp: '27 May 2025, 10:24 AM', user: 'Ravi Kumar', action: 'Updated Settings', details: 'Changed late fee percentage to 25%', ip: '192.168.1.14' },
    { timestamp: '27 May 2025, 09:12 AM', user: 'Aditi Rao', action: 'Created Employee', details: 'Added new staff member Neha Singh', ip: '192.168.1.23' },
    { timestamp: '26 May 2025, 06:45 PM', user: 'Vikram Shah', action: 'Updated Rental', details: 'Modified return time for RNT-2025-018', ip: '192.168.1.31' },
  ];

  for (const log of seedAuditLogs) {
    await db.execute({
      sql: `INSERT INTO audit_logs (timestamp, user, action, details, ip_address) VALUES (?, ?, ?, ?, ?)`,
      args: [log.timestamp, log.user, log.action, log.details, log.ip]
    });
  }

  // Seed default settings_kv if empty
  await db.execute("DELETE FROM settings_kv");
  const defaultProfile = {
    business_name: 'LensLedger Camera Rentals',
    tagline: 'Gear In. Stories Out.',
    email: 'info@lensledger.in',
    phone: '+91 98765 43210',
    address: '123 Photography Lane, Koramangala\nBengaluru, Karnataka 560034',
  };

  const defaultPricing = {
    default_daily_rate: 1000,
    minimum_rental_period: '1 Day',
    security_deposit: 10000,
    long_rental_discount: '10% (7+ days)',
    allow_custom_pricing: true,
  };

  const defaultLateFee = {
    fee_type: 'Percentage of daily rate',
    fee_percentage: 25,
    grace_period_days: 1,
    apply_automatically: true,
    send_overdue_reminders: false,
  };

  const defaultPaymentModes = [
    { id: 'cash', name: 'Cash Payments', description: 'Accept cash at store', is_enabled: true },
    { id: 'upi', name: 'UPI Payments', description: 'Accept UPI (GPay, PhonePe, Paytm, etc.)', is_enabled: true },
    { id: 'card', name: 'Card Payments', description: 'Accept credit/debit cards', is_enabled: true },
    { id: 'bank', name: 'Bank Transfer', description: 'Accept direct bank transfers', is_enabled: false },
    { id: 'wallet', name: 'Wallet Payment', description: 'Accept from customer wallet/balance', is_enabled: false },
  ];

  const defaultNotificationRules = [
    { id: 'booking', label: 'Send booking confirmation', timing: 'Immediately', is_enabled: true },
    { id: 'payment', label: 'Send payment reminder', timing: '1 day before due', is_enabled: true },
    { id: 'overdue', label: 'Send overdue notice', timing: 'On due date', is_enabled: true },
    { id: 'return', label: 'Send return reminder', timing: '1 day before return', is_enabled: false },
    { id: 'marketing', label: 'Send marketing messages', timing: 'Weekly', is_enabled: false },
  ];

  const defaultSecurity = {
    restrict_access: true,
    watermark_documents: true,
    allow_customer_upload: false,
  };

  const defaultBackup = {
    auto_backup_frequency: 'Daily',
    last_backup_time: 'Today, 10:24 AM',
  };

  const defaultRolesPermissions = {
    Manager: ['Dashboard', 'Rentals', 'Customers', 'Inventory', 'Payments', 'Reports'],
    Staff: ['Dashboard', 'Rentals', 'Customers', 'Inventory'],
    Owner: ['Dashboard', 'Rentals', 'Customers', 'Inventory', 'Payments', 'Settings', 'Reports'],
  };

  const defaultMessageTemplates = {
    'Booking Confirmation': `Hi {customer_name},\n\nYour booking ({#rental_id}) has been confirmed!\n\nEquipment: {equipment_list}\nPickup: {pickup_date} {pickup_time}\nReturn: {return_date} {return_time}\n\nThank you for choosing LensLedger!\nGear In. Stories Out.`,
    'Payment Reminder': `Hi {customer_name},\n\nAn outstanding balance of {amount} is pending for rental {rental_code}.\nPay now: https://pay.lensledger.in/{rental_code}\n\nThank you!`,
    'Overdue Notice': `URGENT NOTICE: {customer_name},\n\nYour rental for {equipment_name} is overdue. Late return charges of 25% apply.\nPlease return immediately.`,
  };

  await db.execute({ sql: "INSERT INTO settings_kv (key, value) VALUES (?, ?)", args: ['business_profile', JSON.stringify(defaultProfile)] });
  await db.execute({ sql: "INSERT INTO settings_kv (key, value) VALUES (?, ?)", args: ['pricing', JSON.stringify(defaultPricing)] });
  await db.execute({ sql: "INSERT INTO settings_kv (key, value) VALUES (?, ?)", args: ['late_fee', JSON.stringify(defaultLateFee)] });
  await db.execute({ sql: "INSERT INTO settings_kv (key, value) VALUES (?, ?)", args: ['payment_modes', JSON.stringify(defaultPaymentModes)] });
  await db.execute({ sql: "INSERT INTO settings_kv (key, value) VALUES (?, ?)", args: ['notification_rules', JSON.stringify(defaultNotificationRules)] });
  await db.execute({ sql: "INSERT INTO settings_kv (key, value) VALUES (?, ?)", args: ['document_security', JSON.stringify(defaultSecurity)] });
  await db.execute({ sql: "INSERT INTO settings_kv (key, value) VALUES (?, ?)", args: ['backup', JSON.stringify(defaultBackup)] });
  await db.execute({ sql: "INSERT INTO settings_kv (key, value) VALUES (?, ?)", args: ['roles_permissions', JSON.stringify(defaultRolesPermissions)] });
  await db.execute({ sql: "INSERT INTO settings_kv (key, value) VALUES (?, ?)", args: ['message_templates', JSON.stringify(defaultMessageTemplates)] });
}

async function getDashboardData() {
  const db = getDb();
  const stats = await db.execute("SELECT * FROM stats WHERE key != 'draft_rentals'");
  const rentals = await db.execute("SELECT * FROM rentals ORDER BY id ASC LIMIT 4");
  const attention = await db.execute("SELECT * FROM attention_items WHERE is_resolved = 0");
  const topEquipment = await db.execute("SELECT * FROM top_equipment ORDER BY rank ASC");
  const revenueTrend = await db.execute("SELECT * FROM revenue_trend ORDER BY id ASC");

  return {
    stats: stats.rows,
    rentals: rentals.rows,
    attention: attention.rows,
    topEquipment: topEquipment.rows,
    revenueTrend: revenueTrend.rows,
    summary: {
      totalRevenue: '₹1,24,300',
      revenueChange: '↑ 12%',
      averageDaily: '₹17,757',
      dailyChange: '↑ 8%',
    }
  };
}

async function getAllRentals() {
  const db = getDb();
  const res = await db.execute("SELECT * FROM rentals ORDER BY id ASC");
  return res.rows;
}

async function getCustomers() {
  const db = getDb();
  const res = await db.execute("SELECT * FROM customers ORDER BY id ASC");
  return res.rows;
}

async function getInventory() {
  const db = getDb();
  const res = await db.execute("SELECT * FROM inventory ORDER BY id ASC");
  return res.rows;
}

async function getPayments() {
  const db = getDb();
  const res = await db.execute("SELECT * FROM payments ORDER BY id ASC");
  return res.rows;
}

async function createPayment(pay) {
  const db = getDb();
  const res = await db.execute({
    sql: `INSERT INTO payments (transaction_id, rental_id, customer_name, amount, mode, type, collected_by, date, time, status, utr_reference, notes, equipment_name, rental_period)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`,
    args: [
      pay.transaction_id,
      pay.rental_id,
      pay.customer_name,
      pay.amount,
      pay.mode || 'UPI',
      pay.type || 'Rental',
      pay.collected_by || 'Ravi Kumar',
      pay.date || '27 May 2025',
      pay.time || '06:00 PM',
      pay.status || 'Paid',
      pay.utr_reference || 'UPI' + Math.floor(1000000000 + Math.random() * 9000000000),
      pay.notes || 'Payment recorded.',
      pay.equipment_name || 'Gear Item',
      pay.rental_period || '27 May 2025'
    ]
  });
  return res.rows[0];
}

async function updateCustomerNotes(id, notes) {
  const db = getDb();
  await db.execute({
    sql: "UPDATE customers SET notes = ? WHERE id = ?",
    args: [notes, id]
  });
  return true;
}

async function createRental(rental) {
  const db = getDb();
  const res = await db.execute({
    sql: `INSERT INTO rentals (rental_code, customer_name, customer_phone, equipment_name, pickup_date, return_time, amount, payment_status, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`,
    args: [
      rental.rental_code,
      rental.customer_name,
      rental.customer_phone || '+91 98765 00000',
      rental.equipment_name,
      rental.pickup_date || '27 May 2025 10:00 AM',
      rental.return_time,
      rental.amount,
      rental.payment_status,
      rental.status || 'Due Today'
    ]
  });

  try {
    await db.execute({
      sql: `INSERT INTO audit_logs (timestamp, user, action, details, ip_address) VALUES (?, ?, ?, ?, ?)`,
      args: ['Today, Just now', 'Ravi Kumar', 'Created Rental', `Created booking ${rental.rental_code} for ${rental.customer_name}`, '192.168.1.14']
    });
  } catch (e) {
    console.error('Failed to log audit for new rental:', e);
  }

  return res.rows[0];
}

async function updateRentalStatus(id, status, payment_status) {
  const db = getDb();
  await db.execute({
    sql: "UPDATE rentals SET status = COALESCE(?, status), payment_status = COALESCE(?, payment_status) WHERE id = ?",
    args: [status, payment_status, id]
  });
  return true;
}

async function getAnalyticsData() {
  const kpis = [
    { id: 1, key: 'rev_today', title: 'Revenue Today', value: '₹12,800', trend_val: '↑ 18%', trend_label: 'vs. yesterday', trend_direction: 'up', badge_type: 'emerald' },
    { id: 2, key: 'rev_month', title: 'Revenue This Month', value: '₹4,12,300', trend_val: '↑ 12%', trend_label: 'vs. last month', trend_direction: 'up', badge_type: 'emerald' },
    { id: 3, key: 'rentals_month', title: 'Rentals This Month', value: '128', trend_val: '↑ 10%', trend_label: 'vs. last month', trend_direction: 'up', badge_type: 'emerald' },
    { id: 4, key: 'new_cust', title: 'New Customers', value: '24', trend_val: '↑ 33%', trend_label: 'vs. last month', trend_direction: 'up', badge_type: 'emerald' },
    { id: 5, key: 'ret_cust', title: 'Returning Customers', value: '56', trend_val: '↑ 8%', trend_label: 'vs. last month', trend_direction: 'up', badge_type: 'emerald' },
    { id: 6, key: 'out_pay', title: 'Outstanding Payments', value: '₹28,500', trend_val: '↑ 25%', trend_label: 'across 5 invoices', trend_direction: 'up', badge_type: 'rose' },
  ];

  const revenueTrend = [
    { id: 1, date_label: '28 Apr', revenue: 9500, is_current: 0 },
    { id: 2, date_label: '29 Apr', revenue: 19000, is_current: 0 },
    { id: 3, date_label: '30 Apr', revenue: 14000, is_current: 0 },
    { id: 4, date_label: '1 May', revenue: 11000, is_current: 0 },
    { id: 5, date_label: '2 May', revenue: 15500, is_current: 0 },
    { id: 6, date_label: '3 May', revenue: 14200, is_current: 0 },
    { id: 7, date_label: '4 May', revenue: 18500, is_current: 0 },
    { id: 8, date_label: '5 May', revenue: 16000, is_current: 0 },
    { id: 9, date_label: '6 May', revenue: 17200, is_current: 0 },
    { id: 10, date_label: '7 May', revenue: 20500, is_current: 0 },
    { id: 11, date_label: '8 May', revenue: 19800, is_current: 0 },
    { id: 12, date_label: '9 May', revenue: 18000, is_current: 0 },
    { id: 13, date_label: '10 May', revenue: 26000, is_current: 0 },
    { id: 14, date_label: '11 May', revenue: 21500, is_current: 0 },
    { id: 15, date_label: '12 May', revenue: 19000, is_current: 0 },
    { id: 16, date_label: '13 May', revenue: 35000, is_current: 0 },
    { id: 17, date_label: '14 May', revenue: 22000, is_current: 0 },
    { id: 18, date_label: '15 May', revenue: 27500, is_current: 0 },
    { id: 19, date_label: '16 May', revenue: 33000, is_current: 0 },
    { id: 20, date_label: '17 May', revenue: 24000, is_current: 0 },
    { id: 21, date_label: '18 May', revenue: 18500, is_current: 0 },
    { id: 22, date_label: '19 May', revenue: 23000, is_current: 0 },
    { id: 23, date_label: '20 May', revenue: 17000, is_current: 0 },
    { id: 24, date_label: '21 May', revenue: 21000, is_current: 0 },
    { id: 25, date_label: '22 May', revenue: 24500, is_current: 0 },
    { id: 26, date_label: '23 May', revenue: 18000, is_current: 0 },
    { id: 27, date_label: '24 May', revenue: 22000, is_current: 0 },
    { id: 28, date_label: '25 May', revenue: 16000, is_current: 0 },
    { id: 29, date_label: '26 May', revenue: 17500, is_current: 0 },
    { id: 30, date_label: '27 May', revenue: 27000, is_current: 1 },
  ];

  const equipmentRanking = [
    { id: 1, rank: 1, name: 'Sony A7 IV', category: 'camera', rentals_count: 28, earnings: 56000 },
    { id: 2, rank: 2, name: 'Canon R6 Mark II', category: 'camera', rentals_count: 24, earnings: 48000 },
    { id: 3, rank: 3, name: 'DJI RS 4', category: 'gimbal', rentals_count: 18, earnings: 27000 },
    { id: 4, rank: 4, name: 'Sony 24-70mm GM II', category: 'lens', rentals_count: 16, earnings: 24000 },
    { id: 5, rank: 5, name: 'Sigma 85mm F1.4', category: 'lens', rentals_count: 14, earnings: 18500 },
  ];

  const categoryUtilization = [
    { id: 1, category: 'Cameras', icon_name: 'camera', utilization_rate: 78 },
    { id: 2, category: 'Lenses', icon_name: 'lens', utilization_rate: 62 },
    { id: 3, category: 'Gimbals', icon_name: 'gimbal', utilization_rate: 48 },
    { id: 4, category: 'Lighting', icon_name: 'lighting', utilization_rate: 36 },
    { id: 5, category: 'Audio', icon_name: 'audio', utilization_rate: 32 },
    { id: 6, category: 'Accessories', icon_name: 'accessories', utilization_rate: 28 },
  ];

  const topCustomers = [
    { id: 1, rank: 1, name: 'Vikram Shah', initials: 'VS', avatar_bg: 'bg-blue-100 text-blue-700', rentals_count: 12, revenue: 48000 },
    { id: 2, rank: 2, name: 'Aditi Rao', initials: 'AR', avatar_bg: 'bg-blue-100 text-blue-700', rentals_count: 10, revenue: 36500 },
    { id: 3, rank: 3, name: 'Karan Films', initials: 'KF', avatar_bg: 'bg-emerald-100 text-emerald-700', rentals_count: 8, revenue: 27000 },
    { id: 4, rank: 4, name: 'Neha Singh', initials: 'NS', avatar_bg: 'bg-orange-100 text-orange-700', rentals_count: 7, revenue: 22500 },
    { id: 5, rank: 5, name: 'Rohan Mehta', initials: 'RM', avatar_bg: 'bg-purple-100 text-purple-700', rentals_count: 6, revenue: 18000 },
  ];

  const paymentSplit = [
    { id: 1, mode: 'UPI', percentage: 52, amount: 214400, color: '#E11D48' },
    { id: 2, mode: 'Card', percentage: 28, amount: 115500, color: '#FB7185' },
    { id: 3, mode: 'Cash', percentage: 15, amount: 61800, color: '#FDA4AF' },
    { id: 4, mode: 'Bank Transfer', percentage: 5, amount: 20600, color: '#CBD5E1' },
  ];

  const insights = [
    { id: 1, title: 'Top Revenue Generator', description: 'Sony A7 IV generated the highest revenue of ₹56,000 (28 rentals).', icon_type: 'camera', icon_color: 'text-rose-600', bg_color: 'bg-rose-50' },
    { id: 2, title: 'Growing Category', description: 'Camera rentals are up 18% compared to last month.', icon_type: 'growth', icon_color: 'text-emerald-600', bg_color: 'bg-emerald-50' },
    { id: 3, title: 'Repeat Customers', description: '70% of your revenue comes from returning customers.', icon_type: 'users', icon_color: 'text-rose-600', bg_color: 'bg-rose-50' },
    { id: 4, title: 'Outstanding Amount', description: '₹28,500 pending across 5 invoices.', icon_type: 'credit_card', icon_color: 'text-rose-600', bg_color: 'bg-rose-50' },
    { id: 5, title: 'Business Health', description: 'Revenue is up 12% compared to the previous 30 days.', icon_type: 'bar_chart', icon_color: 'text-emerald-600', bg_color: 'bg-emerald-50' },
  ];

  return {
    kpis,
    revenueTrend,
    equipmentRanking,
    categoryUtilization,
    topCustomers,
    paymentSplit,
    insights,
    summary: {
      totalRevenue: '₹4,12,300',
      revenueChange: '↑ 12%',
    }
  };
}

async function getMessagesData() {
  const db = getDb();
  const templates = await db.execute("SELECT * FROM message_templates ORDER BY id ASC");
  const history = await db.execute("SELECT * FROM message_history ORDER BY id ASC");
  return {
    templates: templates.rows,
    history: history.rows
  };
}

async function sendMessage(msg) {
  const db = getDb();
  await db.execute({
    sql: `INSERT INTO message_history (customer_name, initials, subject, channel, status, time) VALUES (?, ?, ?, ?, ?, ?)`,
    args: [
      msg.customer_name || 'Customer',
      msg.initials || 'CU',
      msg.subject || 'Message',
      msg.channel || 'whatsapp',
      msg.status || 'Delivered',
      msg.time || 'Just now'
    ]
  });
  return true;
}

async function getDocumentsData() {
  const db = getDb();
  const res = await db.execute("SELECT * FROM documents ORDER BY id ASC");
  const docs = res.rows.map(row => ({
    ...row,
    preview_data: row.preview_data ? JSON.parse(row.preview_data) : undefined
  }));

  const counts = {
    all: docs.length,
    identity: docs.filter(d => d.type === 'Identity Proof').length,
    receipts: docs.filter(d => d.type === 'Receipt').length,
    agreements: docs.filter(d => d.type === 'Agreement').length,
    damage: docs.filter(d => d.type === 'Damage Photo').length,
  };

  return {
    documents: docs,
    counts
  };
}

async function uploadDocument(doc) {
  const db = getDb();
  const res = await db.execute({
    sql: `INSERT INTO documents (document_name, customer_name, rental_id, type, file_type, uploaded_on_date, uploaded_on_time, verified_by, status, file_size, security, preview_data)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`,
    args: [
      doc.document_name || 'Document.pdf',
      doc.customer_name || 'Customer',
      doc.rental_id || 'RNT-2025-001',
      doc.type || 'Identity Proof',
      doc.file_type || 'pdf',
      doc.uploaded_on_date || '27 May 2025',
      doc.uploaded_on_time || '10:00 AM',
      doc.verified_by || 'Ravi Kumar',
      doc.status || 'Verified',
      doc.file_size || '1.0 MB',
      doc.security || 'Encrypted • Access Logged',
      doc.preview_data ? JSON.stringify(doc.preview_data) : null
    ]
  });
  const row = res.rows[0];
  return {
    ...row,
    preview_data: row.preview_data ? JSON.parse(row.preview_data) : undefined
  };
}

async function updateDocumentStatus(id, status) {
  const db = getDb();
  await db.execute({
    sql: "UPDATE documents SET status = ? WHERE id = ?",
    args: [status, id]
  });
  return true;
}

async function getSettingsData() {
  const db = getDb();
  const kvRes = await db.execute("SELECT key, value FROM settings_kv");
  const kv = {};
  for (const row of kvRes.rows) {
    try {
      kv[row.key] = JSON.parse(row.value);
    } catch (e) {
      kv[row.key] = row.value;
    }
  }

  const empRes = await db.execute("SELECT * FROM employees ORDER BY id ASC");
  const auditRes = await db.execute("SELECT * FROM audit_logs ORDER BY id ASC");

  return {
    businessProfile: kv.business_profile || {},
    employees: empRes.rows,
    rolesPermissions: kv.roles_permissions || {},
    rentalPricing: kv.pricing || {},
    lateFeeRules: kv.late_fee || {},
    paymentModes: kv.payment_modes || [],
    messageTemplates: kv.message_templates || {},
    notificationRules: kv.notification_rules || [],
    documentSecurity: kv.document_security || {},
    backup: kv.backup || {},
    auditLogs: auditRes.rows,
  };
}

async function saveSettingsData(settings) {
  const db = getDb();
  if (settings.businessProfile) {
    await db.execute({ sql: "INSERT OR REPLACE INTO settings_kv (key, value) VALUES (?, ?)", args: ['business_profile', JSON.stringify(settings.businessProfile)] });
  }
  if (settings.rentalPricing) {
    await db.execute({ sql: "INSERT OR REPLACE INTO settings_kv (key, value) VALUES (?, ?)", args: ['pricing', JSON.stringify(settings.rentalPricing)] });
  }
  if (settings.lateFeeRules) {
    await db.execute({ sql: "INSERT OR REPLACE INTO settings_kv (key, value) VALUES (?, ?)", args: ['late_fee', JSON.stringify(settings.lateFeeRules)] });
  }
  if (settings.paymentModes) {
    await db.execute({ sql: "INSERT OR REPLACE INTO settings_kv (key, value) VALUES (?, ?)", args: ['payment_modes', JSON.stringify(settings.paymentModes)] });
  }
  if (settings.notificationRules) {
    await db.execute({ sql: "INSERT OR REPLACE INTO settings_kv (key, value) VALUES (?, ?)", args: ['notification_rules', JSON.stringify(settings.notificationRules)] });
  }
  if (settings.documentSecurity) {
    await db.execute({ sql: "INSERT OR REPLACE INTO settings_kv (key, value) VALUES (?, ?)", args: ['document_security', JSON.stringify(settings.documentSecurity)] });
  }
  if (settings.backup) {
    await db.execute({ sql: "INSERT OR REPLACE INTO settings_kv (key, value) VALUES (?, ?)", args: ['backup', JSON.stringify(settings.backup)] });
  }
  if (settings.rolesPermissions) {
    await db.execute({ sql: "INSERT OR REPLACE INTO settings_kv (key, value) VALUES (?, ?)", args: ['roles_permissions', JSON.stringify(settings.rolesPermissions)] });
  }
  if (settings.messageTemplates) {
    await db.execute({ sql: "INSERT OR REPLACE INTO settings_kv (key, value) VALUES (?, ?)", args: ['message_templates', JSON.stringify(settings.messageTemplates)] });
  }

  // Record audit log
  await db.execute({
    sql: `INSERT INTO audit_logs (timestamp, user, action, details, ip_address) VALUES (?, ?, ?, ?, ?)`,
    args: ['Today, Just now', 'Ravi Kumar', 'Updated Settings', 'Saved business preferences and rules', '192.168.1.14']
  });

  return true;
}

async function addEmployee(emp) {
  const db = getDb();
  const res = await db.execute({
    sql: `INSERT INTO employees (name, role, email, status) VALUES (?, ?, ?, ?) RETURNING *`,
    args: [emp.name || 'New Staff', emp.role || 'Staff', emp.email || 'staff@lensledger.in', emp.status || 'Active']
  });

  // Record audit log
  await db.execute({
    sql: `INSERT INTO audit_logs (timestamp, user, action, details, ip_address) VALUES (?, ?, ?, ?, ?)`,
    args: ['Today, Just now', 'Ravi Kumar', 'Created Employee', `Added new staff member ${emp.name || 'Staff'}`, '192.168.1.14']
  });

  return res.rows[0];
}

async function triggerBackup() {
  const db = getDb();
  const nowStr = 'Today, ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const backupObj = { auto_backup_frequency: 'Daily', last_backup_time: nowStr };
  await db.execute({ sql: "INSERT OR REPLACE INTO settings_kv (key, value) VALUES (?, ?)", args: ['backup', JSON.stringify(backupObj)] });

  await db.execute({
    sql: `INSERT INTO audit_logs (timestamp, user, action, details, ip_address) VALUES (?, ?, ?, ?, ?)`,
    args: [nowStr, 'Ravi Kumar', 'System Backup', 'Manual full database snapshot generated', '192.168.1.14']
  });

  return true;
}

module.exports = {
  getDb,
  initDatabase,
  getDashboardData,
  getAllRentals,
  getCustomers,
  getInventory,
  getPayments,
  createPayment,
  getAnalyticsData,
  updateCustomerNotes,
  createRental,
  updateRentalStatus,
  getMessagesData,
  sendMessage,
  getDocumentsData,
  uploadDocument,
  updateDocumentStatus,
  getSettingsData,
  saveSettingsData,
  addEmployee,
  triggerBackup
};


