import request from "supertest";
import httpServer from "@/app"

describe('API Testing', () => {
  
    describe('/api/v1/members', () => {
      it('should return 404', async () => {
        const res = await request(httpServer).get('/api/v1/member');
        expect(res.statusCode).toBe(404)
      });
      it('should return 200', async () => {
        const res = await request(httpServer).get('/api/v1/members');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('status')
        expect(res.body).toHaveProperty('code');
        expect(res.body).toHaveProperty('data');
      });
      it('should return 201', async () => {
        const m_body = {
          code: "M020",
          name: "K. Pandjaitan"
        }
        const res = await request(httpServer).post(`/api/v1/members`).send(m_body);
        expect(res.statusCode).toBe(201)
      })
    });
    
    describe('/api/v1/authors', () => {
      it('should return 404', async () => {
        const res = await request(httpServer).get('/api/v1/author');
        expect(res.statusCode).toBe(404)
      });
      it('Should return 200 - GET', async () => {
        const res = await request(httpServer).get('/api/v1/authors');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('status');
        expect(res.body).toHaveProperty('code');
        expect(res.body).toHaveProperty('data');
      })
    })
})