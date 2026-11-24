"""Build dated EREA Excel upload files from the supplied regional source workbooks."""

from __future__ import annotations

from collections import defaultdict
from calendar import monthrange
from datetime import datetime
from pathlib import Path
import re

from openpyxl import Workbook, load_workbook
from openpyxl.formatting.rule import CellIsRule
from openpyxl.styles import Alignment, Font, PatternFill
from openpyxl.worksheet.datavalidation import DataValidation


SOURCE = Path('/Users/skasika/Dream Tech/EREA Docs')
OUTPUT = Path(__file__).resolve().parents[1] / 'data-operations' / 'excel-uploads'
UPLOADS = OUTPUT / 'production-uploads'
TEMPLATES = OUTPUT / 'upload-templates'

NAVY = '123047'
TEAL = '00A6A6'
MINT = 'E6F6F4'
PALE = 'F4F8F8'

# The deployed DataHub validates country names against this regional catalogue.
EREA_COUNTRIES = {'Burundi', 'DR Congo', 'Kenya', 'Rwanda', 'Tanzania', 'Uganda', 'Zanzibar'}
CAPITAL_CITIES = {
    'Burundi': 'Bujumbura',
    'DR Congo': 'Kinshasa',
    'Kenya': 'Nairobi',
    'Rwanda': 'Kigali',
    'Tanzania': 'Dodoma',
    'Uganda': 'Kampala',
    'Zanzibar': 'Zanzibar City',
}


def reporting_year(value: object) -> int | None:
    if isinstance(value, datetime):
        return value.year
    if isinstance(value, int) and 2000 <= value <= 2100:
        return value
    return None


def styled_upload_sheet(headers: list[str], rows: list[list[object]], source_note: str) -> Workbook:
    workbook = Workbook()
    sheet = workbook.active
    sheet.title = 'Upload'
    sheet.append(headers)
    for row in rows:
        sheet.append(row)
    sheet.freeze_panes = 'A2'
    sheet.auto_filter.ref = f'A1:{chr(64 + len(headers))}{max(len(rows) + 1, 1)}'
    for cell in sheet[1]:
        cell.fill = PatternFill('solid', fgColor=NAVY)
        cell.font = Font(color='FFFFFF', bold=True)
        cell.alignment = Alignment(horizontal='center')
    for column in sheet.columns:
        width = max(len(str(cell.value or '')) for cell in column) + 3
        sheet.column_dimensions[column[0].column_letter].width = min(max(width, 14), 34)
    readme = workbook.create_sheet('Read Me')
    readme['A1'] = 'EREA production upload file'
    readme['A1'].font = Font(bold=True, size=16, color=NAVY)
    readme['A3'] = 'Source'
    readme['B3'] = source_note
    readme['A4'] = 'Upload endpoint'
    readme['B4'] = 'POST /upload-excel-module/?module=<module> with the Upload sheet as the first worksheet.'
    readme['A5'] = 'Reporting year'
    readme['B5'] = 'Every row uses the reporting year shown in the source workbook, not the date of upload.'
    readme.column_dimensions['A'].width = 22
    readme.column_dimensions['B'].width = 112
    return workbook


def template_workbook(module: str, headers: list[str], example: list[object], notes: list[str], choices: dict[str, list[str]] | None = None) -> Workbook:
    workbook = Workbook()
    sheet = workbook.active
    sheet.title = 'Upload'
    sheet.append(headers)
    for cell in sheet[1]:
        cell.fill = PatternFill('solid', fgColor=NAVY)
        cell.font = Font(color='FFFFFF', bold=True)
        cell.alignment = Alignment(horizontal='center')
    # Keep the example out of the upload sheet: a blank template must pass cleanly once populated.
    for column, width in zip(headers, [22, 28, 24, 16, 16]):
        sheet.column_dimensions[chr(65 + headers.index(column))].width = width
    sheet.freeze_panes = 'A2'
    if choices:
        for header, allowed in choices.items():
            index = headers.index(header) + 1
            validation = DataValidation(type='list', formula1='"' + ','.join(allowed) + '"', allow_blank=False)
            sheet.add_data_validation(validation)
            validation.add(f'{chr(64 + index)}2:{chr(64 + index)}501')
    year_column = headers.index('year') + 1 if 'year' in headers else None
    if year_column:
        sheet.cell(2, year_column).fill = PatternFill('solid', fgColor=MINT)
        sheet.conditional_formatting.add(
            f'{chr(64 + year_column)}2:{chr(64 + year_column)}501',
            CellIsRule(operator='notBetween', formula=['2000', '2100'], fill=PatternFill('solid', fgColor='FDE9D9')),
        )
    readme = workbook.create_sheet('Read Me')
    readme['A1'] = f'EREA upload template: {module}'
    readme['A1'].font = Font(bold=True, size=16, color=NAVY)
    readme['A3'] = 'How to use this template'
    readme['A3'].font = Font(bold=True, color=NAVY)
    for index, note in enumerate(notes, start=4):
        readme.cell(index, 1).value = note
    readme['A10'] = 'Example row (do not place this in the Upload sheet until it is a real record)'
    readme['A10'].font = Font(bold=True, color=NAVY)
    for index, value in enumerate(example, start=1):
        readme.cell(11, index).value = value
        readme.cell(11, index).fill = PatternFill('solid', fgColor=PALE)
    for column in range(1, len(headers) + 1):
        readme.cell(10, column).value = headers[column - 1]
        readme.cell(10, column).font = Font(bold=True, color='FFFFFF')
        readme.cell(10, column).fill = PatternFill('solid', fgColor=TEAL)
        readme.column_dimensions[chr(64 + column)].width = 28
    return workbook


def capacity_or_demand(sheet_name: str, value_header: str) -> list[list[object]]:
    source_book = load_workbook(SOURCE / 'EAC perfomance comparison Dec 2024-4.12.xlsx', data_only=True, read_only=True)
    sheet = source_book[sheet_name]
    header_row = next(
        row for row in sheet.iter_rows(values_only=True)
        if sum(reporting_year(value) is not None for value in row) >= 5
    )
    year_columns = {reporting_year(value): index for index, value in enumerate(header_row) if reporting_year(value)}
    years = sorted((index, year) for year, index in year_columns.items())
    country_index = years[0][0] - 1
    rows: list[list[object]] = []
    header_seen = False
    for row in sheet.iter_rows(values_only=True):
        if row == header_row:
            header_seen = True
            continue
        if not header_seen:
            continue
        country = row[country_index]
        if country in (None, 'Total'):
            continue
        if country not in {'Burundi', 'DR Congo', 'DRC', 'Kenya', 'Rwanda', 'Tanzania', 'Uganda', 'Zanzibar'}:
            continue
        country = 'DR Congo' if country == 'DRC' else country
        for index, year in years:
            value = row[index]
            if isinstance(value, (int, float)):
                rows.append([country, round(value, 2), year])
    return rows


def generation_contributions() -> list[list[object]]:
    source_book = load_workbook(SOURCE / 'EAC perfomance comparison Dec 2024-4.12.xlsx', data_only=True, read_only=True)
    sheet = source_book['Energy Mix']
    country_headers = next(row for row in sheet.iter_rows(values_only=True) if 'Technology ' in row)
    countries = [(index, value) for index, value in enumerate(country_headers) if value in {'Burundi', 'DR Congo', 'Kenya', 'Rwanda', 'Tanzania', 'Uganda', 'Zanzibar'}]
    source_map = {
        'Hydro above 20MW': 'hydro',
        'Small Hydro 20MW and below': 'hydro',
        'Geothermal': 'geothermal',
        'Natural Gas': 'thermal',
        'Methane Gas': 'thermal',
        'HFO': 'thermal',
        'Peat': 'peat',
        'Other Thermal': 'thermal',
        'Wind': 'wind',
        'Solar PV': 'solar',
        'Biamass': 'biomass',
        'Cogeneration': 'thermal',
    }
    totals: defaultdict[tuple[str, str], float] = defaultdict(float)
    header_seen = False
    for row in sheet.iter_rows(values_only=True):
        if row == country_headers:
            header_seen = True
            continue
        if not header_seen:
            continue
        if str(row[1]).strip() == 'Total':
            break
        source = source_map.get(str(row[1]).strip())
        if not source:
            continue
        for index, country in countries:
            value = row[index]
            if isinstance(value, (int, float)):
                totals[(country, source)] += value
    return [[country, source, 2024, round(value, 2)] for (country, source), value in sorted(totals.items())]


def normalized_country(value: object) -> str:
    """Match the country name used by the DataHub catalogue."""
    country = str(value).strip()
    return 'DR Congo' if country == 'DRC' else country


def electricity_access_rates() -> list[list[object]]:
    source_book = load_workbook(
        SOURCE / 'EREA ENERGY MARKET SURVEILLANCE DASHBOARD.xlsx',
        data_only=True,
        read_only=True,
    )
    sheet = source_book['EAC-Electrification rate']
    header = next(
        row for row in sheet.iter_rows(values_only=True)
        if 'Country' in row and any(isinstance(value, str) and 'Electrification rate' in value for value in row)
    )
    country_index = header.index('Country')
    value_index = next(index for index, value in enumerate(header) if isinstance(value, str) and 'Electrification rate' in value)
    year_match = re.search(r'(20\d{2})', str(header[value_index]))
    if not year_match:
        raise ValueError('The electrification-rate source column does not state a reporting year.')
    year = int(year_match.group(1))
    rows: list[list[object]] = []
    header_seen = False
    for row in sheet.iter_rows(values_only=True):
        if row == header:
            header_seen = True
            continue
        if not header_seen:
            continue
        country, value = row[country_index], row[value_index]
        if not country:
            break
        country = normalized_country(country)
        if country in EREA_COUNTRIES and isinstance(value, (int, float)):
            rows.append([country, value, year])
    return rows


def electricity_regulatory_indexes() -> list[list[object]]:
    source_book = load_workbook(
        SOURCE / 'EREA ENERGY MARKET SURVEILLANCE DASHBOARD.xlsx',
        data_only=True,
        read_only=True,
    )
    sheet = source_book['EAC ERI']
    header = next(row for row in sheet.iter_rows(values_only=True) if 'Country/Year' in row)
    country_index = header.index('Country/Year')
    year_columns = [(index, value) for index, value in enumerate(header) if reporting_year(value)]
    rows: list[list[object]] = []
    header_seen = False
    for row in sheet.iter_rows(values_only=True):
        if row == header:
            header_seen = True
            continue
        if not header_seen:
            continue
        country = row[country_index]
        if country in (None, 'AVE'):
            break
        for index, year in year_columns:
            value = row[index]
            if isinstance(value, (int, float)):
                rows.append([normalized_country(country), value, year])
    return rows


def status_report_indicator(indicator: str, percentage: bool = False) -> list[list[object]]:
    """Extract a December 2024 country-level indicator from Annex 8."""
    source_book = load_workbook(
        SOURCE / 'EAC perfomance comparison Dec 2024-4.12.xlsx',
        data_only=True,
        read_only=True,
    )
    sheet = source_book['Status Report']
    header = next(row for row in sheet.iter_rows(values_only=True) if 'Performance Indicator' in row)
    country_columns = [
        (index, normalized_country(value))
        for index, value in enumerate(header)
        if value and normalized_country(value) in EREA_COUNTRIES
    ]
    source_row = next(
        row for row in sheet.iter_rows(values_only=True)
        if indicator in row
    )
    rows: list[list[object]] = []
    for index, country in country_columns:
        value = source_row[index]
        if not isinstance(value, (int, float)):
            continue
        # The source uses ratios for some countries and percentages for others.
        value = value * 100 if percentage and 0 < value <= 1 else value
        rows.append([country, round(value, 4), 2024])
    return rows


def system_losses() -> list[list[object]]:
    source_book = load_workbook(
        SOURCE / 'EREA ENERGY MARKET SURVEILLANCE DASHBOARD.xlsx',
        data_only=True,
        read_only=True,
    )
    sheet = source_book['E_Losses,BALANCE CALCU']
    year_row = next(
        row for row in sheet.iter_rows(values_only=True)
        if 2018 in row and 2019 in row and 2020 in row and 2021 in row
    )
    # The same worksheet places an unrelated capacity table after a blank spacer.
    year_columns = []
    for index in range(2, len(year_row)):
        year = reporting_year(year_row[index])
        if year is None:
            break
        year_columns.append((index, year))
    rows: list[list[object]] = []
    year_header_seen = False
    for row in sheet.iter_rows(values_only=True):
        if row == year_row:
            year_header_seen = True
            continue
        if not year_header_seen:
            continue
        country = row[1] if len(row) > 1 else None
        if country not in EREA_COUNTRIES and country != 'DRC':
            if any(value is not None for value in row[7:]):
                break
            continue
        country = normalized_country(country)
        for index, year in year_columns:
            value = row[index]
            if isinstance(value, (int, float)):
                rows.append([country, 'system', round(value, 4), year])
    return rows


def user_tariffs_2023() -> list[list[object]]:
    """Tariffs transcribed from the dated Annex 6 table in the EPC report."""
    values = {
        'Kenya': {'domestic_lifeline': 12.5, 'domestic_other': 19.9, 'small_commercial': 19.7, 'medium_industries': 17.6, 'large_industries': 16.5, 'street_lighting': 11.9},
        'Zanzibar': {'domestic_lifeline': 3.4, 'domestic_other': 11.4, 'small_commercial': 8.8, 'large_industries': 7.2, 'street_lighting': 11.4},
        'Rwanda': {'domestic_lifeline': 7.1, 'domestic_other': 18.4, 'small_commercial': 20.3, 'medium_industries': 8.3, 'large_industries': 7.5, 'street_lighting': 14.8},
        'Tanzania': {'domestic_lifeline': 4.3, 'domestic_other': 12.7, 'small_commercial': 8.5, 'medium_industries': 6.8, 'large_industries': 6.7, 'extra_large_industries': 8.5, 'street_lighting': 8.5},
        'Uganda': {'domestic_lifeline': 6.6, 'domestic_other': 21.1, 'small_commercial': 16.0, 'medium_industries': 12.1, 'large_industries': 10.1, 'extra_large_industries': 9.5, 'street_lighting': 9.7},
        'DR Congo': {'domestic_lifeline': 2.7, 'domestic_other': 3.9, 'small_commercial': 8.7, 'medium_industries': 11.0, 'large_industries': 15.0},
        'Burundi': {'domestic_lifeline': 1.4, 'domestic_other': 14.97, 'small_commercial': 8.13, 'medium_industries': 29.78},
    }
    return [[country, category, tariff, 2023] for country, categories in values.items() for category, tariff in categories.items()]


def source_period_end(label: object) -> str | None:
    text = str(label).replace('’', "'").replace('‘', "'")
    month_year = re.search(r'(Jul|Aug|Sep|Oct|Nov|Dec|Jan|Feb|Mar|Apr|May|Jun)[a-z.\s-]*[’\']?(\d{2,4})', text, re.IGNORECASE)
    if not month_year:
        return None
    month_name, year_suffix = month_year.groups()
    month = datetime.strptime(month_name.title(), '%b').month
    year = int(year_suffix) if len(year_suffix) == 4 else 2000 + int(year_suffix)
    if '-' in text and re.search(r'(Sep|Dec|Mar|Jun)', text, re.IGNORECASE):
        month = {'Sep': 9, 'Dec': 12, 'Mar': 3, 'Jun': 6}[re.findall(r'(Sep|Dec|Mar|Jun)', text, re.IGNORECASE)[-1].title()]
    day = monthrange(year, month)[1]
    return f'{year:04d}-{month:02d}-{day:02d}'


def petroleum_volumes() -> list[list[object]]:
    source_book = load_workbook(
        SOURCE / 'EREA ENERGY MARKET SURVEILLANCE DASHBOARD.xlsx',
        data_only=True,
        read_only=True,
    )
    sheet = source_book['vol.imported. petro;.products']
    header = next(row for row in sheet.iter_rows(values_only=True) if 'Burundi' in row and 'Kenya' in row)
    countries = [(index, normalized_country(value)) for index, value in enumerate(header) if normalized_country(value) in EREA_COUNTRIES]
    rows: list[list[object]] = []
    period_end = None
    product_map = {'PMS': 'PMS', 'AGO': 'AGO', 'IK': 'IK', 'JET': 'JET-A1'}
    for row in sheet.iter_rows(values_only=True):
        if isinstance(row[0], str):
            period_end = source_period_end(row[0])
        if not period_end or not isinstance(row[1], str):
            continue
        product = next((name for prefix, name in product_map.items() if row[1].strip().upper().startswith(prefix)), None)
        # LPG is reported in metric tonnes, while this model is explicitly m3.
        if not product:
            continue
        for index, country in countries:
            value = row[index]
            if isinstance(value, (int, float)):
                rows.append([country, product, round(value, 4), period_end])
    return rows


def petroleum_prices() -> list[list[object]]:
    source_book = load_workbook(
        SOURCE / 'EREA ENERGY MARKET SURVEILLANCE DASHBOARD.xlsx',
        data_only=True,
        read_only=True,
    )
    sheet = source_book['Pet.prod.price progession']
    country_headers = next(row for row in sheet.iter_rows(values_only=True) if 'Burundi (USD)' in row and 'Kenya (USD)' in row)
    countries = [(index, normalized_country(str(value).replace(' (USD)', ''))) for index, value in enumerate(country_headers) if isinstance(value, str) and value.endswith('(USD)')]
    rows: list[list[object]] = []
    month = None
    product_map = {'PMS': 'Petrol', 'AGO': 'Diesel', 'IK': 'Kerosene', 'JET': 'Jet A1'}
    for row in sheet.iter_rows(values_only=True):
        if isinstance(row[0], str):
            month = source_period_end(row[0])
        if not month or not isinstance(row[1], str):
            continue
        product = next((name for prefix, name in product_map.items() if row[1].strip().upper().startswith(prefix)), None)
        if not product:
            continue
        for index, country in countries:
            value = row[index]
            if country in EREA_COUNTRIES and isinstance(value, (int, float)):
                rows.append([country, product, CAPITAL_CITIES[country], round(value, 4), month])
    return rows


def main() -> None:
    UPLOADS.mkdir(parents=True, exist_ok=True)
    TEMPLATES.mkdir(parents=True, exist_ok=True)

    datasets = {
        'installed-capacity.xlsx': (
            ['country', 'capacity', 'year'],
            capacity_or_demand('installed capacity', 'capacity'),
            'EAC performance comparison, December 2024 update, Annex 6A Figure 1.',
        ),
        'maximum-demand.xlsx': (
            ['country', 'demand', 'year'],
            capacity_or_demand('maximum demand', 'demand'),
            'EAC performance comparison, December 2024 update, Annex 6A Figure 2.',
        ),
        'generation-contribution-2024.xlsx': (
            ['country', 'source', 'year', 'contribution'],
            generation_contributions(),
            'EAC performance comparison, December 2024 update, Annex 8 regional energy mix. Small and large hydro are consolidated as Hydro; fossil technologies are consolidated as Thermal to match the API taxonomy.',
        ),
        'electricity-access-rate-2023.xlsx': (
            ['country', 'access_rate_percentage', 'year'],
            electricity_access_rates(),
            'EREA Energy Market Surveillance Dashboard, EAC-Electrification rate sheet. The source column explicitly reports 2023. South Sudan is excluded because it is not in the current EREA country catalogue, so the workbook can import atomically.',
        ),
        'electricity-regulatory-index-2018-2022.xlsx': (
            ['country', 'regulatory_index', 'year'],
            electricity_regulatory_indexes(),
            'EREA Energy Market Surveillance Dashboard, EAC ERI sheet, Electricity Regulatory Index table. 2023 is excluded because the source cells are blank.',
        ),
        'electricity-access-rate-2024.xlsx': (
            ['country', 'access_rate_percentage', 'year'],
            status_report_indicator('Electricity access rate (%)', percentage=True),
            'EAC performance comparison, December 2024 update, Annex 8 Status Report on Electricity sector at December 2024.',
        ),
        'grid-connectivity-2024.xlsx': (
            ['country', 'connectivity_percentage', 'year'],
            status_report_indicator('Grid connectivity (%)', percentage=True),
            'EAC performance comparison, December 2024 update, Annex 8 Status Report on Electricity sector at December 2024.',
        ),
        'effective-capacity-2024.xlsx': (
            ['country', 'effective_capacity', 'year'],
            status_report_indicator('Effective capacity (MW)'),
            'EAC performance comparison, December 2024 update, Annex 8 Status Report on Electricity sector at December 2024.',
        ),
        'connected-customers-2024.xlsx': (
            ['country', 'connected_customers', 'year'],
            status_report_indicator('Number of connected customers in Millions'),
            'EAC performance comparison, December 2024 update, Annex 8 Status Report on Electricity sector at December 2024.',
        ),
        'system-load-factor-2024.xlsx': (
            ['country', 'load_factor_percentage', 'year'],
            status_report_indicator('System load factor (%)', percentage=True),
            'EAC performance comparison, December 2024 update, Annex 8 Status Report on Electricity sector at December 2024.',
        ),
        'saidi-2024.xlsx': (
            ['country', 'saidi', 'year'],
            status_report_indicator('SAIDI (monthly)'),
            'EAC performance comparison, December 2024 update, Annex 8 Status Report on Electricity sector at December 2024. The source records December monthly values.',
        ),
        'saifi-2024.xlsx': (
            ['country', 'saifi', 'year'],
            status_report_indicator('SAIFI (monthly)'),
            'EAC performance comparison, December 2024 update, Annex 8 Status Report on Electricity sector at December 2024. The source records December monthly values.',
        ),
        'consumption-per-capita-2024.xlsx': (
            ['country', 'consumption_per_capita', 'year'],
            status_report_indicator('Consumption per capita (kWh/year)'),
            'EAC performance comparison, December 2024 update, Annex 8 Status Report on Electricity sector at December 2024.',
        ),
        'electricity-system-losses-2018-2021.xlsx': (
            ['country', 'type_of_loss', 'loss_percentage', 'year'],
            system_losses(),
            'EREA Energy Market Surveillance Dashboard, E_Losses,BALANCE CALCU sheet. The source reports combined transmission and distribution losses, therefore these are labelled system rather than being split into technical and commercial losses.',
        ),
        'user-tariffs-june-2023.xlsx': (
            ['country', 'user_category', 'tariff', 'year'],
            user_tariffs_2023(),
            'EPC Report, June 2024, Annex 6 Table 1: End User Electricity Tariff for each member country excluding taxes and levies as at June 2023. Values marked N/A or expressed as a non-price levy are excluded.',
        ),
        'petroleum-import-volumes-2021-2022.xlsx': (
            ['country', 'petroleum_product', 'volume', 'period_end'],
            petroleum_volumes(),
            'EREA Energy Market Surveillance Dashboard, vol.imported. petro;.products sheet. LPG is excluded because the source reports it in metric tonnes while the DataHub volume model is cubic metres.',
        ),
        'petroleum-product-prices-2021-2022.xlsx': (
            ['country', 'petroleum_product', 'administrative_level1', 'price', 'month'],
            petroleum_prices(),
            'EREA Energy Market Surveillance Dashboard, Pet.prod.price progession sheet. Each country-level source value is assigned to its capital city for the DataHub administrative-level field.',
        ),
    }
    for filename, (headers, rows, source_note) in datasets.items():
        styled_upload_sheet(headers, rows, source_note).save(UPLOADS / filename)

    templates = {
        'installed-capacity-template.xlsx': ('installed-capacity', ['country', 'capacity', 'year'], ['Kenya', 3199.90, 2024], []),
        'maximum-demand-template.xlsx': ('maximum-demand', ['country', 'demand', 'year'], ['Kenya', 2288.38, 2024], []),
        'generation-contribution-template.xlsx': ('generation-contribution', ['country', 'source', 'year', 'contribution'], ['Kenya', 'geothermal', 2024, 940], {'source': ['hydro', 'solar', 'wind', 'thermal', 'biomass', 'methane', 'peat', 'geothermal', 'imports']}),
        'grid-connectivity-template.xlsx': ('grid-connectivity', ['country', 'connectivity_percentage', 'year'], ['Uganda', 57.00, 2024], []),
        'effective-capacity-template.xlsx': ('effective-capacity', ['country', 'effective_capacity', 'year'], ['Tanzania', 2971.40, 2024], []),
        'connected-customers-template.xlsx': ('connected-customers', ['country', 'connected_customers', 'year'], ['Rwanda', 1.25, 2024], []),
        'system-load-factor-template.xlsx': ('system-load-factor', ['country', 'load_factor_percentage', 'year'], ['Kenya', 64.20, 2024], []),
        'consumption-per-capita-template.xlsx': ('consumption-per-capital', ['country', 'consumption_per_capita', 'year'], ['Uganda', 240.00, 2024], []),
        'saidi-template.xlsx': ('saidi', ['country', 'saidi', 'year'], ['Kenya', 8.71, 2024], []),
        'saifi-template.xlsx': ('saifi', ['country', 'saifi', 'year'], ['Kenya', 2.76, 2024], []),
        'user-tariff-template.xlsx': ('user-tariff', ['country', 'user_category', 'tariff', 'year'], ['Tanzania', 'domestic_lifeline', 4.33, 2024], {'user_category': ['domestic_lifeline', 'domestic_other', 'small_commercial', 'medium_industries', 'large_industries', 'extra_large_industries', 'street_lighting']}),
        'petroleum-volume-template.xlsx': ('petroleum-volume', ['country', 'petroleum_product', 'volume', 'year'], ['Tanzania', 'PMS', 1939598.37, 2024], []),
        'electricity-access-rate-template.xlsx': ('electricity-access-rate', ['country', 'access_rate_percentage', 'year'], ['Kenya', 79, 2023], []),
        'electricity-regulatory-index-template.xlsx': ('electricity-regulatory-index', ['country', 'regulatory_index', 'year'], ['Tanzania', 0.675, 2022], []),
    }
    for filename, (module, headers, example, choices) in templates.items():
        notes = [
            'Enter one record per row in the Upload sheet. Do not change the header names.',
            'Use the four-digit reporting year from the underlying source, never the date the file is uploaded.',
            'Use an EREA catalogue country name and the permitted category/source codes shown in the sample row.',
        ]
        template_workbook(module, headers, example, notes, choices or None).save(TEMPLATES / filename)


if __name__ == '__main__':
    main()
