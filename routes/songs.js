const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController');
const { checkAuth } = require('../middlewares/auth');
const upload = require('../middlewares/multer');

const genreMatch = 'all|pop|folk|rap|blues|jazz|rock|electronic|classical|dance';

router.get('/', songController.getSongs);
router.get('/hot', songController.getHotSongs);
router.get(`/hot/:genre(${genreMatch})`, songController.getHotSongsByGenre);
router.get('/latest', songController.getLatestSongs);
router.get(`/latest/:genre(${genreMatch})`, songController.getLatestSongsByGenre);
router.get('/search', songController.searchSong);
router.get('/:id', songController.getSong);

router.post('/upload', checkAuth('isCreator'), upload.single('song'), songController.uploadSong);
router.post('/create', checkAuth('isCreator'), songController.createSong);
router.patch('/:id', checkAuth('isCreator'), songController.updateSong);
router.delete('/:id', checkAuth('isCreator'), songController.deleteSong);

module.exports = router;
