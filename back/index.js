const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Le nom est obligatoire'],
      trim: true,
      minlength: [1, 'Le nom ne peut pas être vide'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true }
);

const Item = mongoose.model('Item', itemSchema);

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'API MERN opérationnelle',
    health: '/api/health',
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

app.get('/api/items', async (req, res, next) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    next(error);
  }
});

app.post('/api/items', async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({
        error: 'Le champ name est obligatoire et doit être une chaîne non vide.',
      });
    }

    if (description !== undefined && typeof description !== 'string') {
      return res.status(400).json({
        error: 'Le champ description doit être une chaîne de caractères.',
      });
    }

    const item = await Item.create({
      name: name.trim(),
      description: description ? description.trim() : '',
    });

    return res.status(201).json(item);
  } catch (error) {
    next(error);
  }
});

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({ error: 'Le corps de la requête JSON est invalide.' });
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }

  console.error(error);
  return res.status(500).json({ error: 'Une erreur interne est survenue.' });
});

async function startServer() {
  if (!process.env.MONGODB_URI) {
    throw new Error('La variable MONGODB_URI est obligatoire.');
  }

  await mongoose.connect(process.env.MONGODB_URI);

  app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
  });
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error(`Impossible de démarrer le serveur : ${error.message}`);
    process.exitCode = 1;
  });
}

module.exports = app;
