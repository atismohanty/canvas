import swaggerAutolgen from 'swagger-autogen';


const doc = {
    info: {
      title: 'Canvas',
      description: 'This is a generic auth module for all the applications',
    },
    host: 'localhost:3001',
    schemes: ['https'],
    basePath: "/",
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
  };
const outputFile = './swagger.json';
const endPointFiles = ['../routes/index.ts']
swaggerAutolgen(outputFile, endPointFiles, doc);
