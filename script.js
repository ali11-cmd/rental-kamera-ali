let totalHargaPerHari = 0;
let jumlahKamera = 0;

function pilihKamera(namaKamera, hargaKamera) {
  const daftar = document.getElementById("ali_camera_booking_items");
  const barang = document.createElement("li");

  barang.textContent = namaKamera + " - Rp" + hargaKamera + " per hari";
  daftar.appendChild(barang);

  totalHargaPerHari = totalHargaPerHari + hargaKamera;
  jumlahKamera = jumlahKamera + 1;

  document.getElementById("ali_camera_count_selected").textContent = jumlahKamera;

  hitungBiaya();
}

function hitungBiaya() {
  const mulai = document.getElementById("ali_camera_start_date").value;
  const selesai = document.getElementById("ali_camera_end_date").value;
  let jumlahHari = 1;

  if (mulai !== "" && selesai !== "") {
    const tanggalMulai = new Date(mulai);
    const tanggalSelesai = new Date(selesai);

    jumlahHari = (tanggalSelesai - tanggalMulai) / 86400000 + 1;
  }

  if (jumlahHari < 1) {
    jumlahHari = 1;
  }

  const totalBayar = totalHargaPerHari * jumlahHari;

  document.getElementById("ali_camera_booking_days").textContent =
    jumlahHari + " hari";

  document.getElementById("ali_camera_booking_total").textContent =
    "Rp" + totalBayar;
}

function kirimPesan(event) {
  event.preventDefault();

  const nama = document.getElementById("ali_contact_input_name").value;
  const email = document.getElementById("ali_contact_input_email").value;
  const pesan = document.getElementById("ali_contact_input_message").value;

  // Ganti dengan nomor WhatsApp pemilik: kode negara + nomor, tanpa tanda + atau spasi.
  // Contoh format Indonesia: 6281234567890
  const nomorWhatsAppPemilik = "6285793354882";

  if (nomorWhatsAppPemilik.includes("x")) {
    alert("Isi nomor WhatsApp pemilik website di script.js terlebih dahulu.");
    return;
  }

  const isiPesan = `Halo, saya ${nama} (${email}).\n\n${pesan}`;
  const linkWhatsApp = "https://wa.me/" + nomorWhatsAppPemilik
    + "?text=" + encodeURIComponent(isiPesan);

  window.open(linkWhatsApp, "_blank");
}

