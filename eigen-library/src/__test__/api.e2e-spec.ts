import request from "supertest";
import httpServer from "@/app"

describe('API Testing', () => {
    const m_body = {
      code: "M020",
      name: "K. Pandjaitan"
    };
    const a_body = {
      name: 'P. Pujangga'
    }
    const b_body = {
      code: "TKW-12",
      title: "Doraemon di negeri Wakanda",
      author: "Bang Saleh",
      stock: 1
    }

    describe('/api/v1/members', () => {
      it('should return 404', async () => {
        const res = await request(httpServer).get('/api/v1/member');
        expect(res.statusCode).toBe(404)
      });
      it('Getting Member List: Should return 200', async () => {
        const res = await request(httpServer).get('/api/v1/members');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('status')
        expect(res.body).toHaveProperty('code');
        expect(res.body).toHaveProperty('data');
      });
      it('Adding New Member: Should return 201', async () => {
        const res = await request(httpServer).post(`/api/v1/members`).send(m_body);
        expect(res.statusCode).toBe(201)
      });
      it('Removing Member: Should return 201', async () => {
        const res = await request(httpServer).delete(`/api/v1/members?code=${m_body.code}`);
        expect(res.statusCode).toBe(201);
        expect(res.body['status']).toBe('Deleted')
      })
    });
    /**
     * Author Test Unit
     */
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
      });
      it(`Adding Author ${a_body.name}: Should return 201`, async () => {
        const res = await request(httpServer).post(`/api/v1/authors`).send(a_body);
        expect(res.statusCode).toBe(201);
      });
      it(`Removing Author ${a_body.name}: Should return 201`, async () => {
        const res = await request(httpServer).delete(`/api/v1/authors?name=${a_body.name}`);
        expect(res.statusCode).toBe(201);
        expect(res.body['operations']).toBe('Succeeded')
      })
    });
    /**
     *  Books Test Unit
     */
    describe('/api/v1/books', () => {
      it('should return 404', async () => {
        const res = await request(httpServer).get('/api/v1/book');
        expect(res.statusCode).toBe(404)
      });
      it('Should return 200 - GET', async () => {
        const res = await request(httpServer).get('/api/v1/books');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('status');
        expect(res.body).toHaveProperty('code');
        expect(res.body).toHaveProperty('data');
      });
      it(`Adding Books ${b_body.title}: Should return 201`, async () => {
        const res = await request(httpServer).post(`/api/v1/books`).send(b_body);
        expect(res.statusCode).toBe(201);
      });
      it(`Removing Books ${b_body.title}: Should return 201`, async () => {
        const res = await request(httpServer).delete(`/api/v1/books?code=${b_body.code}`);
        expect(res.statusCode).toBe(201);
        expect(res.body['operations']).toBe('Succeeded')
      })
    })
})