import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { LIGHT_NOVELS } from '@consumet/extensions';
import { LightNovelSortBy } from '@consumet/extensions/dist/models/types';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  const readlightnovels = new LIGHT_NOVELS.ReadLightNovels();
  fastify.get('/', (_, rp) => {
    rp.status(200).send({
      intro:
        "Welcome to the readlightnovels provider: check out the provider's website @ https://readlightnovels.net/",
      routes: ['/:query', '/info', '/read'],
      documentation: 'https://docs.consumet.org/#tag/readlightnovels',
    });
  });

  fastify.get('/:query', async (request: FastifyRequest, reply: FastifyReply) => {
    const query = (request.params as { query: string }).query;
    const page = (request.query as { page: number }).page || 1;
    const res = await readlightnovels.search(query,page);

    reply.status(200).send(res);
  });

  fastify.get('/info', async (request: FastifyRequest, reply: FastifyReply) => {
    const id = (request.query as { id: string }).id;
    const chapterPage = (request.query as { chapterPage: number }).chapterPage;

    if (typeof id === 'undefined') {
      return reply.status(400).send({
        message: 'id is required',
      });
    }

    try {
      const res = await readlightnovels
        .fetchLightNovelInfo(id, chapterPage)
        .catch((err) => reply.status(404).send({ message: err }));

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Please try again later.' });
    }
  });

  fastify.get('/read', async (request: FastifyRequest, reply: FastifyReply) => {
    const chapterId = (request.query as { chapterId: string }).chapterId;

    if (typeof chapterId === 'undefined') {
      return reply.status(400).send({
        message: 'chapterId is required',
      });
    }

    try {
      const res = await readlightnovels
        .fetchChapterContent(chapterId)
        .catch((err) => reply.status(404).send(err));

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Please try again later.' });
    }
  });

  fastify.get('/new-novels', async (request: FastifyRequest, reply: FastifyReply) => {
    const page = (request.query as { page: number }).page || 1;
    try {
      const res = await readlightnovels
        .fetchNewNovels(page)
        .catch((err) => reply.status(404).send({ message: err }));

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Please try again later.' });
    }
  });

  fastify.get('/latest-release', async (request: FastifyRequest, reply: FastifyReply) => {
    const page = (request.query as { page: number }).page || 1;
    try {
      const res = await readlightnovels
        .fetchLatestRelease(page)
        .catch((err) => reply.status(404).send({ message: err }));

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Please try again later.' });
    }
  });

  fastify.get('/most-popular', async (request: FastifyRequest, reply: FastifyReply) => {
    const page = (request.query as { page: number }).page || 1;
    try {
      const res = await readlightnovels
        .fetchMostPopular(page)
        .catch((err) => reply.status(404).send({ message: err }));

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Please try again later.' });
    }
  });

  fastify.get('/completed-novels', async (request: FastifyRequest, reply: FastifyReply) => {
    const page = (request.query as { page: number }).page || 1;
    try {
      const res = await readlightnovels
        .fetchCompleteNovels(page)
        .catch((err) => reply.status(404).send({ message: err }));

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Please try again later.' });
    }
  });

  fastify.get('/genre/:genreID', async (request: FastifyRequest, reply: FastifyReply) => {
    const genreID = (request.params as { genreID: string }).genreID;
    const page = (request.query as { page: number }).page || 1;
    const sortBy = (request.query as { sortBy: string }).sortBy || 'new';
    let checkSortBy : LightNovelSortBy;
    switch(sortBy){
      case 'new':
        checkSortBy=LightNovelSortBy.NEW;
        break;
      case 'most-read':
        checkSortBy=LightNovelSortBy.MOST_READ;
        break;
      case 'completed':
        checkSortBy=LightNovelSortBy.COMPLETED;
        break;
      default:
        checkSortBy=LightNovelSortBy.NEW;
        break;
    }
    try {
      const res = await readlightnovels
        .fetchGenreNovels(genreID,page,checkSortBy)
        .catch((err) => reply.status(404).send({ message: err }));

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Please try again later.' });
    }
  });

  fastify.get('/genre-list', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const res = await readlightnovels
        .fetchGenreList()
        .catch((err) => reply.status(404).send({ message: err }));

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Please try again later.' });
    }
  });
};

export default routes;
