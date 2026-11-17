const Mahasiswa = require('../models/mahasiswaModel');
const Prodi = require('../models/prodiModel');
const { errorHttp } = require('../middlewares/errorHandler');

exports.getAll = async (req, res) => {
  const filter = {};
  if (req.query.kota) {
    filter['alamat.kota'] = String(req.query.kota);
  }
  if (req.query.prodi) {
    const prodi = await Prodi.findOne({ kode: String(req.query.prodi).toUpperCase() });
    filter.prodiId = prodi ? prodi._id : { $in: [] };
  }
  const data = await Mahasiswa.find(filter).populate('prodiId');
  res.json(data);
};

exports.getById = async (req, res, next) => {
  if (!Mahasiswa.db.base.isValidObjectId(req.params.id)) {
    return next(errorHttp(400, 'ID mahasiswa tidak valid'));
  }
  const data = await Mahasiswa.findById(req.params.id).populate('prodiId');
  if (!data) return next(errorHttp(404, 'Data tidak ditemukan'));
  res.json(data);
};

exports.create = async (req, res, next) => {
  const { nama, nim, alamat, prodiId } = req.body;
  if (typeof nama !== 'string' || !nama.trim() || typeof nim !== 'string' || !nim.trim()) {
    return next(errorHttp(400, 'nama dan nim wajib diisi'));
  }
  const baru = await Mahasiswa.create({
    nama: nama.trim(),
    nim: nim.trim(),
    alamat,
    prodiId: prodiId || undefined,
  });
  res.status(201).json(baru);
};

exports.update = async (req, res, next) => {
  if (!Mahasiswa.db.base.isValidObjectId(req.params.id)) {
    return next(errorHttp(400, 'ID mahasiswa tidak valid'));
  }
  const { nama, nim, alamat, prodiId } = req.body;
  const perubahan = {};
  if (nama !== undefined) perubahan.nama = nama;
  if (nim !== undefined) perubahan.nim = nim;
  if (alamat !== undefined) perubahan.alamat = alamat;
  if (prodiId !== undefined) perubahan.prodiId = prodiId || undefined;

  const hasil = await Mahasiswa.findByIdAndUpdate(req.params.id, perubahan, {
    new: true,
    runValidators: true,
  }).populate('prodiId');
  if (!hasil) return next(errorHttp(404, 'Data tidak ditemukan'));
  res.json(hasil);
};

exports.remove = async (req, res, next) => {
  if (!Mahasiswa.db.base.isValidObjectId(req.params.id)) {
    return next(errorHttp(400, 'ID mahasiswa tidak valid'));
  }
  const berhasil = await Mahasiswa.findByIdAndDelete(req.params.id);
  if (!berhasil) return next(errorHttp(404, 'Data tidak ditemukan'));
  res.status(204).send();
};