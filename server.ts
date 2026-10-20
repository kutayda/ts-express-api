import express from "express";

interface Kisi {
    id: number;
    name: string;
    email: string;
}
const kisiler: Kisi[] = [
    {id: 1, name: "Kutay", email: "kutay@kutay.com"},
    {id: 2, name: "Ahmet", email: "ahmet@ahmet.com"},
    {id: 3, name: "Mehmet", email: "mehmet@mehmet.com"},
]
const app = express();  
app.use(express.json());

app.get("/kisiler", (req, res) => {
    res.json(kisiler);
})

app.get("/", (req, res) => {
    res.send("Merhaba API");
});

app.get("/kisiler/:id", (req, res) => {
    const id = Number(req.params.id);
    const kisi = kisiler.find((k) => k.id === id);
    if(!kisi){
        res.status(404).json({Hata: "Kişi bulunamadı"});
        return;
    }
    res.json(kisi);
});

app.post("/kisiler", (req, res) => {
    const {name, email} = req.body;
    if(!name || !email){
        res.status(400).json({Hata: "name ve email zorunlu"});
        return; 
    }
    const yeniKisi : Kisi = {
        id: kisiler.length + 1,
        name,
        email
    }
    kisiler.push(yeniKisi);
    res.status(201).json(yeniKisi);
});

app.delete("/kisiler/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = kisiler.findIndex((k) => k.id === id);
    if(index === -1){
        res.status(404).json({Hata: "Kişi bulunamadı"});
        return;
    }
    kisiler.splice(index, 1);
    res.sendStatus(204).send();
});

app.listen(3000, () => {
    console.log("Sunucu 3000 portunda çalışıyor");
});