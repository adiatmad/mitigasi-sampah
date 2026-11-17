import pytest
from calculator import calculate

def test_workbook_kaliwlingi_cached_output_parity():
    r = calculate(10539)
    assert r.baseline_emissions_tco2e == pytest.approx(1581.1719697799867, abs=1e-8)
    assert r.mitigation_emissions_tco2e == pytest.approx(344.99200703436014, abs=1e-8)
    assert r.reduction_tco2e == pytest.approx(1236.1799627456267, abs=1e-8)

def test_zero_population():
    r = calculate(0)
    assert r.annual_waste_tonnes == r.baseline_emissions_tco2e == r.mitigation_emissions_tco2e == 0

@pytest.mark.parametrize("value", [-1, float("inf"), float("nan"), True, "100"])
def test_invalid_population(value):
    with pytest.raises(ValueError):
        calculate(value)

def test_waste_allocations_conserve_total():
    r = calculate(2500)
    assert sum(r.baseline_waste_allocation_tonnes.values()) == pytest.approx(r.annual_waste_tonnes)
    assert sum(r.mitigation_waste_allocation_tonnes.values()) == pytest.approx(r.annual_waste_tonnes)
