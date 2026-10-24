const girisCevap = await fetch("http://localhost:3000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "kutay@test.com", password: "123456" }),
});
const { token } = await girisCevap.json() as { token: string };
const bozukToken = token.slice(0, 10) + "X" + token.slice(11);

const cevap = await fetch("http://localhost:3000/kisiler", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ name: "Zeynep", email: "zeynep@zeynep.com" }),
});
console.log(cevap.status);
console.log(await cevap.text());