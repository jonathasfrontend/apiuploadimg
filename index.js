const Imagedata = require('./models/Imagedata');

const { mongoose } = require('mongoose');
const { google } = require('googleapis');
const { Readable } =  require('stream');
const express = require('express');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios');


const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(upload.single('file'));
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({extended: true})); 
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, '/pages'));


app.get('/getimg', async (req, res) => {
  try {
    const responseData = await Imagedata.find()
    res.status(200).end(JSON.stringify(responseData));
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
})


const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, '/credentials.json'),
  scopes: 'https://www.googleapis.com/auth/drive',
});

const drive = google.drive({ version: 'v3', auth });

const GOOGLE_API_FOLDER_ID = '1iNl1clLu61VRW6M2B4WqhFMaYM9uC7SS';

app.post('/upload', async (req, res) => {
  try {
    const fileMetadata = {
      name: req.file.originalname,
      parents: [GOOGLE_API_FOLDER_ID]
    };

    const media = {
      mimeType: req.file.mimetype,
      body:  Readable.from(req.file.buffer),
    }

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
    });

    await Imagedata.create({
      title: req.body.titulo_imagem,
      autor: req.body.autor_imagem,
      imagem: `https://drive.google.com/uc?id=${response.data.id}`
    });
    
    return res.status(204).end();

  } catch(error) {
    return res.status(500).json({ error: 'Error uploading file' });
}

});



mongoose.connect('mongodb+srv://root:dFrPbwloK4qEAnKy@cluster0.xvdlp.mongodb.net/dataimage?retryWrites=true&w=majority')
.then(()=>{console.log("bd connected")})
.catch(()=>{console.log("Falha ao conectar com o banco")})

const port = 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
