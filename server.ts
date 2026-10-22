import express from "express";
import Database from "better-sqlite3";

interface Kisi {
    id: number;
    name: string;
    email: string;
}
const db = new Database("kisiler.db");
db.exec(`
  CREATE TABLE IF NOT EXISTS kisiler (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL
  )
`);
const app = express();  
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

app.post("/kisiler", (req, res) => {
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

app.delete("/kisiler/:id", (req, res) => {
    const id = Number(req.params.id);
    const sonuc = db.prepare("DELETE FROM kisiler WHERE id = ?").run(id);
    if (sonuc.changes === 0) {
        res.status(404).json({hata: "Kişi bulunamadı"});
        return; 
    }
    res.sendStatus(204);
});

app.listen(3000, () => {
    console.log("Sunucu 3000 portunda çalışıyor");
});