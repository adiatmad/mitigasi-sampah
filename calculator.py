"""Workbook-faithful port of Skenario Mitigasi Limbah.xlsx."""
from dataclasses import asdict, dataclass
import math

COMPOSITION = {"food": .4986, "paper": .1082, "nappies": .0604, "garden": .0739, "wood": .0095, "textile": .0397, "rubber_leather": .0051, "plastic": .188, "metal": .0035, "glass": .0071, "other": .006}

@dataclass(frozen=True)
class Result:
    population: float
    effective_population: float
    annual_waste_tonnes: float
    baseline_emissions_tco2e: float
    mitigation_emissions_tco2e: float
    reduction_tco2e: float
    reduction_percent: float
    baseline_breakdown_tco2e: dict
    mitigation_breakdown_tco2e: dict
    waste_by_category_tonnes: dict
    baseline_waste_allocation_tonnes: dict
    mitigation_waste_allocation_tonnes: dict
    def to_dict(self):
        return asdict(self)

def calculate(population: float) -> Result:
    """Mirror workbook formulas; preserve existing assumptions and oddities."""
    if isinstance(population, bool) or not isinstance(population, (int, float)):
        raise ValueError("Population must be a number.")
    if not math.isfinite(population) or population < 0:
        raise ValueError("Population must be a finite, non-negative number.")
    pop = float(population)
    effective = pop - .30 * pop
    total = effective * .19
    waste = {k: v * total for k, v in COMPOSITION.items()}
    burn = (waste["nappies"] + waste["textile"] + waste["rubber_leather"] + waste["plastic"]) * .80
    base_landfill = total - burn
    compost = waste["food"]
    recycle = .50 * waste["plastic"] + waste["paper"] + waste["textile"] + waste["metal"] + waste["glass"]
    pyrolysis = .50 * waste["plastic"]
    mitigation_landfill = total - compost - recycle - pyrolysis

    # Workbook B46:E47: DOC=.182, DOCf=.5, MCF=.8, F=.5, R=0, OX=0.
    def landfill_co2e(tonnes):
        landfill_gg = tonnes / 1000
        ddocm = landfill_gg * .182 * .5 * .8
        lo = ddocm * .5 * (16 / 12)
        return lo * 21 * 1000

    # Workbook B51:D52: dry CH4 factor=4; wet N2O factor=.3; no extra moisture conversion.
    def compost_co2e(tonnes):
        gg = tonnes / 1000
        ch4_gg = gg * 4 / 1000
        n2o_gg = gg * .3 / 1000
        return (ch4_gg * 21 + n2o_gg * 310) * 1000

    # Open-burning CO2 workbook rows 14:17; CH4/N2O use the linked burn mass.
    total_gg, burn_gg = total / 1000, burn / 1000
    co2_specs = [(0.0604,.4,.7,.1,.71),(0.0397,.8,.5,.2,.71),(0.0051,.84,.67,.2,.71),(0.188,1,.75,1,.71)]
    co2_gg = sum(frac * total_gg * .8 * dm * cf * fossil * ox * (44/12) for frac,dm,cf,fossil,ox in co2_specs)
    ch4_gg = burn_gg * 6500 / 1_000_000
    n2o_gg = burn_gg * 150 / 1_000_000
    open_burn_co2e = (co2_gg + ch4_gg * 21 + n2o_gg * 310) * 1000

    base_parts = {"Composting": 0.0, "Open burning": open_burn_co2e, "Landfill": landfill_co2e(base_landfill)}
    mitigation_parts = {"Composting": compost_co2e(compost), "Landfill": landfill_co2e(mitigation_landfill)}
    baseline, mitigation = sum(base_parts.values()), sum(mitigation_parts.values())
    reduction = baseline - mitigation
    return Result(pop, effective, total, baseline, mitigation, reduction, reduction / baseline * 100 if baseline else 0.0,
        base_parts, mitigation_parts, waste,
        {"Composting":0.0,"Open burning":burn,"Bank sampah 3R":0.0,"Biodigester":0.0,"Pyrolysis":0.0,"Landfill":base_landfill},
        {"Composting":compost,"Open burning":0.0,"Bank sampah 3R":recycle,"Biodigester":0.0,"Pyrolysis":pyrolysis,"Landfill":mitigation_landfill})
