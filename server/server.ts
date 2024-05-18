import * as dotenv from "dotenv";
import express, { query, response } from "express";
import cors from "cors";
import { User } from "./types";
import { Post } from "./types";
import { ProfileInfo } from "./types";
import {MongoClient, ServerApiVersion} from 'mongodb';
import { title } from "process";
const uri = "mongodb+srv://briannw2:IuH2qY69AaAKHGSs@bitlink.wfyrdwt.mongodb.net/?retryWrites=true&w=majority&appName=Bitlink";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
export const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

export async function connectToDatabase() {
  try {
      // Connect the client to the server
      await client.connect();
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
      return client;  // Return the connected client
  } catch (error) {
      console.error("Failed to connect to MongoDB:", error);
      // Handle error (e.g., retry connection, log error, etc.)
      throw error; // Optionally rethrow or handle differently
  }
}


dotenv.config();

const app = express();
app.use(cors());

// Connect to MongoDB and start Express server
connectToDatabase()
  .then((client) => {
    const app = express();  // Assuming express is used

    app.get('/api/account/messages', async (req, res) => {
      try {
        const database = client.db("account");
        const query = { $or: [{ sender_id: "1" }, { receiver_id: "1" }] };
        const messages = await database.collection("message").find(query).toArray();
        const userIds = new Set<string>();
        messages.forEach(message => { 
          if (message.sender_id === "1") userIds.add(message.receiver_id);
          if (message.receiver_id === "1") userIds.add(message.receiver_id);
        });
        const userIdArray = Array.from(userIds);
        const query2 = { user_id: { $in: userIdArray } };
        const collections = database.collection("user");
        // Fetch user information from the user collection
        const users = await collections.find(query2).toArray();

        // Map the user documents to the required format
        const userInfo: User[] = users.map(user => ({
          username: user.username,
          usertag: user.user_tag,
          profile_pic: user.profile_picture,
          user_id: user.user_id,
        }));
        
        const data = {
          users: userInfo,
          messages: messages
        };

        res.json(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).send('Failed to fetch messages');
      }
    });

    app.get('/api/posts', async (req, res) => {
      try {
        const database = client.db("account");
        const posts = await database.collection("post").find().toArray();

        // Map the post documents to the required format
        const data: Post[] = posts.map(post => ({
          title: post.title,
          content: {
            message: post.content.message,
            image: post.content.image,
            video: post.content.video
          },
          user: {
            username: post.user.username,
            usertag: post.user.usertag,
            profile_pic: post.user.profile_pic
          },
          comments: post.comments,
          timestamp: post.timestamp,
          likes: post.likes,
          reposts: post.reposts,
          comment_num: post.comment_num,
          saves: post.saves
        }));

        res.json(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).send('Failed to fetch messages');
      }
    });

    app.get('/api/user/:id', async (req, res) => {
      try {
        const database = client.db("account");
        const user_query = {'user_tag': req.params.id};
        const user_post_query = {'user.usertag': req.params.id};
        const user_info = await database.collection("user").find(user_query).toArray();
        const user_posts = await database.collection("post").find(user_post_query).toArray();

        const userInfo: ProfileInfo[] = user_info.map(user => ({
          user_id: user.user_id,
          username: user.username,
          usertag: user.user_tag,
          email: user.email,
          password: user.password,
          profile_picture: user.profile_picture,
          bio: user.bio,
          following: user.following
        }));

        // Map the post documents to the required format
        const posts: Post[] = user_posts.map(post => ({
          title: post.title,
          content: {
            message: post.content.message,
            image: post.content.image,
            video: post.content.video
          },
          user: {
            username: post.user.username,
            usertag: post.user.usertag,
            profile_pic: post.user.profile_pic
          },
          comments: post.comments,
          timestamp: post.timestamp,
          likes: post.likes,
          reposts: post.reposts,
          comment_num: post.comment_num,
          saves: post.saves
        }));

        const data = {
          user_info: userInfo,
          user_posts: posts
        }

        res.json(data);
      } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).send('Failed to fetch user');
      }
    });

    app.get('/api/search/', async (req, res) => {
      try {
        const database = client.db("account");
        const post_query = {'content.message': {$regex: req.query.q}}
        const search = await database.collection("post").find(post_query).toArray();

        // Map the user documents to the required format
        const data: Post[] = search.map(post => ({
          title: post.title,
          content: {
            message: post.content.message,
            image: post.content.image,
            video: post.content.video
          },
          user: {
            username: post.user.username,
            usertag: post.user.usertag,
            profile_pic: post.user.profile_pic
          },
          comments: post.comments,
          timestamp: post.timestamp,
          likes: post.likes,
          reposts: post.reposts,
          comment_num: post.comment_num,
          saves: post.saves
        }));

        res.json(data);
      } catch (error) {
        console.error("Error searching:", error);
        res.status(500).send('Failed to search');
      }
    });

    app.listen(4200, () => {
      console.log(`Server running at http://localhost:4200...`);
    });

    // Optional: Handle shutdown gracefully
    process.on('SIGINT', () => {
      client.close().then(() => {
        console.log("MongoDB connection closed due to app termination");
        process.exit(0);
      });
    });
  })
  .catch((error) => {
    console.error("Failed to connect to database:", error);
    process.exit(1); // Exit with error code on failure
  });
