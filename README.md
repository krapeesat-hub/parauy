# บันทึกพารวย — Standalone PWA (Local-only)

แอปนี้เป็น React + Vite PWA ที่รันได้อิสระ ไม่ต้องพึ่ง Claude อีกต่อไป
ข้อมูลทั้งหมดเก็บใน `localStorage` ของเบราว์เซอร์บนอุปกรณ์นั้นๆ (local-only ตามที่ตกลงไว้)

## รันดูบนเครื่องตัวเอง (dev mode)

```bash
npm install
npm run dev
```
เปิด `http://localhost:5173` (หรือพอร์ตที่ terminal แจ้ง) — ทดสอบบนมือถือเครื่องเดียวกันวง LAN ก็ใช้ `npm run dev -- --host` แล้วเปิดจาก IP เครื่อง

## Build เป็นไฟล์สำหรับ deploy จริง

```bash
npm run build
```
จะได้โฟลเดอร์ `dist/` เป็น static site ล้วนๆ (HTML/CSS/JS) — เอาไปโฮสต์ที่ไหนก็ได้ที่รองรับ static file ฟรีทั้งนั้น เช่น:

- **Netlify** — ลาก-วางโฟลเดอร์ `dist/` ที่ https://app.netlify.com/drop (เร็วที่สุด ไม่ต้อง config)
- **Vercel** — `vercel --prod` (ต้องติดตั้ง Vercel CLI ก่อน)
- **GitHub Pages** — push โปรเจกต์ขึ้น repo แล้วตั้งค่า Pages ให้ serve จาก `dist/` หรือใช้ GitHub Actions build อัตโนมัติ
- **Cloudflare Pages** — connect repo แล้ว build command `npm run build`, output directory `dist`

ต้องมี HTTPS เสมอ (บริการข้างต้นให้ฟรีอัตโนมัติ) เพราะ PWA ติดตั้งได้เฉพาะบน HTTPS หรือ localhost เท่านั้น

## ติดตั้งลงหน้าจอโฮมมือถือ (ไม่ต้องขึ้น App Store / Play Store)

หลัง deploy แล้วเปิดลิงก์บนมือถือ:

- **iPhone (Safari)**: กดปุ่มแชร์ (ไอคอนสี่เหลี่ยมมีลูกศรขึ้น) → "เพิ่มไปยังหน้าจอโฮม"
- **Android (Chrome)**: กดเมนู 3 จุด → "ติดตั้งแอป" หรือ "เพิ่มไปยังหน้าจอโฮม"

แอปจะเปิดแบบเต็มจอเหมือนแอปจริง มีไอคอนของตัวเอง และใช้งานได้แม้ไม่มีเน็ต (offline) เพราะมี service worker แคชไฟล์ไว้ให้แล้ว

## ข้อมูล — เก็บที่ไหน สำรองยังไง

- ข้อมูลอยู่ใน `localStorage` ของเบราว์เซอร์ **เฉพาะเครื่อง/เบราว์เซอร์นั้น** ไม่ sync ข้ามอุปกรณ์
- ล้างแคช/ถอนแอปออกจากหน้าจอโฮม (บางกรณี) หรือใช้ Private/Incognito mode จะทำให้ข้อมูลหาย
- ในแอปมีปุ่ม **ส่งออกข้อมูล (Settings → สำรอง/กู้คืนข้อมูล)** ให้ export เป็นไฟล์ `.json` เก็บไว้ แนะนำทำเป็นประจำ โดยเฉพาะก่อนเปลี่ยนเครื่อง
- ถ้าต้องการ sync ข้ามเครื่องจริงในอนาคต ต้องย้ายไปเฟส Supabase backend ตามที่คุยกันไว้

## โครงสร้างโปรเจกต์

```
src/
  App.jsx        ← ตัวแอปทั้งหมด (หน้าจอ/ตรรกะ/ดีไซน์)
  localStore.js  ← เลเยอร์เก็บข้อมูล local (แทนที่ window.storage เดิมของ Claude)
  main.jsx       ← entry point
vite.config.js   ← ตั้งค่า PWA manifest, service worker, Tailwind
public/          ← ไอคอนแอป (192px, 512px, favicon)
```
