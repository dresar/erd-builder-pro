export interface ColumnDefinition {
  name: string;
  type: string;
  is_pk?: boolean;
  is_nullable?: boolean;
  is_unique?: boolean;
  default_value?: string;
  enum_values?: string[];
  comment?: string;
}

export function generateRealisticValue(col: ColumnDefinition, tableName: string): any {
  const colName = col.name.toLowerCase();
  const type = (col.type || 'varchar').toLowerCase();
  const cleanTable = tableName.toLowerCase().replace(/s$/, '');

  if (col.is_pk || colName === 'id' || colName.endsWith('_id')) {
    if (type.includes('uuid')) {
      return '550e8400-e29b-41d4-a716-446655440000';
    }
    return 101;
  }

  if (col.enum_values && col.enum_values.length > 0) {
    return col.enum_values[0];
  }

  if (type.includes('bool')) {
    return true;
  }

  if (type.includes('int') || type.includes('serial')) {
    if (colName.includes('year')) return 2026;
    if (colName.includes('point') || colName.includes('score')) return 100;
    if (colName.includes('capacity') || colName.includes('limit') || colName.includes('count') || colName.includes('qty')) return 10;
    if (colName.includes('order') || colName.includes('step')) return 1;
    return 1;
  }

  if (type.includes('decimal') || type.includes('numeric') || type.includes('float') || type.includes('money')) {
    if (colName.includes('fee') || colName.includes('amount') || colName.includes('balance') || colName.includes('price') || colName.includes('total')) {
      return 100000;
    }
    return 10.5;
  }

  if (type.includes('date') && !type.includes('timestamp')) {
    return '2026-09-09';
  }

  if (type.includes('timestamp') || type.includes('time')) {
    return new Date().toISOString();
  }

  if (type.includes('json')) {
    return { status: 'active', meta: {} };
  }

  if (colName.includes('email')) {
    return `${cleanTable}@domain.com`;
  }
  if (colName.includes('phone') || colName.includes('telp') || colName.includes('mobile')) {
    return '081298765432';
  }
  if (colName.includes('name') || colName.includes('nama')) {
    const formatted = cleanTable.charAt(0).toUpperCase() + cleanTable.slice(1);
    return `${formatted} Item`;
  }
  if (colName.includes('title') || colName.includes('judul')) {
    const formatted = cleanTable.charAt(0).toUpperCase() + cleanTable.slice(1);
    return `${formatted} Title`;
  }
  if (colName.includes('code') || colName.includes('kode')) {
    return `${cleanTable.slice(0, 3).toUpperCase()}-001`;
  }
  if (colName.includes('slug')) {
    return `${cleanTable}-item`;
  }
  if (colName.includes('status')) {
    return 'active';
  }
  if (colName.includes('password') || colName.includes('hash')) {
    return 'Secret123!';
  }
  if (colName.includes('url') || colName.includes('link') || colName.includes('avatar') || colName.includes('image')) {
    return `https://example.com/assets/${cleanTable}.jpg`;
  }
  if (colName.includes('address') || colName.includes('alamat')) {
    return 'Jl. Sudirman No. 1';
  }
  if (colName.includes('description') || colName.includes('deskripsi') || colName.includes('notes') || colName.includes('content')) {
    return `Deskripsi untuk ${cleanTable}`;
  }

  return `${cleanTable}_value`;
}

export function generateCreateMockPayload(columns: ColumnDefinition[], tableName: string): Record<string, any> {
  const payload: Record<string, any> = {};
  for (const col of columns) {
    if (col.is_pk && !col.type.toLowerCase().includes('uuid')) continue;
    if (col.name === 'created_at' || col.name === 'updated_at' || col.name === 'deleted_at') continue;
    payload[col.name] = generateRealisticValue(col, tableName);
  }
  return payload;
}

export function generateUpdateMockPayload(columns: ColumnDefinition[], tableName: string): Record<string, any> {
  const payload: Record<string, any> = {};
  const editable = columns.filter(c => !c.is_pk && !['created_at', 'deleted_at'].includes(c.name));
  for (const col of editable.slice(0, 4)) {
    payload[col.name] = generateRealisticValue(col, tableName);
  }
  return payload;
}
