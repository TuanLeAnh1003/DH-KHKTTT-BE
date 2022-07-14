import express from 'express';
import { getPosts, getPostById, createPost, updatePost, getPostsByTitle, getPostsByLabel, getEnoughPostsByTitle, uploadImageToFirebase, uploadImages} from '../controllers/posts.js'
import multer from 'multer'
import multiparty from 'connect-multiparty'

const MultipartyMiddleware = multiparty({uploadDir: './images'});

// const upload = multer({
//   storage: multer.memoryStorage()
// })

const upload = multer({ dest: "images/" });

const router = express.Router();

router.get('/', getPosts);

router.get('/:postId', getPostById);

router.post('/', createPost)

router.put('/', updatePost)

router.post('/getPostsByTitle', getPostsByTitle)

router.post('/getEnoughPostsByTitle', getEnoughPostsByTitle)

router.post('/getPostsByLabel', getPostsByLabel)

router.post('/upload', upload.single('image'), uploadImageToFirebase)

router.post('/uploads', MultipartyMiddleware, uploadImages)

export default router;