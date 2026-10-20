const cevap = await fetch("http://localhost:3000/kisiler/1", {
    method: "DELETE",
});
console.log(cevap.status);