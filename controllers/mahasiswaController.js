const Mahasiswa = require('../models/mahasiswaModel');
const { errorHttp } = require('../middlewares/errorHandler');

exports.getAll = async (req, res) => {
  const filter = {};
  if (req.query.kota) {
    filter['alamat.kota'] = String(req.query.kota);
  }
  if (req.query.prodi) {
    const prodi = await Prodi.findOne({ kode: String(req.query.prodi).toUpperCase() });
    // Kode prodi tidak dikenal -> hasil kosong ($in: [] tidak cocok dengan apa pun)
    filter.prodiId = prodi ? prodi._id : { $in: [] };
  }
  const data = await Mahasiswa.find(filter).populate('prodiId');
  res.json(data);
};

exports.getById = (req, res, next) => {
  const id = parseInt(req.params.id);
  const data = mahasiswaModel.getById(id);
  if (!data) return next(errorHttp(404, 'Data tidak ditemukan'));
  res.json(data);
};

exports.create = (req, res, next) => {
  const { nama, jurusan } = req.body;
  if (!nama || !jurusan) return next(errorHttp(400, 'nama dan jurusan wajib diisi'));

  const baru = mahasiswaModel.create({ nama, jurusan });
  res.status(201).json(baru);
};

exports.update = (req, res, next) => {
  const id = parseInt(req.params.id);
  const hasil = mahasiswaModel.update(id, req.body);
  if (!hasil) return next(errorHttp(404, 'Data tidak ditemukan'));
  res.json(hasil);
};

exports.remove = (req, res, next) => {
  const id = parseInt(req.params.id);
  const berhasil = mahasiswaModel.remove(id);
  if (!berhasil) return next(errorHttp(404, 'Data tidak ditemukan'));
  res.status(204).send();
};