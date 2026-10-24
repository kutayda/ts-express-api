const girisCevap = await fetch("http://localhost:3000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "kutay@test.com", password: "123456" }),
});
const { token } = await girisCevap.json() as { token: string };

const cevap = await fetch("http://localhost:3000/kisiler/1", {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` },
});
console.log(cevap.status);
console.log(await cevap.text());