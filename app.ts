import express, { type Request, type Response, type NextFunction } from "express";
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";         
import jwt from "jsonwebtoken";


interface Kisi {
    id: number;
    name: string;
    email: string;
}
const db = new Database(process.env.DB_PATH ?? "kisiler.db");
db.exec(`
  CREATE TABLE IF NOT EXISTS kisiler (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL
  )
`);
db.exec(`
  CREATE TABLE IF NOT EXISTS kullanicilar (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL
  )
`);
const app = express();  
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not defined");
}
app.use(express.json());

app.get("/kisiler", (req, res) => {
    const kisiler = db.prepare("SELECT * FROM kisiler").all();
    res.json(kisiler);
})

app.get("/kisiler/:id", (req, res) => {
    const id = Number(req.params.id);
    const kisi = db.prepare("SELECT * FROM kisiler WHERE id = ?").get(id);
    if(!kisi){
        res.status(404).json({hata: "Kişi bulunamadı"});
        return;
    }
    res.json(kisi);
});

app.post("/kisiler", girisGerekli, (req, res) => {
    const {name, email} = req.body;
    if(!name || !email){
        res.status(400).json({hata: "name ve email zorunlu"});
        return; 
    }
    const sonuc = db.prepare("INSERT INTO kisiler (name, email) VALUES (?, ?)").run(name, email);
    const yeniKisi: Kisi = {
        id: Number(sonuc.lastInsertRowid),
        name,
        email
    }
    res.status(201).json(yeniKisi);
});

app.delete("/kisiler/:id", girisGerekli, (req, res) => {
    const id = Number(req.params.id);
    const sonuc = db.prepare("DELETE FROM kisiler WHERE id = ?").run(id);
    if (sonuc.changes === 0) {
        res.status(404).json({hata: "Kişi bulunamadı"});
        return; 
    }
    res.sendStatus(204);
});

app.post("/register",  async (req, res) => {
    const {email, password} = req.body; 
    if(!email || !password){
        res.status(400).json({hata: "email ve password zorunlu"});
        return; 
    }
    const hash = await bcrypt.hash(password, 10);
    try {
        const sonuc = db.prepare("INSERT INTO kullanicilar (email, password_hash) VALUES (?, ?)").run(email, hash);
        res.status(201).json({ id: Number(sonuc.lastInsertRowid), email });
    }catch(hata){
        if (hata instanceof Error && hata.message.includes("UNIQUE")) {
            res.status(409).json({hata: "Bu e-posta kullanılmakta"});
            return; 
        }
        res.status(500).json({hata: "Sunucu hatası"});
    } 
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ hata: "email ve password zorunlu" });
        return;
    }

    const kullanici = db.prepare("SELECT * FROM kullanicilar WHERE email = ?").get(email) as
        { id: number; email: string; password_hash: string } | undefined;
    if (!kullanici) {
        res.status(401).json({ hata: "Email veya şifre hatalı" });
        return;
    }

    const dogruMu = await bcrypt.compare(password, kullanici.password_hash);
    if (!dogruMu) {
        res.status(401).json({ hata: "Email veya şifre hatalı" });
        return;
    }

    const token = jwt.sign(
        { id: kullanici.id, email: kullanici.email },
        JWT_SECRET,
        { expiresIn: "1h" }
    );
    res.json({ token });
});

function girisGerekli(req: Request, res: Response, next: NextFunction) {
    const baslik = req.headers.authorization;
    if(!baslik || !baslik.startsWith("Bearer ")){
        res.status(401).json({hata: "Giris yapılmalı"});
        return;
    }

    const token = baslik.slice(7);
    try {
        jwt.verify(token, JWT_SECRET!);
        next(); 
    }catch{
        res.status(401).json({hata: "Token geçersiz veya süresi dolmuş"});
    }
}

export default app;