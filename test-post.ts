const cevap = await fetch("http://localhost:3000/kisiler", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Ayşe", email: "ayse@ayse.com" }),
});
console.log(await cevap.json());