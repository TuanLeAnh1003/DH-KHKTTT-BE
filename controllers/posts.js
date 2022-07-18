import { PostModel } from '../models/PostModel.js'
import { fileURLToPath } from 'url';
import path from 'path'
import fs from 'fs'

import uuid from 'uuid-v4'
import { bucket } from '../firebase/config.js'
import { Console } from 'console';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

export const getPosts = async (req, res) => {
  try {
    const posts = await PostModel.find().sort({createdAt: 'desc'})

    res.status(200).json(posts)
  } catch (error) {
    res.status(500).json({
      error: error
    })
  }
}

export const getPostsSearch = async (req, res) => {
  try {
    let results;
      results = await PostModel.aggregate([
        {
          $search: {
            "index": "searchPost",
            "autocomplete": {
              "query": req.body.input,
              "path": "title"
            },
          },
        }
      ]);
      if (results) return res.status(200).send(results);
  } catch (error) {
    console.log(error);
    res.send([]);
  }
};

export const getPostById = async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.postId)

    res.status(200).json(post)
  } catch (err) {
    res.status(500).json(err)
  }
}

export const createPost = async (req, res) => {
  try {
    const post = await PostModel.create({
      title: req.body.title,
      subHeader: req.body.subHeader,
      image: req.body.image,
      label: req.body.label,
      content: req.body.content,
      linkPost: req.body.linkPost ? req.body.linkPost : '',
    })

    res.status(200).json(post)
  } catch (err) {
    res.status(500).json(err)
  }
}

export const updatePost = async (req, res) => {
  try { 
    const updatedPost = req.body;

    const post = await PostModel.findOneAndUpdate({ _id: updatedPost.postId}, updatedPost, { new: true });

    res.status(200).json(post)
  } catch (err) {
    res.status(500).json(err)
  }
}

export const getPostsByTitle = async (req, res) => {
  try {
    const posts = await PostModel.find()
    const postsList = []
    for (let index = 0; index < posts.length; index++) {
      if (Object.keys(posts[index].label).includes(req.body.title)) {
        postsList.push(posts[index])
      }
    }
    res.status(200).json(postsList)

  } catch (err) {
    res.status(500).json(err)
  }
}

export const getPostsByLabel = async (req, res) => {
  try {
    const posts = await PostModel.find()
    const postsList = []

    for (let post of posts) {
      if (Object.values(post.label)[0].includes(req.body.label)) {
        postsList.push(post)
      }
    }

    res.status(200).json(postsList)
  } catch (err) {
    res.status(500).json(err)
  }
}

export const getEnoughPostsByTitle = async (req, res) => {
  let labelList = []
  const tempList = []

  switch (req.body.title) {
    case "Giới thiệu":
      labelList = ["Đoàn - Hội KH&KTTT", "Cơ cấu nhân sự", "Danh hiệu SV5T - TNTT"]
      break;
    case "Hoạt động":
      labelList = ["Bản tin Đoàn - Hội", "Hoạt động đang diễn ra", "Hoạt động sắp diễn ra", "Các cuộc thi của Đoàn Thanh niên", "Hoạt động tại UIT"]
      break;
    case "Tin tức":
      labelList = ["Thông báo", "Tin công nghệ", "Sinh viên tiêu biểu", "Những câu chuyện đẹp tại ISE"]
      break;
    case "Hỗ trợ":
      labelList = ["Quy trình - văn bản", "Học bổng", "Việc làm - Thực tập", "Khác"]
      break;
    case "Học tập":
      labelList = ["Cuộc thi học thuật", "Kho tài liệu", "Nghiên cứu khoa học cùng ISE"]
      break;
    default:
      break;
  }

  try {
    const posts = await PostModel.find().sort({updatedAt: 'desc'})
    const postsList = []
    
    for (let label of labelList) {
      for (let post of posts) {
        if (Object.values(post.label)[0].includes(label)) {
          postsList.push(post)
          break;
        }
      }
    }

    res.status(200).json(postsList)

  } catch (err) {
    res.status(500).json(err)
  }
}

export const uploadImageToFirebase = async (req, res) => {
  console.log(req.file);

  var TempFile = req.file;
  var TempPathFile = TempFile.path;

    const targetPathUrl = path.join(process.cwd(), "./images/" + TempFile.originalname)
    if (path.extname(TempFile.originalname).toLowerCase() === ".png" || ".jpg") {
        await fs.rename(TempPathFile, targetPathUrl, err => {
          if (err) return console.log(err)
        })
      }

    const filename = await targetPathUrl;

    const metadata = {
      metadata: {
        firebaseStorageDownloadTokens: uuid()
      },
      contentType: 'image/png',
      cacheControl: 'public, max-age=31536000',
    };

    try {
      await bucket.upload(filename, {
        gzip: true,
        metadata: metadata,
      });
      await res.status(200).json({
        uploaded: true,
        url: `https://firebasestorage.googleapis.com/v0/b/doanhoikhkttt.appspot.com/o/${TempFile.originalname}?alt=media\&token=${metadata.metadata.firebaseStorageDownloadTokens}`
      })
      
      fs.unlink(filename, function (err) {
        if (err) {
          console.error(err);
        } else {
          console.log("File removed:", filename);
        }
      });
    } catch (err) {
      console.log('upload error', err);
    }

}

export const uploadImages = async (req, res) => {
  var TempFile = req.files.upload;
  var TempPathFile = TempFile.path;

  const targetPathUrl = path.join(process.cwd(), "./images/" + TempFile.name)
    if (path.extname(TempFile.originalFilename).toLowerCase() === ".png" || ".jpg") {
        await fs.rename(TempPathFile, targetPathUrl, err => {
          if (err) return console.log(err)
        })
      }

    const filename = targetPathUrl;

    const metadata = {
      metadata: {
        firebaseStorageDownloadTokens: uuid()
      },
      contentType: 'image/png',
      cacheControl: 'public, max-age=31536000',
    };

    try {
      await bucket.upload(filename, {
        gzip: true,
        metadata: metadata,
      });
      await res.status(200).json({
        uploaded: true,
        url: `https://firebasestorage.googleapis.com/v0/b/doanhoikhkttt.appspot.com/o/${TempFile.originalFilename}?alt=media&token=${metadata.metadata.firebaseStorageDownloadTokens}`
      })

        fs.unlink(filename, function (err) {
          if (err) {
            console.error(err);
          } else {
            console.log("File removed:", filename);
          }
        });
    } catch (err) {
      console.log('upload err', err);
    }

}