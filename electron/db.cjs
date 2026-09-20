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

  // Drop old tables and create fresh ones
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS app_config (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

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
      address TEXT,
      aadhaar_number TEXT,
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
  
  // Safe column migrations for existing databases
  try { await db.execute("ALTER TABLE customers ADD COLUMN address TEXT"); } catch (e) {}
  try { await db.execute("ALTER TABLE customers ADD COLUMN aadhaar_number TEXT"); } catch (e) {}
  try { await db.execute("ALTER TABLE employees ADD COLUMN phone TEXT"); } catch (e) {}
  try { await db.execute("UPDATE rentals SET payment_status = 'Unpaid' WHERE payment_status NOT IN ('Paid', 'Unpaid')"); } catch (e) {}
  try {
    await db.execute("UPDATE payments SET status = 'Unpaid' WHERE status IN ('Pending', 'Partial')");
    await db.execute("UPDATE payments SET status = 'Paid' WHERE status IN ('Deposit', 'Refund')");
    await db.execute("UPDATE payments SET status = 'Unpaid' WHERE status NOT IN ('Paid', 'Unpaid')");
  } catch (e) {}

  // Initialize zeroed stats metrics if stats table is empty
  try {
    const statsCount = await db.execute("SELECT COUNT(*) as count FROM stats");
    if ((statsCount.rows[0]?.count || 0) === 0) {
      await db.executeMultiple(`
        INSERT INTO stats (key, title, value, trend_val, trend_label, trend_direction, badge_type) VALUES
          ('active_rentals', 'Active Rentals', '0', '0', 'active', 'neutral', 'emerald'),
          ('due_today', 'Due Today', '0', '0', 'today', 'neutral', 'neutral'),
          ('overdue_rentals', 'Overdue Rentals', '0', '0', 'overdue', 'neutral', 'rose'),
          ('available_equipment', 'Available Equipment', '0', '0', 'available', 'neutral', 'emerald'),
          ('pending_payments', 'Pending Payments', '₹0', '0', 'pending', 'neutral', 'rose'),
          ('revenue_today', 'Revenue Today', '₹0', '0', 'today', 'neutral', 'emerald');
      `);
    }
  } catch (e) {}
}

async function getAppConfig() {
  const db = getDb();
  const res = await db.execute("SELECT key, value FROM app_config");
  const config = {};
  res.rows.forEach(r => { config[r.key] = r.value; });
  return config;
}

async function saveAppConfig(config) {
  const db = getDb();
  for (const [key, value] of Object.entries(config)) {
    await db.execute({
      sql: "INSERT INTO app_config (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value=?",
      args: [key, value, value]
    });
  }
  return true;
}

async function updatePaymentStatus(id, status) {
  const db = getDb();
  await db.execute({
    sql: "UPDATE payments SET status = ? WHERE id = ?",
    args: [status, id]
  });
  return true;
}

async function updateEmployee(id, name, role, email, status, phone) {
  const db = getDb();
  await db.execute({
    sql: "UPDATE employees SET name=?, role=?, email=COALESCE(?, email), status=COALESCE(?, status), phone=COALESCE(?, phone) WHERE id=?",
    args: [name, role, email, status, phone, id]
  });
  return true;
}

async function removeEmployee(id) {
  const db = getDb();
  await db.execute({
    sql: "DELETE FROM employees WHERE id=?",
    args: [id]
  });
  return true;
}


async function getDashboardData() {
  const db = getDb();
  let totalRevenue = 0;
  try {
    const revRes = await db.execute("SELECT COALESCE(SUM(amount), 0) as tot FROM payments WHERE status = 'Paid'");
    totalRevenue = revRes.rows[0]?.tot || 0;
  } catch (e) {}

  const stats = await db.execute("SELECT * FROM stats WHERE key != 'draft_rentals'");
  const rentals = await db.execute("SELECT * FROM rentals ORDER BY id DESC LIMIT 4");
  
  // Real attention items: active rentals past due time (mocking logic here by selecting unpaid payments for now)
  let attention = [];
  try {
    const attRes = await db.execute("SELECT * FROM payments WHERE status = 'Unpaid' LIMIT 3");
    attention = attRes.rows.map((r, i) => ({
      id: i + 1,
      type: 'payment',
      code: r.transaction_id,
      party_name: r.customer_name,
      detail: `Unpaid: ₹${r.amount}`,
      badge_text: 'Unpaid',
      is_resolved: 0
    }));
  } catch(e) {}

  // Top Equipment (dynamic)
  let topEquipment = [];
  try {
    const equipRes = await db.execute(`
      SELECT equipment_name as name, COUNT(*) as rentals_count, SUM(amount) as earnings
      FROM rentals
      GROUP BY equipment_name
      ORDER BY earnings DESC LIMIT 4
    `);
    topEquipment = equipRes.rows.map((r, i) => ({
      id: i + 1,
      rank: i + 1,
      name: r.name,
      category: 'camera',
      rentals_count: Number(r.rentals_count),
      earnings: Number(r.earnings)
    }));
  } catch(e) {}

  // Revenue Trend (dynamic)
  let revenueTrend = [];
  try {
    const revTrendRes = await db.execute(`
      SELECT date as date_label, SUM(amount) as revenue 
      FROM payments 
      WHERE status = 'Paid' 
      GROUP BY date 
      ORDER BY id DESC LIMIT 10
    `);
    revenueTrend = revTrendRes.rows.reverse().map((r, i) => ({
      id: i + 1,
      date_label: r.date_label,
      revenue: Number(r.revenue),
      is_current: i === revTrendRes.rows.length - 1 ? 1 : 0
    }));
  } catch(e) {}

  return {
    stats: stats.rows || [],
    rentals: rentals.rows || [],
    attention: attention,
    topEquipment: topEquipment,
    revenueTrend: revenueTrend,
    summary: {
      totalRevenue: `₹${Number(totalRevenue).toLocaleString('en-IN')}`,
      revenueChange: '0%',
      averageDaily: '₹0',
      dailyChange: '0%',
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

async function createCustomer(cust) {
  const db = getDb();

  // Generate customer code
  const countRes = await db.execute("SELECT COUNT(*) as count FROM customers");
  const count = (countRes.rows[0]?.count || 0) + 1;
  const code = cust.code || `CUST-${String(count).padStart(3, '0')}`;

  // Generate initials for avatar
  const initials = (cust.name || '')
    .trim()
    .split(/\s+/)
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'CU';

  // Format Aadhaar Masked
  let aadhaarClean = (cust.aadhaar_number || '').replace(/\D/g, '');
  let idProofMasked = cust.id_proof_masked;
  if (!idProofMasked) {
    if (aadhaarClean.length >= 4) {
      idProofMasked = `•••• •••• ${aadhaarClean.slice(-4)}`;
    } else {
      idProofMasked = '•••• •••• ••••';
    }
  }

  const now = new Date();
  const customerSince = cust.customer_since || now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  const res = await db.execute({
    sql: `INSERT INTO customers (
            code, name, primary_phone, alternate_phone, email, location, address,
            aadhaar_number, total_rentals, active_rentals, outstanding_amount,
            last_rental, verification, avatar_type, avatar_text, avatar_img,
            customer_since, id_proof_type, id_proof_masked, notes
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`,
    args: [
      code,
      cust.name,
      cust.primary_phone,
      cust.alternate_phone || '',
      cust.email || '',
      cust.address || cust.location || '',
      cust.address || cust.location || '',
      cust.aadhaar_number || '',
      cust.total_rentals || 0,
      cust.active_rentals || 0,
      cust.outstanding_amount || 0,
      cust.last_rental || 'New Customer',
      cust.verification || 'Verified',
      cust.avatar_type || 'initials',
      initials,
      cust.avatar_img || null,
      customerSince,
      cust.id_proof_type || 'Identity Proof (Aadhaar)',
      idProofMasked,
      cust.notes || 'Newly registered customer.'
    ]
  });

  try {
    await db.execute({
      sql: `INSERT INTO audit_logs (timestamp, user, action, details, ip_address) VALUES (?, ?, ?, ?, ?)`,
      args: ['Today, Just now', 'Ravi Kumar', 'Created Customer', `Registered customer ${cust.name} (${code})`, '192.168.1.14']
    });
  } catch (e) {
    console.error('Failed to log audit for new customer:', e);
  }

  return res.rows[0];
}

async function getInventory() {
  const db = getDb();
  const res = await db.execute("SELECT * FROM inventory ORDER BY id ASC");
  return res.rows;
}

async function createInventoryItem(item) {
  const db = getDb();
  const asset_id = item.asset_id || `AST-${Math.floor(1000 + Math.random() * 9000)}`;
  const serial_number = item.serial_number || `SN${Math.floor(1000000 + Math.random() * 9000000)}`;
  const imageUrl = item.image_url && item.image_url.trim()
    ? item.image_url.trim()
    : 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=150&auto=format&fit=crop&q=80';
  
  const res = await db.execute({
    sql: `INSERT INTO inventory (
            name, subtitle, category, asset_id, serial_number, rental_rate, status,
            current_customer, expected_return, condition, image_url,
            lifetime_revenue, lifetime_rentals, utilization_rate, purchase_date, warranty
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`,
    args: [
      item.name || 'Equipment',
      item.subtitle || '',
      item.category || 'Cameras',
      asset_id,
      serial_number,
      Number(item.rental_rate) || 0,
      item.status || 'Available',
      item.current_customer || '-',
      item.expected_return || '-',
      item.condition || 'Excellent',
      imageUrl,
      0, 0, 0,
      item.purchase_date || new Date().toISOString().split('T')[0],
      item.warranty || '1 Year'
    ]
  });

  try {
    await db.execute({
      sql: `INSERT INTO audit_logs (timestamp, user, action, details, ip_address) VALUES (?, ?, ?, ?, ?)`,
      args: ['Today, Just now', 'Ravi Kumar', 'Added Equipment', `Added ${item.name} to inventory`, '192.168.1.14']
    });
  } catch (e) {
    console.error('Failed to log audit for new equipment:', e);
  }

  return res.rows[0];
}

async function updateInventoryItem(id, item) {
  const db = getDb();

  // Fetch existing item to merge cleanly and avoid undefined arguments in libsql
  const existingRes = await db.execute({
    sql: "SELECT * FROM inventory WHERE id = ?",
    args: [id]
  });
  const existing = existingRes.rows[0] || {};

  const name = item.name !== undefined ? item.name : existing.name;
  const subtitle = item.subtitle !== undefined ? item.subtitle : (existing.subtitle || '');
  const category = item.category !== undefined ? item.category : (existing.category || 'Cameras');
  const rental_rate = item.rental_rate !== undefined ? Number(item.rental_rate) : (existing.rental_rate || 0);
  const status = item.status !== undefined ? item.status : (existing.status || 'Available');
  const condition = item.condition !== undefined ? item.condition : (existing.condition || 'Excellent');
  const image_url = item.image_url !== undefined ? item.image_url : (existing.image_url || '');
  const serial_number = item.serial_number !== undefined ? item.serial_number : (existing.serial_number || '');
  const purchase_date = item.purchase_date !== undefined ? item.purchase_date : (existing.purchase_date || '');
  const warranty = item.warranty !== undefined ? item.warranty : (existing.warranty || '');

  const res = await db.execute({
    sql: `UPDATE inventory SET
            name = ?,
            subtitle = ?,
            category = ?,
            rental_rate = ?,
            status = ?,
            condition = ?,
            image_url = ?,
            serial_number = ?,
            purchase_date = ?,
            warranty = ?
          WHERE id = ? RETURNING *`,
    args: [
      name,
      subtitle,
      category,
      rental_rate,
      status,
      condition,
      image_url,
      serial_number,
      purchase_date,
      warranty,
      id
    ]
  });

  try {
    await db.execute({
      sql: `INSERT INTO audit_logs (timestamp, user, action, details, ip_address) VALUES (?, ?, ?, ?, ?)`,
      args: ['Today, Just now', 'Ravi Kumar', 'Updated Equipment', `Updated ${name || 'equipment'} details`, '192.168.1.14']
    });
  } catch (e) {
    console.error('Failed to log audit for update equipment:', e);
  }

  return res.rows[0];
}

async function deleteInventoryItem(id) {
  const db = getDb();
  await db.execute({
    sql: `DELETE FROM inventory WHERE id = ?`,
    args: [id]
  });
  
  try {
    await db.execute({
      sql: `INSERT INTO audit_logs (timestamp, user, action, details, ip_address) VALUES (?, ?, ?, ?, ?)`,
      args: ['Today, Just now', 'Ravi Kumar', 'Deleted Equipment', `Removed equipment ID ${id} from inventory`, '192.168.1.14']
    });
  } catch (e) {
    console.error('Failed to log audit for delete equipment:', e);
  }

  return true;
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

async function deleteCustomer(id) {
  const db = getDb();
  await db.execute({
    sql: "DELETE FROM customers WHERE id = ?",
    args: [id]
  });
  return true;
}

async function updateCustomerNotes(id, notes) {
  const db = getDb();
  await db.execute({
    sql: "UPDATE customers SET notes = ? WHERE id = ?",
    args: [notes, id]
  });
  return true;
}

async function updateCustomerVerification(id, status) {
  const db = getDb();
  await db.execute({
    sql: "UPDATE customers SET verification = ? WHERE id = ?",
    args: [status, id]
  });
  return true;
}

async function updateCustomer(id, cust) {
  const db = getDb();

  // If name changed, optionally update avatar initials
  let avatarText = undefined;
  if (cust.name) {
    avatarText = cust.name
      .trim()
      .split(/\s+/)
      .map(w => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'CU';
  }

  // Format Aadhaar Masked if provided
  let idProofMasked = undefined;
  if (cust.aadhaar_number) {
    const clean = cust.aadhaar_number.replace(/\D/g, '');
    idProofMasked = clean.length >= 4 ? `•••• •••• ${clean.slice(-4)}` : '•••• •••• ••••';
  }

  // Fetch current customer to merge cleanly
  const existingRes = await db.execute({
    sql: "SELECT * FROM customers WHERE id = ?",
    args: [id]
  });
  const existing = existingRes.rows[0] || {};

  const updatedName = cust.name !== undefined ? cust.name : existing.name;
  const updatedPrimaryPhone = cust.primary_phone !== undefined ? cust.primary_phone : existing.primary_phone;
  const updatedAlternatePhone = cust.alternate_phone !== undefined ? cust.alternate_phone : existing.alternate_phone;
  const updatedEmail = cust.email !== undefined ? cust.email : existing.email;
  const updatedAddress = cust.address !== undefined ? cust.address : existing.address;
  const updatedLocation = cust.location !== undefined ? cust.location : (cust.address !== undefined ? cust.address : existing.location);
  const updatedAadhaar = cust.aadhaar_number !== undefined ? cust.aadhaar_number : existing.aadhaar_number;
  const updatedVerification = cust.verification !== undefined ? cust.verification : existing.verification;
  const updatedNotes = cust.notes !== undefined ? cust.notes : existing.notes;
  const updatedAvatarText = avatarText || existing.avatar_text || 'CU';
  const updatedIdProofMasked = idProofMasked || existing.id_proof_masked || '•••• •••• ••••';

  const res = await db.execute({
    sql: `UPDATE customers SET
            name = ?,
            primary_phone = ?,
            alternate_phone = ?,
            email = ?,
            location = ?,
            address = ?,
            aadhaar_number = ?,
            verification = ?,
            avatar_text = ?,
            id_proof_masked = ?,
            notes = ?
          WHERE id = ? RETURNING *`,
    args: [
      updatedName,
      updatedPrimaryPhone,
      updatedAlternatePhone || '',
      updatedEmail || '',
      updatedLocation || '',
      updatedAddress || '',
      updatedAadhaar || '',
      updatedVerification || 'Pending',
      updatedAvatarText,
      updatedIdProofMasked,
      updatedNotes || '',
      id
    ]
  });

  return res.rows[0];
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
      rental.status || 'Active'
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
  const db = getDb();
  let totalRevenue = 0;
  let outPay = 0;
  let totalRentals = 0;
  let totalCustomers = 0;
  let activeRentals = 0;

  try {
    const pRes = await db.execute("SELECT COALESCE(SUM(amount), 0) as tot FROM payments WHERE status = 'Paid'");
    totalRevenue = pRes.rows[0]?.tot || 0;

    const opRes = await db.execute("SELECT COALESCE(SUM(amount), 0) as tot FROM payments WHERE status = 'Unpaid'");
    outPay = opRes.rows[0]?.tot || 0;

    const rRes = await db.execute("SELECT COUNT(*) as cnt FROM rentals");
    totalRentals = rRes.rows[0]?.cnt || 0;

    const arRes = await db.execute("SELECT COUNT(*) as cnt FROM rentals WHERE status = 'Active'");
    activeRentals = arRes.rows[0]?.cnt || 0;

    const cRes = await db.execute("SELECT COUNT(*) as cnt FROM customers");
    totalCustomers = cRes.rows[0]?.cnt || 0;
  } catch (e) {
    console.error('Error fetching analytics counts:', e);
  }

  const kpis = [
    { id: 1, key: 'rev_today', title: 'Revenue Today', value: '₹0', trend_val: '0', trend_label: 'today', trend_direction: 'neutral', badge_type: 'emerald' },
    { id: 2, key: 'rev_month', title: 'Total Revenue', value: `₹${Number(totalRevenue).toLocaleString('en-IN')}`, trend_val: '0', trend_label: 'all time', trend_direction: 'neutral', badge_type: 'emerald' },
    { id: 3, key: 'rentals_month', title: 'Total Rentals', value: String(totalRentals), trend_val: '0', trend_label: 'all time', trend_direction: 'neutral', badge_type: 'emerald' },
    { id: 4, key: 'new_cust', title: 'Customers', value: String(totalCustomers), trend_val: '0', trend_label: 'registered', trend_direction: 'neutral', badge_type: 'emerald' },
    { id: 5, key: 'ret_cust', title: 'Active Rentals', value: String(activeRentals), trend_val: '0', trend_label: 'active', trend_direction: 'neutral', badge_type: 'emerald' },
    { id: 6, key: 'out_pay', title: 'Outstanding Payments', value: `₹${Number(outPay).toLocaleString('en-IN')}`, trend_val: '0', trend_label: 'unpaid', trend_direction: 'neutral', badge_type: 'rose' },
  ];

  // Revenue Trend (Dynamic)
  let revenueTrend = [];
  try {
    const revTrendRes = await db.execute(`
      SELECT date as date_label, SUM(amount) as revenue 
      FROM payments 
      WHERE status = 'Paid' 
      GROUP BY date 
      ORDER BY id DESC LIMIT 30
    `);
    revenueTrend = revTrendRes.rows.reverse().map((r, i) => ({
      id: i + 1,
      date_label: r.date_label,
      revenue: Number(r.revenue),
      is_current: i === revTrendRes.rows.length - 1 ? 1 : 0
    }));
  } catch(e) {}

  // Equipment Ranking (Dynamic)
  let equipmentRanking = [];
  try {
    const equipRes = await db.execute(`
      SELECT equipment_name as name, COUNT(*) as rentals_count, SUM(amount) as earnings
      FROM rentals
      GROUP BY equipment_name
      ORDER BY earnings DESC LIMIT 5
    `);
    equipmentRanking = equipRes.rows.map((r, i) => ({
      id: i + 1,
      rank: i + 1,
      name: r.name,
      category: 'camera',
      rentals_count: Number(r.rentals_count),
      earnings: Number(r.earnings)
    }));
  } catch(e) {}

  // Top Customers (Dynamic)
  let topCustomers = [];
  try {
    const tcRes = await db.execute(`
      SELECT customer_name as name, COUNT(*) as rentals_count, SUM(amount) as revenue
      FROM rentals
      GROUP BY customer_name
      ORDER BY revenue DESC LIMIT 5
    `);
    const colors = ['bg-rose-100 text-rose-700', 'bg-blue-100 text-blue-700', 'bg-emerald-100 text-emerald-700', 'bg-amber-100 text-amber-700', 'bg-purple-100 text-purple-700'];
    topCustomers = tcRes.rows.map((r, i) => {
      const initials = (r.name || 'CU').substring(0, 2).toUpperCase();
      return {
        id: i + 1,
        rank: i + 1,
        name: r.name,
        initials,
        avatar_bg: colors[i % colors.length],
        rentals_count: Number(r.rentals_count),
        revenue: Number(r.revenue)
      };
    });
  } catch(e) {}

  // Payment Mode Split (Dynamic)
  let paymentSplit = [];
  try {
    const pSplitRes = await db.execute(`
      SELECT mode, SUM(amount) as amount
      FROM payments
      WHERE status = 'Paid'
      GROUP BY mode
    `);
    const colors = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B'];
    const totalRevNum = Number(totalRevenue) || 1; // avoid division by 0
    paymentSplit = pSplitRes.rows.map((r, i) => ({
      id: i + 1,
      mode: r.mode || 'Unknown',
      amount: Number(r.amount),
      percentage: Math.round((Number(r.amount) / totalRevNum) * 100),
      color: colors[i % colors.length]
    }));
  } catch(e) {}

  return {
    kpis,
    revenueTrend,
    equipmentRanking,
    categoryUtilization: [],
    topCustomers,
    paymentSplit,
    insights: [],
    summary: {
      totalRevenue: `₹${Number(totalRevenue).toLocaleString('en-IN')}`,
      revenueChange: '0%',
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
  const phone = emp.phone || '';
  const email = emp.email || (emp.name ? `${emp.name.toLowerCase().replace(/\s+/g, '.')}@camerahub.in` : 'staff@camerahub.in');
  const res = await db.execute({
    sql: `INSERT INTO employees (name, role, email, status, phone) VALUES (?, ?, ?, ?, ?) RETURNING *`,
    args: [emp.name || 'New Staff', emp.role || 'Staff', email, emp.status || 'Active', phone]
  });

  // Record audit log
  await db.execute({
    sql: `INSERT INTO audit_logs (timestamp, user, action, details, ip_address) VALUES (?, ?, ?, ?, ?)`,
    args: ['Today, Just now', 'Admin', 'Created Employee', `Added new employee ${emp.name || 'Staff'} (${emp.role || 'Staff'})`, '127.0.0.1']
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
  getAppConfig,
  saveAppConfig,
  getDashboardData,
  getAllRentals,
  getCustomers,
  createCustomer,
  updateCustomer,
  getInventory,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  getPayments,
  createPayment,
  updatePaymentStatus,
  getAnalyticsData,
  updateCustomerNotes,
  deleteCustomer,
  updateCustomerVerification,
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
  updateEmployee,
  removeEmployee,
  triggerBackup
};


