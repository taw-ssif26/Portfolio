import { hash } from "@node-rs/argon2";

const pw = process.argv[2];
if (!pw) { console.error('Usage: npm run hash -- "your-password"'); process.exit(1); }
hash(pw).then((h) => console.log(`ADMIN_PASSWORD_HASH='${h}'`));
