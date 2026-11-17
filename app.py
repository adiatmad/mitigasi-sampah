import json
from datetime import date
import pandas as pd
import streamlit as st
from calculator import calculate
from references import LIMITATIONS, MODEL_VERSION, REFERENCES, WORKBOOK_NAME

st.set_page_config(page_title="Kalkulator Mitigasi Sampah", page_icon="♻️", layout="centered")
st.title("Kalkulator Mitigasi Sampah")
st.caption("Estimasi emisi gas rumah kaca dari skenario pengelolaan sampah berdasarkan workbook sumber.")
st.info("Hasil membandingkan baseline dengan satu skenario mitigasi tetap dari workbook. Ini estimasi model, bukan pengukuran emisi langsung.")

with st.form("calculator"):
    st.subheader("Data wilayah")
    population = st.number_input("Jumlah penduduk", min_value=0, value=0, step=1,
        help="Masukkan total penduduk. Workbook menjumlahkan enam RW; pembagian penduduk antar-RW tidak mengubah hasil.")
    location = st.text_input("Nama desa/kelurahan (opsional)", max_chars=120)
    submitted = st.form_submit_button("Hitung estimasi", type="primary", use_container_width=True)

if submitted:
    if population <= 0:
        st.error("Masukkan jumlah penduduk lebih dari 0.")
    else:
        st.session_state.result = calculate(population).to_dict()
        st.session_state.location = location.strip()

if "result" in st.session_state:
    r = st.session_state.result
    st.divider()
    st.subheader("Hasil perhitungan")
    st.caption(f"Wilayah: {st.session_state.get('location') or 'Tidak disebutkan'} · Model: {MODEL_VERSION}")
    c1,c2 = st.columns(2)
    c1.metric("Baseline", f"{r['baseline_emissions_tco2e']:,.2f} tCO₂e")
    c2.metric("Dengan mitigasi", f"{r['mitigation_emissions_tco2e']:,.2f} tCO₂e")
    st.metric("Potensi penurunan emisi", f"{r['reduction_tco2e']:,.2f} tCO₂e",
              f"{r['reduction_percent']:,.1f}% dibanding baseline")
    st.caption(f"Penduduk setelah penyesuaian tetap 30%: {r['effective_population']:,.0f} jiwa · Timbulan sampah: {r['annual_waste_tonnes']:,.2f} ton/tahun")

    st.subheader("Perbandingan emisi")
    emissions = pd.DataFrame({"Baseline":r["baseline_breakdown_tco2e"],"Mitigasi":r["mitigation_breakdown_tco2e"]}).fillna(0)
    st.bar_chart(emissions)
    st.dataframe(emissions.style.format("{:,.3f}"), use_container_width=True)
    st.subheader("Alokasi sampah")
    allocation = pd.DataFrame({"Baseline (ton/tahun)":r["baseline_waste_allocation_tonnes"],"Mitigasi (ton/tahun)":r["mitigation_waste_allocation_tonnes"]})
    st.dataframe(allocation.style.format("{:,.2f}"), use_container_width=True)
    st.subheader("Komposisi sampah yang digunakan")
    composition = pd.DataFrame({"Estimasi (ton/tahun)":r["waste_by_category_tonnes"]})
    st.dataframe(composition.style.format("{:,.2f}"), use_container_width=True)

    report = {"metadata":{"model_version":MODEL_VERSION,"calculation_date":date.today().isoformat(),"location":st.session_state.get("location") or None,"workbook_source":WORKBOOK_NAME},
              "result":r,"references_transcribed_from_workbook":REFERENCES,"limitations":LIMITATIONS}
    st.download_button("Unduh hasil dan rincian (JSON)", json.dumps(report,ensure_ascii=False,indent=2),
        file_name="hasil-kalkulator-mitigasi-sampah.json", mime="application/json", use_container_width=True)

with st.expander("Asumsi dan batasan model"):
    st.markdown("- Penyesuaian penduduk keluar desa: **30%** (tetap).\n- Timbulan sampah: **0,19 ton/kapita/tahun** (tetap).\n- Komposisi dan alokasi baseline/mitigasi mengikuti nilai tetap workbook.\n- Bank sampah 3R, biodigester, dan pirolisis tercatat sebagai alokasi tetapi belum memiliki kredit pengurangan emisi.")
    for item in LIMITATIONS:
        st.warning(item)
with st.expander("Rujukan yang tercantum dalam workbook"):
    for item in REFERENCES:
        st.markdown(f"**{item['topic']}** — {item['source']}  \nSel: `{item['cells']}`  \n{item['value']}")
    st.caption("Rujukan disalin dari workbook dan belum diverifikasi secara independen.")
st.divider()
st.caption("Model ini bukan alat pelaporan regulasi atau klaim penurunan emisi terukur.")
