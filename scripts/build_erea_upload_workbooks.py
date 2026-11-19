"""Build dated EREA Excel upload files from the supplied regional source workbooks."""

from __future__ import annotations

from collections import defaultdict
from datetime import datetime
from pathlib import Path

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
