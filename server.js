import './env.js';
import express from 'express';
import { connectingWithMongoose } from './src/config/mongooseConfig.js';
import { userRoutes } from './src/features/user/user.routes.js';
import bodyParser from 'body-parser';
import { postRoutes } from './src/features/post/post.routes.js';
import { commentRoutes } from './src/features/comment/comment.routes.js';
import { likeRoutes } from './src/features/like/like.routes.js';
import { otpRoutes } from './src/features/otp/otp.routes.js';
import { reqRoutes } from './src/features/request/request.routes.js';
const app = express();
const port = 3000;

app.use(bodyParser.json())
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/friends', reqRoutes);
app.use('/api/otp', otpRoutes);


app.get('/', (req, res) => {
    res.send("Welcome to the backend RestApi to comment ,like the user's post")
})

app.listen(port, () => {
    console.log(`Server is listening at ${port}`);
    connectingWithMongoose();

})
