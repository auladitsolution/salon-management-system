# Backup and Disaster Recovery Strategy
**Salon Booking & Management System - Aulad IT Solution**

## 1. Backup Strategy Overview
Every salon deployment manages sensitive business operations: appointment calendars, customer contact details, retail inventory, and financial transaction histories. Data loss can halt salon operations.

### Multi-Layered Protection
1. **Automated Continuous Backups (MongoDB Atlas M10+):** Point-in-time recovery with continuous opLog capture and daily snapshots retained for 7 to 35 days.
2. **Scheduled Logical Dump Backups (CLI Tooling):** Weekly automated database dumps exported as compressed BSON archives to secure offsite cloud storage.
3. **Application Level CSV Exports:** Operational managers can export raw CSV reports for Appointments, Customers, Sales, Expenses, and Inventory directly from `/admin/reports`.

---

## 2. Manual Backup with `mongodump`

To take an instant full snapshot of a client's database:

```bash
# Set client database URI
export MONGODB_URI="mongodb+srv://<user>:<password>@cluster0.mongodb.net/client_salon_db"

# Create timestamped backup directory
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="./backups/backup_$TIMESTAMP"
mkdir -p "$BACKUP_DIR"

# Execute mongodump
mongodump --uri="$MONGODB_URI" --archive="$BACKUP_DIR/salon_dump.gz" --gzip

echo "Backup created successfully at $BACKUP_DIR/salon_dump.gz"
```

---

## 3. Disaster Recovery & Database Restoration with `mongorestore`

If a database restore is required due to corruption, accidental deletion, or server migration:

### Restoration Steps:
1. Notify salon operations to pause active POS billing and online booking (display maintenance banner).
2. Prepare the clean target database.
3. Execute `mongorestore`:

```bash
# Restore from compressed archive with drop option
mongorestore --uri="$TARGET_MONGODB_URI" --archive="./backups/backup_20261004_120000/salon_dump.gz" --gzip --drop
```

4. Verify index consistency:
   - Check unique indexes on `slotReservations` (`staffId`, `bookingDate`, `slotTime`).
   - Check unique index on `invoices` (`invoiceNumber`).
   - Check unique index on `customers` (`phone`).
5. Verify application connectivity and run integration health checks.
6. Resume normal operations.

---

## 4. Backup & Recovery Verification Checklist

- [ ] Daily backup snapshot verified in MongoDB Atlas console.
- [ ] Sample restore tested in an isolated staging environment at least once per quarter.
- [ ] CSV data exports tested with UTF-8 Bengali text formatting preserved.
- [ ] Emergency contact protocol documented for 24/7 disaster recovery support.
