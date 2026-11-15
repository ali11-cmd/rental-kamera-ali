let totalHargaPerHari = 0;
let jumlahKamera = 0;

function formatRupiah(nilai) {
  return "Rp" + nilai.toLocaleString("id-ID");
}

function pilihKamera(namaKamera, hargaKamera) {
  const daftar = document.getElementById("ali_camera_booking_items");
  const barang = document.createElement("li");

  barang.textContent = namaKamera + " - " + formatRupiah(hargaKamera) + " per hari";
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

    if (jumlahHari < 1) {
      document.getElementById("ali_camera_booking_days").textContent =
        "Tanggal tidak valid";
      document.getElementById("ali_camera_booking_total").textContent = "-";
      return;
    }
  }

  const totalBayar = totalHargaPerHari * jumlahHari;

  document.getElementById("ali_camera_booking_days").textContent =
    jumlahHari + " hari";

  document.getElementById("ali_camera_booking_total").textContent =
    formatRupiah(totalBayar);
}

function formatTanggal(tanggal) {
  if (tanggal === "") {
    return "Belum dipilih";
  }

  const tanggalLokal = new Date(tanggal + "T00:00:00");
  return tanggalLokal.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function kirimPesan(event) {
  event.preventDefault();

  const nama = document.getElementById("ali_contact_input_name").value;
  const email = document.getElementById("ali_contact_input_email").value;
  const pesan = document.getElementById("ali_contact_input_message").value;
  const mulai = document.getElementById("ali_camera_start_date").value;
  const selesai = document.getElementById("ali_camera_end_date").value;

  if (mulai !== "" && selesai !== "" && selesai < mulai) {
    alert("Tanggal selesai sewa tidak boleh lebih awal dari tanggal mulai.");
    return;
  }

  // Ganti dengan nomor WhatsApp pemilik: kode negara + nomor, tanpa tanda + atau spasi.
  // Contoh format Indonesia: 6281234567890
  const nomorWhatsAppPemilik = "6285793354882";

  if (nomorWhatsAppPemilik.includes("x")) {
    alert("Isi nomor WhatsApp pemilik website di script.js terlebih dahulu.");
    return;
  }

  hitungBiaya();

  const pilihan = Array.from(
    document.querySelectorAll("#ali_camera_booking_items li")
  ).map((barang, index) => `${index + 1}. ${barang.textContent}`);
  const daftarPilihan = pilihan.length > 0
    ? pilihan.join("\n")
    : "Belum ada kamera atau paket yang dipilih.";
  const tanggalMulai = formatTanggal(mulai);
  const tanggalSelesai = formatTanggal(selesai);
  const tanggalLengkap = mulai !== "" && selesai !== "";
  const lamaSewa = document.getElementById("ali_camera_booking_days").textContent;
  const totalBayar = document.getElementById("ali_camera_booking_total").textContent;

  const ringkasanPesanan = [
    "RINGKASAN PESANAN",
    daftarPilihan,
    `Tanggal mulai: ${tanggalMulai}`,
    `Tanggal selesai: ${tanggalSelesai}`,
    `Lama sewa: ${lamaSewa}${tanggalLengkap ? "" : " (perkiraan sementara, tanggal belum lengkap)"}`,
    `Perkiraan total: ${totalBayar}`
  ].join("\n");

  const isiPesan = `Halo, saya ${nama} (${email}).\n\n${pesan}\n\n${ringkasanPesanan}`;
  const linkWhatsApp = "https://wa.me/" + nomorWhatsAppPemilik
    + "?text=" + encodeURIComponent(isiPesan);

  window.open(linkWhatsApp, "_blank");
}

document.getElementById("ali_camera_start_date").addEventListener("change", hitungBiaya);
document.getElementById("ali_camera_end_date").addEventListener("change", hitungBiaya);
