const nomorWhatsAppPemilik = "6285793354882";
const keranjangAli = [];
let urutanPesananAli = 0;

function formatRupiah(nilai) {
  return "Rp" + Number(nilai).toLocaleString("id-ID");
}

function hitungJumlahHari() {
  const mulai = document.getElementById("ali_order_start").value;
  const selesai = document.getElementById("ali_order_end").value;
  if (!mulai || !selesai) return { hari: 1, valid: true };
  const awal = new Date(`${mulai}T00:00:00`);
  const akhir = new Date(`${selesai}T00:00:00`);
  const hari = Math.round((akhir - awal) / 86400000) + 1;
  return { hari, valid: hari > 0 };
}

function tambahKeKeranjang(nama, harga) {
  keranjangAli.push({ id: ++urutanPesananAli, nama, harga });
  renderKeranjang();
  document.getElementById("ali_section_pesanan").scrollIntoView({ behavior: "smooth", block: "start" });
}

function hapusDariKeranjang(id) {
  const index = keranjangAli.findIndex((barang) => barang.id === id);
  if (index !== -1) keranjangAli.splice(index, 1);
  renderKeranjang();
}

function kosongkanKeranjang() {
  keranjangAli.length = 0;
  renderKeranjang();
}

function renderKeranjang() {
  const daftar = document.getElementById("ali_cart_items");
  const kosong = document.getElementById("ali_cart_empty");
  const subtotal = keranjangAli.reduce((jumlah, barang) => jumlah + barang.harga, 0);
  const hitungan = hitungJumlahHari();
  const hari = hitungan.valid ? hitungan.hari : 1;
  daftar.replaceChildren();

  keranjangAli.forEach((barang) => {
    const item = document.createElement("li");
    item.className = "ali_cart_item";
    const detail = document.createElement("div");
    const nama = document.createElement("strong");
    const harga = document.createElement("span");
    nama.textContent = barang.nama;
    harga.textContent = `${formatRupiah(barang.harga)} / hari`;
    detail.append(nama, harga);
    const hapus = document.createElement("button");
    hapus.type = "button";
    hapus.className = "ali_remove_item";
    hapus.textContent = "Hapus";
    hapus.setAttribute("aria-label", `Hapus ${barang.nama} dari keranjang`);
    hapus.addEventListener("click", () => hapusDariKeranjang(barang.id));
    item.append(detail, hapus);
    daftar.append(item);
  });

  const jumlah = keranjangAli.length;
  kosong.hidden = jumlah > 0;
  document.getElementById("ali_clear_cart").hidden = jumlah === 0;
  document.getElementById("ali_cart_count").textContent = jumlah;
  document.getElementById("ali_floating_cart_count").textContent = jumlah;
  document.getElementById("ali_order_subtotal").textContent = formatRupiah(subtotal);
  document.getElementById("ali_order_days").textContent = hitungan.valid ? `${hari} hari` : "Tanggal tidak valid";
  document.getElementById("ali_order_total").textContent = hitungan.valid ? formatRupiah(subtotal * hari) : "Periksa tanggal";
}

function formatTanggalAli(tanggal) {
  return new Date(`${tanggal}T00:00:00`).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric"
  });
}

function bukaWhatsAppAli(pesan) {
  const tautan = `https://wa.me/${nomorWhatsAppPemilik}?text=${encodeURIComponent(pesan)}`;
  window.open(tautan, "_blank", "noopener,noreferrer");
}

function kirimPesanan(event) {
  event.preventDefault();
  if (keranjangAli.length === 0) {
    alert("Pilih kamera atau paket terlebih dahulu.");
    return;
  }
  const nama = document.getElementById("ali_order_name").value.trim();
  const mulai = document.getElementById("ali_order_start").value;
  const selesai = document.getElementById("ali_order_end").value;
  const hitungan = hitungJumlahHari();
  if (!hitungan.valid) {
    alert("Tanggal selesai harus sama atau setelah tanggal mulai.");
    return;
  }
  const subtotal = keranjangAli.reduce((jumlah, barang) => jumlah + barang.harga, 0);
  const pilihanAntar = document.getElementById("ali_order_pickup").value;
  const catatan = document.getElementById("ali_order_note").value.trim();
  const daftar = keranjangAli.map((barang, index) => `${index + 1}. ${barang.nama} — ${formatRupiah(barang.harga)}/hari`).join("\n");
  const pesan = [
    "Halo Rental Kamera Ali, saya ingin memesan:", "", daftar, "",
    `Nama: ${nama}`,
    `Tanggal sewa: ${formatTanggalAli(mulai)} sampai ${formatTanggalAli(selesai)}`,
    `Lama sewa: ${hitungan.hari} hari`,
    `Pengambilan: ${pilihanAntar}`,
    `Subtotal per hari: ${formatRupiah(subtotal)}`,
    `Perkiraan total: ${formatRupiah(subtotal * hitungan.hari)}`,
    `Catatan: ${catatan || "-"}`, "",
    "Mohon konfirmasi ketersediaan dan total akhir. Terima kasih."
  ].join("\n");
  bukaWhatsAppAli(pesan);
}

function kirimPertanyaan(event) {
  event.preventDefault();
  const nama = document.getElementById("ali_question_name").value.trim();
  const pertanyaan = document.getElementById("ali_question_message").value.trim();
  bukaWhatsAppAli(`Halo Rental Kamera Ali, saya ${nama}.\n\n${pertanyaan}`);
}

const kolomTanggal = [document.getElementById("ali_order_start"), document.getElementById("ali_order_end")];
kolomTanggal.forEach((kolom) => kolom.addEventListener("change", renderKeranjang));
kolomTanggal[0].addEventListener("change", () => { kolomTanggal[1].min = kolomTanggal[0].value; });
renderKeranjang();
