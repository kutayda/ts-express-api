const cevap = await fetch("http://localhost:3000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "kutay@test.com", password: "123456" }),
});
console.log(cevap.status);
console.log(await cevap.text());