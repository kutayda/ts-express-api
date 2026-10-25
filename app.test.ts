import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "./app.js";

describe("API", () => {
    it("token olmadan POST /kisiler 401 döner", async () => {
        const cevap = await request(app)
            .post("/kisiler")
            .send({ name: "Ali", email: "ali@ali.com" });
        expect(cevap.status).toBe(401);
    });
    it("geçerli bilgilerle POST /register 201 döner ", async () => {
        const cevap = await request(app)
            .post("/register")
            .send({ email: "kutay@test.com", password: "123456" });
        expect(cevap.status).toBe(201);
    });
    it("geçerli bilgilerle POST /login 200 döner", async () => {
        const cevap = await request(app)
            .post("/login")
            .send({ email: "kutay@test.com", password: "123456" });
        expect(cevap.status).toBe(200);
    });
    it("aynı e-posta ile POST /register 409 döner", async () => {
        const cevap = await request(app)
            .post("/register")
            .send({ email: "kutay@test.com", password: "123456" });
        expect(cevap.status).toBe(409);
    });
    it("token ile POST /kisiler 201 döner", async () => {
        const girisCevap = await request(app)
            .post("/login")
            .send({ email: "kutay@test.com", password: "123456" });
        const token = girisCevap.body.token;

        const cevap = await request(app)
            .post("/kisiler")
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "Ali", email: "ali@ali.com" });
        expect(cevap.status).toBe(201);
        expect(cevap.body.name).toBe("Ali");
    });

    it("token ile DELETE /kisiler/:id 204 döner", async () => {
        const girisCevap = await request(app)
            .post("/login")
            .send({ email: "kutay@test.com", password: "123456" });
        const token = girisCevap.body.token;

        const cevap = await request (app)
            .delete("/kisiler/1")
            .set("Authorization", `Bearer ${token}`);
        expect(cevap.status).toBe(204);
    });
    it("token ile olmayan kişiyi DELETE /kisiler/:id 404 döner", async () => {
        const girisCevap = await request (app)
            .post("/login")
            .send({ email: "kutay@test.com", password: "123456" });
        const toklen = girisCevap.body.token;

        const cevap = await request (app)
            .delete("/kisiler/99")
            .set("Authorization", `Bearer ${toklen}`);
        expect(cevap.status).toBe(404);
    });
});

