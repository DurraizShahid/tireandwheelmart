import pg from 'pg';
const { Client } = pg;

const configs = [];
// Supavisor with postgres user (no project ref)
for (const r of ["us-east-1","us-east-2","eu-west-1","eu-central-1","ap-southeast-1"]) {
  configs.push({ host: 'aws-0-' + r + '.pooler.supabase.com', port: 5432, user: 'postgres', password: 'mgAvGB7WuSY1lvaM', database: 'postgres' });
  configs.push({ host: 'aws-0-' + r + '.pooler.supabase.com', port: 6543, user: 'postgres', password: 'mgAvGB7WuSY1lvaM', database: 'postgres' });
}
// Try DbDot (newer Supabase pooler)
configs.push({ host: 'db.xjxjsofuosrajvppoaph.supabase.co', port: 6543, user: 'postgres', password: 'mgAvGB7WuSY1lvaM', database: 'postgres' });

async function main() {
  for (const cfg of configs) {
    try {
      const c = new Client({ ...cfg, connectionTimeoutMillis: 8000 });
      await c.connect();
      console.log('CONNECTED:', cfg.host, cfg.port, cfg.user);
      await c.end();
      process.exit(0);
    } catch(e) {
      const msg = e.message || '';
      if (msg.includes('not found') || msg.includes('ENOTFOUND') || msg.includes('ENETUNREACH') || msg.includes('ECONNREFUSED') || msg.includes('no tenant')) continue;
      console.log(cfg.host, cfg.port, '->', msg.substring(0, 100));
    }
  }
  console.log('No connection found');
  process.exit(1);
}
main();
