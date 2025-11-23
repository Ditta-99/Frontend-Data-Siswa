import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const API_URL = "http://localhost:5000/api/siswa_ujk";

export default function App() {
  const [siswa, setSiswa] = useState([]);
  const [formData, setFormData] = useState({
    kode_siswa: "",
    nama_siswa: "",
    alamat: "",
    tanggal_lahir: "",
    jurusan: "",
  });

  const [isEdit, setIsEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const fetchSiswa = async () => {
    try {
      const res = await axios.get(API_URL);
      setSiswa(res.data);
    } catch (err) {
      console.error("Gagal ambil data:", err);
    }
  };

  useEffect(() => {
    fetchSiswa(); //memanggil fetch saat komponen pertma kali d mount
  }, []); //  efek hanya jalan satu kali

  const handleChange = (e) => { //dipsng kesetiap input onchange
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { // cabang logika
      if (isEdit) {
        await axios.put(`${API_URL}/${formData.kode_siswa}`, formData);
        alert("✅ Data berhasil diubah!");
      } else {
        await axios.post(API_URL, formData);
        alert("✅ Data berhasil ditambahkan!");
      }
      fetchSiswa();
      handleCloseModal();
    } catch (err) {
      console.error(err);
      alert("❌ Gagal menyimpan data!");
    }
  };

  const handleDelete = async (kode_siswa) => {
    if (!window.confirm("Yakin ingin menghapus data ini?")) return;
    try {
      await axios.delete(`${API_URL}/${kode_siswa}`);
      alert("🗑️ Data berhasil dihapus!");
      fetchSiswa();
    } catch (err) {
      console.error(err);
      alert("❌ Gagal menghapus data!");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false); // menutup modal
    setIsEdit(false); // reset jd mode +
    setFormData({ // kosongkan fields
      kode_siswa: "",
      nama_siswa: "",
      alamat: "",
      tanggal_lahir: "",
      jurusan: "",
    });
  };

  const handleShowModal = () => setShowModal(true);

  // tanggallahir
  const handleEdit = (data) => {
    setFormData({
      ...data,
      tanggal_lahir: data.tanggal_lahir // isi formdata yg dipilih dan diisi otomatis
        ? new Date(data.tanggal_lahir).toISOString().split("T")[0]
        : "", // konversi tanggal y,m.d
    });
    setIsEdit(true);
    setShowModal(true);
  };

  return ( // render jsx
    <div
      className="min-vh-100 text-dark" // bosstrap utilitas
      style={{
        background: "linear-gradient(to bottom right, #dae5e6ff, #d4d8d8ff)", //body
        padding: "40px"
      }}
    >
      <div className="container-fluid">
        <h2
          className="text-center mb-4 fw-bold"
          style={{
            color: "#1565c0", //warna teks manajemen data
            textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
          }}
        >
          📘 Manajemen Data Siswa
        </h2>

        <div className="d-flex justify-content-end mb-3">
          <button
            className="btn text-black fw-bold"
            style={{
              backgroundColor: "#3498db",
              border: "none",
              boxShadow: "0 3px 6px rgba(0,0,0,0.2)",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#5dade2")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#3498db")}
            onClick={handleShowModal}
          >
            ➕ Tambah Siswa
          </button>
        </div>

        <div className="table-responsive shadow-lg rounded-4"> 
          <table
            className="table table-bordered text-center align-middle mb-0"
            style={{
              backgroundColor: "#6d8ae1ff",
              borderColor: "#213269ff",
            }}
          >
            <thead>
              <tr>
                <th style={{ backgroundColor: "#3498db", color: "black" }}>Kode</th>
                <th style={{ backgroundColor: "#3498db", color: "black" }}>Nama Siswa</th>
                <th style={{ backgroundColor: "#3498db", color: "black" }}>Alamat</th>
                <th style={{ backgroundColor: "#3498db", color: "black" }}>Tanggal Lahir</th>
                <th style={{ backgroundColor: "#3498db", color: "black" }}>Jurusan</th>
                <th style={{ backgroundColor: "#3498db", color: "black" }}>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {siswa.length > 0 ? (
                siswa.map((item, index) => ( //render 1 utk tiap siswa
                  <tr
                    key={item.kode_siswa} // key unik untuk peforma render
                    style={{
                      backgroundColor: index % 2 === 0 ? "#f7fbff" : "white",
                      transition: "0.3s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#6daedaff")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        index % 2 === 0 ? "#f7fbff" : "white")
                    }
                  >
                    <td>{item.kode_siswa}</td>
                    <td>{item.nama_siswa}</td>
                    <td>{item.alamat}</td>
                    <td>
                      {item.tanggal_lahir  // format tanggal lokal idn
                        ? new Date(item.tanggal_lahir).toLocaleDateString("id-ID") //format tnggl indo
                        : "-"} 
                    </td>
                    <td>{item.jurusan}</td>
                    
                    <td>
                      <button
                        className="btn btn-sm me-2 text-black"
                        style={{ backgroundColor: "#5dade2", border: "none" }}
                        onMouseEnter={(e) =>
                          (e.target.style.backgroundColor = "#85c1e9")
                        }
                        onMouseLeave={(e) =>
                          (e.target.style.backgroundColor = "#5dade2")
                        }
                        onClick={() => handleEdit(item)}
                      >
                        ✏️ Edit
                      </button>

                      <button
                        className="btn btn-sm text-black"
                        style={{ backgroundColor: "#1565c0", border: "none" }}
                        onMouseEnter={(e) =>
                          (e.target.style.backgroundColor = "#1e88e5")
                        }
                        onMouseLeave={(e) =>
                          (e.target.style.backgroundColor = "#1565c0")
                        }
                        onClick={() => handleDelete(item.kode_siswa)}
                      >
                        🗑️ Hapus
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-muted">
                    Belum ada data siswa
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && ( //struktur modal boostrap
        <div
          className="modal show fade d-block"
          tabIndex="-1" // menutup modal
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }} // overlay gelap diblkng modal
        >
          <div className="modal-dialog">
            <div className="modal-content border-0 shadow-lg">
              <div
                className="modal-header text-black"
                style={{ backgroundColor: "#3498db" }}
              >
                <h5 className="modal-title">
                  {isEdit ? "✏️ Edit Siswa" : "➕ Tambah Siswa"}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={handleCloseModal}
                ></button>
              </div>

              <form onSubmit={handleSubmit}> 
                <div className="modal-body">
                  {!isEdit && ( //input kodesiswa tampil saat + , edit tdk boleh diubah
                    <div className="mb-3">
                      <label className="form-label fw-bold">Kode Siswa</label>
                      <input
                        type="text"
                        name="kode_siswa"
                        className="form-control"
                        value={formData.kode_siswa}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label fw-bold">Nama Siswa</label>
                    <input
                      type="text"
                      name="nama_siswa"
                      className="form-control"
                      value={formData.nama_siswa}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">Alamat</label>
                    <input
                      type="text"
                      name="alamat"
                      className="form-control"
                      value={formData.alamat}
                      onChange={handleChange}
                    />
                  </div>

                
                  <div className="mb-3">
                    <label className="form-label fw-bold">Tanggal Lahir</label>
                    <input
                      type="date"
                      name="tanggal_lahir"
                      className="form-control"
                      value={formData.tanggal_lahir}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">Jurusan</label>
                    <input
                      type="text"
                      name="jurusan"
                      className="form-control"
                      value={formData.jurusan}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="submit" //memicu on submit menyesuaikan mode isEdit
                    className="btn text-black fw-bold"
                    style={{ backgroundColor: "#3498db", border: "none" }}
                  >
                    {isEdit ? "Simpan Perubahan" : "Tambah Siswa"}
                  </button>
                  <button
                    type="button" // menutup modal tanpa submit
                    className="btn btn-secondary text-black fw-bold"
                    onClick={handleCloseModal}
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
