const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const { graphqlUploadExpress, GraphQLUpload } = require('graphql-upload');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

const typeDefs = gql`
  scalar Upload

  type Bio {
    id: Int!
    name: String!
    email: String!
    image: String
    file: String
  }

  type Query {
    getAllBios: [Bio!]!
  }

  type Mutation {
    createBio(name: String!, email: String!, image: Upload, file: Upload): Bio!
  }
`;

const resolvers = {
  Upload: GraphQLUpload,

  Query: {
    getAllBios: async () => {
      try {
        const bios = await prisma.bio.findMany();
        return bios.map(bio => ({
          ...bio,
          image: bio.image ? Buffer.from(bio.image, 'binary').toString('base64') : null,
          file: bio.file ? Buffer.from(bio.file, 'binary').toString('base64') : null,
        }));
      } catch (error) {
        console.error('Error fetching bios:', error);
        throw new Error('Failed to fetch bios');
      }
    }
  },
  Mutation: {
    createBio: async (_, { name, email, image, file }) => {
      try {
        let imagePath = null;
        let filePath = null;
  
        if (image) {
          imagePath = await processUpload(image);
          imagePath = path.join(__dirname, 'uploads', imagePath);
        }
  
        if (file) {
          filePath = await processUpload(file);
          filePath = path.join(__dirname, 'uploads', filePath);
        }
  
        const bioData = {
          name,
          email,
          image: imagePath,
          file: filePath
        };

        // Check if image is provided before adding it to bioData
        if (imagePath) {
          bioData.image = imagePath;
        }
  
        const newBio = await prisma.bio.create({
          data: bioData,
        });
  
        return {
          ...newBio,
          image: newBio.image ? Buffer.from(newBio.image, 'binary').toString('base64') : null,
          file: newBio.file ? Buffer.from(newBio.file, 'binary').toString('base64') : null,
        };
      } catch (error) {
        console.error('Error creating bio:', error);
        throw new Error('Failed to create bio');
      }
    }
  }

};  

async function processUpload(upload) {
  const { createReadStream, filename } = await upload;
  const stream = createReadStream();
  const filePath = path.join(__dirname, 'uploads', filename);
  await new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(filePath);
    stream
      .pipe(writeStream)
      .on('finish', resolve)
      .on('error', reject);
  });
  return filePath;
}

const app = express();

// Middleware to handle multipart/form-data
app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  uploads: false, // Set this to false to use `graphqlUploadExpress`
  context: ({ req }) => ({
    req,
  }),
});

(async () => {
  await server.start();
  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
})();
